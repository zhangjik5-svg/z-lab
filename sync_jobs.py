#!/usr/bin/env python3
"""Synchronize the public Tencent and Feishu recruitment tables into one feed."""

from __future__ import annotations

import json
import hashlib
import gzip
import os
import sys
import tempfile
import urllib.request
from pathlib import Path


SOURCE_URL = "https://yundou.cc.cd/notes/jobs.json"
TENCENT_URL = "https://docs.qq.com/sheet/DS0JPSmtaZk5SUHdw?tab=0vnh5f"
FEISHU_URL = "https://yal2at57cvq.feishu.cn/base/GtSLbyyR3aCENOsJYC6cdlsVnih?table=tbllTNyaMiYmRlv4&view=vewff65AIW"
PALETTE = ["#514778", "#315f7b", "#b77744", "#8a536d", "#3d6e71", "#697a40", "#47707b", "#685b75"]
JOB_FIELDS = [
    "id",
    "title",
    "company",
    "companyType",
    "city",
    "batch",
    "audience",
    "industry",
    "updated",
    "deadline",
    "tags",
    "desc",
    "applicationUrl",
    "sourceId",
    "sourceName",
    "color",
]


def clean(value: object) -> str:
    return str(value or "").strip()


def split_categories(value: object) -> list[str]:
    text = clean(value)
    for separator in ("，", ",", "/", "、"):
        text = text.replace(separator, "、")
    return [item.strip() for item in text.split("、") if item.strip()]


def stable_color(value: str) -> str:
    return PALETTE[sum(value.encode("utf-8")) % len(PALETTE)]


def normalize_company_type(value: object) -> str:
    text = clean(value).replace(" ", "")
    if any(token in text for token in ("央国企", "央企", "国企", "国有")):
        return "央企 / 国企"
    if any(token in text for token in ("民企", "民营", "私企")):
        return "民企 / 私企"
    if any(token in text for token in ("外企", "外资", "合资", "港澳台资")):
        return "外企 / 合资"
    if "事业单位" in text:
        return "事业单位"
    if any(token in text for token in ("银行", "金融机构")):
        return "银行 / 金融机构"
    if any(token in text for token in ("社会组织", "公益组织", "社会团体")):
        return "社会组织"
    return "其他企业"


def position_title(value: object) -> str:
    positions = split_categories(value)
    if not positions:
        return "招聘岗位以官方页面为准"
    first = positions[0]
    if len(first) > 28:
        first = f"{first[:27]}…"
    return f"{first}等岗位" if len(positions) > 1 else first


def map_job(row: dict[str, object]) -> dict[str, object]:
    company = clean(row.get("company")) or "公司名称待补充"
    industry = clean(row.get("industry"))
    company_type = normalize_company_type(row.get("companyType"))
    batch = clean(row.get("batch"))
    audience = clean(row.get("audience"))
    location = clean(row.get("location"))
    updated = clean(row.get("updated"))
    position = clean(row.get("position")) or "招聘岗位以官方页面为准"
    source_id = clean(row.get("sourceId")) or "unknown"
    source_name = clean(row.get("sourceName")) or ("腾讯表格" if source_id == "tencent" else "飞书表格")
    identity = "|".join(
        [source_id, clean(row.get("sourceRecordId")), clean(row.get("row")), company, position, batch]
    )
    stable_id = hashlib.sha1(identity.encode("utf-8")).hexdigest()[:16]
    tags = []
    for item in [batch, company_type, *split_categories(industry)]:
        if item and item not in tags:
            tags.append(item)
    return {
        "id": f"{source_id}-{stable_id}",
        "title": position_title(position),
        "company": company,
        "companyType": company_type,
        "city": location,
        "batch": batch,
        "audience": audience,
        "industry": industry,
        "updated": updated,
        "deadline": clean(row.get("deadline")),
        "tags": tags[:6],
        "desc": position,
        "applicationUrl": clean(row.get("applicationUrl")),
        "sourceId": source_id,
        "sourceName": source_name,
        "color": stable_color(company),
    }


def dedupe_key(row: dict[str, object]) -> str:
    application_url = clean(row.get("applicationUrl")).lower().rstrip("/")
    company = clean(row.get("company")).lower()
    position = clean(row.get("position")).lower()
    batch = clean(row.get("batch")).lower()
    if application_url:
        return f"url:{application_url}|{company}|{position}|{batch}"
    parts = [company, position, batch, clean(row.get("audience")).lower()]
    return "row:" + "|".join(parts)


def synchronize(output_path: Path) -> int:
    request = urllib.request.Request(
        SOURCE_URL,
        headers={"User-Agent": "ZhidaCareerStudio/1.0 (+https://zhangjik.bbroot.com/)"},
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        upstream = json.load(response)

    source_rows = [row for row in upstream.get("jobs", []) if row.get("sourceId") in {"tencent", "feishu"}]
    source_counts = {
        "tencent": sum(row.get("sourceId") == "tencent" for row in source_rows),
        "feishu": sum(row.get("sourceId") == "feishu" for row in source_rows),
    }
    if not all(source_counts.values()):
        raise RuntimeError("One or more recruitment sources returned no rows; keeping the previous feed")

    deduplicated: list[dict[str, object]] = []
    seen: set[str] = set()
    for row in source_rows:
        key = dedupe_key(row)
        if key in seen:
            continue
        seen.add(key)
        deduplicated.append(row)

    mapped_jobs = [map_job(row) for row in deduplicated]
    payload = {
        "schemaVersion": 2,
        "fields": JOB_FIELDS,
        "generatedAt": upstream.get("generatedAt"),
        "syncedBy": "职达岗位同步",
        "source": "腾讯表格 + 飞书表格",
        "sourceUrls": {"tencent": TENCENT_URL, "feishu": FEISHU_URL},
        "sourceCounts": source_counts,
        "rawCount": len(source_rows),
        "count": len(deduplicated),
        "updateIntervalHours": 2,
        # Array rows avoid repeating 16 field names thousands of times. The browser
        # expands them after download and reconstructs the derived requirements.
        "jobs": [[job.get(field, "") for field in JOB_FIELDS] for job in mapped_jobs],
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=output_path.parent, delete=False) as temp:
        json.dump(payload, temp, ensure_ascii=False, separators=(",", ":"))
        temp.write("\n")
        temporary_path = Path(temp.name)
    os.chmod(temporary_path, 0o644)
    temporary_path.replace(output_path)

    gzip_path = output_path.with_suffix(f"{output_path.suffix}.gz")
    with tempfile.NamedTemporaryFile("wb", dir=output_path.parent, delete=False) as compressed_temp:
        with gzip.GzipFile(fileobj=compressed_temp, mode="wb", compresslevel=6) as compressed:
            compressed.write(output_path.read_bytes())
        compressed_path = Path(compressed_temp.name)
    os.chmod(compressed_path, 0o644)
    compressed_path.replace(gzip_path)
    return len(deduplicated)


if __name__ == "__main__":
    destination = Path(sys.argv[1] if len(sys.argv) > 1 else "/var/www/html/jobs-data.json")
    count = synchronize(destination)
    print(f"Synchronized {count} deduplicated Tencent + Feishu recruitment records")
