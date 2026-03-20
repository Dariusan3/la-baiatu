import os
import uuid
from datetime import datetime, timezone
from pymongo import MongoClient

MONGO_URL = os.environ.get('MONGO_URL', '')
DB_NAME = os.environ.get('DB_NAME', 'la_baiatu')

_client = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        _client = MongoClient(MONGO_URL)
        _db = _client[DB_NAME]
    return _db

def json_headers():
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

def cors_response():
    """Handle OPTIONS preflight"""
    return {
        'statusCode': 204,
        'headers': json_headers(),
        'body': ''
    }

RESTAURANT_INFO = {
    "name": "La Băiatu'",
    "tagline": "Gustul de acasă - Tradiție Românească",
    "description": "Un restaurant de familie care vă oferă o experiență culinară autentică cu un meniu fantastic și o abordare prietenoasă. Restaurantul este deținut de o familie de 2 generații. Meniul este mic, dar pur și simplu fantastic, este o bază din bucătăria vestică românească. Dacă doriți ceva autentic, vă recomandăm cu adevărat să ne vizitați.",
    "address": "Aleea Anemonelor 21, 330055 Deva, România",
    "phone": "0750 868 367",
    "email": "contact@la-baiatu.ro",
    "opening_hours": {
        "Luni - Sâmbătă": "10:00 - 23:30",
        "Duminică": "13:00 - 23:30"
    },
    "rating": 4.1,
    "total_reviews": 964
}

COUPONS = {
    "LABAIATU10": {"discount_percent": 10, "description": "10% reducere"},
    "BAIATU20": {"discount_percent": 20, "description": "20% reducere"},
}

MENU_ITEMS = [
    {"name": "Ochiuri de ouă", "ingredients": "Ouă 100g, sare, ulei", "price": 10.00, "weight": "100g", "category": "mic_dejun", "description": "Ouă ochiuri preparate tradițional"},
    {"name": "Ou poșat", "ingredients": "Ouă 50g, sare", "price": 5.00, "weight": "50g", "category": "mic_dejun", "description": "Ou poșat simplu"},
    {"name": "Omletă simplă", "ingredients": "Ouă 100g, lapte 20ml, ulei, sare", "price": 12.00, "weight": "120g", "category": "mic_dejun", "description": "Omletă clasică și pufoasă"},
    {"name": "Omletă cu salam picant și cașcaval", "ingredients": "Ouă 100g, cașcaval 20g, salam porc, unt, sare", "price": 15.00, "weight": "150g", "category": "mic_dejun", "description": "Omletă pufoasă cu salam picant și cașcaval topit"},
    {"name": "Omletă cu șuncă și cașcaval", "ingredients": "Ouă, cașcaval, șuncă pui, unt, sare", "price": 15.00, "weight": "150g", "category": "mic_dejun", "description": "Omletă cu șuncă de pui și cașcaval"},
    {"name": "Cremvuști", "ingredients": "Carne de pui 200g", "price": 10.00, "weight": "pereche", "category": "mic_dejun", "description": "Cremvuști de pui proaspeți"},
    {"name": "Virșli", "ingredients": "Carne 180g (porc, oaie, vită)", "price": 10.00, "weight": "pereche", "category": "mic_dejun", "description": "Virșli tradiționali din carne selectată"},
    {"name": "Unt", "ingredients": "Unt", "price": 5.00, "weight": "10g", "category": "mic_dejun", "description": "Unt proaspăt"},
    {"name": "Dulceață", "ingredients": "Dulceață", "price": 5.00, "weight": "20g", "category": "mic_dejun", "description": "Dulceață de casă"},
    {"name": "Lapte", "ingredients": "Lapte", "price": 5.00, "weight": "200ml", "category": "mic_dejun", "description": "Lapte proaspăt"},
    {"name": "Coaste de porc cu cartofi copți", "ingredients": "Coaste de porc 300g, cartofi 250g, sos BBQ, ardei iute, ulei, sare, piper", "price": 45.00, "weight": "600g", "category": "preparate_baza", "description": "Coaste de porc glazurate cu sos BBQ", "is_popular": True},
    {"name": "Gordon bleo cu cartofi prăjiți", "ingredients": "Carne de porc 100g, cartofi 150g, șuncă pui, mozzarella, ou, făină de grâu, pesmet, ulei, sare, piper", "price": 45.00, "weight": "350g", "category": "preparate_baza", "description": "Gordon bleo umplut cu șuncă și mozzarella"},
    {"name": "Șnițel de porc cu cartofi prăjiți", "ingredients": "Carne de porc 150g, cartofi 150g, ou, făină de grâu, pesmet, ulei, sare, piper", "price": 30.00, "weight": "300g", "category": "preparate_baza", "description": "Șnițel crocant de porc cu cartofi prăjiți", "is_popular": True},
    {"name": "Friptură de porc", "ingredients": "Carne de porc 200g, ulei, sare, piper", "price": 30.00, "weight": "200g", "category": "preparate_baza", "description": "Friptură de porc la grătar"},
    {"name": "Șnițel de pui cu cartofi prăjiți", "ingredients": "Carne de pui 150g, cartofi 150g, ou, făină de grâu, pesmet, ulei, sare, piper", "price": 35.00, "weight": "300g", "category": "preparate_baza", "description": "Șnițel auriu de pui cu cartofi prăjiți"},
    {"name": "Tochitură cu mămăligă", "ingredients": "Carne de porc 200g, afumătură de porc 150g, ardei, ou ochi, telemea, smântână, usturoi, făină, mălai, unt, ulei, sare, piper, dafin", "price": 40.00, "weight": "600g", "category": "preparate_baza", "description": "Tochitură moldovenească cu mămăliguță", "is_popular": True},
    {"name": "Cașcaval pane cu cartofi prăjiți", "ingredients": "Cașcaval, ou, făină de grâu, pesmet, cartofi, ulei, sare", "price": 40.00, "weight": "300g", "category": "preparate_baza", "description": "Cașcaval pane crocant cu cartofi prăjiți"},
    {"name": "Păstrăv prăjit", "ingredients": "Carne de pește 100g", "price": 10.00, "weight": "100g", "category": "preparate_baza", "description": "Păstrăv proaspăt prăjit"},
    {"name": "Ciolan cu fasole", "ingredients": "Ciolan de porc 400g, fasole boabe 200g, ceapă, morcovi, ardei, ulei, dafin, sare, piper", "price": 45.00, "weight": "700g", "category": "preparate_baza", "description": "Ciolan fraged de porc cu fasole la cuptor", "is_popular": True},
    {"name": "Cotlet de porc cu cartofi prăjiți", "ingredients": "Carne de porc 200g, cartofi 150g, ulei, sare, piper", "price": 30.00, "weight": "350g", "category": "preparate_baza", "description": "Cotlet suculent de porc cu cartofi"},
    {"name": "Ceafă de porc cu cartofi prăjiți", "ingredients": "Carne de porc 150g, cartofi 150g, ulei, sare, piper", "price": 30.00, "weight": "300g", "category": "preparate_baza", "description": "Ceafă de porc la grătar cu cartofi"},
    {"name": "Aripioare picante cu cartofi prăjiți", "ingredients": "Aripioare de pui 200g, cartofi 150g, făină de grâu, ou, pesmet, ulei, sare, boia iute", "price": 30.00, "weight": "350g", "category": "preparate_baza", "description": "Aripioare de pui cu boia iute și cartofi"},
    {"name": "Mix grill", "ingredients": "Ceafă de porc 200g, piept de pui 150g, bacon 100g, cârnați porc 200g, mici 150g, cartofi 200g, ulei, sare, piper", "price": 100.00, "weight": "1000g", "category": "preparate_baza", "description": "Platou mixt la grătar pentru 2 persoane", "is_popular": True},
    {"name": "Mămăligă cu brânză și smântână", "ingredients": "Telemea 150g, smântână 100g, făină de mălai, unt, sare", "price": 20.00, "weight": "400g", "category": "preparate_baza", "description": "Mămăligă cu brânză topită și smântână"},
    {"name": "Mici cu muștar", "ingredients": "Mic 120g, muștar 30g, pâine", "price": 10.00, "weight": "1 buc. 200g", "category": "preparate_baza", "description": "Mititeii casei serviți cu muștar"},
    {"name": "Supă de pui cu găluște", "ingredients": "Ou 20g, griș 30g, morcov 50g, sare, piper", "price": 25.00, "weight": "350/100g", "category": "ciorbe_supe", "description": "Supă caldă de pui cu găluște pufoase"},
    {"name": "Ciorbă rădăuțeană", "ingredients": "Carne de pui 80g, morcov 50g, păstârnac, ceapă, smântână, ou, sare, piper", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă cremoasă de pui în stil rădăuțean", "is_popular": True},
    {"name": "Ciorbă de văcuță", "ingredients": "Carne de văcuță 80g, morcov 50g, ceapă, păstârnac, țelină, mazăre, fasole verde, sare, piper, boia", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă de văcuță cu legume proaspete"},
    {"name": "Ciorbă de perișoare", "ingredients": "Carne tocată de porc 80g, morcov 50g, ceapă, păstârnac, orez, ou, smântână, sare, piper", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă tradițională cu perișoare de porc"},
    {"name": "Ciorbă de burtă", "ingredients": "Burtă de vită 80g, morcov 50g, usturoi, smântână, ou", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă de burtă preparată după rețeta casei"},
    {"name": "Ciorbă de fasole cu afumătură", "ingredients": "Afumătură de porc 90g, fasole 30g, ceapă, morcov, păstârnac, țelină, sare, piper, boia", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă de fasole cu afumătură de casă"},
    {"name": "Ciorbă de legume", "ingredients": "Cartofi 50g, mazăre 50g, ceapă, ardei, păstârnac, țelină, sare, piper, boia", "price": 20.00, "weight": "350/180g", "category": "ciorbe_supe", "description": "Ciorbă ușoară de legume proaspete"},
    {"name": "Gulaș de vită", "ingredients": "Carne de vită, cartofi, ceapă, ardei, boia, sare, piper", "price": 40.00, "weight": "400g", "category": "ciorbe_supe", "description": "Gulaș de vită tradițional"},
    {"name": "Cartofi prăjiți", "ingredients": "Cartofi 150g, ulei, sare", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi prăjiți aurii și crocanți"},
    {"name": "Cartofi piure", "ingredients": "Cartofi 150g, unt 20g, lapte, sare", "price": 10.00, "weight": "160g", "category": "garnituri", "description": "Piure de cartofi cremos cu unt"},
    {"name": "Cartofi țărănești", "ingredients": "Cartofi 120g, ceapă 30g, ulei, sare, piper, vegeta de legume", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi țărănești cu ceapă"},
    {"name": "Cartofi natur", "ingredients": "Cartofi 130g, unt 20g, pătrunjel, sare, piper, vegeta de legume", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi natur cu pătrunjel"},
    {"name": "Legume mexicane", "ingredients": "Unt 30g, ardei, fasole verde 30g, porumb 30g, mazăre, morcovi, sare, piper", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Mix de legume mexicane la tigaie"},
    {"name": "Orez cu legume", "ingredients": "Orez, legume, sare", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Orez cu legume proaspete"},
    {"name": "Cartofi prăjiți cu brânză", "ingredients": "Cartofi 120g, brânză telemea 30g, ulei, sare, piper", "price": 15.00, "weight": "150g", "category": "garnituri", "description": "Cartofi prăjiți cu brânză telemea rasă"},
    {"name": "Salată de pui cu feta", "ingredients": "Carne de pui 150g, feta 100g, castraveți, roșii, ardei, ceapă, rucolă, ulei măsline, sare, piper", "price": 30.00, "weight": "300g", "category": "salate", "description": "Salată bogată cu pui la grătar și brânză feta"},
    {"name": "Salată de varză", "ingredients": "Varză 100g, sare, piper, ulei, oțet", "price": 7.00, "weight": "100g", "category": "salate", "description": "Salată clasică de varză"},
    {"name": "Salată de roșii și castraveți", "ingredients": "Roșii 50g, castraveți 50g, sare, piper, ulei, oțet", "price": 7.00, "weight": "100g", "category": "salate", "description": "Salată proaspătă de sezon"},
    {"name": "Salată de roșii cu brânză", "ingredients": "Roșii 70g, telemea 30g", "price": 7.00, "weight": "100g", "category": "salate", "description": "Roșii proaspete cu telemea"},
    {"name": "Salată de murături asortate", "ingredients": "Castraveți murați", "price": 7.00, "weight": "100g", "category": "salate", "description": "Murături asortate de casă"},
    {"name": "Salată asortată de crudități", "ingredients": "Castraveți 30g, roșii 50g, ceapă 20g, sare, piper, oțet, ulei", "price": 7.00, "weight": "100g", "category": "salate", "description": "Mix de legume proaspete"},
    {"name": "Paste Carbonara", "ingredients": "Paste 150g, bacon 100g, gălbenuș de ou, parmesan ras, sare, piper, ulei", "price": 30.00, "weight": "300g", "category": "paste", "description": "Paste carbonara cu bacon crocant și parmesan", "is_popular": True},
    {"name": "Paste Milaneze", "ingredients": "Paste 150g, șuncă 50g, bacon 50g, ciuperci, mozzarella, roșii, sare, piper, ulei", "price": 30.00, "weight": "300g", "category": "paste", "description": "Paste milaneze cu șuncă, ciuperci și mozzarella"},
    {"name": "Papanași", "ingredients": "Brânză de vaci 150g, smântână 100g, dulceață de afine 70g, făină de grâu, praf de copt, zahăr, zahăr vanilat, sare, ulei", "price": 35.00, "weight": "400g", "category": "desert", "description": "Papanași tradiționali cu smântână și dulceață de afine", "is_popular": True},
    {"name": "Salată de fructe", "ingredients": "Ananas 50g, portocale 50g, mere, struguri, frișcă", "price": 25.00, "weight": "200g", "category": "desert", "description": "Salată de fructe proaspete cu frișcă"},
    {"name": "Clătite Ana Lugojana", "ingredients": "Brânză de vaci 100g, spumă de ou 100g, sos de vanilie 80g, lapte 100ml, făină de grâu, ou, zahăr, zahăr vanilat, sare, ulei", "price": 35.00, "weight": "400g", "category": "desert", "description": "Clătite umplute cu brânză și sos de vanilie", "is_popular": True},
    {"name": "Clătite cu brânză dulce", "ingredients": "Brânză de vaci 100g, lapte 100g, făină de grâu, ou, zahăr, zahăr vanilat, sare, ulei", "price": 20.00, "weight": "250g", "category": "desert", "description": "Clătite pufoase cu brânză dulce de vaci"},
    {"name": "Clătite cu finetti", "ingredients": "Cremă de alune de pădure 80g, lapte 100ml, făină de grâu, ou, zahăr, sare, ulei", "price": 20.00, "weight": "250g", "category": "desert", "description": "Clătite calde cu cremă de alune"},
    {"name": "Prăjitura Casei Surpriza", "ingredients": "Rețetă secretă a casei", "price": 20.00, "weight": "200g", "category": "desert", "description": "Desertul surpriză al bucătarului"},
]

REVIEWS = [
    {"author": "Bettie", "rating": 5, "text": "Foarte frumos. Papanașii sunt mari și gustoși, iar servirea este ireproșabilă.", "date": "2023-09-04"},
    {"author": "Robert", "rating": 5, "text": "Mâncarea este tare gustoasă și atmosfera foarte plăcută! Recomand.", "date": "2023-09-04"},
    {"author": "Jerin", "rating": 5, "text": "Papanași foarte buni, mâncare bună la preț accesibil, personal amabil.", "date": "2023-09-04"},
    {"author": "Traute", "rating": 5, "text": "Mâncare foarte bună, porții mari, iar domnul care servește este foarte amabil!", "date": "2023-09-04"},
    {"author": "Simo", "rating": 5, "text": "Gulașul meu preferat. Un loc minunat cu mâncare autentică.", "date": "2023-09-04"},
    {"author": "Maria P.", "rating": 4, "text": "Loc intim, cu mâncare de casă. Ciorba rădăuțeană e extraordinară! Porțiile sunt generoase.", "date": "2024-03-15"},
    {"author": "Andrei V.", "rating": 5, "text": "Cel mai bun restaurant tradițional din Deva. Tochitură cu mămăligă ca la bunica!", "date": "2024-06-20"},
    {"author": "Elena D.", "rating": 5, "text": "Atmosferă caldă, ca la bunica acasă. Clătitele Ana Lugojana sunt divine!", "date": "2024-08-10"},
]

def gen_id():
    return str(uuid.uuid4())

def seed_if_needed():
    """Seed menu_items and reviews if empty"""
    db = get_db()
    if db.menu_items.count_documents({}) == 0:
        docs = []
        for item in MENU_ITEMS:
            doc = {"id": gen_id(), **item}
            doc.setdefault("is_popular", False)
            doc.setdefault("image_url", "")
            docs.append(doc)
        db.menu_items.insert_many(docs)

    if db.reviews.count_documents({}) == 0:
        docs = [{"id": gen_id(), **r} for r in REVIEWS]
        db.reviews.insert_many(docs)
