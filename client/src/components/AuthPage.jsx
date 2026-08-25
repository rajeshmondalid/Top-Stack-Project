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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '24px', padding: '16px', backgroundColor: 'var(--pro-danger-light)', border: '1px solid rgba(196, 91, 91, 0.25)', borderRadius: 'var(--radius-md)', color: 'var(--pro-danger)', fontSize: '13px', textAlign: 'left', lineHeight: '1.5', boxShadow: 'var(--shadow-sm)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Public Test Accounts Disclaimer</strong>
              Default test accounts and their passwords are publicly available on this login page. I am not responsible for any inappropriate or incorrect quotes posted by users, as anyone can log into these demonstration accounts.
            </div>
          </div>
        </div>



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
