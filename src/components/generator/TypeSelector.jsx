import { QrCode, Barcode, Hash, ShoppingCart, ShoppingBag, Grid } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './TypeSelector.css';

const CODE_TYPES = [
  { id: 'qr',          label: 'QR Code',      Icon: QrCode },
  { id: 'datamatrix',  label: 'Data Matrix',  Icon: Grid },
  { id: 'code128',     label: 'Code 128',     Icon: Barcode },
  { id: 'code39',      label: 'Code 39',      Icon: Hash },
  { id: 'ean13',       label: 'EAN-13',       Icon: ShoppingCart },
  { id: 'upc',         label: 'UPC',          Icon: ShoppingBag },
];

export default function TypeSelector({ codeType, setCodeType }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="type-selector-wrap">
      <p className="section-title">{t.codeType}</p>
      <div className="type-selector">
        {CODE_TYPES.map(({ id, label, Icon }) => (
          <button
            key={id}
            id={`type-${id}`}
            className={`type-btn ${codeType === id ? 'active' : ''}`}
            onClick={() => setCodeType(id)}
            title={label}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
