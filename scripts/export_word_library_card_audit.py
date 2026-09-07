import json
from collections import OrderedDict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.table import Table, TableStyleInfo

PROJECT = Path("/home/ubuntu/hong-kong-chinese-word-library")
TERMS_PATH = PROJECT / "client/src/data/termsV2.json"
OUTPUT_DIR = PROJECT / "exports"
OUTPUT_DIR.mkdir(exist_ok=True)

# 只列明可與既有家長原卡準確對應的十級地圖；其餘地圖不會錯配舊卡。
CARD_SOURCES = {
    "M01": "初級食物原卡", "M02": "中級食物原卡", "M03": "高級食物原卡",
    "M04": "初級心情原卡", "M05": "中級心情原卡", "M06": "高級情緒進階原卡",
    "M07": "初級動物原卡", "M08": "中級動物原卡", "M09": "高級動物原卡",
    "M10": "初級顏色原卡", "M11": "中級顏色原卡",
    "M13": "初級身體原卡", "M14": "中級身體原卡", "M15": "高級身體原卡",
    "M16": "初級家庭原卡", "M17": "中級家庭原卡", "M18": "高級家庭原卡",
    "M19": "初級日常用品原卡", "M20": "中級日常用品原卡", "M21": "高級日常用品原卡",
    "M22": "玩具原卡", "M23": "交通工具原卡", "M24": "學校原卡",
    "M26": "職業原卡", "M27": "運動原卡", "M29": "自然原卡", "M31": "社會原卡",
}

with TERMS_PATH.open(encoding="utf-8") as source:
    terms = json.load(source)

maps = OrderedDict()
for term in terms:
    maps.setdefault(term["mapId"], {"level": term["level"], "topic": term["topic"], "topicId": term["topicId"], "terms": []})
    maps[term["mapId"]]["terms"].append(term)

workbook = Workbook()
word_sheet = workbook.active
word_sheet.title = "完整詞庫1260詞"
word_headers = ["詞語", "粵拼", "普通話拼音", "第幾級", "地圖編號", "地圖主題", "第幾關", "關內次序", "固定音檔狀態", "卡片素材狀態", "可用原卡"]
word_sheet.append(word_headers)
for term in terms:
    source_name = CARD_SOURCES.get(term["mapId"], "")
    word_sheet.append([
        term["term"], term["jyutping"], term["pinyin"], term["level"], term["mapId"], term["topic"],
        term["stage"], term["stageOrder"], term["audioStatus"], "已有對應原卡" if source_name else "尚未有卡圖", source_name or "—",
    ])

map_sheet = workbook.create_sheet("42張地圖與卡片")
map_headers = ["地圖編號", "第幾級", "主題", "主題代碼", "詞語數", "關卡結構", "卡片素材狀態", "可用原卡／待提供卡圖"]
map_sheet.append(map_headers)
for map_id, item in maps.items():
    source_name = CARD_SOURCES.get(map_id, "")
    map_sheet.append([
        map_id, item["level"], item["topic"], item["topicId"], len(item["terms"]), "5 關 × 6 題",
        "已有對應原卡" if source_name else "尚未有卡圖", source_name or "請提供此主題的完整卡圖",
    ])

missing_sheet = workbook.create_sheet("待提供卡圖清單")
missing_sheet.append(["地圖編號", "第幾級", "主題", "詞語數", "需要的素材"])
for map_id, item in maps.items():
    if map_id not in CARD_SOURCES:
        missing_sheet.append([map_id, item["level"], item["topic"], len(item["terms"]), f"「{item['topic']}」完整主題字卡"])

for sheet in workbook.worksheets:
    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions
    for cell in sheet[1]:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="4F7B6A")
        cell.alignment = Alignment(horizontal="center", vertical="center")
    for row in sheet.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top")
    for column in sheet.columns:
        letter = column[0].column_letter
        width = min(max(len(str(cell.value or "")) for cell in column) + 2, 28)
        sheet.column_dimensions[letter].width = max(width, 12)
    table = Table(displayName=f"{sheet.title.replace(' ', '').replace('張', 'Maps').replace('詞', 'Words')[:20]}Table", ref=sheet.dimensions)
    table.tableStyleInfo = TableStyleInfo(name="TableStyleMedium4", showRowStripes=True, showColumnStripes=False)
    sheet.add_table(table)

workbook.save(OUTPUT_DIR / "繁體認字樂_1260詞與42張卡片素材檢查表.xlsx")

with (OUTPUT_DIR / "繁體認字樂_待提供卡圖清單.csv").open("w", encoding="utf-8-sig") as output:
    output.write("地圖編號,第幾級,主題,詞語數,需要的素材\n")
    for map_id, item in maps.items():
        if map_id not in CARD_SOURCES:
            output.write(f'{map_id},{item["level"]},{item["topic"]},{len(item["terms"])},「{item["topic"]}」完整主題字卡\n')
