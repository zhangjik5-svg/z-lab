#!/usr/bin/env python3
"""Small same-origin search API for the Z Lab recruitment snapshot."""

from __future__ import annotations

import json
import os
import re
import threading
import unicodedata
from collections import Counter
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


DATA_PATH = Path(os.environ.get("ZLAB_JOBS_DATA", "/var/www/html/jobs-data.json"))
HOST = os.environ.get("ZLAB_JOBS_HOST", "127.0.0.1")
PORT = int(os.environ.get("ZLAB_JOBS_PORT", "8767"))
MAX_LIMIT = 240
SEARCH_VOCABULARY = sorted(
    {
        "供应链", "智能硬件", "硬件", "工程师", "产品经理", "产品运营", "用户增长", "商业化",
        "数据产品", "平台产品", "策略产品", "ai", "saas", "b端", "c端", "增长", "运营", "数据",
        "项目管理", "用户研究", "研发", "技术", "算法", "芯片", "软件", "市场", "设计", "职能",
        "实习", "秋招", "春招", "校招", "本科", "硕士", "博士", "上海", "北京", "深圳", "杭州", "广州", "成都",
    },
    key=len,
    reverse=True,
)
PROVINCE_CITIES = {
    "北京": ["北京"], "天津": ["天津"], "上海": ["上海"], "重庆": ["重庆"],
    "河北": ["石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊", "衡水", "雄安"],
    "山西": ["太原", "大同", "阳泉", "长治", "晋城", "朔州", "晋中", "运城", "忻州", "临汾", "吕梁"],
    "内蒙古": ["呼和浩特", "包头", "乌海", "赤峰", "通辽", "鄂尔多斯", "呼伦贝尔", "巴彦淖尔", "乌兰察布"],
    "辽宁": ["沈阳", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "盘锦", "铁岭", "朝阳", "葫芦岛"],
    "吉林": ["长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边"],
    "黑龙江": ["哈尔滨", "齐齐哈尔", "鸡西", "鹤岗", "双鸭山", "大庆", "伊春", "佳木斯", "七台河", "牡丹江", "黑河", "绥化"],
    "江苏": ["南京", "无锡", "徐州", "常州", "苏州", "南通", "连云港", "淮安", "盐城", "扬州", "镇江", "泰州", "宿迁", "昆山"],
    "浙江": ["杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水", "义乌"],
    "安徽": ["合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州", "阜阳", "宿州", "六安", "亳州", "池州", "宣城"],
    "福建": ["福州", "厦门", "莆田", "三明", "泉州", "漳州", "南平", "龙岩", "宁德"],
    "江西": ["南昌", "景德镇", "萍乡", "九江", "新余", "鹰潭", "赣州", "吉安", "宜春", "抚州", "上饶"],
    "山东": ["济南", "青岛", "淄博", "枣庄", "东营", "烟台", "潍坊", "济宁", "泰安", "威海", "日照", "临沂", "德州", "聊城", "滨州", "菏泽"],
    "河南": ["郑州", "开封", "洛阳", "平顶山", "安阳", "鹤壁", "新乡", "焦作", "濮阳", "许昌", "漯河", "三门峡", "南阳", "商丘", "信阳", "周口", "驻马店", "济源"],
    "湖北": ["武汉", "黄石", "十堰", "宜昌", "襄阳", "鄂州", "荆门", "孝感", "荆州", "黄冈", "咸宁", "随州", "恩施", "仙桃", "潜江", "天门"],
    "湖南": ["长沙", "株洲", "湘潭", "衡阳", "邵阳", "岳阳", "常德", "张家界", "益阳", "郴州", "永州", "怀化", "娄底", "湘西"],
    "广东": ["广州", "韶关", "深圳", "珠海", "汕头", "佛山", "江门", "湛江", "茂名", "肇庆", "惠州", "梅州", "汕尾", "河源", "阳江", "清远", "东莞", "中山", "潮州", "揭阳", "云浮"],
    "广西": ["南宁", "柳州", "桂林", "梧州", "北海", "防城港", "钦州", "贵港", "玉林", "百色", "贺州", "河池", "来宾", "崇左"],
    "海南": ["海口", "三亚", "三沙", "儋州", "琼海", "文昌", "万宁", "五指山", "东方", "澄迈"],
    "四川": ["成都", "自贡", "攀枝花", "泸州", "德阳", "绵阳", "广元", "遂宁", "内江", "乐山", "南充", "眉山", "宜宾", "广安", "达州", "雅安", "巴中", "资阳", "阿坝", "甘孜", "凉山"],
    "贵州": ["贵阳", "六盘水", "遵义", "安顺", "毕节", "铜仁", "黔西南", "黔东南", "黔南"],
    "云南": ["昆明", "曲靖", "玉溪", "保山", "昭通", "丽江", "普洱", "临沧", "楚雄", "红河", "文山", "西双版纳", "大理", "德宏", "怒江", "迪庆"],
    "西藏": ["拉萨", "日喀则", "昌都", "林芝", "山南", "那曲", "阿里"],
    "陕西": ["西安", "铜川", "宝鸡", "咸阳", "渭南", "延安", "汉中", "榆林", "安康", "商洛"],
    "甘肃": ["兰州", "嘉峪关", "金昌", "白银", "天水", "武威", "张掖", "平凉", "酒泉", "庆阳", "定西", "陇南", "临夏", "甘南"],
    "青海": ["西宁", "海东", "海北", "黄南", "海南州", "果洛", "玉树", "海西"],
    "宁夏": ["银川", "石嘴山", "吴忠", "固原", "中卫"],
    "新疆": ["乌鲁木齐", "克拉玛依", "吐鲁番", "哈密", "昌吉", "博尔塔拉", "巴音郭楞", "阿克苏", "克孜勒苏", "喀什", "和田", "伊犁", "塔城", "阿勒泰", "石河子"],
    "香港": ["香港"], "澳门": ["澳门"], "台湾": ["台北", "新北", "桃园", "台中", "台南", "高雄", "台湾"],
}
COMPANY_TYPE_ORDER = ["央企 / 国企", "民企 / 私企", "外企 / 合资", "事业单位", "银行 / 金融机构", "社会组织", "其他企业"]


def normalized_text(value: object) -> str:
    return unicodedata.normalize("NFKC", str(value or "")).lower()


def search_terms(value: str) -> list[str]:
    normalized = re.sub(r"[^\w+#.]+", " ", normalized_text(value)).strip()
    if not normalized:
        return []
    compact = normalized.replace(" ", "")
    discovered = [term for term in SEARCH_VOCABULARY if term in compact]
    specific = [term for term in discovered if not any(other != term and term in other for other in discovered)]
    words = [part for part in normalized.split() if len(part) >= 2]
    return list(dict.fromkeys([*specific, *words]))


def regions(location: object) -> tuple[list[str], list[str], bool]:
    text = re.sub(r"\s+", "", str(location or ""))
    nationwide = bool(re.search(r"全国|多地|地点不限|不限地点|远程", text))
    provinces: list[str] = []
    cities: list[str] = []
    for province, candidates in PROVINCE_CITIES.items():
        matches = [city for city in candidates if city in text]
        if province in text or matches:
            provinces.append(province)
            cities.extend(city for city in matches if city not in cities)
    return provinces, cities, nationwide


def updated_value(value: object) -> int:
    match = re.search(r"(20\d{2})[./-](\d{1,2})[./-](\d{1,2})", str(value or ""))
    return int("".join((match.group(1), match.group(2).zfill(2), match.group(3).zfill(2)))) if match else 0


class JobIndex:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.lock = threading.Lock()
        self.mtime_ns = -1
        self.payload: dict[str, object] = {}
        self.jobs: list[dict[str, object]] = []
        self.meta: dict[str, object] = {}

    def ensure_loaded(self) -> None:
        mtime_ns = self.path.stat().st_mtime_ns
        if mtime_ns == self.mtime_ns:
            return
        with self.lock:
            mtime_ns = self.path.stat().st_mtime_ns
            if mtime_ns == self.mtime_ns:
                return
            with self.path.open(encoding="utf-8") as source:
                payload = json.load(source)
            fields = payload.get("fields") or []
            jobs: list[dict[str, object]] = []
            province_counts: Counter[str] = Counter()
            city_counts: Counter[str] = Counter()
            type_counts: Counter[str] = Counter()
            for raw in payload.get("jobs", []):
                job = dict(zip(fields, raw)) if isinstance(raw, list) else dict(raw)
                provinces, cities, nationwide = regions(job.get("city"))
                job["_provinces"] = provinces
                job["_cities"] = cities
                job["_nationwide"] = nationwide
                job["_search"] = normalized_text(" ".join(str(job.get(key) or "") for key in ("title", "company", "tags", "desc", "industry", "batch", "audience", "city")))
                job["_compact"] = re.sub(r"\s+", "", job["_search"])
                for province in set(provinces + (["全国 / 多地"] if nationwide else [])):
                    province_counts[province] += 1
                for city in set(cities):
                    city_counts[city] += 1
                type_counts[str(job.get("companyType") or "其他企业")] += 1
                jobs.append(job)
            province_order = [*PROVINCE_CITIES, "全国 / 多地"]
            self.payload = payload
            self.jobs = jobs
            self.meta = {
                "provinces": [[name, province_counts[name]] for name in province_order if province_counts[name]],
                "cities": sorted(city_counts.items(), key=lambda item: (-item[1], item[0])),
                "companyTypes": [[name, type_counts[name]] for name in COMPANY_TYPE_ORDER if type_counts[name]],
            }
            self.mtime_ns = mtime_ns

    def search(self, query: dict[str, list[str]]) -> dict[str, object]:
        self.ensure_loaded()
        keyword = (query.get("keyword") or [""])[0][:120]
        province = (query.get("province") or ["all"])[0]
        city = (query.get("city") or ["all"])[0]
        company_type = (query.get("companyType") or ["all"])[0]
        batch = (query.get("batch") or ["all"])[0]
        audience = (query.get("audience") or ["all"])[0]
        sort = (query.get("sort") or ["match"])[0]
        limit = min(MAX_LIMIT, max(1, int((query.get("limit") or ["60"])[0])))
        compact_keyword = re.sub(r"\s+", "", normalized_text(keyword))
        terms = search_terms(keyword)
        matched: list[tuple[dict[str, object], int]] = []
        city_counts: Counter[str] = Counter()
        for job in self.jobs:
            title = normalized_text(job.get("title"))
            tags = normalized_text(" ".join(map(str, job.get("tags") or [])))
            score = sum(7 if term in title else 5 if term in tags else 2 if term in job["_search"] else 0 for term in terms)
            keyword_match = not compact_keyword or compact_keyword in job["_compact"] or score > 0
            province_match = province == "all" or (province == "全国 / 多地" and job["_nationwide"]) or province in job["_provinces"]
            if not (keyword_match and province_match):
                continue
            for item in set(job["_cities"]):
                city_counts[item] += 1
            if city != "all" and city not in job["_cities"]:
                continue
            if company_type != "all" and company_type != job.get("companyType"):
                continue
            if batch != "all" and batch not in str(job.get("batch") or ""):
                continue
            if audience != "all" and audience not in str(job.get("audience") or ""):
                continue
            matched.append((job, score))
        if sort == "updated":
            matched.sort(key=lambda item: updated_value(item[0].get("updated")), reverse=True)
        elif sort == "company":
            matched.sort(key=lambda item: str(item[0].get("company") or ""))
        else:
            matched.sort(key=lambda item: (item[1], updated_value(item[0].get("updated"))), reverse=True)
        fields = self.payload.get("fields") or []
        rows = [[job.get(field, "") for field in fields] for job, _score in matched[:limit]]
        return {
            "schemaVersion": 2,
            "fields": fields,
            "generatedAt": self.payload.get("generatedAt"),
            "source": self.payload.get("source", "腾讯表格 + 飞书表格"),
            "total": len(matched),
            "limit": limit,
            "jobs": rows,
            "meta": {
                "provinces": self.meta["provinces"],
                "cities": sorted(city_counts.items(), key=lambda item: (-item[1], item[0])),
                "companyTypes": self.meta["companyTypes"],
            },
        }


INDEX = JobIndex(DATA_PATH)


class Handler(BaseHTTPRequestHandler):
    server_version = "ZLabJobs/1.0"

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path != "/api/jobs":
            self.send_error(404)
            return
        try:
            payload = INDEX.search(parse_qs(parsed.query))
            body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        except (OSError, ValueError, json.JSONDecodeError) as error:
            body = json.dumps({"error": "岗位服务暂时不可用"}, ensure_ascii=False).encode("utf-8")
            self.send_response(503)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            print(f"job api error: {error}")
            return
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "public, max-age=120, stale-while-revalidate=7200")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    INDEX.ensure_loaded()
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
