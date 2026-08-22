import React, { useState } from "react";
import { IconX, IconDownload, IconCopy, IconCheck } from "./Icons";
import { useToast } from "./Toast";

export function ExportModal({ isOpen, onClose, quotes = [] }) {
  const { addToast } = useToast();
  const [format, setFormat] = useState("json");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateContent = () => {
    if (format === "json") {
      const cleanQuotes = quotes.map(({ text, author, category, createdAt }) => ({
        text,
        author,
        category,
        createdAt
      }));
      return JSON.stringify(cleanQuotes, null, 2);
    }

    if (format === "markdown") {
      return quotes
        .map(
          (q, i) =>
            `${i + 1}. "${q.text}"\n   — **${q.author || "Unknown"}** \`#${q.category || "General"}\`\n`
        )
        .join("\n");
    }

    if (format === "csv") {
      const header = `"Text","Author","Category"\n`;
      const rows = quotes
        .map(
          (q) =>
            `"${(q.text || "").replace(/"/g, '""')}","${(q.author || "").replace(/"/g, '""')}","${(q.category || "").replace(/"/g, '""')}"`
        )
        .join("\n");
      return header + rows;
    }

    return "";
  };

  const content = generateContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    addToast(`Exported ${quotes.length} quotes to clipboard as ${format.toUpperCase()}`, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === "markdown" ? "md" : format;
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quotes-vault.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast(`Downloaded quotes-vault.${ext}`, "success");
  };

  return (
    <div className="pro-modal-backdrop" onClick={onClose}>
      <div className="pro-modal-box export-box" onClick={(e) => e.stopPropagation()}>
        <div className="pro-modal-header">
          <div className="pro-modal-title-group">
            <div className="pro-modal-icon">
              <IconDownload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="pro-modal-title">Export Vault</h2>
              <p className="pro-modal-sub">Export your {quotes.length} quotes to your preferred format</p>
            </div>
          </div>
          <button type="button" className="pro-close-btn" onClick={onClose} aria-label="Close">
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="pro-export-body">
          <div className="pro-format-tabs">
            {["json", "markdown", "csv"].map((fmt) => (
              <button
                key={fmt}
                type="button"
                className={`pro-tab-btn ${format === fmt ? "active" : ""}`}
                onClick={() => setFormat(fmt)}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="pro-preview-box">
            <pre className="pro-code-preview">{content}</pre>
          </div>
        </div>

        <div className="pro-modal-footer">
          <button type="button" className="pro-btn-secondary" onClick={onClose}>
            Close
          </button>
          <div className="pro-footer-btns">
            <button type="button" className="pro-btn-secondary" onClick={handleCopy}>
              {copied ? <IconCheck className="w-3.5 h-3.5 text-emerald" /> : <IconCopy className="w-3.5 h-3.5" />}
              <span>Copy Data</span>
            </button>
            <button type="button" className="pro-btn-primary" onClick={handleDownload}>
              <IconDownload className="w-3.5 h-3.5" />
              <span>Download .{format === "markdown" ? "md" : format}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
