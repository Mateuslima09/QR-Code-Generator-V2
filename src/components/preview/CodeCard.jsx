import { useRef, memo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import DataMatrixCanvas from './DataMatrixCanvas';
import { Download, AlertCircle } from 'lucide-react';
import { downloadImage } from '../../utils/downloadImage';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './CodeCard.css';

const FORMAT_MAP = {
  code128: 'CODE128',
  code39: 'CODE39',
  ean13: 'EAN13',
  upc: 'UPC',
};

const CodeCard = memo(function CodeCard({ item, codeType, config, index }) {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = translations[lang];

  const handleDownload = () => {
    if (containerRef.current) {
      downloadImage(containerRef.current, item.text);
    }
  };

  const isBarcode = codeType !== 'qr' && codeType !== 'datamatrix';

  return (
    <div 
      className="code-card glass-card animate-scale-in" 
      data-text={item.text} 
      style={{ '--delay': `${index * 0.04}s` }}
    >
      {item.error ? (
        <div className="code-error">
          <AlertCircle size={24} />
          <p className="code-error-label">{t[item.error]}</p>
          <span className="code-error-value">{item.text}</span>
        </div>
      ) : (
        <>
          <div className="code-render">
            <div
              ref={containerRef}
              className="code-render-inner"
              style={{
                padding: config.padding,
                backgroundColor: config.bgColor,
              }}
            >
              {codeType === 'qr' ? (
                <QRCodeCanvas
                  value={item.text}
                  size={config.size * (window.devicePixelRatio || 2)}
                  fgColor={config.fgColor}
                  bgColor={config.bgColor}
                  level="H"
                  marginSize={0}
                  style={{
                    width: config.size,
                    height: config.size,
                    imageRendering: 'pixelated',
                    display: 'block',
                  }}
                />
              ) : codeType === 'datamatrix' ? (
                <DataMatrixCanvas
                  value={item.text}
                  size={config.size}
                  fgColor={config.fgColor}
                  bgColor={config.bgColor}
                />
              ) : (
                <Barcode
                  value={item.text}
                  format={FORMAT_MAP[codeType]}
                  renderer="canvas"
                  width={Math.max(1, config.size / 100)}
                  height={Math.max(40, config.size * 0.5)}
                  background={config.bgColor}
                  lineColor={config.fgColor}
                  displayValue={true}
                  fontSize={11}
                  margin={0}
                />
              )}
            </div>
          </div>

          <div className="code-footer">
            <span className="code-text" title={item.text}>
              <span className="code-index">#{index + 1}</span>
              <span className="code-desc">
                {item.text.length > 22 ? item.text.slice(0, 22) + '…' : item.text}
              </span>
            </span>
            <button
              className="btn-icon download-btn"
              onClick={handleDownload}
              title={t.download}
            >
              <Download size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default CodeCard;
