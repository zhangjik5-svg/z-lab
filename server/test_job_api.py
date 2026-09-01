import json
import tempfile
import unittest
from pathlib import Path

from job_api import JobIndex


FIELDS = [
    "id", "title", "company", "companyType", "city", "batch", "audience",
    "industry", "updated", "deadline", "tags", "desc", "applicationUrl",
    "sourceId", "sourceName", "color",
]


class JobApiTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "jobs.json"
        jobs = [
            {"id": "old-job", "title": "旧岗位", "company": "旧公司", "companyType": "民企 / 私企", "city": "上海", "updated": "2026.08.20", "tags": []},
            {"id": "new-job", "title": "综合岗位", "company": "新公司", "companyType": "央企 / 国企", "city": "北京", "updated": "2026.08.29", "tags": [], "desc": "协助产品经理推进项目"},
            {"id": "best-job", "title": "高级产品经理", "company": "新公司有限公司", "companyType": "央企 / 国企", "city": "北京", "updated": "2026.08.28", "tags": ["产品经理"]},
            {"id": "bundle-job", "title": "算法工程师等岗位", "company": "聚合公司", "companyType": "民企 / 私企", "city": "深圳", "updated": "2026.08.30", "tags": [], "desc": "算法工程师、软件产品经理、硬件产品经理"},
        ]
        self.path.write_text(json.dumps({"fields": FIELDS, "jobs": jobs, "generatedAt": "2026-08-29T00:00:00Z"}), encoding="utf-8")
        self.index = JobIndex(self.path)

    def tearDown(self):
        self.temp.cleanup()

    def ids(self, result):
        id_index = result["fields"].index("id")
        return [row[id_index] for row in result["jobs"]]

    def test_default_sort_is_latest_first(self):
        self.assertEqual(self.ids(self.index.search({})), ["bundle-job", "new-job", "old-job"])

    def test_excluded_tracker_job_is_not_returned_or_counted(self):
        result = self.index.search({"exclude": ["new-job"]})
        self.assertEqual(self.ids(result), ["bundle-job", "best-job", "old-job"])
        self.assertEqual(result["total"], 3)

    def test_each_company_returns_only_the_best_keyword_match(self):
        result = self.index.search({"keyword": ["产品经理"], "sort": ["match"]})
        self.assertEqual(self.ids(result), ["best-job", "bundle-job"])
        self.assertEqual(result["total"], 2)

    def test_excluded_company_hides_all_of_its_jobs(self):
        result = self.index.search({"excludeCompany": ["新公司"]})
        self.assertEqual(self.ids(result), ["bundle-job", "old-job"])
        self.assertEqual(result["total"], 2)

    def test_keyword_relevance_precedes_date_for_latest_sort(self):
        result = self.index.search({"keyword": ["产品经理"], "sort": ["updated"]})
        self.assertEqual(self.ids(result), ["best-job", "bundle-job"])

    def test_aggregated_posting_uses_the_matched_role_as_display_title(self):
        result = self.index.search({"keyword": ["产品经理"], "sort": ["match"]})
        id_index = result["fields"].index("id")
        title_index = result["fields"].index("title")
        bundle_row = next(row for row in result["jobs"] if row[id_index] == "bundle-job")
        self.assertEqual(bundle_row[title_index], "软件产品经理等岗位")

    def test_response_exposes_job_library_and_pre_dedupe_counts(self):
        result = self.index.search({"keyword": ["产品经理"]})
        self.assertEqual(result["meta"]["totalJobs"], 4)
        self.assertEqual(result["matchedJobs"], 3)

    def test_compound_keyword_does_not_expand_to_one_generic_term(self):
        result = self.index.search({"keyword": ["嵌入式软件"]})
        self.assertEqual(result["jobs"], [])


if __name__ == "__main__":
    unittest.main()
