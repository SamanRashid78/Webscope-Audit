# AuditMetrics (Website Audit & Lead Generation Tool)

AuditMetrics scans any live website and produces a scored report across four categories; SEO, Security, Performance, and Website Health then auto-generates a client-ready outreach email based on the issues found. Built as a full-stack tool for freelancers/agencies to quickly audit prospects' sites and turn findings into a pitch.

## Features

- **Live site scanning** — fetches real HTML and HTTP headers from any URL (Node/Express + Axios + Cheerio)
- **4-category scoring** — SEO, Security & Headers, Performance & Speed, Website Health
- **Tech stack detection** — identifies CMS, frameworks, analytics, CDNs, and payment providers in use
- **Auto-generated outreach email** — turns audit findings into a ready-to-send client pitch
- **Competitor comparison** — audits two URLs side by side
- **Scan history** — revisit past audits
- **PDF export** — download a client-facing report
- **Hardened API** — SSRF protection, rate limiting, and restricted CORS

## Tech Stack

**Backend:** Node.js, Express, Axios, Cheerio
**Frontend:** Vanilla JS, HTML, CSS, Vite, Lucide Icons, jsPDF/html2canvas

## Project Structure
```
audit-metrics/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js                # UI controller, tab/theme/form wiring
│   ├── auditEngine.js        # calls the backend /api/audit endpoint
│   ├── presetData.js         # quick-sample preset audits
│   ├── techDetector.js
│   ├── seoAuditor.js
│   ├── securityAuditor.js
│   ├── perfAuditor.js
│   ├── healthAuditor.js
│   ├── leadGenerator.js
│   ├── competitorCompare.js
│   ├── historyManager.js
│   └── pdfExporter.js
├── server/
│   ├── index.js               # Express app & API routes
│   ├── package.json
│   └── services/
│       ├── auditEngine.js     # master audit coordinator
│       ├── urlValidator.js    # SSRF protection (URL/IP validation)
│       ├── techDetector.js
│       ├── seoAuditor.js
│       ├── securityAuditor.js
│       ├── perfAuditor.js
│       └── healthAuditor.js
├── screenshots/
├── .gitignore
├── LICENSE
└── README.md
```


## Screenshots

_See `/screenshots` folder._

## Getting Started

### Backend
```bash
cd server
npm install
node index.js
```
Runs on `http://localhost:5000`.

### Frontend
Open `client/index.html` directly in a browser, or serve it with Vite:
```bash
cd client
npm install
npm run dev
```

## Security

The `/api/audit` endpoint validates target URLs before fetching them to prevent **SSRF (Server-Side Request Forgery)**:
- Blocks requests to localhost, private IP ranges (10.x, 172.16–31.x, 192.168.x), and link-local/cloud-metadata addresses (169.254.x, including `169.254.169.254`)
- Resolves DNS before fetching, so a public domain that resolves to an internal IP is also blocked
- Only `http:`/`https:` protocols are allowed

The API also enforces rate limiting (20 requests / 15 min per IP) and restricts CORS to known frontend origins.

## License

MIT — see [LICENSE](./LICENSE)
