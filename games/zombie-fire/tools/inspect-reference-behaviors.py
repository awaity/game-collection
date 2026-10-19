"""Inspect selected serialized skill settings; never load or execute client code.

Run with: uv run --no-project --with UnityPy==1.25.0 python <this file>
The reference bundle and report must remain in ignored research storage.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import UnityPy

ROOT = Path(__file__).resolve().parents[3]
RESEARCH = ROOT / "artifacts/research/zombie-fire"
BUNDLE_SHA256 = "2049e3dcf0ddfcb5cda86a09f9a37ace40c8d11f275fb7deb8d74f050b3e8a04"
SELECTED = {15001, 15011, 15061, 15111, 15201, 15221, 15601, 15611, 15621, 15622, 15631, 15632, 15633}


def require(ok: bool, message: str) -> None:
    if not ok:
        raise ValueError(message)


def normalize(value):
    if isinstance(value, dict):
        if set(value) == {"_serializedValue"}:
            # Explicit Q32.32 interpretation; retain the raw integer for review.
            return {"rawQ32": value["_serializedValue"], "value": value["_serializedValue"] / 2**32}
        return {k: normalize(v) for k, v in value.items()}
    if isinstance(value, list):
        return [normalize(v) for v in value]
    return value


def pick(value: dict, names: str) -> dict:
    return {key: normalize(value[key]) for key in names.split()}


def common(element: dict) -> dict:
    return {**pick(element, "m_ElemDesc m_triggerType m_triggleStart m_triggleStop"),
            "repeat": pick(element["m_triggleRepeat"],
                           "m_eventType m_shootId m_triggerSelfId m_playSkillEventParam "
                           "m_bulletTriigleInterval m_targetHaveBufIdTrigger m_targetHaveBuffIdNoTrigger "
                           "m_ownBufIdTrigger m_ownAndBufIdTrigger m_ownBufIdNotTrigger")}


def bullet(element: dict) -> dict:
    return {**common(element),
            "bullet": pick(element["m_bulletData"],
                           "m_bulletType m_position m_fireGroup m_seqTimeBulletNum m_seqTimeBulletInterval "
                           "m_shootFlyTime m_delayMove m_delayShowBullet m_initMoveSpeed m_acceSpeed "
                           "m_hitActorType m_reflectEnemyCount m_hitThroughCount m_sceneReflectCount "
                           "m_bulletScopeType m_sendHitScenceEvent4 m_hitScenceEventParam4 "
                           "m_througtReflect m_reboundCount m_perHitCountTriggleScenceEvent "
                           "m_perHitCountTriggleShootId"),
            "impact": pick(element["m_impactData"], "m_ImpactType m_damageRatio m_shootId"),
            "collision": normalize(element["m_bulletTestParam"])}


def rule(element: dict) -> dict:
    return {**common(element), **pick(element, "m_eventType m_selectRandomEnemy m_selfTriggerEvent")}


def shoot_point(element: dict) -> dict:
    return {**common(element), **pick(element, "m_position m_shootPointLife m_shootTestParam m_shootFireCount"),
            "impact": pick(element["m_impactData"], "m_ImpactType m_damageRatio m_shootId")}


def inspect(path: Path) -> dict:
    require(hashlib.sha256(path.read_bytes()).hexdigest() == BUNDLE_SHA256, "Unknown skill bundle revision")
    env = UnityPy.load(str(path))
    records, ids = {}, set()
    for obj in env.objects:
        if obj.type.name != "MonoBehaviour":
            continue
        row = obj.read_typetree()
        key = int(row["m_Name"])
        # This revision keys assets by numeric m_Name; m_skillDispId is zero in all 2,804 objects.
        require(row["m_skillDispId"] == 0 and key not in ids, "Unexpected or duplicate skill identity")
        ids.add(key)
        if key not in SELECTED:
            continue
        data = row["m_skillDispData"]
        records[key] = {
            "label": data["m_xjskpT5AllElemAnimation"][0]["m_ElemDesc"],
            "groups": {k: len(v) for k, v in data.items() if v},
            "rules": [rule(e) for e in data["m_xjskpT5AllRuleEvent"]],
            "bullets": [bullet(e) for e in data["m_xjskpT5AllElemBullet"]],
            "shootPoints": [shoot_point(e) for e in data["m_xjskpT5AllElemShootPoint"]],
        }
    require(len(ids) == 2804 and records.keys() == SELECTED, "Skill identity set differs from the inspected revision")
    return {"bundleSha256": BUNDLE_SHA256, "serializedSkills": len(ids), "selected": records,
            "scope": "Serialized settings and references, not client execution; enums and final attribute dispatch need runtime confirmation.",
            "limits": ["Default fields in inactive union branches are not active mechanics.",
                       "Q32.32 conversion is explicit and raw values are retained.",
                       "The bundle includes conditional research/season effects; presence alone does not unlock them.",
                       "Original effects, meshes, audio and code are not included in this report or the game."]}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=RESEARCH / "official-config-bundles/skilldisp.ab")
    parser.add_argument("--output", type=Path, default=RESEARCH / "validated-orb-behaviors.json")
    args = parser.parse_args()
    require(args.output.resolve().is_relative_to((ROOT / "artifacts").resolve()), "Output must remain in ignored artifacts/")
    report = inspect(args.input)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    print(f"Validated {report['serializedSkills']} skill identities; inspected {len(report['selected'])} selected behaviors.")
    print(f"Report: {args.output}")


if __name__ == "__main__":
    main()
