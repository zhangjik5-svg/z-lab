import http.client
import json
import tempfile
import threading
import unittest
from pathlib import Path

import auth_api


class AuthApiTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        auth_api.DB_PATH = str(Path(self.temp.name) / "auth.db")
        auth_api.RATE_BUCKETS.clear()
        auth_api.initialize()
        self.server = auth_api.ThreadingHTTPServer(("127.0.0.1", 0), auth_api.ApiHandler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.cookie = ""

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.temp.cleanup()

    def request(self, method, path, body=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=5)
        headers = {"Accept": "application/json", "Origin": "http://127.0.0.1:4173"}
        encoded = None
        if body is not None:
            encoded = json.dumps(body).encode()
            headers["Content-Type"] = "application/json"
        if self.cookie:
            headers["Cookie"] = self.cookie
        connection.request(method, path, encoded, headers)
        response = connection.getresponse()
        payload = json.loads(response.read())
        cookie = response.getheader("Set-Cookie")
        if cookie:
            self.cookie = cookie.split(";", 1)[0]
        connection.close()
        return response.status, payload

    def test_register_login_and_tracker_round_trip(self):
        status, registered = self.request("POST", "/api/auth/register", {"email": "friend@qq.com", "password": "correct-horse-123"})
        self.assertEqual(status, 200)
        self.assertTrue(registered["authenticated"])

        status, account = self.request("GET", "/api/account")
        self.assertEqual(status, 200)
        self.assertEqual(account["user"]["email"], "friend@qq.com")

        entries = [{"id": "job-1", "title": "产品经理", "status": "applied", "notes": "已投递"}]
        status, saved = self.request("PUT", "/api/tracker", {"revision": 0, "entries": entries, "blockedCompanies": ["示例科技有限公司"]})
        self.assertEqual(status, 200)
        self.assertEqual(saved["revision"], 1)

        status, tracker = self.request("GET", "/api/tracker")
        self.assertEqual(status, 200)
        self.assertEqual(tracker["entries"][0]["status"], "applied")
        self.assertEqual(tracker["blockedCompanies"], ["示例科技有限公司"])

        status, conflict = self.request("PUT", "/api/tracker", {"revision": 0, "entries": []})
        self.assertEqual(status, 409)
        self.assertEqual(conflict["revision"], 1)

        status, _ = self.request("POST", "/api/auth/logout")
        self.assertEqual(status, 200)
        self.cookie = ""
        status, account = self.request("GET", "/api/account")
        self.assertEqual(status, 200)
        self.assertFalse(account["authenticated"])


if __name__ == "__main__":
    unittest.main()
