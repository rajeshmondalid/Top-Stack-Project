import React, { useState } from "react";
import {
  IconHeart,
  IconCopy,
  IconCheck,
  IconEdit,
  IconTrash,
  IconTag
} from "./Icons";
import { useToast } from "./Toast";

export function QuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
  viewMode = "grid"
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author || "Unknown"}`);
    setCopied(true);
    addToast("Copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      onDelete(quote._id);
    }
  };

  return (
    <div className={`pro-card ${viewMode === "list" ? "pro-card-list" : ""}`}>
      {/* Top Meta Bar */}
      <div className="pro-card-header">
        <span className="pro-category-tag">
          <IconTag className="w-3 h-3" />
          {quote.category || "General"}
        </span>

        <button
          type="button"
          className={`pro-fav-btn ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => onToggleFavorite(quote._id)}
          title={isFavorite ? "Remove favorite" : "Star as favorite"}
          aria-label="Toggle favorite"
        >
          <IconHeart className="w-3.5 h-3.5" fill={isFavorite} />
        </button>
      </div>

      {/* Quote Body */}
      <div className="pro-card-content">
        <p className="pro-card-quote">“{quote.text}”</p>
      </div>

      {/* Bottom Footer / Author & Actions */}
      <div className="pro-card-footer">
        <span className="pro-card-author">— {quote.author || "Anonymous"}</span>

        <div className="pro-card-actions">
          <button
            type="button"
            className="pro-card-btn"
            onClick={handleCopy}
            title="Copy Quote"
            aria-label="Copy quote text"
          >
            {copied ? <IconCheck className="w-3.5 h-3.5 text-emerald" /> : <IconCopy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            className="pro-card-btn"
            onClick={() => onEdit(quote)}
            title="Edit Quote"
            aria-label="Edit quote"
          >
            <IconEdit className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            className="pro-card-btn delete-btn"
            onClick={confirmDelete}
            title="Delete Quote"
            aria-label="Delete quote"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
