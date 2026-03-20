from http.server import BaseHTTPRequestHandler
import json
from shared import get_db, json_headers, seed_if_needed

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        seed_if_needed()
        db = get_db()
        reviews = list(db.reviews.find({}, {"_id": 0}))
        self.send_response(200)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(reviews, ensure_ascii=False).encode('utf-8'))
