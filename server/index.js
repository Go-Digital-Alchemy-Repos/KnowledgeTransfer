import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import pg from "pg";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const port = process.env.PORT || 3001;
const contactRecipient = process.env.CONTACT_TO || "mike@godigitalalchemy.com";
const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl
  ? new pg.Pool({
      connectionString: databaseUrl,
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
    })
  : null;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function getRequiredString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactPayload(payload) {
  const name = getRequiredString(payload.name);
  const company = getRequiredString(payload.company);
  const phone = getRequiredString(payload.phone);
  const email = getRequiredString(payload.email);
  const message = getRequiredString(payload.message);

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  return {
    data: {
      name,
      company,
      phone,
      email,
      message,
    },
  };
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });
}

async function ensureDatabase() {
  if (!pool) {
    return;
  }

  await pool.query(`
    create table if not exists contact_submissions (
      id bigserial primary key,
      name text not null,
      company text,
      phone text,
      email text not null,
      message text not null,
      created_at timestamptz not null default now()
    )
  `);
}

async function saveContactSubmission({ name, company, phone, email, message }) {
  if (!pool) {
    return;
  }

  await pool.query(
    `
      insert into contact_submissions (name, company, phone, email, message)
      values ($1, $2, $3, $4, $5)
    `,
    [name, company || null, phone || null, email, message],
  );
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, database: Boolean(pool) });
});

app.post("/api/contact", async (request, response) => {
  const validation = validateContactPayload(request.body || {});

  if (validation.error) {
    response.status(400).json({ error: validation.error });
    return;
  }

  const transport = createTransport();

  if (!transport) {
    response.status(503).json({
      error: "Email delivery is not configured yet. Add SMTP settings to the server environment.",
    });
    return;
  }

  const { name, company, phone, email, message } = validation.data;

  try {
    await saveContactSubmission(validation.data);

    await transport.sendMail({
      to: contactRecipient,
      from: process.env.MAIL_FROM || contactRecipient,
      replyTo: email,
      subject: "Knowledge Transfer Inc. website inquiry",
      text: [
        `Name: ${name}`,
        `Company: ${company || "Not provided"}`,
        `Phone: ${phone || "Not provided"}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
    });

    response.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed:", error);
    response.status(500).json({ error: "Unable to send message right now." });
  }
});

app.use(express.static(path.join(rootDir, "dist")));

app.get("*", (_request, response) => {
  response.sendFile(path.join(rootDir, "dist", "index.html"));
});

ensureDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Knowledge Transfer server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
