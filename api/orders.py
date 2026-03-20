from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime, timezone
from shared import get_db, json_headers, gen_id, COUPONS

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        db = get_db()
        orders = list(db.orders.find({}, {"_id": 0}))
        self._respond(200, orders)

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        items = body.get("items", [])
        if not items:
            self._respond(400, {"detail": "Coșul este gol."})
            return

        total = sum(i["price"] * i["quantity"] for i in items)

        coupon_code = body.get("coupon_code")
        if coupon_code:
            code = coupon_code.strip().upper()
            if code in COUPONS:
                total = total * (1 - COUPONS[code]["discount_percent"] / 100)

        if total < 25:
            self._respond(400, {"detail": "Valoarea minimă a comenzii este 25 RON."})
            return

        delivery_method = body.get("delivery_method", "livrare")
        address = body.get("address")
        if delivery_method == "livrare":
            if not address or not address.get("strada") or not address.get("oras"):
                self._respond(400, {"detail": "Adresa este obligatorie pentru livrare."})
                return

        db = get_db()
        order = {
            "id": gen_id(),
            "items": items,
            "delivery_method": delivery_method,
            "address": address,
            "coupon_code": coupon_code,
            "phone": body.get("phone", ""),
            "notes": body.get("notes", ""),
            "total": round(total, 2),
            "status": "nou",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        db.orders.insert_one({**order, "_id": order["id"]})
        self._respond(200, order)

    def _respond(self, status, data):
        self.send_response(status)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
