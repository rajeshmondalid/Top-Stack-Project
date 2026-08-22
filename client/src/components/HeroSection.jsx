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
