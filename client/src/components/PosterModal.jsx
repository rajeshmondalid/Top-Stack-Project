import React, { useState, useRef, useEffect } from "react";
import { IconX, IconDownload, IconCopy, IconCheck, IconSparkles } from "./Icons";
import { useToast } from "./Toast";

export function PosterModal({ isOpen, onClose, quote }) {
  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const [posterStyle, setPosterStyle] = useState("vintage"); // 'vintage', 'sage', 'terracotta', 'midnight'
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen || !quote) return;
    drawPoster();
  }, [isOpen, quote, posterStyle]);

  if (!isOpen || !quote) return null;

  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Canvas size (HD Instagram/Poster portrait ratio: 800 x 1000)
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // Palettes
    let bgColor = "#fbf9f4";
    let textColor = "#1c2b26";
    let accentColor = "#b45309";
    let mutedColor = "#667870";
    let borderColor = "#e8e4d8";
    let quoteMarkColor = "rgba(180, 83, 9, 0.08)";

    if (posterStyle === "sage") {
      bgColor = "#163f35";
      textColor = "#ffffff";
      accentColor = "#34d399";
      mutedColor = "#a7f3d0";
      borderColor = "#245e50";
      quoteMarkColor = "rgba(52, 211, 153, 0.12)";
    } else if (posterStyle === "terracotta") {
      bgColor = "#7c2d12";
      textColor = "#fffbeb";
      accentColor = "#fde047";
      mutedColor = "#fed7aa";
      borderColor = "#9a3412";
      quoteMarkColor = "rgba(253, 224, 71, 0.12)";
    } else if (posterStyle === "midnight") {
      bgColor = "#0b0f19";
      textColor = "#f8fafc";
      accentColor = "#38bdf8";
      mutedColor = "#94a3b8";
      borderColor = "#1e293b";
      quoteMarkColor = "rgba(56, 189, 248, 0.08)";
    }

    // 1. Background Fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Elegant Border Frame
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // 3. Top Header: Category Tag & Brand
    ctx.fillStyle = accentColor;
    ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText((quote.category || "WISDOM").toUpperCase(), width / 2, 110);

    // Subtle divider
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 40, 130);
    ctx.lineTo(width / 2 + 40, 130);
    ctx.stroke();

    // 4. Large Watermark Quotation Mark
    ctx.fillStyle = quoteMarkColor;
    ctx.font = "italic 360px Georgia, 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("“", width / 2, 480);

    // 5. Quote Body Text with Word Wrapping
    ctx.fillStyle = textColor;
    ctx.font = "italic 36px 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";

    const text = `“${quote.text}”`;
    const words = text.split(" ");
    let line = "";
    const lines = [];
    const maxWidth = width - 180;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Vertically center lines around middle area
    const lineHeight = 56;
    const totalTextHeight = lines.length * lineHeight;
    let startY = 460 - totalTextHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].trim(), width / 2, startY + i * lineHeight);
    }

    // 6. Author Row
    const authorY = startY + lines.length * lineHeight + 40;
    ctx.fillStyle = accentColor;
    ctx.font = "24px Georgia, serif";
    ctx.fillText("—", width / 2, authorY);

    ctx.fillStyle = mutedColor;
    ctx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(quote.author || "Anonymous", width / 2, authorY + 36);

    // 7. Bottom Footnote / Archival Mark
    ctx.fillStyle = mutedColor;
    ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("QUOTE COLLECTOR · PERSONAL SANCTUARY", width / 2, height - 80);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const link = document.createElement("a");
      link.download = `quote-${(quote.author || "wisdom").toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      addToast("High-res Quote Poster saved to downloads!", "success");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container poster-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <IconSparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="modal-title">Artisanal Quote Poster</h2>
              <p className="modal-subtitle">Craft a high-resolution visual card for reflection or sharing</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="poster-modal-body">
          {/* Style Selector Tabs */}
          <div className="poster-palette-selector">
            <button
              type="button"
              className={`poster-palette-btn ${posterStyle === "vintage" ? "active" : ""}`}
              onClick={() => setPosterStyle("vintage")}
            >
              📜 Warm Linen
            </button>
            <button
              type="button"
              className={`poster-palette-btn ${posterStyle === "sage" ? "active" : ""}`}
              onClick={() => setPosterStyle("sage")}
            >
              🌿 Forest Sage
            </button>
            <button
              type="button"
              className={`poster-palette-btn ${posterStyle === "terracotta" ? "active" : ""}`}
              onClick={() => setPosterStyle("terracotta")}
            >
              🍂 Terracotta
            </button>
            <button
              type="button"
              className={`poster-palette-btn ${posterStyle === "midnight" ? "active" : ""}`}
              onClick={() => setPosterStyle("midnight")}
            >
              🌌 Midnight
            </button>
          </div>

          {/* Canvas Preview */}
          <div className="poster-canvas-preview-wrapper">
            <canvas ref={canvasRef} className="poster-canvas" />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-primary" onClick={handleDownload} disabled={downloading}>
            <IconDownload className="w-4 h-4" />
            <span>{downloading ? "Generating..." : "Download High-Res Poster"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
