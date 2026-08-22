import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_ROOT = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "/api");
const API_URL = `${API_ROOT}/quotes`;
const AUTH_URL = `${API_ROOT}/auth`;
const HEALTH_URL = `${API_ROOT}/health`;
const emptyForm = { text: "", author: "", category: "" };
const emptyAuthForm = { name: "", email: "", password: "" };

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return { message: `Server returned ${response.status}. Check the Vercel API deployment.` };
}

function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("quoteSession") || "null"));
  const [quotes, setQuotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [databaseStatus, setDatabaseStatus] = useState("checking");

  useEffect(() => {
    fetchQuotes();
    checkDatabase();
  }, []);

  async function checkDatabase() {
    try {
      const response = await fetch(HEALTH_URL);
      setDatabaseStatus(response.ok && (await response.json()).connected ? "connected" : "disconnected");
    } catch (error) {
      setDatabaseStatus("disconnected");
    }
  }

  async function fetchQuotes() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load quotes");
      setQuotes(await response.json());
    } catch (error) {
      setMessage("Start the API server and connect MongoDB to load quotes.");
    }
  }

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function saveQuote(event) {
    event.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
      body: JSON.stringify(form)
    });
    const data = await readResponse(response);
    if (!response.ok) return setMessage(data.message || "Could not save quote");
    setForm(emptyForm);
    setEditingId(null);
    setMessage(editingId ? "Quote updated." : "Quote added.");
    fetchQuotes();
  }

  async function deleteQuote(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${session.token}` } });
    if (response.ok) {
      setQuotes(quotes.filter((quote) => quote._id !== id));
      setMessage("Quote deleted.");
    }
  }

  function startEditing(quote) {
    setEditingId(quote._id);
    setForm({ text: quote.text, author: quote.author, category: quote.category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitAuth(event) {
    event.preventDefault();
    const endpoint = authMode === "login" ? "login" : "register";
    const response = await fetch(`${AUTH_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm)
    });
    const data = await readResponse(response);
    if (!response.ok) return setMessage(data.message || "Could not authenticate");
    localStorage.setItem("quoteSession", JSON.stringify(data));
    setSession(data);
    setAuthForm(emptyAuthForm);
    setMessage("");
  }

  function updateAuthForm(event) {
    setAuthForm({ ...authForm, [event.target.name]: event.target.value });
  }

  function signOut() {
    localStorage.removeItem("quoteSession");
    setSession(null);
    setForm(emptyForm);
    setEditingId(null);
  }

  if (!session) {
    return <main className="auth-page"><section className="auth-card"><div className="brand"><span className="brand-mark">Q</span><span>Quote Collector</span></div><p className="eyebrow">Personal library</p><h1>{authMode === "login" ? "Welcome back." : "Create your account."}</h1><p className="auth-description">{authMode === "login" ? "Sign in to manage your collection." : "Start saving the words that matter to you."}</p><div className={`database-status ${databaseStatus}`}><span className="status-dot" /> Database {databaseStatus === "checking" ? "checking..." : databaseStatus === "connected" ? "connected" : "not connected"}</div><form onSubmit={submitAuth}>{authMode === "register" && <label>Full name<input name="name" value={authForm.name} onChange={updateAuthForm} required placeholder="Your name" /></label>}<label>Email<input type="email" name="email" value={authForm.email} onChange={updateAuthForm} required placeholder="you@example.com" /></label><label>Password<input type="password" name="password" value={authForm.password} onChange={updateAuthForm} required minLength="6" placeholder="At least 6 characters" /></label><button type="submit">{authMode === "login" ? "Sign in" : "Create account"}</button></form>{message && <p className="message">{message}</p>}<button className="switch-auth" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setMessage(""); }}>{authMode === "login" ? "Need an account? Create one" : "Already have an account? Sign in"}</button></section></main>;
  }

  const categories = [...new Set(quotes.map((quote) => quote.category))];
  const visibleQuotes = quotes.filter((quote) => {
    const matchesSearch = `${quote.text} ${quote.author} ${quote.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All categories" || quote.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const latestQuote = quotes[0];

  return (
    <main className="page">
      <header className="intro">
        <div className="brand"><span className="brand-mark">Q</span><span>Quote Collector</span></div>
        <div className="header-right"><span className={`status-dot ${databaseStatus}`} /> Database {databaseStatus === "connected" ? "connected" : databaseStatus === "checking" ? "checking..." : "not connected"} · {session.user.role}<button className="logout" onClick={signOut}>Sign out</button></div>
      </header>

      <section className="welcome">
        <div><p className="eyebrow">Your collection</p><h1>Ideas worth<br /><span>remembering.</span></h1><p className="description">Save the words that inspire you, one quote at a time.</p></div>
        <div className="summary"><strong>{quotes.length}</strong><span>Saved quotes</span></div>
      </section>

      {latestQuote && <section className="featured-quote"><div><p className="eyebrow">Latest addition</p><p className="featured-text">“{latestQuote.text}”</p><span className="featured-author">— {latestQuote.author}</span></div><div className="featured-detail"><strong>{categories.length}</strong><span>Categories</span></div></section>}

      <section className="workspace">
        <form className="quote-form" onSubmit={saveQuote}>
          <div className="form-heading">
            <span>{editingId ? "Edit quote" : "Add a quote"}</span>
            <span className="form-number">{editingId ? "Editing" : "New"}</span>
          </div>
          <label>Quote<textarea name="text" value={form.text} onChange={updateForm} required placeholder="Write the quote here" /></label>
          <label>Author<input name="author" value={form.author} onChange={updateForm} required placeholder="Author name" /></label>
          <label>Category<input name="category" value={form.category} onChange={updateForm} required placeholder="Example: Motivation" /></label>
          <div className="form-actions">
            <button type="submit">{editingId ? "Save changes" : "Add quote"}</button>
            {editingId && <button type="button" className="cancel" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
          {message && <p className="message">{message}</p>}
        </form>

        <section className="quote-list">
          <div className="list-heading"><div><p className="eyebrow">Library</p><h2>Saved quotes</h2></div><div className="list-tools"><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><input className="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search quotes" /></div></div>
          {quotes.length === 0 ? <p className="empty">No quotes yet. Add one using the form.</p> : visibleQuotes.length === 0 ? <p className="empty">No quotes match your search.</p> : visibleQuotes.map((quote) => (
            <article className="quote" key={quote._id}>
              <p className="quote-text">“{quote.text}”</p>
              <div className="quote-meta"><span>— {quote.author}</span><span className="category">{quote.category}</span></div>
              <div className="quote-actions"><button onClick={() => startEditing(quote)}>Edit</button><button onClick={() => deleteQuote(quote._id)}>Delete</button></div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);