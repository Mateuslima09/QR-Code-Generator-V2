import { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import DataMatrixCanvas from './DataMatrixCanvas';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './SlideshowView.css';

const FORMAT_MAP = {
  code128: 'CODE128',
  code39: 'CODE39',
  ean13: 'EAN13',
  upc: 'UPC',
};

export default function SlideshowView({ items, codeType, config, onClose }) {
  const [intervalSeconds, setIntervalSeconds] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);

  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (!isPlaying || items.length === 0) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 0.1) {
        setCurrentIndex((idx) => (idx + 1) % items.length);
        setTimeLeft(Number(intervalSeconds) || 1);
      } else {
        setTimeLeft((prev) => Math.round((prev - 0.1) * 10) / 10);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isPlaying, intervalSeconds, items.length, timeLeft]);

  useEffect(() => {
    setTimeLeft(Number(intervalSeconds) || 1);
  }, [currentIndex, intervalSeconds]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === ' ') { e.preventDefault(); setIsPlaying((p) => !p); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  if (items.length === 0) return null;
  const currentItem = items[currentIndex];

  return (
    <div className="slideshow-overlay animate-fade-in">
      <div className="slideshow-header">

        {/* Linha 1 (esquerda): Intervalo + botão fechar (mobile) */}
        <div className="slideshow-controls-left">
          <label className="interval-label">
            {t.intervalLabel}
            <input
              type="number"
              min="0.1"
              max="60"
              step="0.1"
              value={intervalSeconds}
              onChange={(e) => {
                const val = e.target.value;
                setIntervalSeconds(val === '' ? '' : Number(val));
              }}
              onBlur={() => {
                if (intervalSeconds === '' || intervalSeconds < 0.1) setIntervalSeconds(1);
              }}
              className="interval-input"
            />
          </label>
          {/* Botão fechar aparece aqui só no mobile */}
          <button className="btn-icon close-btn close-btn-mobile" onClick={onClose} title={t.close}>
            <X size={22} />
          </button>
        </div>

        {/* Linha 2 (centro): Prev / Play / Next / Timer */}
        <div className="slideshow-controls-center">
          <button className="btn-icon slideshow-btn" onClick={prevSlide} title={t.prev}>
            <ChevronLeft size={24} />
          </button>

          <button
            className="btn-icon slideshow-btn play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? t.pause : t.play}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button className="btn-icon slideshow-btn" onClick={nextSlide} title={t.next}>
            <ChevronRight size={24} />
          </button>

          <div className="slideshow-timer">
            {isPlaying ? `${timeLeft.toFixed(1)}s` : t.pause}
          </div>
        </div>

        {/* Direita: Timer + fechar (desktop) */}
        <div className="slideshow-controls-right">
          <button className="btn-icon close-btn" onClick={onClose} title={t.close}>
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="slideshow-content">
        <div className="slideshow-card glass-card">
          <div className="slideshow-index">
            {t.qrCodeIndex(currentIndex + 1, items.length)}
          </div>

          <div
            className="slideshow-render"
            style={{
              padding: config.padding * 1.5,
              backgroundColor: config.bgColor,
            }}
          >
            {codeType === 'qr' ? (
              <QRCodeCanvas
                value={currentItem.text}
                size={Math.min(window.innerWidth * 0.6, window.innerHeight * 0.5, config.size * 2, 400)}
                fgColor={config.fgColor}
                bgColor={config.bgColor}
                level="M"
              />
            ) : codeType === 'datamatrix' ? (
              <DataMatrixCanvas
                value={currentItem.text}
                size={Math.min(window.innerWidth * 0.6, window.innerHeight * 0.5, config.size * 2, 400)}
                fgColor={config.fgColor}
                bgColor={config.bgColor}
              />
            ) : (
              <Barcode
                value={currentItem.text}
                format={FORMAT_MAP[codeType]}
                renderer="canvas"
                width={Math.max(2, config.size / 50)}
                height={Math.max(80, config.size)}
                background={config.bgColor}
                lineColor={config.fgColor}
                displayValue={true}
                fontSize={16}
                margin={0}
              />
            )}
          </div>

          <div className="slideshow-text">
            {currentItem.text}
          </div>
        </div>
      </div>
    </div>
  );
}
