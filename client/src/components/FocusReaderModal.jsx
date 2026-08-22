import React, { useState, useEffect } from "react";
import {
  IconX,
  IconHeart,
  IconCopy,
  IconCheck,
  IconShuffle,
  IconTag,
  IconQuote
} from "./Icons";
import { useToast } from "./Toast";

export function FocusReaderModal({
  isOpen,
  onClose,
  quotes = [],
  favorites = [],
  onToggleFavorite
}) {
  const { addToast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [themeTone, setThemeTone] = useState("paper"); // 'paper', 'sage', 'obsidian', 'terracotta'

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeys = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " " || e.key === "j") {
        e.preventDefault();
        handleNext();
      }
      if (e.key === "ArrowLeft" || e.key === "k") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [isOpen, quotes.length, currentIndex]);

  if (!isOpen || quotes.length === 0) return null;

  const currentQuote = quotes[currentIndex] || quotes[0];
  const isFavorite = favorites.includes(currentQuote._id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`“${currentQuote.text}” — ${currentQuote.author}`);
    setCopied(true);
    addToast("Copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`focus-reader-overlay tone-${themeTone}`} onClick={onClose}>
      <div className="focus-reader-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="focus-top-bar">
          <div className="focus-brand-pill">
            <span className="focus-dot" />
            <span>Zen Focus Reader · {currentIndex + 1} of {quotes.length}</span>
          </div>

          <div className="focus-controls-right">
            {/* Tone selector */}
            <div className="tone-selector">
              <button
                type="button"
                className={`tone-btn tone-paper-btn ${themeTone === "paper" ? "active-tone" : ""}`}
                onClick={() => setThemeTone("paper")}
                title="Warm Paper"
              />
              <button
                type="button"
                className={`tone-btn tone-sage-btn ${themeTone === "sage" ? "active-tone" : ""}`}
                onClick={() => setThemeTone("sage")}
                title="Forest Sage"
              />
              <button
                type="button"
                className={`tone-btn tone-terracotta-btn ${themeTone === "terracotta" ? "active-tone" : ""}`}
                onClick={() => setThemeTone("terracotta")}
                title="Terracotta Sunset"
              />
              <button
                type="button"
                className={`tone-btn tone-obsidian-btn ${themeTone === "obsidian" ? "active-tone" : ""}`}
                onClick={() => setThemeTone("obsidian")}
                title="Deep Obsidian"
              />
            </div>

            <button type="button" className="focus-close-btn" onClick={onClose} aria-label="Exit focus mode">
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Editorial Quote Canvas */}
        <div className="focus-main-content">
          <div className="focus-watermark">
            <IconQuote />
          </div>

          {currentQuote.category && (
            <div className="focus-category-tag">
              <IconTag className="w-3.5 h-3.5" />
              <span>{currentQuote.category}</span>
            </div>
          )}

          <blockquote className="focus-quote-text">
            “{currentQuote.text}”
          </blockquote>

          <div className="focus-author-row">
            <span className="focus-dash">—</span>
            <cite className="focus-author">{currentQuote.author || "Anonymous"}</cite>
          </div>
        </div>

        {/* Bottom Interactive Navigation */}
        <div className="focus-bottom-bar">
          <div className="focus-action-buttons">
            <button
              type="button"
              className={`focus-icon-btn ${isFavorite ? "active-fav" : ""}`}
              onClick={() => onToggleFavorite(currentQuote._id)}
              title={isFavorite ? "Remove favorite" : "Add to favorites"}
            >
              <IconHeart className="w-5 h-5" fill={isFavorite} />
            </button>

            <button
              type="button"
              className="focus-icon-btn"
              onClick={handleCopy}
              title="Copy quote"
            >
              {copied ? <IconCheck className="w-5 h-5 text-emerald" /> : <IconCopy className="w-5 h-5" />}
            </button>
          </div>

          <div className="focus-nav-cluster">
            <button
              type="button"
              className="focus-nav-arrow"
              onClick={handlePrev}
              title="Previous Quote (Left Arrow)"
            >
              ← Previous
            </button>
            <button
              type="button"
              className="focus-nav-arrow focus-primary-nav"
              onClick={handleNext}
              title="Next Quote (Space or Right Arrow)"
            >
              Next Thought →
            </button>
          </div>

          <div className="focus-hint-text">
            Press <kbd>Space</kbd> or <kbd>→</kbd> for next
          </div>
        </div>
      </div>
    </div>
  );
}
