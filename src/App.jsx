// src/App.jsx
import { useState, useMemo } from "react";
import "./App.css";

/**
 * QUICK CONFIG
 * - API_URL:     Your Flask API (Render) endpoint
 * - DEMO_BOOK_URL: Optional; if set, "Schedule a Demo" button will link here
 */
const API_URL = "https://sitesignal-api.onrender.com";
const DEMO_BOOK_URL = ""; // e.g. "https://cal.com/yourname/sitesignal-demo"

function App() {
  // --- UI State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const disableSubmit = useMemo(() => {
    return submitting || !form.name || !(form.phone || form.email);
  }, [submitting, form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const payload = {
        intent: "contractor-demo",
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        page_url: window.location.href,
        source: "react-demo",
      };

      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      setStatus({
        type: "success",
        msg: "Thanks! We received your info and just sent a confirmation.",
      });
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        msg:
          "Sorry—something went wrong submitting your info. Please try again or call us.",
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <img
              src="/sitesignal-logo.png"
              alt="SiteSignal"
              className="brand-logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="brand-title">SiteSignal</span>
          </div>

          <nav className="nav">
            <a href="https://sitesignal.net" target="_blank" rel="noreferrer">
              Website
            </a>
            <a href={`${API_URL}/admin/leads`} target="_blank" rel="noreferrer">
              Admin Leads
            </a>
            {DEMO_BOOK_URL ? (
              <a
                className="btn btn-primary"
                href={DEMO_BOOK_URL}
                target="_blank"
                rel="noreferrer"
              >
                Schedule a Demo
              </a>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() =>
                  alert(
                    "Set DEMO_BOOK_URL at the top of App.jsx to enable this."
                  )
                }
              >
                Schedule a Demo
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Never Miss a Job Again</h1>
          <p className="sub">
            SiteSignal answers, captures, and routes leads 24/7—so your crew can
            stay on the tools while we handle the inbox and phone.
          </p>
          <div className="hero-cta">
            <a
              className="btn btn-primary"
              href={DEMO_BOOK_URL || "#lead-form"}
              onClick={(e) => {
                if (!DEMO_BOOK_URL) {
                  e.preventDefault();
                  document.getElementById("lead-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              Get a Live Demo
            </a>
            <a
              className="btn btn-ghost"
              href={`${API_URL}/health`}
              target="_blank"
              rel="noreferrer"
            >
              API Status
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          <Feature
            title="Instant Replies"
            text="AI receptionist responds in seconds on web & SMS—no more missed leads."
          />
          <Feature
            title="Smart Routing"
            text="Leads emailed, logged, and optionally pushed to Slack/Sheets."
          />
          <Feature
            title="Book More Jobs"
            text="Guided flows qualify prospects and collect details upfront."
          />
        </div>
      </section>

      {/* Lead Form */}
      <section className="lead" id="lead-form">
        <div className="card">
          <h2>See SiteSignal in Action</h2>
          <p className="muted">
            Tell us a bit about your business and we’ll send a live demo.
          </p>

          {status.type && (
            <div
              className={`alert ${
                status.type === "success" ? "alert-ok" : "alert-err"
              }`}
              role="status"
            >
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="grid">
              <div className="field">
                <label htmlFor="name">Name*</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Jane Contractor"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="(555) 123-4567"
                  inputMode="tel"
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="message">What do you need help with?</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={onChange}
                placeholder="e.g., We miss calls during jobs. Want web chat + SMS that books jobs automatically."
              />
            </div>

            <button className="btn btn-primary w-full" disabled={disableSubmit}>
              {submitting ? "Submitting…" : "Request Demo"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} SiteSignal — All rights reserved.</p>
      </footer>
    </>
  );
}

function Feature({ title, text }) {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </div>
  );
}

export default App;

