"""Validate selected, locally extracted reference tables without executing the client.

The transform was independently inferred from headers and UTF-8 record boundaries.
It is valid only for complete 16-byte blocks. Partial tails are never interpreted
as decoded data. Original payloads and the generated report stay in artifacts/.
"""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import hashlib
import json
import math
import re
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
    "MagicSkillLevelConfig": "d348f5fea6211c06e6b617798bd94ec925a910bad32bd858a4b5b3bcbaa1a22a",
    "SkillBaseConfg": "051c0e6e78db28d0ced63ca276cd3852ac26bc79235f5273d2f42a0fe6bb5651",
    "LevelBaseConfig": "9ce6ca6e917c13cf855522eb104a894775592abc450762792eae09f51f79269b",
    "ChapterConfig": "9c5dba0a9d52998459ef5095a86dfd4530348ef564017af996bb8a3a44ecc98f",
    "MonsterCfg": "691e8cda216bd1fb3025950118a4d055e2823143c1ab3cbe13db03af3fd9c713",
    "MonsterManualCfg": "29a5d955f39c76a27331a55de7464a54f9b6443841ee1a40b2d280f541203cf9",
    "AttrDataConfig": "ce78e68f04d6dc3184dc7628711acab160b4be848f99bc681bc2e6c3ac890521",
    "BootyConfig": "43fdfdd5f281ea3c9802a099045cb267edab3bc8f5a0fa51bcf875b58b2eaaac",
    "GoodsConfig": "eeab422ac2eac80d9836f33f90b047fcfe756be2c564555dfef259c81247d013",
    "CurrencyTypeConfig": "6a6a4a5cf01660b5721798f591fae27cf55688c0cec8edafb4762811f67246d1",
    "BuffConfig": "0136a02f0f803ffe939b5d083ce4d904a46b071f50e87581a6be69f935fad7c8",
    "BuffAttrConfig": "3d9628a5f2c3e50e2b150d79865b289ec3d30cde113dcb6633d037ca7def8f24",
    "BuffFuncSkillAttrConfig": "80e70aebc621e0f6420b279ef3ea05a81af8c19e8c567ea43e9e252ba2487423",
}
PERMUTATION = (5, 4, 2, 6, 1, 0, 3, 7, 8, 15, 10, 11, 9, 13, 14, 12)
SUBTRACT = {1: 0x8F, 9: 0x69, 10: 0x0D, 11: 0xD8, 13: 0xED, 14: 0x5F}
XOR = {5: 0x40, 8: 0xD4}
ROTATE_RIGHT = {2: 7, 3: 4, 7: 3}
# Numeric filename order; each entry is UTF-8 name + NUL + lowercase SHA-256 + LF.
# This pins the complete extracted collection without publishing original tables.
WAVE_COLLECTION_SHA256 = "47b4d347884fdac88681ca6fac2ba132f1d611eaeafb8792634f55e74658d1b0"


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


def skill_base_row(table: Table) -> dict:
    (prefix,) = table.unpack(">26s")
    key, title, description = struct.unpack_from(">3I", prefix)
    icon = table.string()
    (body,) = table.unpack(">356s")
    values = [struct.unpack_from(">f", body, offset)[0] for offset in (17, 21)]
    require(all(math.isfinite(v) for v in values), "SkillBaseConfg: nonfinite selected fields")
    # Byte offsets are known; attribute and cooldown semantics are not yet proven.
    return {"id": key, "title": title, "description": description,
            "byteAtPrefix12": prefix[12], "iconReference": icon,
            "valueAtBody5": struct.unpack_from(">I", body, 5)[0],
            "floatAtBody17": values[0], "floatAtBody21": values[1]}


def level_base_header(table: Table) -> dict:
    (prefix,) = table.unpack(">48s")
    first_string = table.string()
    (middle4,) = table.unpack(">I")
    second_string = table.string()
    (middle59,) = table.unpack(">59s")
    scene = table.string()
    # Unlike the skill tables, the unique ID is inside the second fixed block.
    # Other fields retain offset-based names until their dispatch is verified.
    return {"id": struct.unpack_from(">I", middle59, 9)[0],
            "prefixHex": prefix.hex(), "firstString": first_string,
            "valueAfterFirstString": middle4, "secondString": second_string,
            "middle59Hex": middle59.hex(), "sceneReference": scene,
            "textReferencesAtMiddle51And55": list(struct.unpack_from(">2I", middle59, 51))}


def level_base_row(table: Table) -> dict:
    start = table.offset
    row = level_base_header(table)
    (body,) = table.unpack(">159s")
    return {**row, "bodyHex": body.hex(), "valueAtBody28": struct.unpack_from(">I", body, 28)[0],
            "recordBytes": table.offset - start}


def monster_row(table: Table) -> dict:
    start = table.offset
    (prefix,) = table.unpack(">191s")
    first_string, second_string = table.string(), table.string()
    table.unpack(">41s")
    return {"id": struct.unpack_from(">I", prefix)[0],
            "valueAt4": struct.unpack_from(">I", prefix, 4)[0],
            "byteAt8": prefix[8], "nameReferenceAt9": struct.unpack_from(">I", prefix, 9)[0],
            "descriptionReferenceAt13": struct.unpack_from(">I", prefix, 13)[0],
            "attributeSlotsAt83": [{"offset": offset, "attribute": attribute,
                                    "method": method, "value": value}
                                   for offset in range(83, 139, 7)
                                   for attribute, method, value in [struct.unpack_from(">HBf", prefix, offset)]],
            "firstString": first_string, "secondString": second_string,
            "recordBytes": table.offset - start}


def attribute_row(table: Table) -> dict:
    (key,) = table.unpack(">I")
    label = table.string()
    table.unpack(">31s")
    return {"id": key, "label": label}


def goods_header(table: Table) -> dict:
    key, name = table.unpack(">2I")
    return {"id": key, "nameReference": name,
            "firstString": table.string(), "secondString": table.string()}


def goods_row(table: Table) -> dict:
    row = goods_header(table)
    (body,) = table.unpack(">152s")
    return {**row, "descriptionReferenceAtTail36": struct.unpack_from(">I", body, 36)[0]}


def currency_row(table: Table) -> dict:
    key, value4, text8, goods12 = table.unpack(">4I")
    icon = table.string()
    (tail,) = table.unpack(">I")
    return {"id": key, "valueAt4": value4, "textReferenceAt8": text8,
            "goodsReferenceAt12": goods12, "iconReference": icon, "tail": tail}


def campaign_loot_links(directory: Path, candidates: list, booty: Table, goods_table: Table,
                        currency_table: Table, texts: dict) -> dict:
    goods = read_variable(goods_table, goods_row, lambda r: r["id"])
    partial_goods = goods_table.partial_record_offset
    goods_end = goods_table.offset
    partial_goods_id = None
    if partial_goods is not None:
        partial_goods_id = goods_header(goods_table)["id"]
        goods_end = goods_table.offset + 152
        goods_table.offset = partial_goods
        require(partial_goods_id not in {r["id"] for r in goods}, "GoodsConfig: duplicate partial ID")
    require(goods_end == goods_table.size, "GoodsConfig: final boundary differs from file size")
    currencies = read_variable(currency_table, currency_row, lambda r: r["id"])
    by_goods = {r["id"]: r for r in goods}
    rows = [struct.unpack(">14I", raw) for raw in read_fixed(booty, 56)]
    groups = defaultdict(list)
    for row in rows:
        groups[row[0]].append(row)
    # An incomplete final row may belong to an otherwise readable group. Never
    # treat such a group as fully known, even if its first ID is available.
    partial_booty = 20 + len(rows) * 56
    partial_group = None
    if len(rows) < booty.count:
        require(partial_booty + 4 <= len(booty.data), "BootyConfig: incomplete group identity unavailable")
        partial_group = struct.unpack_from(">I", booty.data, partial_booty)[0]
    refs = {offset: Counter() for offset in (89, 93, 97)}
    per_level_counts = {offset: Counter() for offset in refs}
    wave_number_sets = Counter()
    for level in candidates:
        raw = (directory / f"LevelWaveConfig{level['id']}").read_bytes()
        local = Counter()
        numbers = set()
        prefix = (1000 + level["number"]) * 100
        allowed = {89: set(range(prefix + 1, prefix + 6)), 93: {prefix + 51}, 97: {prefix + 11}}
        # Collection fingerprints and row boundaries were verified earlier.
        for start in range(20, len(raw), 139):
            numbers.add(struct.unpack_from(">I", raw, start + 12)[0])
            for offset in refs:
                key = struct.unpack_from(">I", raw, start + offset)[0]
                if not key:
                    continue
                require(key in groups and key != partial_group, "Campaign loot: unresolved or incomplete group")
                require(key in allowed[offset], "Campaign loot: unexpected parent-number group pattern")
                refs[offset][key] += 1
                local[offset] += 1
        wave_number_sets[tuple(sorted(numbers))] += 1
        for offset in refs:
            per_level_counts[offset][local[offset]] += 1
    used = {key for values in refs.values() for key in values}
    used_rows = [row for key in sorted(used) for row in groups[key]]
    missing_goods = sorted({row[5] for row in used_rows if row[5] not in by_goods})
    selected_goods = []
    for key in (99004, 90002, *range(61001, 61019)):
        row = by_goods[key]
        selected_goods.append({**row, "name": texts[row["nameReference"]]["text"],
                               "description": texts[row["descriptionReferenceAtTail36"]]["text"]})
    return {"bootyRecordBytes": 56, "completeBootyRows": len(rows), "uniqueBootyGroups": len(groups),
            "incompleteBootyGroupExcluded": partial_group, "candidateLevels": len(candidates),
            "waveNumberSets": [{"numbers": list(numbers), "levels": count}
                               for numbers, count in sorted(wave_number_sets.items())],
            "references": {offset: {"nonzeroWaveRows": sum(values.values()), "distinctGroups": len(values),
                                    "perLevelNonzeroCounts": dict(sorted(per_level_counts[offset].items()))}
                           for offset, values in refs.items()},
            "parentNumberGroupPattern": "(1000+titleNumber)*100 + 1..5 / 51 / 11 for wave offsets 89 / 93 / 97",
            "matchedGroups": len(used), "matchedGroupRows": len(used_rows),
            "unresolvedGoodsReferencesAt20": missing_goods,
            "selectedGroups": {key: [list(row) for row in groups[key]] for key in (100101, 100151, 100111)},
            "goodsLayout": {"idAndNameBytes": 8, "stringCount": 2, "tailBytes": 152,
                            "predictedFinalRecordEnd": goods_end, "incompleteIdExcluded": partial_goods_id,
                            "nonemptySecondStrings": sum(bool(r["secondString"]) for r in goods)},
            "selectedGoods": selected_goods,
            "currencyLayout": {"prefixBytes": 16, "stringCount": 1, "tailBytes": 4},
            "currencyGoodsReferences": {"matched": sum(r["goodsReferenceAt12"] in by_goods for r in currencies),
                                        "unresolved": [r for r in currencies if r["goodsReferenceAt12"] not in by_goods]},
            "selectedCurrencies": [{**r, "label": texts[r["textReferenceAt8"]]["text"]}
                                   for r in currencies if r["id"] in (1, 2, 3, 4)],
            "limits": ["Only the explicit numbered candidate series is checked here; live availability remains unknown.",
                       "These fields refer to loot groups, not proven monster multipliers.",
                       "Preserve repeated group rows, zero values and gating fields; dispatch/weights are unverified.",
                       "Experience item 99004 describes character leveling; this does not prove combat-XP timing.",
                       "Goods references may denote other item families; unresolved values are retained."]}


def monster_attribute_links(monsters: list, attributes: list, texts: dict) -> dict:
    by_id = {row["id"]: row for row in attributes}
    slots = [slot for row in monsters for slot in row["attributeSlotsAt83"]]
    require(all(math.isfinite(s["value"]) for s in slots), "MonsterCfg: non-finite attribute")
    require(all(s["attribute"] in by_id and s["method"] == 1 if s["attribute"] else
                s["method"] == 0 and s["value"] == 0 for s in slots),
            "MonsterCfg: unresolved attribute or unexpected slot method")
    selected = []
    for row in monsters:
        if row["id"] not in (10, 20, 30, 40, 50, 60, 70, 80, 90, 100):
            continue
        selected.append({"id": row["id"], "name": texts[row["nameReferenceAt9"]]["text"],
                         "description": texts[row["descriptionReferenceAt13"]]["text"],
                         "attributes": [{**slot, "label": by_id[slot["attribute"]]["label"]}
                                        for slot in row["attributeSlotsAt83"] if slot["attribute"]]})
    frost = next(row for row in selected if row["id"] == 70)
    fire = next(slot for slot in frost["attributes"] if slot["attribute"] == 303)
    require(fire["value"] == 1 and "50%" in frost["description"],
            "MonsterCfg: expected frost fire-damage text/attribute discrepancy")
    return {"definitionLayout": {"idBytes": 4, "stringCount": 1, "tailBytes": 31},
            "definitionRows": len(attributes), "monsterRows": len(monsters),
            "slots": len(slots), "nonzeroSlots": sum(bool(s["attribute"]) for s in slots),
            "methodCounts": dict(sorted(Counter(s["method"] for s in slots).items())),
            "missingAttributeIds": [], "selectedMonsters": selected,
            "statusDefinitions": [row for row in attributes if row["id"] in (310, 311, 312, 313, 316)],
            "textAttributeConflicts": [{"monster": 70, "attribute": 303, "slotValue": fire["value"],
                                        "description": frost["description"],
                                        "localChoice": "Use the description's +50%; raw +100% remains unresolved."}],
            "limits": ["Attribute IDs and static values are verified; runtime merge order is not.",
                       "Method 1 is not assumed to mean the same operation for every attribute.",
                       "Burn/freeze/stun immunity uses descriptions; not all immunity comes from these eight slots.",
                       "Paralysis (311) and stun (313) are different statuses."]}


def monster_references(monsters: list, manual_table: Table, texts: dict) -> dict:
    by_id = {row["id"]: row for row in monsters}
    manual = [{"id": struct.unpack_from(">I", raw)[0],
               "valueAt4": struct.unpack_from(">I", raw, 4)[0]}
              for raw in read_fixed(manual_table, 52)]
    require(len({row["id"] for row in manual}) == len(manual),
            "MonsterManualCfg: duplicate ID")
    missing_texts = sorted({row[key] for row in monsters
                           for key in ("nameReferenceAt9", "descriptionReferenceAt13")
                           if row[key] not in texts})
    return {
        "monsterLayout": {"prefixBytes": 191, "stringCount": 2, "tailBytes": 41,
                          "fixedOverheadBytes": 240},
        "recordByteCounts": dict(sorted(Counter(row["recordBytes"] for row in monsters).items())),
        "nonemptySecondStrings": [{"id": row["id"], "value": row["secondString"]}
                                  for row in monsters if row["secondString"]],
        "missingTextReferences": missing_texts,
        "manualRecordBytes": 52, "manualRows": len(manual),
        "matchedManualValuesAt4": sum(row["valueAt4"] in by_id for row in manual),
        "unresolvedManualValuesAt4": [row for row in manual if row["valueAt4"] not in by_id],
        "manualAliases": [row for row in manual if row["id"] != row["valueAt4"]],
        "selectedMonsters": [{**row, "name": texts.get(row["nameReferenceAt9"], {}).get("text"),
                              "description": texts.get(row["descriptionReferenceAt13"], {}).get("text")}
                             for row in monsters if row["id"] in (10, 20, 30, 40, 50, 60, 70,
                                                                  80, 90, 100, 5300, 6001, 8014)],
        "limits": ["Names and descriptions are static text references, not observed combat behavior.",
                   "Manual offset 4 has three unresolved rows; do not replace them by the manual row ID.",
                   "Health, damage, resistance, animation and mode-specific attribute merging remain unverified."],
    }


def wave_references(directory: Path, levels: list, monsters: list) -> dict:
    files = list(directory.glob("LevelWaveConfig*"))
    require(all(path.name[15:].isdigit() and str(int(path.name[15:])) == path.name[15:]
                for path in files), "LevelWaveConfig: unexpected filename")
    files.sort(key=lambda path: int(path.name[15:]))
    require(len(files) == 12987, "LevelWaveConfig: incomplete or unexpected collection")
    level_ids, monster_ids = {row["id"] for row in levels}, {row["id"] for row in monsters}
    digest = hashlib.sha256()
    row_count, total_bytes = 0, 0
    monster_counts, mode_counts, byte24_counts = Counter(), Counter(), Counter()
    wave_ids, nonconsecutive, nonmonotonic, selected = set(), [], [], []
    for path in files:
        level, raw = int(path.name[15:]), path.read_bytes()
        digest.update((path.name + "\0" + hashlib.sha256(raw).hexdigest() + "\n").encode("utf8"))
        require(len(raw) >= 20, f"{path.name}: incomplete header")
        magic, size, version, count, checksum = struct.unpack_from(">5I", raw)
        require((magic, size, version, checksum) == (0x2DEF, len(raw), 1, 9999),
                f"{path.name}: unexpected header")
        require(size == 20 + count * 139, f"{path.name}: invalid record stride")
        wave_ids.add(level)
        row_count += count
        total_bytes += size
        ids, times, rows = [], [], []
        for index in range(count):
            offset = 20 + index * 139
            key, row_id, value8, value12, value16 = struct.unpack_from(">4If", raw, offset)
            require(key == level, f"{path.name}: row/file ID mismatch")
            require(math.isfinite(value16) and value16 >= 0, f"{path.name}: invalid float at 16")
            monster = struct.unpack_from(">I", raw, offset + 33)[0]
            ids.append(row_id)
            times.append(value16)
            monster_counts[monster] += 1
            mode_counts[value8] += 1
            byte24_counts[raw[offset + 24]] += 1
            if level in (1001, 1002, 2001, 2007, 81015, 84001):
                rows.append({"idAt4": row_id, "valueAt8": value8, "valueAt12": value12,
                             "floatAt16": value16, "byteAt24": raw[offset + 24],
                             "monsterReferenceAt33": monster,
                             "valueAt41": struct.unpack_from(">I", raw, offset + 41)[0]})
        require(len(set(ids)) == len(ids), f"{path.name}: duplicate row ID")
        # Preserve valid exceptions. Sorting/reindexing would erase dispatch evidence.
        if ids != list(range(1, count + 1)):
            nonconsecutive.append(level)
        if times != sorted(times):
            nonmonotonic.append(level)
        if rows:
            selected.append({"level": level, "rows": rows})
    require(digest.hexdigest() == WAVE_COLLECTION_SHA256, "LevelWaveConfig: unknown reference revision")
    unresolved_levels = sorted(wave_ids - level_ids)
    unresolved_monsters = sorted(set(monster_counts) - monster_ids - {0})
    require(not unresolved_levels, "LevelWaveConfig: unresolved complete level reference")
    require(not unresolved_monsters, "LevelWaveConfig: unresolved nonzero monster reference")
    return {
        "files": len(files), "bytes": total_bytes, "completeRows": row_count,
        "recordBytes": 139, "aggregateSha256": digest.hexdigest(),
        "aggregateFormat": "Numeric filename order; UTF-8 filename + NUL + SHA-256 hex + LF.",
        "declaredChecksum": 9999, "checksumVerified": False,
        "matchedLevelReferences": len(wave_ids), "levelsWithoutWaveFile": sorted(level_ids - wave_ids),
        "monsterReferenceOffset": 33, "matchedNonzeroMonsterRows": row_count - monster_counts[0],
        "distinctNonzeroMonsterReferences": len(monster_counts) - (0 in monster_counts),
        "zeroMonsterReferenceRows": monster_counts[0],
        "unresolvedLevelReferences": unresolved_levels, "unresolvedMonsterReferences": unresolved_monsters,
        "uniqueRowIdsWithinEachFile": True, "nonconsecutiveRowIdFiles": nonconsecutive,
        "nonmonotonicFloat16Files": nonmonotonic,
        "valuesAt8": dict(sorted(mode_counts.items())), "bytesAt24": dict(sorted(byte24_counts.items())),
        "selectedWaves": selected,
        "limits": ["The collection includes multiple modes; file count is not the campaign stage count.",
                   "A zero monster field is not a spawnable monster; dynamic library/event dispatch is unresolved.",
                   "Offsets 12, 16 and 41 remain candidates for wave, timing and count; units and dispatch are unverified.",
                   "Nonmonotonic timing and gaps in row IDs must be retained, not sorted away.",
                   "No raw reference records are imported into the playable campaign by this reader."],
    }


def numbered_level_candidates(levels: list, texts: dict, waves: dict) -> dict:
    """Select an explicit static numbering series without asserting live availability."""
    groups = defaultdict(list)
    title_separator_exceptions = []
    title_label_conflicts = []
    for row in levels:
        title, label = [texts.get(key, {}).get("text", "")
                        for key in row["textReferencesAtMiddle51And55"]]
        label_number = re.fullmatch(r"第(\d+)(?:-(\d+))?关", label)
        title_number = re.match(r"^(\d+)(?:-(\d+))?", title)
        if not title_number or not label_number or row["valueAtBody28"] != 2:
            continue
        number, sub = int(title_number[1]), int(title_number[2]) if title_number[2] else None
        expected_id = 1000 + number if sub is None else 10000 + number * 10 + sub
        if row["id"] != expected_id:
            continue
        prefix = str(number) + (f"-{sub}" if sub is not None else "")
        if title_number.groups() != label_number.groups():
            title_label_conflicts.append({"id": row["id"], "title": title, "label": label,
                                          "textReferences": row["textReferencesAtMiddle51And55"]})
        if not title.startswith(prefix + "."):
            title_separator_exceptions.append({"id": row["id"], "title": title, "label": label})
        require(row["id"] not in waves["levelsWithoutWaveFile"],
                "Numbered levels: missing wave file")
        groups[number].append({"id": row["id"], "numberFromTitle": number, "subnumberFromTitle": sub,
                               "numberFromLabel": int(label_number[1]),
                               "subnumberFromLabel": int(label_number[2]) if label_number[2] else None,
                               "title": title, "label": label, "sceneReference": row["sceneReference"]})
    numbers = sorted(groups)
    require(numbers, "Numbered levels: missing reference series")
    for rows in groups.values():
        subs = [row["subnumberFromTitle"] for row in rows]
        require(subs == [None] or None not in subs and sorted(subs) == list(range(1, len(subs) + 1)),
                "Numbered levels: duplicate or missing subnumber")
    return {
        "criterion": "Body28=2; title number N with ID=1000+N, or N-S with ID=10000+10*N+S. Description labels are parsed independently and conflicts retained.",
        "distinctNumbers": len(numbers), "firstNumber": min(numbers), "lastNumber": max(numbers),
        "missingNumbers": sorted(set(range(min(numbers), max(numbers) + 1)) - set(numbers)),
        "records": sum(len(rows) for rows in groups.values()),
        "recordsPerNumberCounts": dict(sorted(Counter(len(rows) for rows in groups.values()).items())),
        "firstSplitNumber": min(number for number, rows in groups.items()
                                if rows[0]["subnumberFromTitle"] is not None),
        "titleSeparatorExceptions": title_separator_exceptions,
        "titleLabelNumberConflicts": title_label_conflicts,
        "allWaveReferencesPresent": True,
        "candidateIdentities": [{"id": row["id"], "number": number, "subnumber": row["subnumberFromTitle"]}
                                for number in numbers for row in groups[number]],
        "selectedNumbers": {number: groups[number] for number in (1, 299, 300, 399, 400, 409, 419)},
        "limits": ["This explicit ID/text criterion identifies a static candidate series only.",
                   "Conflicting description labels are retained; neither title nor description proves runtime dispatch.",
                   "It does not establish current live stage availability, unlock rules, skill locks or difficulty.",
                   "Other mode series and nonnumbered levels remain outside this selection, not outside the full collection."],
    }


def level_library_candidates(table: Table, libraries: list, groups: list,
                             level_bases: list, texts: dict) -> dict:
    """Cross-reference a candidate field without naming it as proven dispatch."""
    pairs = [struct.unpack(">2I", raw) for raw in libraries]
    require(len(set(pairs)) == len(pairs), "BuildLibraryConfig: duplicate library/group pair")
    group_ids = {r["group"] for r in groups}
    require(all(group in group_ids for _, group in pairs),
            "BuildLibraryConfig: unresolved complete group reference")
    by_library = defaultdict(list)
    for library, group in pairs:
        by_library[library].append(group)
    counts = Counter(r["valueAtBody28"] for r in level_bases)

    def describe(row: dict) -> dict:
        references = row["textReferencesAtMiddle51And55"]
        return {"id": row["id"], "valueAtBody28": row["valueAtBody28"],
                "textReferences": references,
                "texts": [texts.get(key, {}).get("text") for key in references]}

    unresolved = [describe(r) for r in level_bases
                  if r["valueAtBody28"] and r["valueAtBody28"] not in by_library]
    # Fixed rows can straddle the final block. A complete first word is evidence
    # about that word only; never treat it as a usable library/group pair.
    first_incomplete = 20 + len(pairs) * 8
    partial = None
    if first_incomplete < table.size:
        partial = {"offset": first_incomplete, "completeRowExcluded": True,
                   "firstDecodedWord": struct.unpack_from(">I", table.data, first_incomplete)[0]
                   if first_incomplete + 4 <= len(table.data) else None}
    return {
        "block": "final159", "offset": 28,
        "completeLibraryGroupPairs": len(pairs), "uniqueLibraries": len(by_library),
        "matchedGroupReferences": len(pairs),
        "completeLevelRows": len(level_bases),
        "matchedLevelRows": sum(counts[key] for key in by_library),
        "zeroLevelRows": counts[0], "unresolvedNonzeroLevelRows": unresolved,
        "body28ValueCounts": dict(sorted(counts.items())),
        "selectedLevels": [describe(r) for r in level_bases
                           if r["id"] in (1001, 2001, 3001, 4001, 5001, 6001,
                                          7001, 8001, 10001, 91001)],
        "selectedLibraryGroups": {key: by_library[key] for key in (1, 2, 3, 4, 5)},
        "firstIncompleteLibraryRow": partial,
        "limits": ["The offset is a strong static reference candidate, not a verified runtime field name.",
                   "A library's linked groups do not prove how groups, conditions or weights are dispatched.",
                   "Incomplete library and level rows never contribute to matching counts."],
    }


def orb_group_comparisons(groups: list) -> dict:
    selected = (1015, 2001, 3001, 4001, 5001, 6001, 11000, 102001, 310000)
    by_group = {key: {r["build"]: r for r in groups
                      if r["group"] == key and 1501 <= r["build"] <= 1525}
                for key in selected}
    require(all(set(rows) == set(range(1501, 1526)) for rows in by_group.values()),
            "BuildGroupConfig: expected complete orb comparison groups")
    compared = ("values2To4", "tuples5To19", "tuples20To34", "remainingFields", "lastByte")
    comparisons = []
    for key, rows in by_group.items():
        differences = []
        for build, row in rows.items():
            base = by_group[1015][build]
            changed = {field: {"base": base[field], "compared": row[field]}
                       for field in compared if base[field] != row[field]}
            if changed:
                differences.append({"build": build, "fields": changed})
        comparisons.append({"group": key, "completeOrbRows": len(rows), "differences": differences})
    return {"baseGroup": 1015, "comparisons": comparisons,
            "ordinaryZeroWeightCandidates": [r["build"] for r in by_group[2001].values()
                                               if r["values2To4"][:2] == [0, 0]],
            "hiddenGroup2002": [r for r in groups if r["group"] == 2002],
            "limits": ["Field 4 is a rank-cap candidate; its runtime interpretation remains unobserved.",
                       "Groups agree on some conditions but differ on weights; no universal card pool is inferred.",
                       "Research display text for levels 2/14 names a different card from the ordinary group's tuple."]}


def chapter_level_links(table: Table, level_bases: list, texts: dict) -> dict:
    levels = {r["id"]: r for r in level_bases}
    records = [struct.unpack(">3I", raw) for raw in read_fixed(table, 12)]
    require(len({r[0] for r in records}) == len(records), "ChapterConfig: duplicate ID")
    linked = []
    for key, first, second in records:
        require(first in levels and second in levels, "ChapterConfig: unresolved complete level record")
        references = [levels[n]["textReferencesAtMiddle51And55"] for n in (first, second)]
        require(all(t in texts for pair in references for t in pair), "ChapterConfig: unresolved level text")
        linked.append({"id": key, "levelReferences": [first, second], "textReferences": references,
                       "texts": [[texts[t]["text"] for t in pair] for pair in references],
                       "sceneReferences": [levels[n]["sceneReference"] for n in (first, second)]})
    return {"recordBytes": 12, "completeRecords": len(records), "matchedLevelReferences": len(records) * 2,
            "matchingDisplayPairs": sum(r["texts"][0] == r["texts"][1] for r in linked),
            "matchingScenePairs": sum(r["sceneReferences"][0] == r["sceneReferences"][1] for r in linked),
            "selected": linked[:3]}


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


def read_magic_levels(table: Table, texts: dict, builds: dict) -> list:
    rows, identities, pairs = [], set(), set()
    for index, raw in enumerate(read_fixed(table, 176)):
        prefix = struct.unpack_from(">8I", raw)
        skill, level, identity, build, description = prefix[:5]
        require(identity not in identities and (skill, level) not in pairs,
                "MagicSkillLevelConfig: duplicate identity or skill/level pair")
        identities.add(identity)
        pairs.add((skill, level))
        tail = struct.unpack_from(">4I", raw, 160)
        for reference in (description, tail[0]):
            require(not reference or reference in texts, "MagicSkillLevelConfig: unresolved milestone text")
        for reference in (build, tail[2]):
            require(not reference or reference in builds and builds[reference]["complete"],
                    "MagicSkillLevelConfig: unresolved milestone build")
        attributes = []
        for offset in (32, 39):
            key, method, value = struct.unpack_from(">HBf", raw, offset)
            require(math.isfinite(value), "MagicSkillLevelConfig: nonfinite attribute")
            attributes.append({"offset": offset, "attribute": key, "method": method, "value": value})
        displays = []
        for offset in range(46, 160, 19):
            key, method, label, value, target, flag = struct.unpack_from(">HBIfII", raw, offset)
            require(math.isfinite(value), "MagicSkillLevelConfig: nonfinite display value")
            displays.append({"offset": offset, "attribute": key, "method": method,
                             "labelReference": label, "label": texts.get(label, {}).get("text"),
                             "value": value, "target": target, "flag": flag})
        # Referenced labels establish display concepts, not attribute dispatch or stacking.
        rows.append({"offset": 20 + index * 176, "skill": skill, "level": level,
                     "identityAt8": identity, "buildAt12": build, "descriptionAt16": description,
                     "descriptionText": texts.get(description, {}).get("text"),
                     "valuesAt20To28": list(prefix[5:]), "attributesAt32And39": attributes,
                     "displayFields": displays, "tailAt160To172": list(tail),
                     "tailText": texts.get(tail[0], {}).get("text"),
                     "tailBuildName": texts[builds[tail[2]]["title"]]["text"] if tail[2] else None})
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
    skill_bases = read_variable(tables["SkillBaseConfg"], skill_base_row, lambda r: r["id"])
    base_table = tables["SkillBaseConfg"]
    partial_base = base_table.partial_record_offset
    base_end = (partial_base + 386 + struct.unpack_from(">I", base_table.data, partial_base + 26)[0]
                if partial_base is not None else base_table.offset)
    require(base_end == base_table.size, "SkillBaseConfg: inferred final boundary differs from file size")
    level_bases = read_variable(tables["LevelBaseConfig"], level_base_row, lambda r: r["id"])
    level_table = tables["LevelBaseConfig"]
    partial_level = level_table.partial_record_offset
    level_end, partial_level_id = level_table.offset, None
    if partial_level is not None:
        partial_header = level_base_header(level_table)
        level_end, partial_level_id = level_table.offset + 159, partial_header["id"]
        level_table.offset = partial_level
        require(partial_level_id not in {r["id"] for r in level_bases},
                "LevelBaseConfig: duplicate ID in incomplete final record")
    require(level_end == level_table.size, "LevelBaseConfig: inferred final boundary differs from file size")
    chapter_links = chapter_level_links(tables["ChapterConfig"], level_bases, texts)
    monsters = read_variable(tables["MonsterCfg"], monster_row, lambda row: row["id"])
    attributes = read_variable(tables["AttrDataConfig"], attribute_row, lambda row: row["id"])
    attribute_links = monster_attribute_links(monsters, attributes, texts)
    monster_links = monster_references(monsters, tables["MonsterManualCfg"], texts)
    waves = wave_references(directory, level_bases, monsters)
    numbered = numbered_level_candidates(level_bases, texts, waves)
    loot = campaign_loot_links(directory, numbered["candidateIdentities"], tables["BootyConfig"],
                               tables["GoodsConfig"], tables["CurrencyTypeConfig"], texts)
    library_candidates = level_library_candidates(tables["BuildLibraryConfig"], libraries,
                                                  groups, level_bases, texts)
    magic_ids = {r["id"] for r in magic}
    levels = read_magic_levels(tables["MagicSkillLevelConfig"], texts, builds)
    level_families = {key: sorted(r["level"] for r in levels if r["skill"] == key)
                      for key in {r["skill"] for r in levels}}
    require(level_families.keys() == magic_ids and all(v == list(range(1, 47)) for v in level_families.values()),
            "MagicSkillLevelConfig: expected eighteen complete 1–46 sequences")
    base_by_id = {r["id"]: r for r in skill_bases}
    cooldown_comparisons = []
    for row in levels:
        if row["level"] != 1:
            continue
        for field in row["displayFields"]:
            if field["label"] == "冷却":
                value = base_by_id[row["skill"]]["floatAtBody17"]
                require(value == field["value"], "MagicSkillLevelConfig: base/display cooldown comparison differs")
                cooldown_comparisons.append({"skill": row["skill"], "baseFloatAtBody17": value,
                                             "displayOffset": field["offset"], "displayValue": field["value"]})
    require(len(cooldown_comparisons) == 17, "MagicSkillLevelConfig: unexpected primary cooldown display count")
    buffs = read_variable(tables["BuffConfig"], buff_row, lambda r: r["id"])
    buff_attrs = read_variable(tables["BuffAttrConfig"], buff_attr_row, lambda r: (r["id"], r["rank"]))
    skill_attrs = read_skill_attributes(tables["BuffFuncSkillAttrConfig"])
    selected = {}
    for key in [*range(1401, 1421), *range(1501, 1530), 1532, *range(1549, 1555), *range(1560, 1564)]:
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
        "selectedSkillBases": {r["id"]: {**r, "name": texts.get(r["title"], {}).get("text"),
                                          "descriptionText": texts.get(r["description"], {}).get("text")}
                               for r in skill_bases if r["id"] in magic_ids},
        "skillBaseBoundaries": {"prefixBytes": 26, "stringLengthBytes": 4, "bodyBytes": 356,
                                "predictedFinalRecordEnd": base_end,
                                "incompleteBodyExcluded": partial_base is not None,
                                "missingMagicSkillBases": sorted(magic_ids - {r["id"] for r in skill_bases})},
        "levelBaseBoundaries": {"prefixBytes": 48, "middleBytes": [4, 59], "bodyBytes": 159,
                                "stringCount": 3, "fixedOverheadBytes": 282, "idOffsetInMiddle59": 9,
                                "completeRecords": len(level_bases), "predictedFinalRecordEnd": level_end,
                                "incompleteRecordId": partial_level_id,
                                "incompleteBodyExcluded": partial_level is not None},
        "selectedLevelBases": [r for r in level_bases
                               if r["id"] in (9997, 9998, 9999, 1001, 1002, 1003, 2001, 2002)],
        "chapterLevelLinks": chapter_links,
        "monsterReferences": monster_links,
        "monsterAttributeLinks": attribute_links,
        "waveReferences": waves,
        "numberedLevelCandidates": numbered,
        "campaignLootLinks": loot,
        "levelLibraryCandidates": library_candidates,
        "orbGroupComparisons": orb_group_comparisons(groups),
        "skillLevelBoundaries": {"recordBytes": 176, "completeRecords": len(levels),
                                 "familyLevels": level_families,
                                 "missingDisplayTexts": sorted({f["labelReference"] for r in levels
                                                                 for f in r["displayFields"]
                                                                 if f["labelReference"] and f["label"] is None}),
                                 "baseField17DisplayComparisons": cooldown_comparisons},
        "selectedSkillLevels": [r for r in levels if r["level"] == 1 or
                                r["skill"] in (14000, 15000, 18000) and r["descriptionAt16"]],
        "researchComparisons": {
            "orbRiseGroups": [g for g in groups if g["build"] in (1504, 1525)],
            "orbRiseAttributes": [r for r in skill_attrs if r["id"] in (15041, 15251)],
            "orbLevel31Buff": [r for r in buff_attrs if r["id"] == 152911],
            "orbReplacementRows": [list(struct.unpack(">7I", raw)) for raw in replacements
                                   if any(1501 <= n <= 1563 for n in struct.unpack(">7I", raw))],
            "limits": ["Group 310000 lacks the positive level-6 tuple on build 1525; its mode is unresolved.",
                       "Research level 31 says 45% chance; build 1529 says hits on stunned targets. Neither text alone proves dispatch.",
                       "Replacement build 1532 is a different rise variant from research build 1525."],
        },
        "selectedGroups": [g for g in groups if g["group"] in (1014, 1015, 2002)],
        "selectedWeights": [list(struct.unpack(">21I", raw)) for raw in weights
                            if struct.unpack_from(">I", raw)[0] == 2002],
        "orbMechanics": {
            "texts": {key: texts[key] for key in (402915000, 416002055, 416102055, 470281301,
                                                   407401561, 407401562, 407401563, 407401564, 407401567)},
            "magic": [r for r in magic if r["id"] == 15000],
            "subskills": [r for r in subskills if 15000 <= r["id"] < 15700],
            "buffs": [r for r in buffs if r["id"] in (150111, 150112, 150113, 156011, 156012, 156013)],
            "buffAttributes": [r for r in buff_attrs if r["id"] in (150111, 150112, 150113, 156011, 156012, 156013)],
            "skillAttributes": [r for r in skill_attrs if 15000 <= r["id"] < 15700],
        },
        # Cross-check unknown dispatch enums with cards whose text names the effect.
        # These comparisons do not establish the runtime meaning of other subtypes.
        "dispatchComparisons": {
            "buffAttributes": [r for r in buff_attrs
                               if r["id"] in (150112, 150113, 181101, 16001041, 16001351)],
            "builds": {key: {**builds[key], "name": texts[builds[key]["title"]]["text"],
                             "descriptionText": texts[builds[key]["description"]]["text"]}
                       for key in (1600104, 1600135)},
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
                   "LevelBase body offset 28 matches library IDs structurally; runtime dispatch and modes remain unverified.",
                   "ChapterConfig's fifty pairs do not establish current campaign size or availability.",
                   "A text row or card definition does not prove it is selectable in normal play.",
                   "Skill-level display labels do not establish runtime stacking, upgrade costs or maximum attainable research.",
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
    waves = report["waveReferences"]
    print(f"Wave collection: {waves['files']} files, {waves['completeRows']} complete rows; "
          f"{waves['matchedNonzeroMonsterRows']} nonzero monster references matched")
    numbered = report["numberedLevelCandidates"]
    print(f"Numbered candidate series: {numbered['distinctNumbers']} numbers, {numbered['records']} records; "
          "live campaign availability not verified")
    print(f"Report: {args.output}")


if __name__ == "__main__":
    main()
