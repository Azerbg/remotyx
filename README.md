# Remotyx — website

Next.js 15 (App Router, TypeScript) site for Remotyx: home page with a 3-step request form, and pages for IT Support, Custom Development and Specialized Services. Requests are saved to MongoDB and confirmed by email (Resend).

## Pages

| Route | Content |
| --- | --- |
| `/` | Hero + request form, services, how it works, experts banner, support plans, FAQ |
| `/it-support` | IT Support page |
| `/development` | Custom Development page |
| `/specialized-services` | Specialized Services page |
| `/terms`, `/privacy` | Legal placeholders (replace before launch) |
| `POST /api/requests` | Validates and saves a request, sends emails |

All page text lives in `lib/content.ts`. Styles are in `app/globals.css` (colors at the top as CSS variables).

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `MONGODB_DB` | No | Database name (default `remotyx`) |
| `RESEND_API_KEY` | No | Enables emails; if empty, requests are saved without emails |
| `FROM_EMAIL` | With Resend | Sender on a domain verified in Resend, e.g. `Remotyx <hello@remotyx.com>` |
| `NOTIFY_EMAIL` | No | Your inbox for new-request alerts |
| `NEXT_PUBLIC_SITE_URL` | No | Public URL used in the sitemap (default `https://remotyx.com`) |

Requests are stored in the `requests` collection with `status: "new"`.

## Deploy on Vercel

1. Create a free cluster on MongoDB Atlas, a database user, and allow access from anywhere (`0.0.0.0/0`) under Network Access. Copy the connection string.
2. Push this folder to a GitHub repository.
3. On vercel.com: **Add New → Project**, import the repo, add the environment variables above, then **Deploy**.
4. In the Vercel project: **Settings → Domains**, add `remotyx.com` and `www.remotyx.com`, and set the DNS records Vercel shows you at your registrar. HTTPS is automatic.
5. In Resend, add and verify the `remotyx.com` domain (DNS records), then set `RESEND_API_KEY` and `FROM_EMAIL` in Vercel and redeploy.

## Before launch

- Replace every `[PRICE]` in `lib/content.ts`.
- Replace the Terms and Privacy placeholders.
- Update the contact addresses (`hello@remotyx.com`, `experts@remotyx.com`) if different.
- Add Google Search Console and your analytics tool.
