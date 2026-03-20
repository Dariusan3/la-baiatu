from http.server import BaseHTTPRequestHandler
import json
from _shared import json_headers, COUPONS

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        code = body.get("code", "").strip().upper()
        if code in COUPONS:
            result = {"valid": True, **COUPONS[code]}
        else:
            result = {"valid": False, "message": "Codul cuponului nu este valid."}

        self.send_response(200)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
