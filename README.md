# DocVise Microsite

A single-page marketing microsite for **DocVise** (a digiLATERAL offering).

- **Frontend:** React + Vite + Tailwind CSS v4, Lucide icons, Framer Motion
- **Backend:** Node.js + Express API for demo-request validation and SMTP email delivery
- **Storage:** None. Demo enquiries are emailed directly and are not saved to a database.

## Backend

Requirements: Node.js 18.18+ (20 LTS recommended).

```bash
cd backend
cp .env.example .env
npm install
npm run dev            # http://localhost:5050
npm test
```

### Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5050) |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins allowed by CORS |
| `TRUST_PROXY` | Set to `1` behind a reverse proxy, so rate limiting sees client IPs |
| `ENQUIRY_RATE_WINDOW_MINUTES`, `ENQUIRY_RATE_MAX` | Rate limit (default 5 submissions per IP per 15 minutes) |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `NOTIFY_TO` | SMTP email configuration. Supports legacy `SMTP_*` aliases. Hostinger defaults: `smtp.hostinger.com:465`, secure. Recipient defaults to `info@digilateral.com`. |

Put SMTP credentials in the private `backend/.env`; never commit them. The API returns success only after Nodemailer reports successful delivery. If SMTP is missing or fails, the form receives an error response and can retry. Requests completed too quickly or containing the honeypot field are silently discarded as spam.

### API

| Method | Route | Notes |
|---|---|---|
| POST | `/api/enquiries` | Validates/sanitises request, applies rate limit and anti-spam checks, then emails the demo request. No persistence. |
| GET | `/api/health` | API liveness check. |

Example:

```bash
curl -X POST http://localhost:5050/api/enquiries -H "Content-Type: application/json" \
  -d '{"name":"Priya Sharma","company":"Acme Pharma","designation":"Brand Manager","email":"priya@acmepharma.com","phone":"+91 98765 43210","message":"Please arrange a demo","elapsedMs":8000}'
```

The form sends `elapsedMs` automatically. Submissions completed in under 2.5 seconds are treated as bots. Patient/health information is not accepted in the message field.

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
npm run build
npm run preview
```

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Public URL for canonical, Open Graph, structured data, sitemap and robots |
| `VITE_API_URL` | API base URL; leave empty if same-domain proxy serves `/api` |
| `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE` | Optional public contact details |

## Deployment

- **Frontend:** Build `frontend` and host `frontend/dist` on a static host. Set `VITE_SITE_URL` and `VITE_API_URL` before building.
- **Backend:** Run `npm start` on a Node host with `NODE_ENV=production`, production `ALLOWED_ORIGINS`, and `TRUST_PROXY=1` if behind a proxy. Configure SMTP environment variables.
- **Same-domain:** Proxy `/api` to the Node server and leave `VITE_API_URL` empty.
- The in-memory rate limiter is per server instance; use a shared store if you deploy multiple instances.

## Content notes

- The interactive demo uses pre-built sample PDFs and does not call AI or WhatsApp.
- Dashboard figures are illustrative sample data.
- Review translations with native speakers before launch.
- Have Privacy Policy and Terms reviewed by legal counsel.
- Replace decorative QR art once the production WhatsApp number is live.
