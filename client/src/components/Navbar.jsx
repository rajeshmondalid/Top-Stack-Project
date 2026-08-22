import React from "react";
import {
  IconQuote,
  IconPlus,
  IconSun,
  IconMoon,
  IconShuffle,
  IconLogOut,
  IconUser,
  IconDownload,
  IconRefresh
} from "./Icons";

export function Navbar({
  user,
  databaseStatus,
  onCheckDatabase,
  onOpenCreate,
  onInspireMe,
  onOpenExport,
  onSignOut,
  theme,
  onToggleTheme
}) {
  return (
    <header className="pro-navbar">
      <div className="pro-navbar-container">
        {/* Brand */}
        <div className="pro-brand">
          <div className="pro-brand-icon">
            <IconQuote className="w-4 h-4" />
          </div>
          <div className="pro-brand-info">
            <span className="pro-brand-title">Quote Collector</span>
            <span className="pro-brand-tag">Workspace</span>
          </div>
        </div>

        {/* Database Status Pill */}
        <div
          className={`pro-status-pill status-${databaseStatus}`}
          onClick={onCheckDatabase}
          title="Click to test database connection"
        >
          <span className="pro-status-dot" />
          <span className="pro-status-label">
            {databaseStatus === "connected" && "Atlas Online"}
            {databaseStatus === "checking" && "Connecting..."}
            {databaseStatus === "disconnected" && "Offline Mode"}
          </span>
          <button className="pro-status-refresh" aria-label="Refresh connection">
            <IconRefresh className="w-3 h-3" />
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="pro-navbar-actions">
          <button
            type="button"
            className="pro-btn-secondary"
            onClick={onInspireMe}
            title="Random Quote"
          >
            <IconShuffle className="w-3.5 h-3.5" />
            <span className="btn-text-desktop">Shuffle</span>
          </button>

          <button
            type="button"
            className="pro-btn-secondary"
            onClick={onOpenExport}
            title="Export collection to JSON/CSV/Markdown"
          >
            <IconDownload className="w-3.5 h-3.5" />
            <span className="btn-text-desktop">Export</span>
          </button>

          <button
            type="button"
            className="pro-btn-primary"
            onClick={onOpenCreate}
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>New Quote</span>
          </button>

          <button
            type="button"
            className="pro-icon-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
          </button>

          {/* User Account */}
          <div className="pro-user-menu">
            <div className="pro-user-avatar">
              <IconUser className="w-3.5 h-3.5" />
            </div>
            <span className="pro-user-name">{user.name || user.email.split("@")[0]}</span>
            <span className="pro-role-tag">{user.role || "user"}</span>
            <button
              type="button"
              className="pro-signout-btn"
              onClick={onSignOut}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <IconLogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
