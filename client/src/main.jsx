import { StrictMode, useEffect, useState, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { ToastProvider, useToast } from "./components/Toast";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { QuoteCard } from "./components/QuoteCard";
import { QuoteModal } from "./components/QuoteModal";
import { ExportModal } from "./components/ExportModal";
import { AuthPage } from "./components/AuthPage";
import {
  IconSearch,
  IconPlus,
  IconGrid,
  IconList,
  IconHeart,
  IconX,
  IconQuote
} from "./components/Icons";

const API_ROOT = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "/api");
const API_URL = `${API_ROOT}/quotes`;
const AUTH_URL = `${API_ROOT}/auth`;
const HEALTH_URL = `${API_ROOT}/health`;

const DEMO_QUOTES = [
  {
    _id: "demo-1",
    text: "Simplicity is the prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    category: "Engineering",
    createdAt: new Date().toISOString()
  },
  {
    _id: "demo-2",
    text: "The details are not the details. They make the design.",
    author: "Charles Eames",
    category: "Design",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: "demo-3",
    text: "Focusing is about saying No.",
    author: "Steve Jobs",
    category: "Leadership",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: "demo-4",
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    category: "Philosophy",
    createdAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    _id: "demo-5",
    text: "Continuous improvement is better than delayed perfection.",
    author: "Mark Twain",
    category: "Business",
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    _id: "demo-6",
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Inspiration",
    createdAt: new Date(Date.now() - 18000000).toISOString()
  }
];

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return { message: `Server returned ${response.status}.` };
}

function MainApp() {
  const { addToast } = useToast();

  // Session & Auth
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quoteSession") || "null");
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("quoteTheme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  // App Data
  const [quotes, setQuotes] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quoteFavorites") || "[]");
    } catch {
      return [];
    }
  });
  const [featuredQuote, setFeaturedQuote] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState("checking");
  const [databaseMessage, setDatabaseMessage] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Controls & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("quoteTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const checkDatabase = useCallback(async () => {
    setDatabaseStatus("checking");
    try {
      const response = await fetch(HEALTH_URL);
      const data = await response.json();
      if (response.ok && data.connected) {
        setDatabaseStatus("connected");
        setDatabaseMessage("");
      } else {
        setDatabaseStatus("disconnected");
        setDatabaseMessage(data.message || "Database unreachable");
      }
    } catch (err) {
      setDatabaseStatus("disconnected");
      setDatabaseMessage("Cannot reach API server");
    }
  }, []);

  const fetchQuotes = useCallback(async () => {
    if (isDemoMode) {
      setQuotes(DEMO_QUOTES);
      setFeaturedQuote(DEMO_QUOTES[0]);
      return;
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load quotes");
      const data = await response.json();
      setQuotes(data);
      if (data.length > 0 && !featuredQuote) {
        setFeaturedQuote(data[Math.floor(Math.random() * data.length)]);
      }
    } catch (err) {
      if (quotes.length === 0) {
        setQuotes(DEMO_QUOTES);
        setFeaturedQuote(DEMO_QUOTES[0]);
      }
    }
  }, [isDemoMode, featuredQuote, quotes.length]);

  useEffect(() => {
    checkDatabase();
    fetchQuotes();
  }, [checkDatabase, fetchQuotes]);

  // Global search keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById("pro-search-input");
        if (input) input.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("quoteFavorites", JSON.stringify(updated));
      return updated;
    });
  };

  const shuffleFeatured = () => {
    if (quotes.length === 0) return;
    const pool = quotes.filter((q) => q._id !== featuredQuote?._id);
    const chosen = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : quotes[0];
    setFeaturedQuote(chosen);
    addToast("Selected a new featured quote", "info");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsAuthSubmitting(true);
    setAuthMessage("");

    const endpoint = authMode === "login" ? "login" : "register";
    try {
      const response = await fetch(`${AUTH_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm)
      });
      const data = await readResponse(response);

      if (!response.ok) {
        setAuthMessage(data.message || "Authentication failed.");
        setIsAuthSubmitting(false);
        return;
      }

      localStorage.setItem("quoteSession", JSON.stringify(data));
      setSession(data);
      setIsDemoMode(false);
      setAuthForm({ name: "", email: "", password: "" });
      addToast(authMode === "login" ? `Signed in as ${data.user.name || "User"}` : "Account created successfully!", "success");
      fetchQuotes();
    } catch (err) {
      setAuthMessage("Could not reach API server. Use Demo Mode to preview.");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("quoteSession");
    setSession(null);
    setIsDemoMode(false);
    addToast("Signed out", "info");
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setSession({
      token: "demo-token",
      user: {
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@quote.collector",
        role: "user"
      }
    });
    setQuotes(DEMO_QUOTES);
    setFeaturedQuote(DEMO_QUOTES[0]);
    addToast("Entered Demo Workspace", "info");
  };

  const handleSaveQuote = async (formData) => {
    if (isDemoMode) {
      if (editingQuote) {
        setQuotes((prev) =>
          prev.map((q) => (q._id === editingQuote._id ? { ...q, ...formData } : q))
        );
        addToast("Quote updated (Demo Mode)", "success");
      } else {
        const newQ = {
          _id: `demo-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString()
        };
        setQuotes((prev) => [newQ, ...prev]);
        addToast("Quote added to library", "success");
      }
      return;
    }

    const method = editingQuote ? "PUT" : "POST";
    const url = editingQuote ? `${API_URL}/${editingQuote._id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await readResponse(response);

      if (!response.ok) {
        addToast(data.message || "Failed to save quote", "error");
        return;
      }

      addToast(editingQuote ? "Quote updated" : "Quote created", "success");
      fetchQuotes();
    } catch (err) {
      addToast("Network error while saving quote.", "error");
    }
  };

  const handleDeleteQuote = async (id) => {
    if (isDemoMode) {
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      addToast("Quote deleted", "info");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.token}` }
      });

      if (response.ok) {
        setQuotes((prev) => prev.filter((q) => q._id !== id));
        addToast("Quote deleted", "info");
      } else {
        const data = await readResponse(response);
        addToast(data.message || "Could not delete quote", "error");
      }
    } catch (err) {
      addToast("Network error while deleting quote.", "error");
    }
  };

  const allCategories = useMemo(() => {
    const set = new Set();
    quotes.forEach((q) => {
      if (q.category && q.category.trim()) set.add(q.category.trim());
    });
    return Array.from(set).sort();
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        q.text?.toLowerCase().includes(query) ||
        q.author?.toLowerCase().includes(query) ||
        q.category?.toLowerCase().includes(query);

      const matchCategory =
        selectedCategory === "All" ||
        (q.category && q.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchFav = !showOnlyFavorites || favorites.includes(q._id);

      return matchSearch && matchCategory && matchFav;
    }).sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "author") return (a.author || "").localeCompare(b.author || "");
      if (sortBy === "length") return (b.text?.length || 0) - (a.text?.length || 0);
      return 0;
    });
  }, [quotes, searchTerm, selectedCategory, showOnlyFavorites, favorites, sortBy]);

  if (!session) {
    return (
      <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        onSubmitAuth={handleAuthSubmit}
        isSubmitting={isAuthSubmitting}
        message={authMessage}
        databaseStatus={databaseStatus}
        databaseMessage={databaseMessage}
        onCheckDatabase={checkDatabase}
        onEnterDemoMode={enterDemoMode}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="pro-app">
      {/* Top Navbar */}
      <Navbar
        user={session.user}
        databaseStatus={databaseStatus}
        onCheckDatabase={checkDatabase}
        onOpenCreate={() => { setEditingQuote(null); setIsModalOpen(true); }}
        onInspireMe={shuffleFeatured}
        onOpenExport={() => setIsExportOpen(true)}
        onSignOut={handleSignOut}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="pro-main">
        {/* Header & Stats Banner */}
        <HeroSection
          user={session.user}
          quotes={quotes}
          featuredQuote={featuredQuote}
          onSelectFeatured={shuffleFeatured}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpenCreate={() => { setEditingQuote(null); setIsModalOpen(true); }}
        />

        {/* Search & Filter Toolbar */}
        <section className="pro-toolbar">
          <div className="pro-toolbar-top">
            <div className="pro-search-box">
              <IconSearch className="pro-search-icon" />
              <input
                id="pro-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search quotes, authors, categories... (Ctrl+K)"
                className="pro-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="pro-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="pro-tools-group">
              <button
                type="button"
                className={`pro-btn-secondary ${showOnlyFavorites ? "active-fav-filter" : ""}`}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                title="Filter favorites"
              >
                <IconHeart className="w-3.5 h-3.5" fill={showOnlyFavorites} />
                <span>Favorites {favorites.length > 0 && `(${favorites.length})`}</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pro-select"
                aria-label="Sort options"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="author">Author (A-Z)</option>
                <option value="length">Length</option>
              </select>

              <div className="pro-view-switch">
                <button
                  type="button"
                  className={`pro-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <IconGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={`pro-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <IconList className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Tab Row */}
          <div className="pro-category-tabs">
            <button
              type="button"
              className={`pro-cat-tab ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All")}
            >
              All Quotes <span className="cat-count">{quotes.length}</span>
            </button>

            {allCategories.map((cat) => {
              const count = quotes.filter((q) => q.category?.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`pro-cat-tab ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} <span className="cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quotes Display Section */}
        <section className="pro-quotes-section">
          <div className="pro-section-header">
            <h2 className="pro-section-title">
              {selectedCategory === "All" ? "Quotes Library" : `${selectedCategory}`}
            </h2>
            <span className="pro-section-count">
              {filteredQuotes.length} {filteredQuotes.length === 1 ? "quote" : "quotes"}
            </span>
          </div>

          {filteredQuotes.length > 0 ? (
            <div className={viewMode === "grid" ? "pro-grid" : "pro-list"}>
              {filteredQuotes.map((quote) => (
                <QuoteCard
                  key={quote._id}
                  quote={quote}
                  isFavorite={favorites.includes(quote._id)}
                  onToggleFavorite={toggleFavorite}
                  onEdit={(q) => { setEditingQuote(q); setIsModalOpen(true); }}
                  onDelete={handleDeleteQuote}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="pro-empty-card">
              <h3>No quotes found</h3>
              <p>
                {searchTerm || selectedCategory !== "All" || showOnlyFavorites
                  ? "No results matched your search or active filter."
                  : "Start populating your vault by adding your first quote."}
              </p>
              <div className="pro-empty-actions">
                {(searchTerm || selectedCategory !== "All" || showOnlyFavorites) && (
                  <button
                    type="button"
                    className="pro-btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setShowOnlyFavorites(false);
                    }}
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  type="button"
                  className="pro-btn-primary"
                  onClick={() => { setEditingQuote(null); setIsModalOpen(true); }}
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  <span>Add Quote</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Quote Create/Edit Modal */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuote}
        editingQuote={editingQuote}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        quotes={quotes}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);