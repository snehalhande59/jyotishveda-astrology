# JyotishVeda — Complete Full-Stack Vedic Astrology Platform

JyotishVeda is a production-oriented, full-stack Vedic Astrology web application engineered with a **Next.js 14 App Router** frontend and a **Strapi 5 Headless CMS** backend. It features an in-house **Nirayana Sidereal astronomical calculation engine** implementing the official Indian Government standard **Lahiri (Chitrapaksha) Ayanamsa**, interactive North & South Indian chart SVG visualizations, a 36-point Ashta Kuta compatibility matching engine, Razorpay test-mode payment integration, and complete user profile management.

---

## 1. Project Architecture

```
vedic-astrology-platform/
├── backend/                  # Strapi 5 Headless CMS Application
│   ├── config/               # Server, database, admin, CORS & security middlewares
│   ├── database/             # SQLite dev fallback & migration definitions
│   ├── src/
│   │   ├── api/              # 16 Content Types & Custom REST APIs
│   │   │   ├── astrologer/
│   │   │   ├── astrology-article/
│   │   │   ├── astrology-report/
│   │   │   ├── astrology-service/
│   │   │   ├── birth-profile/
│   │   │   ├── consultation-booking/
│   │   │   ├── contact-message/
│   │   │   ├── faq/
│   │   │   ├── horoscope/
│   │   │   ├── kundli/
│   │   │   ├── nakshatra/
│   │   │   ├── payment/
│   │   │   ├── payment-record/
│   │   │   ├── pricing-plan/
│   │   │   ├── site-setting/
│   │   │   └── zodiac-sign/
│   │   ├── services/
│   │   │   ├── vedic-engine.js    # Astronomical calculations & Lahiri ephemeris
│   │   │   └── payment-service.js # Razorpay order creation & HMAC verification
│   │   └── index.js          # Auto-bootstrap permissions & catalog seeding
│   ├── .env.example          # Backend environment template
│   └── package.json
│
├── frontend/                 # Next.js 14 App Router Application
│   ├── app/                  # 24 Complete Pages & Route Handlers
│   │   ├── page.tsx          # 1. Home page
│   │   ├── about/            # 2. About Astrology page
│   │   ├── birth-profile/    # 3. Create My Birth Profile page
│   │   ├── kundli/           # 4. Kundli / Birth Chart page
│   │   ├── horoscope/        # 5. Daily Horoscope page
│   │   ├── zodiac-finder/    # 6. Zodiac Sign (Rashi) Finder page
│   │   ├── nakshatra-finder/ # 7. Nakshatra Finder page
│   │   ├── numerology/       # 8. Numerology Calculator page
│   │   ├── compatibility/    # 9. Kundli Compatibility (Guna Milan) page
│   │   ├── reports/
│   │   │   ├── career/       # 10. Career Astrology Report page
│   │   │   ├── marriage/     # 11. Marriage Astrology Report page
│   │   │   ├── finance/      # 12. Finance Astrology Report page
│   │   │   └── premium-kundli/ # 13. Detailed 50-Page Kundli Report page
│   │   ├── astrologers/      # 14. Astrologers Directory page
│   │   │   └── [id]/         # 15. Astrologer Profile page
│   │   ├── booking/          # 16. Consultation Booking page
│   │   ├── pricing/          # 17. Pricing & Plans page
│   │   ├── checkout/         # 18. Checkout page
│   │   ├── payment/status/   # 18. Payment Status page
│   │   ├── login/            # 19. Login page
│   │   ├── register/         # 19. Registration page
│   │   ├── dashboard/        # 20. User Dashboard page
│   │   │   ├── reports/      # 21. My Reports page
│   │   │   ├── bookings/     # 22. My Bookings page
│   │   │   └── profile/      # 23. User Profile & Settings page
│   │   ├── contact/          # 24. Contact page
│   │   ├── faq/              # 24. FAQ page
│   │   ├── privacy/          # 24. Privacy Policy page
│   │   ├── terms/            # 24. Terms of Service page
│   │   ├── layout.tsx        # Shared responsive layout with Navbar & Footer
│   │   └── not-found.tsx     # Custom 404 page
│   ├── components/           # Reusable UI widgets
│   │   ├── Navbar.tsx        # Responsive navigation with auth drawer
│   │   ├── Footer.tsx        # Footer with ethical Jyotish disclaimer
│   │   ├── NorthIndianChart.tsx # SVG diamond Kundli visualizer
│   │   ├── SouthIndianChart.tsx # SVG 4x4 square visualizer
│   │   ├── BirthDetailsForm.tsx # Searchable city & coordinates form
│   │   └── PaymentModal.tsx  # Razorpay test mode payment dialog
│   ├── lib/
│   │   ├── api.ts            # Type-safe Strapi 5 REST API client
│   │   ├── auth.ts           # Token management & session persistence
│   │   ├── cities.ts         # Pre-configured global & Indian city ephemerides
│   │   ├── numerology.ts     # Pythagorean & Vedic numerology calculator
│   │   └── types.ts          # TypeScript interfaces
│   ├── .env.example          # Frontend environment template
│   └── package.json
└── README.md
```

---

## 2. Key Technology Stack

- **Frontend Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS with custom Vedic palette (Warm Ivory `#FAF6F0`, Midnight Cosmic `#150D2A`, Sacred Gold `#D4AF37`)
- **Backend CMS**: Strapi 5.6
- **Database**:
  - **Local Development**: SQLite (`.tmp/data.db`) via `better-sqlite3`
  - **Production Ready**: PostgreSQL via `pg` driver
- **Authentication**: Strapi Users & Permissions Plugin with JWT authentication and user ownership policies
- **Payment Processing**: Razorpay (Test mode enabled with server-side HMAC-SHA256 signature verification)
- **Astronomical Calculation Engine**: Custom Sidereal Nirayana Engine with Lahiri Chitrapaksha Ayanamsa

---

## 3. Quickstart & Local Setup

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### Step 1: Start the Strapi 5 Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development or production server
npm run start
# Alternatively, to run with auto-reload: npm run develop
```
- The backend will start on **`http://localhost:1337`**.
- On first start, Strapi automatically runs `src/index.js:bootstrap` which seeds initial catalog data (Zodiac signs, Nakshatras, Astrology services, Astrologers, Site settings, FAQs) and sets role permissions.
- To access the Strapi Admin Panel: open **`http://localhost:1337/admin`** and register your initial administrator.

### Step 2: Start the Next.js Frontend

```bash
cd frontend

# Copy environment variables
cp .env.example .env.local

# Install dependencies
npm install

# Start the Next.js dev server
npm run dev
# Or build for production: npm run build && npm run start
```
- Open **`http://localhost:3000`** in your browser.

---

## 4. Environment Variables

### Backend (`backend/.env`)
```env
HOST=0.0.0.0
PORT=1337

# Security Keys
APP_KEYS="vedicAppKeySecret1,vedicAppKeySecret2,vedicAppKeySecret3,vedicAppKeySecret4"
API_TOKEN_SALT="apiTokenSaltVedicPlatform2026Key456"
ADMIN_JWT_SECRET="adminSecretVedicPlatform2026SecureKey789"
TRANSFER_TOKEN_SALT="transferTokenSaltVedicPlatform2026Key123"
JWT_SECRET="superJwtSecret1234567890ForVedicAstrologyPlatform"

# Database Configuration (SQLite default for dev, postgres for prod)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# PostgreSQL Production settings
# DATABASE_CLIENT=postgres
# DATABASE_HOST=127.0.0.1
# DATABASE_PORT=5432
# DATABASE_NAME=vedic_astrology
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=your_secure_password
# DATABASE_SSL=false

# Razorpay Test Mode Credentials
RAZORPAY_KEY_ID=rzp_test_AstrologyDemo123
RAZORPAY_KEY_SECRET=rzp_secret_AstrologyDemoSecret456
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_789

# Frontend Integration
FRONTEND_URL=http://localhost:3000
DEFAULT_AYANAMSA=Lahiri
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_AstrologyDemo123
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 5. Astronomical & Vedic Calculation Engine

Calculation logic is executed exclusively on the backend (`backend/src/services/vedic-engine.js`) to guarantee reproducibility and prevent client-side tampering.

### Astronomical Formulas Implemented:
1. **Julian Day Conversion**: Converts local birth time into UTC, deriving exact Julian centuries ($T$) relative to J2000.0 epoch ($JD = 2451545.0$).
2. **Lahiri (Chitrapaksha) Ayanamsa**:
   $$\text{Ayanamsa} = 23.856667^\circ + 1.3969712^\circ \times T + 0.0003086^\circ \times T^2$$
3. **Planetary Longitudes**: Planetary coordinates for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu (Mean Lunar Node), and Ketu ($+180^\circ$). Sidereal conversion:
   $$\lambda_{\text{sidereal}} = (\lambda_{\text{tropical}} - \text{Ayanamsa}) \pmod{360^\circ}$$
4. **Ascendant (Lagna)**: Computed from Greenwich Mean Sidereal Time (GMST), geographic longitude, and geographic latitude ($\phi$):
   $$\text{RAMC} = \text{GMST} + \text{Lon}$$
   $$\tan(\text{Lagna}_{\text{trop}}) = \frac{\cos(\text{RAMC})}{-\sin(\text{RAMC})\cos(\epsilon) - \tan(\phi)\sin(\epsilon)}$$
   $$\text{Lagna}_{\text{sidereal}} = (\text{Lagna}_{\text{trop}} - \text{Ayanamsa}) \pmod{360^\circ}$$
5. **12 Bhavas (Equal House / Rashi Chalit)**: Maps 12 houses starting from the Ascendant degree.
6. **Vimshottari Mahadasha**: 120-year planetary progression (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury) calculated proportionally from the Moon's elapsed distance inside its birth Nakshatra.
7. **Ashta Kuta Milan (36 Gunas)**:
   - Varna (1 pt)
   - Vashya (2 pts)
   - Tara (3 pts)
   - Yoni (4 pts)
   - Graha Maitri (5 pts)
   - Gana (6 pts)
   - Bhakoot (7 pts)
   - Nadi (8 pts)

---

## 6. Custom Backend API Documentation

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/kundli/generate` | Computes full sidereal chart, 12 houses, Lagna, and Dasha | Public |
| `POST` | `/api/kundli/compatibility` | Computes 36-point Guna Milan matching between 2 charts | Public |
| `GET` | `/api/kundli/:id` | Fetch specific calculated chart | Public |
| `POST` | `/api/birth-profiles` | Create and save user birth profile with auto-chart generation | Public/Authenticated |
| `GET` | `/api/birth-profiles/me` | Retrieve birth profiles owned by authenticated user | **Bearer JWT** |
| `GET` | `/api/astrology-services` | Catalog of reports, pricing, and features | Public |
| `GET` | `/api/astrologers` | Certified scholars directory | Public |
| `GET` | `/api/astrologers/:id` | Individual astrologer profile & availability | Public |
| `POST` | `/api/reports/generate` | Generates Career, Marriage, Finance, or Kundli report | Public/Authenticated |
| `GET` | `/api/reports/me` | Retrieve reports owned by authenticated user | **Bearer JWT** |
| `POST` | `/api/bookings` | Book consultation session with video link generation | Public/Authenticated |
| `GET` | `/api/bookings/me` | Retrieve consultations booked by authenticated user | **Bearer JWT** |
| `POST` | `/api/payments/create-order` | Server-side Razorpay order generation | Public/Authenticated |
| `POST` | `/api/payments/verify` | HMAC-SHA256 signature verification & entitlement unlock | Public/Authenticated |
| `POST` | `/api/payments/webhook` | Idempotent webhook listener for Razorpay | Public |
| `POST` | `/api/contact-messages` | Inquiries form dispatch | Public |

### Example: Generate Kundli
```bash
curl -X POST http://localhost:1337/api/kundli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Aryavarta Sharma",
    "dateOfBirth": "1994-06-15",
    "timeOfBirth": "14:30",
    "placeOfBirth": "New Delhi, India",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezoneOffset": 5.5
  }'
```

### Example: Razorpay Order Creation
```bash
curl -X POST http://localhost:1337/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 699,
    "serviceType": "report",
    "referenceId": "career"
  }'
```

---

## 7. Razorpay Payment Workflow

1. **Client requests order**: User clicks purchase button on frontend.
2. **Server generates order**: Backend computes trusted price from server catalog, calls Razorpay Orders API, creates a `payment-record` entry with status `created`, and sends `orderId` to the frontend.
3. **Checkout modal**: The client loads Razorpay checkout (or interactive test mode verification).
4. **Backend verification**: Upon submission, the frontend sends `orderId`, `paymentId`, and `signature` to `/api/payments/verify`.
5. **Cryptographic validation**: Backend generates HMAC-SHA256 with `RAZORPAY_KEY_SECRET`:
   ```javascript
   crypto.createHmac('sha256', secret).update(orderId + "|" + paymentId).digest('hex')
   ```
6. **Entitlement grant**: Only when signatures match is `status` updated to `captured`, and the corresponding report or consultation booking is marked as `isPurchased = true`.

---

## 8. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push `frontend/` directory to GitHub / GitLab.
2. Link the repository in the Vercel dashboard.
3. Set the Root Directory to `frontend`.
4. Add environment variables:
   - `NEXT_PUBLIC_STRAPI_URL=https://api.yourdomain.com`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key`
   - `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
5. Deploy.

### Backend Deployment (Node.js VPS / Render / DigitalOcean)
1. Host Strapi on a persistent Node.js environment (e.g. Render Web Service, AWS ECS, or Ubuntu VPS with PM2).
2. Configure managed PostgreSQL database (e.g. Supabase, Neon, or AWS RDS).
3. Set environment variables:
   - `DATABASE_CLIENT=postgres`
   - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
   - `DATABASE_SSL=true`
   - `FRONTEND_URL=https://yourdomain.com`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
4. Build and start:
   ```bash
   npm run build
   npm run start
   ```
5. Configure reverse proxy (Nginx or Cloudflare) with HTTPS SSL certificates.

---

## 9. Verification & Automated Test Results

- **Strapi 5 Admin Build**: Exited with code 0 (`√ Building admin panel (28051ms)`).
- **Strapi Server Runtime**: Verified live on port 1337 (`Strapi started successfully` with SQLite dev fallback).
- **Sidereal Calculation Test**: `POST /api/kundli/generate` returned accurate Lahiri Ayanamsa ($23.7792^\circ$), Ascendant in Virgo ($28^\circ 43'$), Moon in Leo ($11^\circ 30'$), Magha Nakshatra Pada 4, Ketu Mahadasha balance 0.96 years, and 12 Bhavas.
- **Razorpay Order & Verification Test**: Created order `order_1793082293296_0fbed33d`, verified signature on backend, recorded captured transaction, and granted report entitlement.
- **Next.js Production Build**: All 31 App Router pages compiled, type-checked, and statically generated with 0 errors.
