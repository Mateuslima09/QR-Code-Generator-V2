import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './StyleControls.css';

function SliderRow({ label, id, min, max, step = 1, value, onChange, hint }) {
  return (
    <div className="slider-row">
      <div className="slider-label-row">
        <label htmlFor={id}>{label}</label>
        <span className="slider-value">{value}px</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        title={hint}
      />
    </div>
  );
}

function ColorRow({ label, id, value, onChange }) {
  return (
    <div className="color-row">
      <label htmlFor={id}>{label}</label>
      <div className="color-input-wrap">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="color-hex">{value}</span>
      </div>
    </div>
  );
}

export default function StyleControls({ config, updateConfig }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="style-controls-wrap">
      <div 
        className="style-controls-header" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '8px 0',
          userSelect: 'none'
        }}
      >
        <p className="section-title" style={{ margin: 0 }}>{t.styleControls}</p>
        <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="style-controls-content animate-fade-in">
          <div className="controls-group">
        <SliderRow
          label={t.size}
          id="ctrl-size"
          min={80}
          max={400}
          step={8}
          value={config.size}
          onChange={(v) => updateConfig('size', v)}
          hint={t.tooltipSize}
        />

        <SliderRow
          label={t.padding}
          id="ctrl-padding"
          min={0}
          max={40}
          value={config.padding}
          onChange={(v) => updateConfig('padding', v)}
          hint={t.tooltipPadding}
        />

        <SliderRow
          label={t.gapX}
          id="ctrl-gapX"
          min={0}
          max={500}
          value={config.gapX}
          onChange={(v) => updateConfig('gapX', v)}
          hint={t.tooltipGap}
        />

        <SliderRow
          label={t.gapY}
          id="ctrl-gapY"
          min={0}
          max={500}
          value={config.gapY}
          onChange={(v) => updateConfig('gapY', v)}
          hint={t.tooltipGap}
        />
      </div>

      <div className="color-group">
        <ColorRow
          label={t.fgColor}
          id="ctrl-fg"
          value={config.fgColor}
          onChange={(v) => updateConfig('fgColor', v)}
        />
        <ColorRow
          label={t.bgColor}
          id="ctrl-bg"
          value={config.bgColor}
          onChange={(v) => updateConfig('bgColor', v)}
        />
      </div>
    </div>
      )}
    </div>
  );
}
