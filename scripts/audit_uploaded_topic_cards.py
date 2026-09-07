from __future__ import annotations

import json
from pathlib import Path


PROJECT = Path("/home/ubuntu/hong-kong-chinese-word-library")
UPLOAD_DIR = Path("/home/ubuntu/upload")
TERMS_PATH = PROJECT / "client/src/data/termsV2.json"
AUDIT_PATH = PROJECT / "exports/42張家長字卡_地圖對應稽核.json"

EXPECTED = {
    "M01": "LV1水果與飲品.png",
    "M02": "LV4主食與小食.jpeg",
    "M03": "LV9蔬菜與食材.png",
    "M04": "LV1基本心情.png",
    "M05": "LV5人際感受與態度.png",
    "M06": "LV9進階情緒與自我認識.png",
    "M07": "LV1常見動物.png",
    "M08": "LV5水中與海洋動物.png",
    "M09": "LV10鳥類昆蟲與野生動物.png",
    "M10": "LV1基本顏色.png",
    "M11": "LV5色彩深淺與質感.png",
    "M12": "LV10形容與視覺描述.png",
    "M13": "LV2五官與外觀.png",
    "M14": "LV5肢體與身體部位.png",
    "M15": "LV10人體系統與感官.png",
    "M16": "LV2核心家人.png",
    "M17": "LV4親戚與家庭生活.jpeg",
    "M18": "LV9家族與關係.png",
    "M19": "LV2家居用品.png",
    "M20": "LV6學習與個人物品.png",
    "M21": "LV10家電與實用工具.png",
    "M22": "LV2玩具與遊戲.png",
    "M23": "LV3交通與出行.png",
    "M24": "LV4校園日常.jpeg",
    "M25": "LV7課堂學習與活動.png",
    "M26": "LV7職業與工作.png",
    "M27": "LV7運動與活動.png",
    "M28": "LV6天氣季節與自然現象.png",
    "M29": "LV10自然景觀與環境保護.png",
    "M30": "LV9品格與自我管理.png",
    "M31": "LV9社區規則與公民生活.png",
    "M32": "LV6社區場所與城市生活.png",
    "M33": "LV4數碼工具與操作.png",
    "M34": "LV8媒體與通訊.png",
    "M35": "LV3傳統節日.jpeg",
    "M36": "LV7中國文化與藝術.png",
    "M37": "LV8歷史與古蹟.png",
    "M38": "LV3日常衛生與健康.jpeg",
    "M39": "LV8就醫與疾病預防.png",
    "M40": "LV3服裝與穿戴.jpeg",
    "M41": "LV8社區服務與生活延伸.png",
    "M42": "LV6服裝穿戴與衣物製作.png",
}


def main() -> None:
    terms = json.loads(TERMS_PATH.read_text(encoding="utf-8"))
    map_meta = {}
    for term in terms:
        map_meta.setdefault(term["mapId"], {"level": term["level"], "topic": term["topic"]})
    uploaded_names = {path.name for path in UPLOAD_DIR.glob("LV*.*")}
    audit = [
        {
            "mapId": map_id,
            "level": map_meta[map_id]["level"],
            "topic": map_meta[map_id]["topic"],
            "cardFile": card_file,
            "present": card_file in uploaded_names,
            "sizeBytes": (UPLOAD_DIR / card_file).stat().st_size if card_file in uploaded_names else None,
        }
        for map_id, card_file in EXPECTED.items()
    ]
    expected_names = set(EXPECTED.values())
    result = {
        "mapCount": len(audit),
        "uploadedCardCount": len(uploaded_names),
        "missing": sorted(expected_names - uploaded_names),
        "unexpected": sorted(uploaded_names - expected_names),
        "maps": audit,
    }
    AUDIT_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "mapCount": result["mapCount"],
        "uploadedCardCount": result["uploadedCardCount"],
        "missingCount": len(result["missing"]),
        "unexpectedCount": len(result["unexpected"]),
    }, ensure_ascii=False))
    if result["missing"] or result["unexpected"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
