from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    ingredients: str = ""
    price: float
    weight: str = ""
    category: str
    image_url: str = ""
    is_popular: bool = False

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author: str
    rating: int
    text: str
    date: str

class Reservation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    date: str
    time: str
    guests: int
    notes: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class OrderItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItem]
    delivery_method: str = "livrare"  # livrare, ridicare, restaurant
    address: Optional[dict] = None  # {strada, numar, oras}
    coupon_code: Optional[str] = None
    phone: str = ""
    notes: str = ""

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[OrderItem]
    delivery_method: str
    address: Optional[dict] = None
    coupon_code: Optional[str] = None
    phone: str = ""
    notes: str = ""
    total: float = 0
    status: str = "nou"  # nou, in_preparare, gata, livrat
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReservationCreate(BaseModel):
    name: str
    email: str
    phone: str
    date: str
    time: str
    guests: int
    notes: str = ""

class RestaurantInfo(BaseModel):
    name: str = "La Băiatu'"
    tagline: str = "Gustul de acasă - Tradiție Românească"
    description: str = "Un restaurant de familie care vă oferă o experiență culinară autentică cu un meniu fantastic și o abordare prietenoasă. Restaurantul este deținut de o familie de 2 generații. Meniul este mic, dar pur și simplu fantastic, este o bază din bucătăria vestică românească. Dacă doriți ceva autentic, vă recomandăm cu adevărat să ne vizitați."
    address: str = "Aleea Anemonelor 21, 330055 Deva, România"
    phone: str = "0750 868 367"
    email: str = "contact@la-baiatu.ro"
    opening_hours: dict = {
        "Luni - Sâmbătă": "10:00 - 23:30",
        "Duminică": "13:00 - 23:30"
    }
    rating: float = 4.1
    total_reviews: int = 964

# Seed data - exact menu from la-baiatu.skubacz.pl
MENU_ITEMS = [
    # MIC DEJUN
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
    # PREPARATE DE BAZĂ
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
    # CIORBE / SUPE
    {"name": "Supă de pui cu găluște", "ingredients": "Ou 20g, griș 30g, morcov 50g, sare, piper", "price": 25.00, "weight": "350/100g", "category": "ciorbe_supe", "description": "Supă caldă de pui cu găluște pufoase"},
    {"name": "Ciorbă rădăuțeană", "ingredients": "Carne de pui 80g, morcov 50g, păstârnac, ceapă, smântână, ou, sare, piper", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă cremoasă de pui în stil rădăuțean", "is_popular": True},
    {"name": "Ciorbă de văcuță", "ingredients": "Carne de văcuță 80g, morcov 50g, ceapă, păstârnac, țelină, mazăre, fasole verde, sare, piper, boia", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă de văcuță cu legume proaspete"},
    {"name": "Ciorbă de perișoare", "ingredients": "Carne tocată de porc 80g, morcov 50g, ceapă, păstârnac, orez, ou, smântână, sare, piper", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă tradițională cu perișoare de porc"},
    {"name": "Ciorbă de burtă", "ingredients": "Burtă de vită 80g, morcov 50g, usturoi, smântână, ou", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă de burtă preparată după rețeta casei"},
    {"name": "Ciorbă de fasole cu afumătură", "ingredients": "Afumătură de porc 90g, fasole 30g, ceapă, morcov, păstârnac, țelină, sare, piper, boia", "price": 25.00, "weight": "350/150g", "category": "ciorbe_supe", "description": "Ciorbă de fasole cu afumătură de casă"},
    {"name": "Ciorbă de legume", "ingredients": "Cartofi 50g, mazăre 50g, ceapă, ardei, păstârnac, țelină, sare, piper, boia", "price": 20.00, "weight": "350/180g", "category": "ciorbe_supe", "description": "Ciorbă ușoară de legume proaspete"},
    {"name": "Gulaș de vită", "ingredients": "Carne de vită, cartofi, ceapă, ardei, boia, sare, piper", "price": 40.00, "weight": "400g", "category": "ciorbe_supe", "description": "Gulaș de vită tradițional"},
    # GARNITURI
    {"name": "Cartofi prăjiți", "ingredients": "Cartofi 150g, ulei, sare", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi prăjiți aurii și crocanți"},
    {"name": "Cartofi piure", "ingredients": "Cartofi 150g, unt 20g, lapte, sare", "price": 10.00, "weight": "160g", "category": "garnituri", "description": "Piure de cartofi cremos cu unt"},
    {"name": "Cartofi țărănești", "ingredients": "Cartofi 120g, ceapă 30g, ulei, sare, piper, vegeta de legume", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi țărănești cu ceapă"},
    {"name": "Cartofi natur", "ingredients": "Cartofi 130g, unt 20g, pătrunjel, sare, piper, vegeta de legume", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi natur cu pătrunjel"},
    {"name": "Legume mexicane", "ingredients": "Unt 30g, ardei, fasole verde 30g, porumb 30g, mazăre, morcovi, sare, piper", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Mix de legume mexicane la tigaie"},
    {"name": "Orez cu legume", "ingredients": "Orez, legume, sare", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Orez cu legume proaspete"},
    {"name": "Cartofi prăjiți cu brânză", "ingredients": "Cartofi 120g, brânză telemea 30g, ulei, sare, piper", "price": 15.00, "weight": "150g", "category": "garnituri", "description": "Cartofi prăjiți cu brânză telemea rasă"},
    # SALATE
    {"name": "Salată de pui cu feta", "ingredients": "Carne de pui 150g, feta 100g, castraveți, roșii, ardei, ceapă, rucolă, ulei măsline, sare, piper", "price": 30.00, "weight": "300g", "category": "salate", "description": "Salată bogată cu pui la grătar și brânză feta"},
    {"name": "Salată de varză", "ingredients": "Varză 100g, sare, piper, ulei, oțet", "price": 7.00, "weight": "100g", "category": "salate", "description": "Salată clasică de varză"},
    {"name": "Salată de roșii și castraveți", "ingredients": "Roșii 50g, castraveți 50g, sare, piper, ulei, oțet", "price": 7.00, "weight": "100g", "category": "salate", "description": "Salată proaspătă de sezon"},
    {"name": "Salată de roșii cu brânză", "ingredients": "Roșii 70g, telemea 30g", "price": 7.00, "weight": "100g", "category": "salate", "description": "Roșii proaspete cu telemea"},
    {"name": "Salată de murături asortate", "ingredients": "Castraveți murați", "price": 7.00, "weight": "100g", "category": "salate", "description": "Murături asortate de casă"},
    {"name": "Salată asortată de crudități", "ingredients": "Castraveți 30g, roșii 50g, ceapă 20g, sare, piper, oțet, ulei", "price": 7.00, "weight": "100g", "category": "salate", "description": "Mix de legume proaspete"},
    # PASTE
    {"name": "Paste Carbonara", "ingredients": "Paste 150g, bacon 100g, gălbenuș de ou, parmesan ras, sare, piper, ulei", "price": 30.00, "weight": "300g", "category": "paste", "description": "Paste carbonara cu bacon crocant și parmesan", "is_popular": True},
    {"name": "Paste Milaneze", "ingredients": "Paste 150g, șuncă 50g, bacon 50g, ciuperci, mozzarella, roșii, sare, piper, ulei", "price": 30.00, "weight": "300g", "category": "paste", "description": "Paste milaneze cu șuncă, ciuperci și mozzarella"},
    # DESERT
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

# Seed database on startup - drops and reseeds to ensure data matches source
@app.on_event("startup")
async def seed_database():
    # Clear and reseed menu items
    await db.menu_items.drop()
    for item in MENU_ITEMS:
        menu_item = MenuItem(**item)
        doc = menu_item.model_dump()
        await db.menu_items.insert_one(doc)
    logger.info(f"Seeded {len(MENU_ITEMS)} menu items")

    # Clear and reseed reviews
    await db.reviews.drop()
    for rev in REVIEWS:
        review = Review(**rev)
        doc = review.model_dump()
        await db.reviews.insert_one(doc)
    logger.info(f"Seeded {len(REVIEWS)} reviews")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "La Băiatu' API"}

@api_router.get("/restaurant-info")
async def get_restaurant_info():
    info = RestaurantInfo()
    return info.model_dump()

@api_router.get("/menu")
async def get_menu(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    items = await db.menu_items.find(query, {"_id": 0}).to_list(100)
    return items

@api_router.get("/menu/popular")
async def get_popular_dishes():
    items = await db.menu_items.find({"is_popular": True}, {"_id": 0}).to_list(20)
    return items

@api_router.get("/menu/categories")
async def get_categories():
    categories = await db.menu_items.distinct("category")
    category_map = {
        "mic_dejun": "Mic Dejun",
        "ciorbe_supe": "Ciorbe & Supe",
        "paste": "Paste",
        "preparate_baza": "Preparate de Bază",
        "garnituri": "Garnituri",
        "salate": "Salate",
        "desert": "Desert"
    }
    return [{"id": c, "label": category_map.get(c, c)} for c in categories]

@api_router.get("/reviews")
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(50)
    return reviews

@api_router.post("/reservations", response_model=Reservation)
async def create_reservation(input_data: ReservationCreate):
    reservation = Reservation(**input_data.model_dump())
    doc = reservation.model_dump()
    await db.reservations.insert_one(doc)
    return reservation

@api_router.get("/reservations")
async def get_reservations():
    reservations = await db.reservations.find({}, {"_id": 0}).to_list(100)
    return reservations

# Coupons (hardcoded for demo)
COUPONS = {
    "LABAIATU10": {"discount_percent": 10, "description": "10% reducere"},
    "BAIATU20": {"discount_percent": 20, "description": "20% reducere"},
}

@api_router.post("/coupons/validate")
async def validate_coupon(data: dict):
    code = data.get("code", "").strip().upper()
    if code in COUPONS:
        return {"valid": True, **COUPONS[code]}
    return {"valid": False, "message": "Codul cuponului nu este valid."}

@api_router.post("/orders", response_model=Order)
async def create_order(input_data: OrderCreate):
    if not input_data.items:
        raise HTTPException(status_code=400, detail="Coșul este gol.")

    total = sum(item.price * item.quantity for item in input_data.items)

    # Apply coupon discount
    discount_percent = 0
    if input_data.coupon_code:
        code = input_data.coupon_code.strip().upper()
        if code in COUPONS:
            discount_percent = COUPONS[code]["discount_percent"]
            total = total * (1 - discount_percent / 100)

    if total < 25:
        raise HTTPException(status_code=400, detail="Valoarea minimă a comenzii este 25 RON.")

    if input_data.delivery_method == "livrare":
        if not input_data.address or not input_data.address.get("strada") or not input_data.address.get("oras"):
            raise HTTPException(status_code=400, detail="Adresa este obligatorie pentru livrare.")

    order = Order(
        items=input_data.items,
        delivery_method=input_data.delivery_method,
        address=input_data.address,
        coupon_code=input_data.coupon_code,
        phone=input_data.phone,
        notes=input_data.notes,
        total=round(total, 2),
    )
    doc = order.model_dump()
    await db.orders.insert_one(doc)
    return order

@api_router.get("/orders")
async def get_orders():
    orders = await db.orders.find({}, {"_id": 0}).to_list(100)
    return orders

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
