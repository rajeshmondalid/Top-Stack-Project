import React, { useState, useEffect } from "react";
import { IconX, IconQuote } from "./Icons";

const PRESET_CATEGORIES = [
  "Inspiration",
  "Wisdom",
  "Philosophy",
  "Business",
  "Leadership",
  "Design",
  "Engineering",
  "Life"
];

export function QuoteModal({ isOpen, onClose, onSave, editingQuote }) {
  const [form, setForm] = useState({ text: "", author: "", category: "Inspiration" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingQuote) {
      setForm({
        text: editingQuote.text || "",
        author: editingQuote.author || "",
        category: editingQuote.category || "Inspiration"
      });
    } else {
      setForm({ text: "", author: "", category: "Inspiration" });
    }
  }, [editingQuote, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSubmit(e);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, form]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.text.trim() || !form.author.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pro-modal-backdrop" onClick={onClose}>
      <div className="pro-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="pro-modal-header">
          <div className="pro-modal-title-group">
            <div className="pro-modal-icon">
              <IconQuote className="w-4 h-4" />
            </div>
            <div>
              <h2 className="pro-modal-title">{editingQuote ? "Edit Quote" : "Add New Quote"}</h2>
              <p className="pro-modal-sub">Enter the quote text, author attribution, and category.</p>
            </div>
          </div>
          <button type="button" className="pro-close-btn" onClick={onClose} aria-label="Close">
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pro-modal-form">
          <div className="pro-form-group">
            <label htmlFor="quote-text" className="pro-form-label">
              Quote Text <span className="pro-required">*</span>
            </label>
            <textarea
              id="quote-text"
              name="text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Enter quote here..."
              required
              rows={4}
              className="pro-textarea"
              autoFocus
            />
          </div>

          <div className="pro-form-group">
            <label htmlFor="quote-author" className="pro-form-label">
              Author / Source <span className="pro-required">*</span>
            </label>
            <input
              id="quote-author"
              name="author"
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="e.g. Steve Jobs, Seneca, Maya Angelou"
              required
              className="pro-input"
            />
          </div>

          <div className="pro-form-group">
            <label htmlFor="quote-category" className="pro-form-label">
              Category
            </label>
            <input
              id="quote-category"
              name="category"
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Leadership, Philosophy"
              className="pro-input"
            />
            <div className="pro-preset-chips">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`pro-chip ${form.category.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
                  onClick={() => setForm({ ...form, category: cat })}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pro-modal-footer">
            <span className="pro-shortcut-tip">Press <strong>Ctrl+Enter</strong> to save</span>
            <div className="pro-footer-btns">
              <button type="button" className="pro-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="pro-btn-primary"
                disabled={isSubmitting || !form.text.trim() || !form.author.trim()}
              >
                {isSubmitting ? "Saving..." : editingQuote ? "Save Changes" : "Save Quote"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
