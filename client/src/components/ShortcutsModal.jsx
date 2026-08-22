import React from "react";
import { IconX, IconSparkles } from "./Icons";

export function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + K / ⌘K", desc: "Focus library search bar" },
    { key: "N", desc: "Create a new quote" },
    { key: "F", desc: "Open Zen Focus Reading Mode" },
    { key: "R", desc: "Shuffle random inspirational quote" },
    { key: "Space / →", desc: "Next thought (in Zen Mode)" },
    { key: "Esc", desc: "Close any modal or dialog" },
    { key: "?", desc: "Open this keyboard guide" }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <IconSparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="modal-title">Keyboard Shortcuts</h2>
              <p className="modal-subtitle">Navigate your collection with seamless keystrokes</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="shortcuts-list">
          {shortcuts.map(({ key, desc }) => (
            <div key={key} className="shortcut-item">
              <span className="shortcut-desc">{desc}</span>
              <kbd className="shortcut-key">{key}</kbd>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
