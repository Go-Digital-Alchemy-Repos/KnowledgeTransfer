import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import logoUrl from "../assets/knowledge-transfer-logo.svg";
import heroUrl from "../assets/knowledge-hero.png";
import { navItems, siteContent } from "./content";

const routes = ["/", "/services", "/process", "/about", "/contact", "/privacy"];

const initialForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  message: "",
};

function getRoute(pathname) {
  return routes.includes(pathname) ? pathname : "/";
}

function useRoute() {
  const [route, setRoute] = useState(() => getRoute(window.location.pathname));

  useEffect(() => {
    function handlePopState() {
      setRoute(getRoute(window.location.pathname));
      window.scrollTo({ top: 0 });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(href) {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.history.pushState({}, "", href);
    setRoute(getRoute(href));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { route, navigate };
}

function App() {
  const { route, navigate } = useRoute();
  const pageTitle = useMemo(() => {
    const titles = {
      "/": "Knowledge Transfer Inc. | Business Continuity Consulting",
      "/services": "Services | Knowledge Transfer Inc.",
      "/process": "Process | Knowledge Transfer Inc.",
      "/about": "About | Knowledge Transfer Inc.",
      "/contact": "Contact | Knowledge Transfer Inc.",
      "/privacy": "Privacy Policy | Knowledge Transfer Inc.",
    };

    return titles[route] || titles["/"];
  }, [route]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="app-shell">
      <SiteHeader route={route} navigate={navigate} />
      <main className="page-shell" aria-labelledby="page-title">
        {route === "/" ? <HomePage navigate={navigate} /> : null}
        {route === "/services" ? <ServicesPage navigate={navigate} /> : null}
        {route === "/process" ? <ProcessPage navigate={navigate} /> : null}
        {route === "/about" ? <AboutPage navigate={navigate} /> : null}
        {route === "/contact" ? <ContactPage /> : null}
        {route === "/privacy" ? <PrivacyPage /> : null}
      </main>
      <SiteFooter navigate={navigate} />
    </div>
  );
}

function SiteHeader({ route, navigate }) {
  return (
    <header className="site-header">
      <PageLink className="brand" href="/" navigate={navigate} ariaLabel="Knowledge Transfer Inc. home">
        <img className="brand-logo" src={logoUrl} alt="" />
        <span>Knowledge Transfer Inc.</span>
      </PageLink>

      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <PageLink
            key={item.href}
            className={route === item.href ? "nav-link nav-link-active" : "nav-link"}
            href={item.href}
            navigate={navigate}
          >
            {item.label}
          </PageLink>
        ))}
      </nav>

      <PageLink className="nav-cta" href="/contact" navigate={navigate}>
        Start
      </PageLink>
    </header>
  );
}

function SiteFooter({ navigate }) {
  return (
    <footer className="site-footer">
      <div>
        <PageLink className="footer-brand" href="/" navigate={navigate}>
          Knowledge Transfer Inc.
        </PageLink>
        <p>Practical knowledge-transfer strategies for succession, turnover, and growth.</p>
      </div>
      <div className="footer-links">
        <PageLink href="/services" navigate={navigate}>Services</PageLink>
        <PageLink href="/process" navigate={navigate}>Process</PageLink>
        <PageLink href="/contact" navigate={navigate}>Contact</PageLink>
        <PageLink href="/privacy" navigate={navigate}>Privacy</PageLink>
      </div>
    </footer>
  );
}

function PageLink({ href, navigate, children, className, ariaLabel }) {
  function handleClick(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    navigate(href);
  }

  return (
    <a className={className} href={href} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </a>
  );
}

function HomePage({ navigate }) {
  const content = siteContent.home;

  return (
    <>
      <section className="hero">
        <div className="hero-texture" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 id="page-title">{content.title}</h1>
            <p className="intro">{content.intro}</p>

            <div className="hero-actions" aria-label="Primary actions">
              <PageLink className="primary-link" href={content.primaryCta.href} navigate={navigate}>
                {content.primaryCta.label}
              </PageLink>
              <PageLink className="secondary-link" href={content.secondaryCta.href} navigate={navigate}>
                {content.secondaryCta.label}
              </PageLink>
            </div>
          </div>

          <TransferMap signals={content.signals} />
        </div>
      </section>

      <section className="problem-strip">
        <SectionIntro eyebrow={content.problem.eyebrow} title={content.problem.title} body={content.problem.body} />
        <SectionIntro eyebrow={content.solution.eyebrow} title={content.solution.title} body={content.solution.body} />
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Outcomes" title="Turn employee knowledge into a transferable business asset." />
        <div className="card-grid">
          {content.outcomes.map((outcome) => (
            <InfoCard key={outcome.title} title={outcome.title} body={outcome.body} />
          ))}
        </div>
      </section>

      <CtaBand title={content.cta.title} body={content.cta.body} label={content.cta.label} href={content.cta.href} navigate={navigate} />
    </>
  );
}

function ServicesPage({ navigate }) {
  const content = siteContent.services;

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <section className="content-section service-section">
        <div className="service-list">
          {content.items.map((service, index) => (
            <article className="wide-card" key={service.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{service.title}</h2>
                <p>{service.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title={content.cta} label="Talk with us" href="/contact" navigate={navigate} />
    </>
  );
}

function ProcessPage({ navigate }) {
  const content = siteContent.process;

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <section className="content-section process-section">
        <div className="pipeline-intro" aria-hidden="true">
          <span>Knowledge risk</span>
          <strong>Continuity pipeline</strong>
          <span>Operational continuity</span>
        </div>
        <div className="process-pipeline">
          {content.steps.map((step, index) => (
            <article className="pipeline-step" key={step.title}>
              <div className="pipeline-node" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="pipeline-card">
                <div className="pipeline-card-header">
                  <span>{step.meta}</span>
                  <strong>{step.label}</strong>
                </div>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
                <div className="deliverable">
                  <span>Deliverable</span>
                  <strong>{step.deliverable}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title={content.cta} label="Plan a transfer strategy" href="/contact" navigate={navigate} />
    </>
  );
}

function AboutPage({ navigate }) {
  const content = siteContent.about;

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <section className="content-section narrative-section">
        <div className="narrative-card">
          <p>{content.body}</p>
        </div>
      </section>
      <section className="content-section section-tight">
        <SectionHeading eyebrow="Values" title="Practical knowledge-transfer work for real businesses." />
        <div className="card-grid">
          {content.values.map((value) => (
            <InfoCard key={value.title} title={value.title} body={value.body} />
          ))}
        </div>
      </section>
      <CtaBand title={content.cta} label="Start planning" href="/contact" navigate={navigate} />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero eyebrow={siteContent.contact.eyebrow} title={siteContent.contact.title} intro={siteContent.contact.intro} />
      <ContactSection />
    </>
  );
}

function PrivacyPage() {
  const content = siteContent.privacy;

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <section className="content-section privacy-list">
        {content.sections.map((section) => (
          <article className="policy-block" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, intro }) {
  return (
    <section className="page-hero">
      <div className="page-hero-art" style={{ "--hero-image": `url(${heroUrl})` }} aria-hidden="true" />
      <div className="page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="page-title">{title}</h1>
        <p className="intro">{intro}</p>
      </div>
    </section>
  );
}

function TransferMap({ signals }) {
  return (
    <aside className="transfer-map" aria-label="Knowledge transfer operating map">
      <div className="map-grid" aria-hidden="true" />
      <div className="map-header">
        <span>Continuity map</span>
        <strong>Risk to readiness</strong>
      </div>
      <div className="map-flow">
        <div className="map-node node-source">
          <span>Outbound role</span>
          <strong>Expertise</strong>
        </div>
        <div className="map-line" />
        <div className="map-node node-center">
          <span>Transfer strategy</span>
          <strong>Process + Data + Context</strong>
        </div>
        <div className="map-line" />
        <div className="map-node node-target">
          <span>Incoming team</span>
          <strong>Continuity</strong>
        </div>
      </div>
      <div className="map-signals">
        {signals.map((signal, index) => (
          <div key={signal}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{signal}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function SectionIntro({ eyebrow, title, body }) {
  return (
    <article>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function InfoCard({ title, body }) {
  return (
    <article className="info-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function CtaBand({ title, body, label, href, navigate }) {
  return (
    <section className="cta-band">
      <div>
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      <PageLink className="primary-link" href={href} navigate={navigate}>
        {label}
      </PageLink>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const content = siteContent.contact;

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
      setStatus({
        type: "success",
        message: result.emailSent ? "Thanks. Your message has been sent." : content.success,
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-inner">
        <div className="contact-copy">
          <p className="eyebrow">Get in touch</p>
          <h2 id="contact-title">{content.title}</h2>
          <p>{content.formIntro}</p>
          <div className="next-step">
            <h3>What happens next</h3>
            <p>{content.next}</p>
          </div>
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
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder={content.messagePlaceholder}
              value={form.message}
              onChange={updateField}
              required
            />
          </div>

          <p className="privacy-note">
            By submitting this form, you agree that Knowledge Transfer Inc. may use your information to respond to your inquiry.
          </p>

          <div className="form-actions">
            <button type="submit" disabled={status.type === "loading"}>
              {status.type === "loading" ? "Sending..." : content.submitLabel}
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
  );
}

createRoot(document.querySelector("#root")).render(<App />);
