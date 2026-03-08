# PRD - La Băiatu' Restaurant Website

## Original Problem Statement
Build a modern responsive restaurant website for "La Băiatu'" by scraping publicly available data from the original website and Glovo delivery platform. The restaurant is located at Aleea Anemonelor 21, 330055 Deva, Romania.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + shadcn/ui components
- **Backend**: FastAPI (Python) with MongoDB (Motor async driver)
- **Database**: MongoDB (menu_items, reviews, reservations collections)
- **Design**: Warm palette (Dough White #FDFBF7, Dark Wood #2D2420, Paprika Red #A63C3C, Polenta Gold #D4A017)
- **Fonts**: Playfair Display (headings), Lato (body), Caveat (accents)

## User Personas
1. **Local Diners** - Residents of Deva seeking comfort food
2. **Tourists** - Visitors wanting authentic Romanian cuisine experience
3. **Families** - Groups looking for a warm, welcoming atmosphere

## Core Requirements (Static)
- Scraped menu data (46 items) from Glovo delivery platform
- 7 menu categories: Mic Dejun, Ciorbe & Supe, Paste, Preparate de Bază, Garnituri, Salate, Desert
- Customer reviews (8 scraped reviews)
- Restaurant info (hours, address, phone, rating)
- Functional reservation system (MongoDB-backed)
- SEO optimization with schema.org structured data

## What's Been Implemented (March 8, 2026)
- [x] Backend API with 7 endpoints (menu, categories, popular, reviews, reservations, restaurant-info)
- [x] Database seeding with 46 menu items and 8 reviews
- [x] Hero section with background image, stats, and CTAs
- [x] About Us section with restaurant description and info cards
- [x] Popular Dishes bento grid layout
- [x] Menu section with tabbed categories, search/filter
- [x] Gallery section with lightbox dialog
- [x] Reviews section with star ratings
- [x] Contact section with Google Maps embed + reservation form (Calendar, Select, Popover)
- [x] Footer with navigation, contact info, opening hours
- [x] Fixed navbar with smooth scroll navigation
- [x] Mobile responsive layout with hamburger menu
- [x] SEO meta tags + schema.org structured data
- [x] Romanian language content throughout

## Testing Results
- Backend: 100% (16/16 API endpoints passing)
- Frontend: 95% (all major features working)

## Prioritized Backlog
### P0 (Done)
- All core sections implemented and tested

### P1 (Next)
- Online ordering integration (redirect to Glovo or custom cart)
- Admin panel for managing menu items and reservations
- Email notifications for new reservations

### P2 (Future)
- Multi-language support (Romanian/English toggle)
- WhatsApp ordering integration
- Blog/news section for events and promotions
- Loyalty program integration
