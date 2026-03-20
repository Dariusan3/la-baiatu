from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime, timezone
from shared import get_db, json_headers, gen_id

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        db = get_db()
        reservations = list(db.reservations.find({}, {"_id": 0}))
        self._respond(200, reservations)

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        required = ["name", "email", "phone", "date", "time", "guests"]
        for field in required:
            if field not in body:
                self._respond(400, {"detail": f"Câmpul '{field}' este obligatoriu."})
                return

        db = get_db()
        reservation = {
            "id": gen_id(),
            "name": body["name"],
            "email": body["email"],
            "phone": body["phone"],
            "date": body["date"],
            "time": body["time"],
            "guests": body["guests"],
            "notes": body.get("notes", ""),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        db.reservations.insert_one({**reservation, "_id": reservation["id"]})
        self._respond(200, reservation)

    def _respond(self, status, data):
        self.send_response(status)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
