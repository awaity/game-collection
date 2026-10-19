"""Validate selected, locally extracted reference tables without executing the client.

The transform was independently inferred from headers and UTF-8 record boundaries.
It is valid only for complete 16-byte blocks. Partial tails are never interpreted
as decoded data. Original payloads and the generated report stay in artifacts/.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
RESEARCH = ROOT / "artifacts/research/zombie-fire"
SOURCE = "https://cdn.xhgamesdk.com/pack-ad/plan_url/1100/9002/ec93ae3836a5d2712ffb0a98b07fe941.apk"
# TextAsset fingerprints, not the enclosing UnityFS bundle fingerprints.
FINGERPRINTS = {
    "TextConfig": "7b274d8c9693f91576f08aeab3aa6ab22c0a283719ff8a98667eaf6a83af8da4",
    "BuildConfig": "dd4344431ec6c7d137bcd1e62d5166ba97367bc905a223cc54ba7461c985101f",
    "BuildGroupConfig": "077e378670d6ae4b25721dbc473cf3b89b87692c8e63e9ca37b9cd986ce932c0",
    "BuildGroupWeightConfig": "e585a9c495fc388fb428783422c338c6a3f566e1a316d26bb6c347e7623e5483",
    "BuildGroupConditionConfig": "180c0436a1883a76cf39cc528f25bf68e343061fe5df4890b2c024aeef6d700b",
    "BuildLibraryConfig": "d5210a455bf64ccec8ea739864338a0cc8045b2f87e1b53faaa79a3f875af1ba",
    "BuildReplaceConfig": "8e7ef1e379ea9dffb775513190e3df2cd71df717bc1ebfdaecf7bcae93593632",
    "SubSkillConfg": "fd0f349dc6df06171dcb95fa6aa3396592e5017e881a01eecf746d0b333c4ffc",
    "MagicSkillConfig": "81209cf4d89d688cbfda8f8af6d7614a17f5e6ebe8c5b08bbb3555af10fddcc6",
    "BuffConfig": "0136a02f0f803ffe939b5d083ce4d904a46b071f50e87581a6be69f935fad7c8",
    "BuffAttrConfig": "3d9628a5f2c3e50e2b150d79865b289ec3d30cde113dcb6633d037ca7def8f24",
    "BuffFuncSkillAttrConfig": "80e70aebc621e0f6420b279ef3ea05a81af8c19e8c567ea43e9e252ba2487423",
}
PERMUTATION = (5, 4, 2, 6, 1, 0, 3, 7, 8, 15, 10, 11, 9, 13, 14, 12)
SUBTRACT = {1: 0x8F, 9: 0x69, 10: 0x0D, 11: 0xD8, 13: 0xED, 14: 0x5F}
XOR = {5: 0x40, 8: 0xD4}
ROTATE_RIGHT = {2: 7, 3: 4, 7: 3}


def require(ok: bool, message: str) -> None:
    if not ok:
        raise ValueError(message)


def decode_prefix(raw: bytes) -> bytes:
    """Return only proven full blocks, so callers cannot read the encoded tail."""
    end = len(raw) // 16 * 16
    decoded = bytearray(end)
    for position, destination in enumerate(PERMUTATION):
        table = []
        for value in range(256):
            value = (value - SUBTRACT.get(position, 0)) & 255
            value ^= XOR.get(position, 0)
            rotation = ROTATE_RIGHT.get(position, 0)
            if rotation:
                value = ((value >> rotation) | (value << (8 - rotation))) & 255
            table.append(value)
        decoded[destination:end:16] = raw[position:end:16].translate(bytes(table))
    return bytes(decoded)


class IncompleteRecord(ValueError):
    """A fixed-version record reaches the unverified partial block."""


class Table:
    def __init__(self, directory: Path, name: str):
        raw = (directory / name).read_bytes()
        self.name = name
        self.sha256 = hashlib.sha256(raw).hexdigest()
        require(self.sha256 == FINGERPRINTS[name], f"{name}: unknown reference revision")
        self.encoding = "plain" if raw[:4] == struct.pack(">I", 0x2DEF) else "transformed-blocks"
        self.data = raw if self.encoding == "plain" else decode_prefix(raw)
        magic, size, version, self.count, self.checksum = struct.unpack_from(">5I", self.data)
        require((magic, size, version) == (0x2DEF, len(raw), 1), f"{name}: invalid header")
        self.size = size
        self.offset = 20
        self.complete = 0
        self.partial_record_offset = None

    def unpack(self, fmt: str):
        size = struct.calcsize(fmt)
        if self.offset + size > len(self.data):
            raise IncompleteRecord(f"{self.name}: undecoded data at {self.offset}")
        result = struct.unpack_from(fmt, self.data, self.offset)
        self.offset += size
        return result

    def string(self) -> str:
        (size,) = self.unpack(">I")
        require(size <= 10000, f"{self.name}: invalid string size at {self.offset}")
        if self.offset + size > len(self.data):
            raise IncompleteRecord(f"{self.name}: incomplete string")
        raw = self.data[self.offset:self.offset + size]
        self.offset += size
        if not size:
            return ""
        require(raw[-1] == 0, f"{self.name}: missing string terminator")
        return raw[:-1].decode("utf8", errors="strict")

    def summary(self) -> dict:
        return {
            "sha256": self.sha256,
            "encoding": self.encoding,
            "bytes": self.size,
            "declaredRows": self.count,
            "completeRows": self.complete,
            "decodedPrefixBytes": len(self.data),
            "undecodedTailBytes": self.size - len(self.data),
            "declaredChecksum": f"{self.checksum:08x}",
            "checksumVerified": False,
            "recordBoundariesReachFileEnd": self.offset == self.size,
            "incompleteRecordOffset": self.partial_record_offset,
        }


def read_text(table: Table) -> dict:
    texts = {}
    for _ in range(table.count):
        key, arguments, size = table.unpack(">IHI")
        require(0 < size <= 10000, "TextConfig: invalid text length")
        end = table.offset + size
        require(end <= table.size, "TextConfig: text extends past file")
        if end <= len(table.data):
            raw = table.data[table.offset:end]
            require(raw[-1] == 0, "TextConfig: missing text terminator")
            require(key not in texts, "TextConfig: duplicate ID")
            texts[key] = {"text": raw[:-1].decode("utf8", errors="strict"), "arguments": arguments}
            table.complete += 1
        else:
            require(end == table.size, "TextConfig: unverified data before final record")
        table.offset = end
    require(table.offset == table.size, "TextConfig: unexpected trailing data")
    return texts


def read_builds(table: Table) -> dict:
    builds = {}
    for _ in range(table.count):
        start = table.offset
        key, title, category = table.unpack(">3I")
        icon = table.string()
        (description,) = table.unpack(">I")
        end = table.offset + 85
        require(end <= table.size, "BuildConfig: payload extends past file")
        require(key not in builds, "BuildConfig: duplicate ID")
        record = {"offset": start, "title": title, "description": description, "category": category,
                  "iconReference": icon, "complete": end <= len(table.data)}
        if record["complete"]:
            body = table.data[table.offset:end]
            record.update({
                "familyAtBody1": struct.unpack_from(">I", body, 1)[0],
                "valuesAtBody5To44": list(struct.unpack_from(">10I", body, 5)),
                "valueAtBody45": struct.unpack_from(">I", body, 45)[0],
                "flagAtBody53": struct.unpack_from(">I", body, 53)[0],
                # Names intentionally reflect offsets until runtime semantics are verified.
                "signedValuesAtBody66And70": list(struct.unpack_from(">2i", body, 66)),
            })
            table.complete += 1
        builds[key] = record
        table.offset = end
    require(table.offset == table.size, "BuildConfig: unexpected trailing data")
    return builds


def read_fixed(table: Table, size: int) -> list:
    require(table.count * size + 20 == table.size, f"{table.name}: invalid fixed stride")
    records = []
    for _ in range(table.count):
        end = table.offset + size
        if end <= len(table.data):
            records.append(table.data[table.offset:end])
            table.complete += 1
        table.offset = end
    return records


def read_variable(table: Table, parse, identity) -> list:
    """Validate every complete row; an unknown final boundary stays unknown."""
    records, keys = [], set()
    for index in range(table.count):
        start = table.offset
        try:
            row = parse(table)
        except IncompleteRecord:
            require(index == table.count - 1 and len(table.data) < table.size,
                    f"{table.name}: incomplete data before the last record")
            table.offset = start
            table.partial_record_offset = start
            break
        key = identity(row)
        require(key not in keys, f"{table.name}: duplicate record identity {key}")
        keys.add(key)
        records.append({"offset": start, **row})
        table.complete += 1
    if table.partial_record_offset is None:
        require(table.offset == table.size, f"{table.name}: unexpected trailing data")
    return records


def subskill_row(table: Table) -> dict:
    (key,) = table.unpack(">I")
    label = table.string()
    return {"id": key, "string": label, "tail": list(table.unpack(">3I"))}


def magic_row(table: Table) -> dict:
    prefix = table.unpack(">5I")
    icon = table.string()
    return {"id": prefix[0], "prefix": list(prefix), "iconReference": icon,
            "tail": list(table.unpack(">5I"))}


def buff_row(table: Table) -> dict:
    (key,) = table.unpack(">I")
    name, icon = table.string(), table.string()
    (middle,) = table.unpack(">34s")
    effect = table.string()
    (tail,) = table.unpack(">I")
    return {"id": key, "name": name, "iconReference": icon,
            "middleHex": middle.hex(), "effectReference": effect, "tail": tail}


def buff_attr_row(table: Table) -> dict:
    (prefix,) = table.unpack(">132s")
    return {"id": struct.unpack_from(">I", prefix)[0], "rank": struct.unpack_from(">I", prefix, 4)[0],
            "wordsAt96To128": list(struct.unpack_from(">9I", prefix, 96)),
            "strings": [table.string() for _ in range(3)]}


def read_skill_attributes(table: Table) -> list:
    rows = []
    for raw in read_fixed(table, 58):
        key, flag = struct.unpack_from(">IB", raw)
        effects = [struct.unpack_from(">HBf", raw, 37 + i * 7) for i in range(3)]
        require(all(math.isfinite(v) for _, _, v in effects), f"{table.name}: nonfinite attribute")
        # Repeated IDs are valid: one modifier may address several skill subsets.
        rows.append({"id": key, "flag": flag, "targets": list(struct.unpack_from(">8I", raw, 5)),
                     "attributes": [{"attribute": a, "method": method, "value": v}
                                    for a, method, v in effects if a]})
    return rows


def inspect(directory: Path) -> dict:
    tables = {name: Table(directory, name) for name in FINGERPRINTS}
    texts = read_text(tables["TextConfig"])
    builds = read_builds(tables["BuildConfig"])
    group_bytes = read_fixed(tables["BuildGroupConfig"], 177)
    groups = []
    for raw in group_bytes:
        fields = struct.unpack_from(">44I", raw)
        groups.append({"group": fields[0], "build": fields[1], "values2To4": list(fields[2:5]),
                       "tuples5To19": [list(fields[i:i + 3]) for i in range(5, 20, 3) if fields[i]],
                       "tuples20To34": [list(fields[i:i + 3]) for i in range(20, 35, 3) if fields[i]],
                       "remainingFields": list(fields[35:]), "lastByte": raw[-1]})
    keys = {(g["group"], g["build"]) for g in groups}
    require(len(keys) == len(groups), "BuildGroupConfig: duplicate group/build pair")
    weights = read_fixed(tables["BuildGroupWeightConfig"], 84)
    conditions = read_fixed(tables["BuildGroupConditionConfig"], 16)
    libraries = read_fixed(tables["BuildLibraryConfig"], 8)
    replacements = read_fixed(tables["BuildReplaceConfig"], 28)
    subskills = read_variable(tables["SubSkillConfg"], subskill_row, lambda r: r["id"])
    magic = read_variable(tables["MagicSkillConfig"], magic_row, lambda r: r["id"])
    buffs = read_variable(tables["BuffConfig"], buff_row, lambda r: r["id"])
    buff_attrs = read_variable(tables["BuffAttrConfig"], buff_attr_row, lambda r: (r["id"], r["rank"]))
    skill_attrs = read_skill_attributes(tables["BuffFuncSkillAttrConfig"])
    selected = {}
    for key in [*range(1401, 1421), *range(1501, 1526), *range(1560, 1564)]:
        row = builds[key]
        require(row["complete"], f"Build {key}: incomplete payload")
        require(row["title"] in texts and row["description"] in texts, f"Build {key}: unresolved text")
        selected[key] = {**row, "name": texts[row["title"]]["text"],
                         "descriptionText": texts[row["description"]]["text"],
                         "descriptionArguments": texts[row["description"]]["arguments"]}
    return {
        "source": SOURCE,
        "scope": "offline configuration evidence; not client execution or a complete decryption",
        "tables": {name: table.summary() for name, table in tables.items()},
        "selectedBuilds": selected,
        "selectedGroups": [g for g in groups if g["group"] in (1014, 1015)],
        "orbMechanics": {
            "texts": {key: texts[key] for key in (402915000, 416002055, 416102055, 470281301,
                                                   407401561, 407401562, 407401563, 407401564, 407401567)},
            "magic": [r for r in magic if r["id"] == 15000],
            "subskills": [r for r in subskills if 15000 <= r["id"] < 15700],
            "buffs": [r for r in buffs if r["id"] in (150111, 150112, 150113, 156011, 156012, 156013)],
            "buffAttributes": [r for r in buff_attrs if r["id"] in (150111, 150112, 150113, 156011, 156012, 156013)],
            "skillAttributes": [r for r in skill_attrs if 15000 <= r["id"] < 15700],
        },
        "selectedLibraries": [list(struct.unpack(">2I", raw)) for raw in libraries
                              if struct.unpack(">2I", raw)[1] in (1014, 1015, 14000, 15000)],
        "unresolvedGroupBuildReferences": [{"group": g["group"], "build": g["build"]}
                                           for g in groups if g["build"] not in builds],
        "completeAuxiliaryRows": {"weights": len(weights), "conditions": len(conditions),
                                  "libraries": len(libraries), "replacements": len(replacements)},
        "limits": ["Partial block transform and checksum algorithm are unresolved.",
                   "Raw field offsets are not verified runtime field names.",
                   "Different selection groups are not mapped to modes or campaign stages.",
                   "A text row or card definition does not prove it is selectable in normal play.",
                   "Lucky-roll timing, weight dispatch and inclusive range semantics need client evidence."],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=RESEARCH / "official-config-text")
    parser.add_argument("--output", type=Path, default=RESEARCH / "validated-tables.json")
    args = parser.parse_args()
    require(args.output.resolve().is_relative_to((ROOT / "artifacts").resolve()),
            "Reference output must remain inside the ignored artifacts/ directory")
    report = inspect(args.input)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    for name, summary in report["tables"].items():
        print(f"{name}: {summary['completeRows']}/{summary['declaredRows']} complete records; "
              f"{summary['undecodedTailBytes']} tail bytes excluded")
    print(f"Unresolved group/build references: {len(report['unresolvedGroupBuildReferences'])}")
    print(f"Report: {args.output}")


if __name__ == "__main__":
    main()
