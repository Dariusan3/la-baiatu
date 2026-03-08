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
    phone: str = "+40 735 041 576"
    email: str = "contact@la-baiatu.ro"
    opening_hours: dict = {
        "Luni - Sâmbătă": "10:00 - 23:30",
        "Duminică": "13:00 - 23:30"
    }
    rating: float = 4.1
    total_reviews: int = 964

# Seed data
MENU_ITEMS = [
    # MIC DEJUN
    {"name": "Omletă cu salam picant și cașcaval", "ingredients": "Ouă, cașcaval, salam porc, unt, sare", "price": 20.00, "weight": "150g", "category": "mic_dejun", "description": "Omletă pufoasă cu salam picant și cașcaval topit"},
    {"name": "Omletă cu șuncă și cașcaval", "ingredients": "Ouă, cașcaval, șuncă pui, unt, sare", "price": 20.00, "weight": "150g", "category": "mic_dejun", "description": "Omletă cu șuncă de pui și cașcaval"},
    {"name": "Ochiuri de ouă", "ingredients": "Ouă, sare, ulei", "price": 15.00, "weight": "100g", "category": "mic_dejun", "description": "Ouă ochiuri preparate tradițional"},
    {"name": "Omletă simplă", "ingredients": "Ouă, lapte, ulei, sare", "price": 15.00, "weight": "120g", "category": "mic_dejun", "description": "Omletă clasică și pufoasă"},
    {"name": "Cremvuști", "ingredients": "Carne de pui", "price": 10.00, "weight": "200g", "category": "mic_dejun", "description": "Cremvuști de pui proaspeți"},
    {"name": "Virșli", "ingredients": "Carne de porc, oaie, vită", "price": 10.00, "weight": "180g", "category": "mic_dejun", "description": "Virșli tradiționali din carne selectată"},
    # CIORBE / SUPE
    {"name": "Ciorbă rădăuțeană", "ingredients": "Carne de pui, morcov, păstârnac, ceapă, smântână, ou, sare, piper", "price": 25.00, "weight": "500g", "category": "ciorbe_supe", "description": "Ciorbă cremoasă de pui în stil rădăuțean", "is_popular": True},
    {"name": "Ciorbă de perișoare", "ingredients": "Carne tocată de porc, morcov, ceapă, păstârnac, orez, ou, smântână, sare, piper", "price": 25.00, "weight": "500ml", "category": "ciorbe_supe", "description": "Ciorbă tradițională cu perișoare de porc"},
    {"name": "Ciorbă de burtă", "ingredients": "Burtă de vită, morcov, usturoi, smântână, ou", "price": 25.00, "weight": "500ml", "category": "ciorbe_supe", "description": "Ciorbă de burtă preparată după rețeta casei"},
    {"name": "Ciorbă de fasole cu afumătură", "ingredients": "Afumătură de porc, fasole, ceapă, morcov, păstârnac, țelină, sare, piper, boia", "price": 25.00, "weight": "500g", "category": "ciorbe_supe", "description": "Ciorbă de fasole cu afumătură de casă"},
    {"name": "Supă de pui cu găluște", "ingredients": "Ou, griș, morcov, sare, piper", "price": 20.00, "weight": "450g", "category": "ciorbe_supe", "description": "Supă caldă de pui cu găluște pufoase"},
    {"name": "Ciorbă de legume", "ingredients": "Cartofi, mazăre, ceapă, ardei, păstârnac, țelină, sare, piper, boia", "price": 20.00, "weight": "530g", "category": "ciorbe_supe", "description": "Ciorbă ușoară de legume proaspete"},
    # PASTE
    {"name": "Paste Carbonara", "ingredients": "Paste, bacon, gălbenuș de ou, parmesan ras, sare, piper, ulei", "price": 30.00, "weight": "300g", "category": "paste", "description": "Paste carbonara cu bacon crocant și parmesan", "is_popular": True},
    {"name": "Paste Milaneze", "ingredients": "Paste, șuncă, bacon, ciuperci, mozzarella, roșii, sare, piper, ulei", "price": 30.00, "weight": "300g", "category": "paste", "description": "Paste milaneze cu șuncă, ciuperci și mozzarella"},
    # PREPARATE DE BAZĂ
    {"name": "Mix grill", "ingredients": "Ceafă de porc, piept de pui, bacon, cârnați porc, mici, cartofi, ulei, sare, piper", "price": 100.00, "weight": "1kg", "category": "preparate_baza", "description": "Platou mixt la grătar pentru 2 persoane", "is_popular": True},
    {"name": "Ciolan cu fasole", "ingredients": "Ciolan de porc, fasole boabe, ceapă, morcovi, ardei, ulei, dafin, sare, piper", "price": 50.00, "weight": "700g", "category": "preparate_baza", "description": "Ciolan fraged de porc cu fasole la cuptor", "is_popular": True},
    {"name": "Coaste de porc cu cartofi copți", "ingredients": "Coaste de porc, cartofi, sos BBQ, ardei iute, ulei, sare, piper", "price": 45.00, "weight": "600g", "category": "preparate_baza", "description": "Coaste de porc glazurate cu sos BBQ"},
    {"name": "Gordon bleo cu cartofi prăjiți", "ingredients": "Carne de porc, cartofi, șuncă pui, mozzarella, ou, făină de grâu, pesmet, ulei, sare, piper", "price": 45.00, "weight": "350g", "category": "preparate_baza", "description": "Gordon bleo umplut cu șuncă și mozzarella"},
    {"name": "Tochitură cu mămăligă", "ingredients": "Carne de porc, afumătură de porc, ardei, ou ochi, telemea, smântână, usturoi, făină, mălai, unt, ulei, sare, piper, dafin", "price": 45.00, "weight": "600g", "category": "preparate_baza", "description": "Tochitură moldovenească cu mămăliguță", "is_popular": True},
    {"name": "Șnițel de porc cu cartofi prăjiți", "ingredients": "Carne de porc, cartofi, ou, făină de grâu, pesmet, ulei, sare, piper", "price": 30.00, "weight": "300g", "category": "preparate_baza", "description": "Șnițel crocant de porc cu cartofi prăjiți", "is_popular": True},
    {"name": "Friptură de porc", "ingredients": "Carne de porc, ulei, sare, piper", "price": 30.00, "weight": "200g", "category": "preparate_baza", "description": "Friptură de porc la grătar"},
    {"name": "Șnițel de pui cu cartofi prăjiți", "ingredients": "Carne de pui, cartofi, ou, făină de grâu, pesmet, ulei, sare, piper", "price": 30.00, "weight": "300g", "category": "preparate_baza", "description": "Șnițel auriu de pui cu cartofi prăjiți"},
    {"name": "Cotlet de porc cu cartofi prăjiți", "ingredients": "Carne de porc, cartofi, ulei, sare, piper", "price": 30.00, "weight": "350g", "category": "preparate_baza", "description": "Cotlet suculent de porc cu cartofi"},
    {"name": "Ceafă de porc cu cartofi prăjiți", "ingredients": "Carne de porc, cartofi, ulei, sare, piper", "price": 30.00, "weight": "300g", "category": "preparate_baza", "description": "Ceafă de porc la grătar cu cartofi"},
    {"name": "Aripioare picante cu cartofi prăjiți", "ingredients": "Aripioare de pui, cartofi, făină de grâu, ou, pesmet, ulei, sare, boia iute", "price": 30.00, "weight": "350g", "category": "preparate_baza", "description": "Aripioare de pui cu boia iute și cartofi"},
    {"name": "Mămăligă cu brânză și smântână", "ingredients": "Telemea, smântână, făină de mălai, unt, sare", "price": 20.00, "weight": "400g", "category": "preparate_baza", "description": "Mămăligă cu brânză topită și smântână"},
    {"name": "Mici cu muștar", "ingredients": "Mic (1buc), muștar, pâine", "price": 10.00, "weight": "200g", "category": "preparate_baza", "description": "Mititeii casei serviți cu muștar"},
    # GARNITURI
    {"name": "Cartofi prăjiți cu brânză", "ingredients": "Cartofi, brânză telemea, ulei, sare, piper", "price": 15.00, "weight": "150g", "category": "garnituri", "description": "Cartofi prăjiți cu brânză telemea rasă"},
    {"name": "Cartofi prăjiți", "ingredients": "Cartofi, ulei, sare", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi prăjiți aurii și crocanți"},
    {"name": "Cartofi piure", "ingredients": "Cartofi, unt, lapte, sare", "price": 10.00, "weight": "160g", "category": "garnituri", "description": "Piure de cartofi cremos cu unt"},
    {"name": "Cartofi țărănești", "ingredients": "Cartofi, ceapă, ulei, sare, piper, vegeta de legume", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi țărănești cu ceapă"},
    {"name": "Cartofi natur", "ingredients": "Cartofi, unt, pătrunjel, sare, piper, vegeta de legume", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Cartofi natur cu pătrunjel"},
    {"name": "Legume mexicane", "ingredients": "Unt, ardei, fasole verde, porumb, mazăre, morcovi, sare, piper", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Mix de legume mexicane la tigaie"},
    {"name": "Orez cu legume", "ingredients": "Orez, legume, sare", "price": 10.00, "weight": "150g", "category": "garnituri", "description": "Orez cu legume proaspete"},
    # SALATE
    {"name": "Salată de pui cu feta", "ingredients": "Carne de pui, feta, castraveți, roșii, ardei, ceapă, rucolă, ulei măsline, sare, piper", "price": 30.00, "weight": "300g", "category": "salate", "description": "Salată bogată cu pui la grătar și brânză feta"},
    {"name": "Salată de roșii cu brânză", "ingredients": "Roșii, telemea", "price": 10.00, "weight": "100g", "category": "salate", "description": "Roșii proaspete cu telemea"},
    {"name": "Salată de varză", "ingredients": "Varză, sare, piper, ulei, oțet", "price": 7.00, "weight": "100g", "category": "salate", "description": "Salată clasică de varză"},
    {"name": "Salată de roșii și castraveți", "ingredients": "Roșii, castraveți, sare, piper, ulei, oțet", "price": 7.00, "weight": "100g", "category": "salate", "description": "Salată proaspătă de sezon"},
    {"name": "Salată de murături asortate", "ingredients": "Castraveți murați", "price": 7.00, "weight": "100g", "category": "salate", "description": "Murături asortate de casă"},
    {"name": "Salată asortată de crudități", "ingredients": "Castraveți, roșii, ceapă, sare, piper, oțet, ulei", "price": 7.00, "weight": "100g", "category": "salate", "description": "Mix de legume proaspete"},
    # DESERT
    {"name": "Papanași", "ingredients": "Brânză de vaci, smântână, dulceață de afine, făină de grâu, praf de copt, zahăr, zahăr vanilat, sare, ulei", "price": 35.00, "weight": "400g", "category": "desert", "description": "Papanași tradiționali cu smântână și dulceață de afine", "is_popular": True},
    {"name": "Clătite Ana Lugojana", "ingredients": "Brânză de vaci, spumă de ou, sos de vanilie, lapte, făină de grâu, ou, zahăr, zahăr vanilat, sare, ulei", "price": 35.00, "weight": "400g", "category": "desert", "description": "Clătite umplute cu brânză și sos de vanilie", "is_popular": True},
    {"name": "Salată de fructe", "ingredients": "Ananas, portocale, mere, struguri, frișcă", "price": 25.00, "weight": "200g", "category": "desert", "description": "Salată de fructe proaspete cu frișcă"},
    {"name": "Prăjitura Casei Surpriza", "ingredients": "Rețetă secretă a casei", "price": 25.00, "weight": "200g", "category": "desert", "description": "Desertul surpriză al bucătarului"},
    {"name": "Clătite cu brânză dulce", "ingredients": "Brânză de vaci, lapte, făină de grâu, ou, zahăr, zahăr vanilat, sare, ulei", "price": 20.00, "weight": "250g", "category": "desert", "description": "Clătite pufoase cu brânză dulce de vaci"},
    {"name": "Clătite cu finetti", "ingredients": "Cremă de alune de pădure, lapte, făină de grâu, ou, zahăr, sare, ulei", "price": 20.00, "weight": "250g", "category": "desert", "description": "Clătite calde cu cremă de alune"},
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

# Seed database on startup
@app.on_event("startup")
async def seed_database():
    existing_count = await db.menu_items.count_documents({})
    if existing_count == 0:
        for item in MENU_ITEMS:
            menu_item = MenuItem(**item)
            doc = menu_item.model_dump()
            await db.menu_items.insert_one(doc)
        logger.info(f"Seeded {len(MENU_ITEMS)} menu items")

    existing_reviews = await db.reviews.count_documents({})
    if existing_reviews == 0:
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
