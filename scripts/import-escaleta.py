#!/usr/bin/env python3
"""Importa la escaleta 48H (xlsx) al programa interno y al programa público.

Uso:
    python3 scripts/import-escaleta.py "/ruta/Escaleta 48H La Supercasa V6.xlsx"

Escribe lib/program/blocks.json y lib/program/segments.json.
No requiere dependencias: lee el xlsx como zip + XML.
"""

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, time, timedelta, timezone
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
                if str(text).strip():
                    cells[colnum(ref)] = str(text).strip().replace("\n", " / ")
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


def text(value):
    return str(value).strip() if value is not None else ""


def to_clock(value):
    """Convierte una hora de Excel (fraccion) o texto HH:MM a HH:MM."""
    raw = text(value)
    if not raw:
        return ""
    match = re.match(r"^(\d{1,2}):(\d{2})", raw)
    if match:
        hour, minute = int(match.group(1)), int(match.group(2))
        return f"{hour % 24:02d}:{minute % 60:02d}"
    try:
        number = float(raw)
    except ValueError:
        return ""
    total = int(round(number * 24 * 60)) % (24 * 60)
    return f"{total // 60:02d}:{total % 60:02d}"


def to_minutes(value):
    try:
        return int(round(float(text(value))))
    except ValueError:
        return 0


def date_from(day_number, clock):
    return datetime.fromisoformat(f"{EVENT_DAY[day_number]}T{clock}:00-05:00")


def header_index(rows, required):
    for index, row in enumerate(rows):
        values = [text(cell).lower() for cell in row]
        if all(any(value == needle.lower() for value in values) for needle in required):
            return index
    return None


def columns(row):
    return {text(cell): index for index, cell in enumerate(row) if text(cell)}


def cell(row, index):
    if index is None or index >= len(row):
        return ""
    return row[index]


def parse_blocks(rows):
    header = header_index(rows, ["Bloque", "Horario"])
    if header is None:
        return []
    cols = columns(rows[header])
    blocks = []
    for row in rows[header + 1:]:
        label = text(cell(row, cols.get("Bloque")))
        if not label.lower().startswith("bloque"):
            continue
        number = re.search(r"(\d+)", label)
        if not number:
            continue
        number = number.group(1).zfill(2)
        day_label = text(cell(row, cols.get("Día")))
        schedule = text(cell(row, cols.get("Horario")))
        clocks = re.split(r"\s*[-–]\s*", schedule)
        start_clock = to_clock(clocks[0]) if clocks else ""
        end_clock = to_clock(clocks[1]) if len(clocks) > 1 else ""
        day_match = re.search(r"Día\s*(\d)", day_label)
        day_number = int(day_match.group(1)) if day_match else 1
        if not start_clock or not end_clock:
            continue
        host = text(cell(row, cols.get("Conducción")))
        host = re.sub(r"\bDeivid\b", "Vikingo", host)
        host = re.sub(r"\bDavid\b", "Vikingo", host)
        guests = text(cell(row, cols.get("Hosts")))
        starts_at = date_from(day_number, start_clock)
        ends_at = date_from(day_number, end_clock)
        if ends_at <= starts_at:
            ends_at += timedelta(days=1)
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
            "title": text(cell(row, cols.get("Nombre del bloque"))),
            "pillar": text(cell(row, cols.get("Pilar"))),
            "host": host,
            "guests": guests,
            "focus": text(cell(row, cols.get("Enfoque físico"))),
            "challenge": text(cell(row, cols.get("Reto del bloque"))),
            "channels": text(cell(row, cols.get("Canales clave"))),
            "minutes": 0,
            "segmentCount": 0,
        })
    return blocks


def parse_segments(rows, blocks):
    header = header_index(rows, ["ID", "Hora de inicio", "Bloque"])
    if header is None:
        return []
    cols = columns(rows[header])
    by_block = {block["number"]: block for block in blocks}
    seen = {}
    segments = []
    for row in rows[header + 1:]:
        code = text(cell(row, cols.get("ID")))
        if not code or code[:1].lower() not in ("s", "v"):
            continue
        block_match = re.search(r"(\d+)", text(cell(row, cols.get("Bloque"))))
        if not block_match:
            continue
        block_number = block_match.group(1).zfill(2)
        block = by_block.get(block_number)
        if not block:
            continue
        start_clock = to_clock(cell(row, cols.get("Hora de inicio")))
        end_clock = to_clock(cell(row, cols.get("Hora de finalización")))
        if not start_clock or not end_clock:
            continue

        block_start = block["startClock"]
        block_end = block["endClock"]
        after_midnight = block_end <= block_start and start_clock < block_end
        day_number = int(block["dayNumber"])
        start_date = datetime.fromisoformat(f"{EVENT_DAY[day_number]}T00:00:00-05:00")
        if after_midnight:
            start_date += timedelta(days=1)
        starts_at = datetime.fromisoformat(
            f"{start_date.date().isoformat()}T{start_clock}:00-05:00"
        )
        ends_at = datetime.fromisoformat(
            f"{start_date.date().isoformat()}T{end_clock}:00-05:00"
        )
        if ends_at <= starts_at:
            ends_at += timedelta(days=1)

        presenter = text(cell(row, cols.get("Presentador / responsable")))
        presenter = re.sub(r"\bDeivid\b", "Vikingo", presenter)
        presenter = re.sub(r"\bDavid\b", "Vikingo", presenter)
        execution = text(cell(row, cols.get("Ejecución"))).upper() or "PREGRABADO"
        duration = to_minutes(cell(row, cols.get("Duración (min)")))
        if duration <= 0:
            duration = int((ends_at - starts_at).total_seconds() / 60)

        base_id = code
        seen[base_id] = seen.get(base_id, 0) + 1
        unique_id = base_id if seen[base_id] == 1 else f"{base_id}-{seen[base_id]}"

        segments.append({
            "id": unique_id,
            "code": code,
            "day": text(cell(row, cols.get("Día"))),
            "block": block_number,
            "duration": duration,
            "name": text(cell(row, cols.get("Nombre del contenido en ejecución"))),
            "execution": execution,
            "live": execution.startswith("EN VIVO"),
            "type": text(cell(row, cols.get("Tipo de contenido"))),
            "presenter": presenter,
            "file": text(cell(row, cols.get("Archivo / pieza audiovisual"))),
            "format": text(cell(row, cols.get("Formato"))),
            "platforms": text(cell(row, cols.get("Plataforma(s)"))),
            "status": text(cell(row, cols.get("Estado de producción"))),
            "notes": text(cell(row, cols.get("Observaciones"))),
            "startsAt": starts_at.isoformat(),
            "endsAt": ends_at.isoformat(),
            "clock": start_clock,
            "startClock": start_clock,
            "endClock": end_clock,
        })

    segments.sort(key=lambda item: item["startsAt"])
    for segment in segments:
        block = by_block.get(segment["block"])
        if block:
            block["minutes"] += segment["duration"]
            block["segmentCount"] += 1
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

    target = Path("lib/program")
    target.mkdir(parents=True, exist_ok=True)
    (target / "blocks.json").write_text(
        json.dumps(clean_text(blocks), ensure_ascii=False, indent=2), encoding="utf8"
    )
    (target / "segments.json").write_text(
        json.dumps(clean_text(segments), ensure_ascii=False, indent=2), encoding="utf8"
    )

    print(f"Bloques: {len(blocks)}")
    print(f"Segmentos: {len(segments)}")
    print(f"En vivo: {sum(1 for item in segments if item['live'])}")
    for block in blocks:
        print(
            f"  {block['number']} {block['schedule']} {block['minutes']} min "
            f"({block['segmentCount']}) {block['title'][:52]}"
        )


if __name__ == "__main__":
    main()
