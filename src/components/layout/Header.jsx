import { QrCode, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './Header.css';

const LANG_LABELS = { pt: '🇧🇷 PT', en: '🇺🇸 EN', es: '🇪🇸 ES' };

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLanguage, SUPPORTED_LANGS } = useLanguage();
  const t = translations[lang];

  return (
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

        {/* Controls */}
        <div className="header-controls">
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
      </div>
    </header>
  );
}
