import { Sparkles, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './InputArea.css';

export default function InputArea({ inputText, setInputText, generate, clearAll }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const handleKeyDown = (e) => {
    // Ctrl+Enter triggers generate
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      generate();
    }
  };

  const lineCount = inputText
    .split('\n')
    .filter((l) => l.trim().length > 0).length;

  return (
    <div className="input-area-wrap">
      <div className="input-area-header">
        <p className="section-title">{t.inputLabel}</p>
        {lineCount > 0 && (
          <span className="badge badge-accent">{lineCount}</span>
        )}
      </div>

      <textarea
        id="code-input"
        className="code-textarea"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.inputPlaceholder}
        rows={8}
        spellCheck={false}
        autoComplete="off"
      />

      <div className="input-actions">
        <button
          id="generate-btn"
          className="btn btn-primary generate-btn"
          onClick={generate}
          disabled={!inputText.trim()}
        >
          <Sparkles size={16} />
          {t.generateBtn}
        </button>

        {inputText && (
          <button
            id="clear-btn"
            className="btn btn-ghost"
            onClick={clearAll}
            title={t.clearAll}
          >
            <Trash2 size={14} />
            {t.clearAll}
          </button>
        )}
      </div>

      <p className="input-hint">Ctrl + Enter para gerar</p>
    </div>
  );
}
