import React, { useState } from "react";
import {
  IconQuote,
  IconMail,
  IconLock,
  IconUser,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
  IconRefresh,
  IconSun,
  IconMoon,
  IconSparkles
} from "./Icons";

export function AuthPage({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  onSubmitAuth,
  isSubmitting,
  message,
  databaseStatus,
  databaseMessage,
  onCheckDatabase,
  onEnterDemoMode,
  theme,
  onToggleTheme
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  const handleInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleDemoFill = () => {
    setAuthMode("login");
    setAuthForm({
      name: "Demo User",
      email: "demo@quote.collector",
      password: "password123"
    });
  };

  return (
    <div className="pro-auth-layout">
      {/* Theme Toggle Top Corner */}
      <div className="pro-auth-top-actions">
        <button
          type="button"
          className="pro-icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
        </button>
      </div>

      <div className="pro-auth-card">
        {/* Brand */}
        <div className="pro-auth-brand">
          <div className="pro-brand-icon large">
            <IconQuote className="w-5 h-5" />
          </div>
          <h1 className="pro-auth-title">Quote Collector</h1>
          <p className="pro-auth-sub">Sign in to your knowledge and quotes workspace.</p>
        </div>

        {/* Database Status Alert */}
        <div className={`pro-auth-db-status status-${databaseStatus}`}>
          <div className="db-status-left">
            <span className="pro-status-dot" />
            <span>
              {databaseStatus === "connected" && "MongoDB Atlas Connected"}
              {databaseStatus === "checking" && "Checking database connection..."}
              {databaseStatus === "disconnected" && "Database not connected"}
            </span>
          </div>
          <div className="db-status-right">
            <button
              type="button"
              className="pro-status-refresh"
              onClick={onCheckDatabase}
              title="Test connection"
            >
              <IconRefresh className="w-3.5 h-3.5" />
            </button>
            {databaseStatus === "disconnected" && (
              <button
                type="button"
                className="pro-troubleshoot-btn"
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              >
                {showTroubleshoot ? "Hide" : "Help"}
              </button>
            )}
          </div>
        </div>

        {/* Troubleshooting box if offline */}
        {databaseStatus === "disconnected" && showTroubleshoot && (
          <div className="pro-troubleshoot-panel">
            <strong>Connecting MongoDB Atlas:</strong>
            <ol>
              <li>In Atlas &gt; <strong>Network Access</strong>, click <strong>Allow Access From Anywhere (0.0.0.0/0)</strong>.</li>
              <li>In Vercel &gt; <strong>Settings &gt; Environment Variables</strong>, set <code>MONGO_URI</code> and <code>JWT_SECRET</code>.</li>
              <li>Or click <strong>Explore Demo Mode</strong> below to preview immediately.</li>
            </ol>
          </div>
        )}

        {/* Segmented Switch: Login / Register */}
        <div className="pro-segmented-tabs">
          <button
            type="button"
            className={`pro-segment-btn ${authMode === "login" ? "active" : ""}`}
            onClick={() => setAuthMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`pro-segment-btn ${authMode === "register" ? "active" : ""}`}
            onClick={() => setAuthMode("register")}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitAuth} className="pro-auth-form">
          {authMode === "register" && (
            <div className="pro-form-group">
              <label className="pro-form-label" htmlFor="auth-name">
                Full Name
              </label>
              <div className="pro-input-wrap">
                <IconUser className="pro-input-icon" />
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={authForm.name}
                  onChange={handleInputChange}
                  className="pro-input with-icon"
                />
              </div>
            </div>
          )}

          <div className="pro-form-group">
            <label className="pro-form-label" htmlFor="auth-email">
              Email Address
            </label>
            <div className="pro-input-wrap">
              <IconMail className="pro-input-icon" />
              <input
                id="auth-email"
                name="email"
                type="email"
                required
                placeholder="name@work.com"
                value={authForm.email}
                onChange={handleInputChange}
                className="pro-input with-icon"
              />
            </div>
          </div>

          <div className="pro-form-group">
            <label className="pro-form-label" htmlFor="auth-password">
              Password
            </label>
            <div className="pro-input-wrap">
              <IconLock className="pro-input-icon" />
              <input
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                value={authForm.password}
                onChange={handleInputChange}
                className="pro-input with-icon with-trailing"
              />
              <button
                type="button"
                className="pro-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {message && (
            <div className="pro-error-alert">
              <IconAlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="pro-btn-primary pro-btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Authenticating..."
              : authMode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {/* Demo Mode Actions */}
        <div className="pro-auth-divider">
          <span>or preview workspace</span>
        </div>

        <div className="pro-demo-row">
          <button
            type="button"
            className="pro-btn-secondary pro-demo-btn"
            onClick={onEnterDemoMode}
          >
            <IconSparkles className="w-3.5 h-3.5" />
            <span>Explore Demo Mode</span>
          </button>
          <button
            type="button"
            className="pro-btn-secondary"
            onClick={handleDemoFill}
            title="Autofill form"
          >
            Autofill
          </button>
        </div>
      </div>
    </div>
  );
}
