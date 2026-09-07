import { useState, useEffect, useRef } from 'react';
import { QrCode, Sun, Moon, Globe, ScanLine, Menu, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './Header.css';

const LANG_LABELS = { pt: 'PT', en: 'EN', es: 'ES' };

export default function Header({ onOpenScanner }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLanguage, SUPPORTED_LANGS } = useLanguage();
  const t = translations[lang];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleScanClick = () => {
    setDrawerOpen(false);
    onOpenScanner();
  };

  const handleLangChange = (l) => {
    changeLanguage(l);
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          {/* Logo */}
          <div className="header-logo">
            <div className="logo-icon">
              <QrCode size={22} />
            </div>
            <div className="logo-text">
              <span className="logo-name">{t.appName}</span>
              <span className="logo-tagline">{t.appTagline}</span>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="header-controls">
            {/* Scanner Button */}
            <button
              id="open-scanner-btn"
              className="btn-scanner"
              onClick={onOpenScanner}
              title={t.scanTitle}
              aria-label={t.scanBtn}
            >
              <ScanLine size={16} />
              {t.scanBtn}
            </button>

            {/* Language Selector */}
            <div className="lang-selector">
              <Globe size={14} className="lang-icon" />
              {SUPPORTED_LANGS.map((l) => (
                <button
                  key={l}
                  className={`lang-btn ${lang === l ? 'active' : ''}`}
                  onClick={() => changeLanguage(l)}
                  title={l.toUpperCase()}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              className="btn btn-icon theme-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? t.themeLight : t.themeDark}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <>
        {/* Backdrop */}
        <div
          className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <aside
          ref={drawerRef}
          className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}
          aria-label="Menu de navegacao"
          role="dialog"
          aria-modal="true"
        >
          {/* Drawer Header */}
          <div className="drawer-header">
            <span className="drawer-title">{t.appName}</span>
            <button
              className="drawer-close-btn"
              onClick={() => setDrawerOpen(false)}
              aria-label={t.close}
            >
              <X size={18} />
            </button>
          </div>

          <div className="drawer-body">
            {/* Scanner Section */}
            <div className="drawer-section">
              <span className="drawer-section-label">{t.scanBtn}</span>
              <button className="drawer-scanner-btn" onClick={handleScanClick}>
                <div className="drawer-scanner-icon">
                  <ScanLine size={20} />
                </div>
                <div className="drawer-scanner-info">
                  <span className="drawer-scanner-title">{t.scanBtn}</span>
                  <span className="drawer-scanner-sub">{t.scanTitle}</span>
                </div>
              </button>
            </div>

            {/* Language Section */}
            <div className="drawer-section">
              <span className="drawer-section-label">{t.language}</span>
              <div className="drawer-lang-row">
                {SUPPORTED_LANGS.map((l) => (
                  <button
                    key={l}
                    className={`drawer-lang-btn ${lang === l ? 'active' : ''}`}
                    onClick={() => handleLangChange(l)}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Section */}
            <div className="drawer-section">
              <span className="drawer-section-label">{t.theme}</span>
              <div className="drawer-theme-row">
                <span className="drawer-theme-label">
                  {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
                  {theme === 'dark' ? t.themeDark : t.themeLight}
                </span>
                <button
                  className="drawer-theme-btn"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  {theme === 'dark' ? t.themeLight : t.themeDark}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </>
    </>
  );
}
