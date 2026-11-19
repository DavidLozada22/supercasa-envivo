#!/usr/bin/env python3
"""Importa la escaleta 48H (xlsx) al programa interno del panel.

Uso:
    python3 scripts/import-escaleta.py "/ruta/Escaleta 48H La Supercasa V2.xlsx"

Escribe lib/program/blocks.json y lib/program/segments.json.
No requiere dependencias: lee el xlsx como zip + XML.
"""

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
RELNS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
BOGOTA = timezone(timedelta(hours=-5))
EVENT_DAY = {1: "2026-11-20", 2: "2026-11-21", 3: "2026-11-22"}


def colnum(ref: str) -> int:
    letters = re.match(r"[A-Z]+", ref).group(0)
    value = 0
    for char in letters:
        value = value * 26 + (ord(char) - 64)
    return value


def read_sheets(path: Path):
    archive = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in archive.namelist():
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
        for item in root.findall(f"{{{NS}}}si"):
            shared.append("".join(text.text or "" for text in item.iter(f"{{{NS}}}t")))

    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    relmap = {rel.get("Id"): rel.get("Target") for rel in rels}

    sheets = {}
    for sheet in workbook.find(f"{{{NS}}}sheets"):
        rid = sheet.get(f"{{{RELNS}}}id")
        target = relmap[rid]
        if not target.startswith("xl/"):
            target = "xl/" + target.lstrip("/")
        root = ET.fromstring(archive.read(target))
        rows = []
        for row in root.iter(f"{{{NS}}}row"):
            cells = {}
            for cell in row.findall(f"{{{NS}}}c"):
                ref = cell.get("r")
                kind = cell.get("t")
                value = cell.find(f"{{{NS}}}v")
                inline = cell.find(f"{{{NS}}}is")
                text = ""
                if kind == "s" and value is not None:
                    text = shared[int(value.text)]
                elif kind == "inlineStr" and inline is not None:
                    text = "".join(node.text or "" for node in inline.iter(f"{{{NS}}}t"))
                elif value is not None:
                    text = value.text or ""
                if text.strip():
                    cells[colnum(ref)] = text.strip().replace("\n", " / ")
            if cells:
                width = max(cells)
                rows.append([cells.get(index, "") for index in range(1, width + 1)])
        sheets[sheet.get("name")] = rows
    return sheets


def find_sheet(sheets, needle):
    for name, rows in sheets.items():
        if needle.lower() in name.lower():
            return rows
    return []


def parse_blocks(rows):
    header = next((index for index, row in enumerate(rows) if row and row[0].strip().lower() == "bloque"), None)
    if header is None:
        return []
    blocks = []
    for row in rows[header + 1:]:
        if not row or not row[0].startswith("Bloque"):
            continue
        number = row[0].split()[-1].zfill(2)
        day_label = row[1] if len(row) > 1 else ""
        schedule = row[2] if len(row) > 2 else ""
        clock_parts = [part.strip() for part in re.split(r"\s*[-–]\s*", schedule) if part.strip()]
        start_clock = clock_parts[0][:5] if clock_parts else "00:00"
        end_clock = clock_parts[1][:5] if len(clock_parts) > 1 else "00:00"
        day_number = int(re.search(r"Día\s*(\d)", day_label).group(1)) if re.search(r"Día\s*(\d)", day_label) else 1
        start_date = EVENT_DAY[day_number]
        starts_at = datetime.fromisoformat(f"{start_date}T{start_clock}:00-05:00")
        end_day = day_number
        if end_clock <= start_clock:
            end_day += 1
        ends_at = datetime.fromisoformat(f"{EVENT_DAY.get(end_day, '2026-11-22')}T{end_clock}:00-05:00")
        blocks.append({
            "number": number,
            "label": f"Bloque {number}",
            "day": day_label,
            "dayNumber": day_number,
            "schedule": schedule,
            "startClock": start_clock,
            "endClock": end_clock,
            "startsAt": starts_at.isoformat(),
            "endsAt": ends_at.isoformat(),
            "title": row[3] if len(row) > 3 else "",
            "pillar": row[4] if len(row) > 4 else "",
            "host": row[5] if len(row) > 5 else "",
            "guests": row[6] if len(row) > 6 else "",
            "focus": row[7] if len(row) > 7 else "",
            "challenge": row[8] if len(row) > 8 else "",
            "channels": row[9] if len(row) > 9 else "",
        })
    return blocks


def parse_segments(rows, blocks):
    header = next((index for index, row in enumerate(rows) if row and row[0].strip().upper() == "ID"), None)
    if header is None:
        return []
    by_block = {block["number"]: block for block in blocks}
    segments = []
    for row in rows[header + 1:]:
        if not row or not row[0].startswith("S"):
            continue
        block_label = row[2] if len(row) > 2 else ""
        match = re.search(r"(\d+)", block_label)
        number = match.group(1).zfill(2) if match else "01"
        try:
            duration = int(float(row[5]))
        except (ValueError, IndexError):
            duration = 0
        presenter = row[9] if len(row) > 9 else ""
        presenter = re.sub(r"\bDeivid\b", "Vikingo", presenter)
        presenter = re.sub(r"\bDavid\b", "Vikingo", presenter)
        segment_name = row[6] if len(row) > 6 else ""
        if segment_name:
            segment_name = segment_name[0].upper() + segment_name[1:]
            segment_name = segment_name.replace("Incio ", "Inicio ")
        segments.append({
            "id": row[0],
            "day": row[1] if len(row) > 1 else "",
            "block": number,
            "duration": duration,
            "name": segment_name,
            "execution": row[7] if len(row) > 7 else "",
            "type": row[8] if len(row) > 8 else "",
            "presenter": presenter,
            "file": row[10] if len(row) > 10 else "",
            "format": row[11] if len(row) > 11 else "",
            "platforms": row[12] if len(row) > 12 else "",
            "status": row[15] if len(row) > 15 else "",
            "notes": row[16] if len(row) > 16 else "",
        })

    cursor = {}
    for segment in segments:
        block = by_block.get(segment["block"])
        if not block:
            continue
        if segment["block"] not in cursor:
            cursor[segment["block"]] = datetime.fromisoformat(block["startsAt"])
        starts = cursor[segment["block"]]
        ends = starts + timedelta(minutes=segment["duration"])
        segment["startsAt"] = starts.isoformat()
        segment["endsAt"] = ends.isoformat()
        segment["clock"] = starts.strftime("%H:%M")
        cursor[segment["block"]] = ends
    return segments



def clean_text(value):
    """Normaliza guiones largos y medios para que el panel no muestre em dashes."""
    if isinstance(value, str):
        return value.replace("\u2014", "\u00b7").replace("\u2013", "-")
    if isinstance(value, list):
        return [clean_text(item) for item in value]
    if isinstance(value, dict):
        return {key: clean_text(item) for key, item in value.items()}
    return value


def main():
    if len(sys.argv) < 2:
        print("Falta la ruta del xlsx.")
        sys.exit(1)
    source = Path(sys.argv[1]).expanduser()
    sheets = read_sheets(source)
    blocks = parse_blocks(find_sheet(sheets, "BLOQUES"))
    segments = parse_segments(find_sheet(sheets, "ESCALETA"), blocks)

    for block in blocks:
        block_segments = [item for item in segments if item["block"] == block["number"]]
        block["minutes"] = sum(item["duration"] for item in block_segments)
        block["segmentCount"] = len(block_segments)

    target = Path("lib/program")
    target.mkdir(parents=True, exist_ok=True)
    (target / "blocks.json").write_text(json.dumps(clean_text(blocks), ensure_ascii=False, indent=2), encoding="utf8")
    (target / "segments.json").write_text(json.dumps(clean_text(segments), ensure_ascii=False, indent=2), encoding="utf8")

    print(f"Bloques: {len(blocks)}")
    print(f"Segmentos: {len(segments)}")
    for block in blocks:
        print(f"  {block['number']} {block['schedule']} {block['minutes']} min ({block['segmentCount']}) {block['title'][:50]}")


if __name__ == "__main__":
    main()
