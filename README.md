# Carsgo v1.0 MVP Candidate

Carsgo v1.0 spojuje veřejný marketplace, AI hledání, Carsgo Score, uživatelské účty, soukromou inzerci, partner portal, admin, XML importy a první monetizační vrstvu.

## Produkční hardening v1.0
- rate limiting veřejných lead/auth endpointů
- HTTPS + hostname allowlist pro XML feedy
- bezpečnější validace uploadů
- kryptografické ověření Stripe webhook podpisu
- reálný checkout topování
- cookie consent UI
- privacy page
- sitemap + robots
- health endpoint
- Docker deployment
- smoke-test checklist

## Důležité před veřejným spuštěním
Toto je MVP candidate, ne bezpečnostní certifikace. Před zpracováním reálných plateb a osobních údajů je potřeba:
- nakonfigurovat produkční PostgreSQL
- změnit AUTH_SECRET a CRON_SECRET
- nakonfigurovat S3-compatible storage
- nastavit ALLOWED_FEED_HOSTS
- nastavit e-mail provider
- nastavit Stripe keys, webhook secret a Price IDs
- právně zkontrolovat GDPR/cookie texty
- přidat externí monitoring/logging
- provést dependency/security scan a E2E test na stagingu

## Start
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name v1_mvp
npm run prisma:seed
npm run dev
```

## Health
`GET /api/health`

## Smoke test
Viz `docs/SMOKE_TEST.md`.

## Co následuje po v1.0
v1.1 by měla být první iterace podle skutečných uživatelů: analytika funnelu, lepší relevance AI hledání, partner reporting, konverzní optimalizace a mobilní UX.
