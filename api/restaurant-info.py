from http.server import BaseHTTPRequestHandler
import json
from shared import RESTAURANT_INFO, json_headers

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(RESTAURANT_INFO, ensure_ascii=False).encode('utf-8'))
