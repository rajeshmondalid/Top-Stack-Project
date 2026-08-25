import React, { useState } from "react";
import {
  IconQuote,
  IconCopy,
  IconCheck,
  IconHeart,
  IconShuffle,
  IconTag,
  IconPlus
} from "./Icons";
import { useToast } from "./Toast";

export function HeroSection({
  user,
  quotes = [],
  featuredQuote,
  onSelectFeatured,
  favorites = [],
  onToggleFavorite,
  onOpenCreate
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const categories = [...new Set(quotes.map((q) => q.category).filter(Boolean))];

  const handleCopy = (text, author) => {
    navigator.clipboard.writeText(`"${text}" — ${author}`);
    setCopied(true);
    addToast("Copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const isFavorite = featuredQuote && favorites.includes(featuredQuote._id);

  return (
    <section className="pro-hero-section">
      {/* Global Notice Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', padding: '16px 20px', backgroundColor: 'var(--pro-danger-light)', border: '1px solid rgba(196, 91, 91, 0.25)', borderRadius: 'var(--radius-md)', color: 'var(--pro-danger)', fontSize: '13.5px', lineHeight: '1.5', width: '100%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <div>
          <strong style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Public Test Accounts Disclaimer</strong>
          Default test accounts and their passwords are publicly available on the login page. I am not responsible for any inappropriate or incorrect quotes posted by users, as anyone can log into these demonstration accounts.
        </div>
      </div>

      {/* Top Banner / Metrics Overview */}
      <div className="pro-header-grid">
        <div className="pro-welcome-column">
          <h1 className="pro-page-title">
            Quotes &amp; Knowledge Vault
          </h1>
          <p className="pro-page-desc">
            Organize, categorize, and reference key insights, principles, and quotes for your daily work.
          </p>
        </div>

        {/* 3 Clean Stat Tiles */}
        <div className="pro-stats-row">
          <div className="pro-stat-box">
            <span className="pro-stat-num">{quotes.length}</span>
            <span className="pro-stat-text">Total Quotes</span>
          </div>
          <div className="pro-stat-box">
            <span className="pro-stat-num">{categories.length}</span>
            <span className="pro-stat-text">Categories</span>
          </div>
          <div className="pro-stat-box">
            <span className="pro-stat-num">{favorites.length}</span>
            <span className="pro-stat-text">Favorites</span>
          </div>
        </div>
      </div>

      {/* Featured Quote Highlight */}
      {featuredQuote ? (
        <div className="pro-highlight-card">
          <div className="pro-highlight-header">
            <div className="pro-highlight-badge">
              <IconQuote className="w-3.5 h-3.5" />
              <span>Quote of the Day</span>
            </div>
            {featuredQuote.category && (
              <span className="pro-category-tag">
                <IconTag className="w-3 h-3" />
                {featuredQuote.category}
              </span>
            )}
          </div>

          <p className="pro-highlight-text">
            “{featuredQuote.text}”
          </p>

          <div className="pro-highlight-footer">
            <span className="pro-highlight-author">— {featuredQuote.author || "Anonymous"}</span>

            <div className="pro-highlight-actions">
              <button
                type="button"
                className={`pro-tool-btn ${isFavorite ? "active-fav" : ""}`}
                onClick={() => onToggleFavorite(featuredQuote._id)}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-label="Toggle favorite"
              >
                <IconHeart className="w-4 h-4" fill={isFavorite} />
              </button>

              <button
                type="button"
                className="pro-tool-btn"
                onClick={() => handleCopy(featuredQuote.text, featuredQuote.author)}
                title="Copy quote"
                aria-label="Copy quote"
              >
                {copied ? <IconCheck className="w-4 h-4 text-emerald" /> : <IconCopy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                className="pro-tool-btn"
                onClick={onSelectFeatured}
                title="Shuffle another quote"
                aria-label="Shuffle quote"
              >
                <IconShuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="pro-empty-highlight">
          <p>Your library is empty. Add quotes to populate your daily workspace.</p>
          <button type="button" className="pro-btn-primary" onClick={onOpenCreate}>
            <IconPlus className="w-3.5 h-3.5" />
            <span>Add First Quote</span>
          </button>
        </div>
      )}
    </section>
  );
}
