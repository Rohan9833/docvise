# DocVise Microsite

A single-page marketing microsite for **DocVise** (a digiLATERAL offering), built from the approved desktop and mobile designs.

- **Frontend:** React + Vite + Tailwind CSS v4, Lucide icons, Framer Motion
- **Backend:** Node.js + Express + MongoDB (Mongoose) REST API for demo enquiries

```
docvise-microsite/
├── frontend/              React + Vite + Tailwind
│   ├── public/            favicon, OG image, assets/ (logo, SVG illustrations), samples/ (sample PDFs)
│   └── src/
│       ├── sections/      Header, Hero, HowItWorks, InAction, Multilingual, WhyDocVise, AnalyticsAndCta, Footer
│       ├── components/    UI kit, phone/PDF/tent-card mockups, dashboard preview, modals
│       ├── data/          site config, demo translations, legal copy
│       ├── hooks/ services/
├── backend/               Express API
│   ├── src/ (config, controllers, models, routes, middleware, services, utils)
│   ├── scripts/hash-password.js
│   └── tests/unit.test.js
└── docs/screenshots/      screenshots of the running implementation
```

## Prerequisites

- Node.js 18.18 or newer (20 LTS recommended)
- MongoDB 6+ (local, Docker or MongoDB Atlas)

## 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev            # http://localhost:5050
npm test               # unit tests (validation, sanitising, JWT, passwords, rate limiter)
```

MongoDB setup:
- **Local:** `docker run -d -p 27017:27017 --name docvise-mongo mongo:7` and keep `MONGO_URI=mongodb://127.0.0.1:27017/docvise_microsite`.
- **Atlas:** create a cluster and a database user, allow your server's IP, then paste the connection string into `MONGO_URI`.

The `enquiries` collection and its indexes are created automatically on the first submission.

### Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5050) |
| `MONGO_URI` | MongoDB connection string |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins allowed by CORS |
| `TRUST_PROXY` | `1` when behind a reverse proxy, so rate limiting sees real client IPs |
| `ENQUIRY_RATE_WINDOW_MINUTES`, `ENQUIRY_RATE_MAX` | Public form rate limit per IP (default 5 per 15 minutes) |
| `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Enable the admin API. Generate the hash with `npm run hash-password -- "a-strong-password"` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_FROM`, `NOTIFY_TO` | Optional email notification for each new enquiry. If SMTP isn't set or sending fails, the enquiry is still saved and the failure is logged without personal data. |

### API

| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/api/enquiries` | Public | Validated, sanitised, rate-limited, honeypot + minimum-fill-time anti-spam, duplicate guard (same email within 10 minutes) |
| POST | `/api/admin/login` | Public (rate-limited) | `{ email, password }` → `{ token }` (8-hour JWT, role `admin`) |
| GET | `/api/enquiries?page&limit&status&q` | Admin | Paginated list. There is no public listing. |
| GET | `/api/enquiries/:id` | Admin | |
| PATCH | `/api/enquiries/:id` | Admin | `{ status: new\|contacted\|qualified\|closed\|spam, adminNotes }` |
| GET | `/api/health` | Public | Liveness + DB state |

Stored fields: name, company, designation, email, phone, message, status, source (`DocVise Microsite`), adminNotes, createdAt, updatedAt. IP addresses are not stored. The form explicitly refuses patient or health information.

Test the API:

```bash
curl -X POST http://localhost:5050/api/enquiries -H "Content-Type: application/json" \
  -d '{"name":"Priya Sharma","company":"Acme Pharma","designation":"Brand Manager","email":"priya@acmepharma.com","phone":"+91 98765 43210","message":"Please arrange a demo","elapsedMs":8000}'

TOKEN=$(curl -s -X POST http://localhost:5050/api/admin/login -H "Content-Type: application/json" \
  -d '{"email":"YOUR_ADMIN_EMAIL","password":"YOUR_PASSWORD"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
curl http://localhost:5050/api/enquiries -H "Authorization: Bearer $TOKEN"
curl -X PATCH http://localhost:5050/api/enquiries/<id> -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"status":"contacted"}'
```

(`elapsedMs` is sent automatically by the website form. Submissions completed in under 2.5 seconds are treated as bots and silently discarded.)

## 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173 (proxies /api to the backend)
npm run build          # production build in frontend/dist
npm run preview
```

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Public URL, used for the canonical link, Open Graph tags, structured data, `sitemap.xml` and `robots.txt` |
| `VITE_API_URL` | API base URL. Leave empty if the API is served on the same domain under `/api`. |
| `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE` | Optional public contact details. While empty, the Contact link and legal pages point visitors to the contact form. |

## 3. Deployment

- **Frontend:** `npm run build`, then host `frontend/dist` on any static host (Netlify, Vercel, S3 + CloudFront, Nginx). Set `VITE_SITE_URL` and `VITE_API_URL` before building.
- **Backend:** run `npm start` on a Node host (Render, Railway, EC2, a VPS behind Nginx) with `NODE_ENV=production`, the production `MONGO_URI`, `ALLOWED_ORIGINS=https://your-domain`, and `TRUST_PROXY=1` when behind a proxy.
- **Same-domain option:** proxy `/api` from your web server to the Node process and leave `VITE_API_URL` empty.
- **Multiple instances:** the built-in rate limiter is in-memory per instance. Back it with Redis if you scale out.

## Content notes

- **Sample data:** the interactive demo uses pre-built sample PDFs in `frontend/public/samples` (Marathi, Hindi, Tamil, English). It never calls an AI service or WhatsApp. Dashboard figures are illustrative and labelled as sample data.
- **Translations:** Marathi text is exactly as supplied. Hindi and Tamil demo text should be reviewed by native speakers before launch.
- **Legal:** the Privacy Policy and Terms (`frontend/src/data/legal.js`) are a sensible draft. Have them reviewed by legal counsel.
- **QR codes:** the QR artwork on the tent card is decorative and does not scan. Replace it once the production WhatsApp number is live.
- **Fonts:** headings use Poppins, body text uses Inter, and Indian-language text uses Noto Sans Devanagari / Noto Sans Tamil, all loaded from Google Fonts. Self-host them if you prefer no third-party requests.
