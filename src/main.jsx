import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import logoUrl from "../assets/knowledge-transfer-logo.svg";
import heroUrl from "../assets/knowledge-hero.png";

const initialForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  message: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitContact(event) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Sending your message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send message right now.");
      }

      setForm(initialForm);
      setStatus({ type: "success", message: "Thanks. Your message has been sent." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  return (
    <main className="page-shell" aria-labelledby="page-title">
      <section className="hero" style={{ "--hero-image": `url(${heroUrl})` }}>
        <div className="brand">
          <img className="brand-logo" src={logoUrl} alt="Knowledge Transfer Inc. logo" />
          <span>Knowledge Transfer Inc.</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">Coming soon</p>
          <h1 id="page-title">Welcome to Knowledge Transfer Inc.</h1>
          <p className="intro">
            We are building a smarter way to capture expertise, share insight, and move knowledge forward.
          </p>
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner">
          <div className="contact-copy">
            <p className="eyebrow">Get in touch</p>
            <h2 id="contact-title">Start the conversation.</h2>
            <p>
              Tell us a little about your team, your company, and what knowledge you want to move forward.
            </p>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={updateField} required />
            </div>

            <div className="form-row">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" autoComplete="organization" value={form.company} onChange={updateField} />
            </div>

            <div className="form-row">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={updateField} />
            </div>

            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} required />
            </div>

            <div className="form-row form-row-full">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" value={form.message} onChange={updateField} required />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={status.type === "loading"}>
                {status.type === "loading" ? "Sending..." : "Send message"}
              </button>
              {status.message ? (
                <p className={`form-status form-status-${status.type}`} role="status">
                  {status.message}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

createRoot(document.querySelector("#root")).render(<App />);
