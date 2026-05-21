# Granulyst Frontend

Signup page for Granulyst — AI-powered CVE monitoring tailored to your tech stack.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and set your n8n signup webhook URL:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-instance.cloud/webhook/signup
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

   Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to GitHub (this lives as a subfolder of the Granulyst repo).
2. In Vercel, import the Granulyst repo. Set the **Root Directory** to `granulyst-frontend` in project settings.
3. Add the environment variable in Vercel:
   - `NEXT_PUBLIC_WEBHOOK_URL` = your n8n production webhook URL
4. Deploy. Vercel auto-detects Next.js.

## How it works

The form collects email, name, and a comma-separated tech list, then POSTs to the n8n signup webhook with this payload:

```json
{
  "email": "alice@example.com",
  "name": "Alice",
  "tech_list": "openssl, react, log4j"
}
```

The n8n workflow creates a User record and corresponding Tech Stack rows in Airtable, registering the user for CVE monitoring. Alerts are delivered via Slack when CVEs matching the user's stack are detected by the Specialist workflow.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Plain CSS (no dependencies)
