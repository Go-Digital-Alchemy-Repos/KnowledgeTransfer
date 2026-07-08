# Knowledge Transfer Inc.

Full-stack React, Node, and Express coming-soon site for Knowledge Transfer Inc.

## Local Development

```bash
npm install
npm run dev
```

The React app runs on `http://localhost:5173` and proxies API requests to the Express server on `http://localhost:3001`.

## Production

```bash
npm run build
npm start
```

The Express server serves the built React app from `dist/` and exposes the contact API at `/api/contact`.

## Environment

Copy `.env.example` to `.env` for local configuration.

`CONTACT_TO` defaults to `mike@godigitalalchemy.com`.

Email delivery requires SMTP settings:

```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

When `DATABASE_URL` is present, the server creates a `contact_submissions` table and stores contact form submissions in Postgres.
