import { X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './ErrorModal.css';

export default function ErrorModal({ message, onClose }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="error-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="error-modal-card glass-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="error-modal-header">
          <div className="error-modal-icon-container">
            <ShieldAlert size={32} className="icon-alert" />
          </div>
          <button className="btn-icon error-close-btn" onClick={onClose} title={t.close}>
            <X size={20} />
          </button>
        </div>
        <div className="error-modal-body">
          <h3 className="error-modal-title">{t.limitWarning}</h3>
          <p className="error-modal-message">{message}</p>
        </div>
        <div className="error-modal-footer">
          <button className="btn btn-primary error-btn-ok" onClick={onClose}>
            {t.ok || 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
