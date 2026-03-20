from http.server import BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs
import re
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
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)

        # /api/menu/popular
        if '/popular' in parsed.path:
            items = list(db.menu_items.find({"is_popular": True}, {"_id": 0}))
            self._respond(200, items)
            return

        # /api/menu/categories
        if '/categories' in parsed.path:
            categories = db.menu_items.distinct("category")
            category_map = {
                "mic_dejun": "Mic Dejun",
                "ciorbe_supe": "Ciorbe & Supe",
                "paste": "Paste",
                "preparate_baza": "Preparate de Bază",
                "garnituri": "Garnituri",
                "salate": "Salate",
                "desert": "Desert"
            }
            result = [{"id": c, "label": category_map.get(c, c)} for c in categories]
            self._respond(200, result)
            return

        # /api/menu
        query = {}
        if 'category' in qs:
            query["category"] = qs["category"][0]
        if 'search' in qs:
            query["name"] = {"$regex": qs["search"][0], "$options": "i"}
        items = list(db.menu_items.find(query, {"_id": 0}))
        self._respond(200, items)

    def _respond(self, status, data):
        self.send_response(status)
        for k, v in json_headers().items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
