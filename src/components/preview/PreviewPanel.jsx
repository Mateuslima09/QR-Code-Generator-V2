import { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, List, QrCode, Download, Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeCard from './CodeCard';
import { getPngBlob, triggerDownloadBlob } from '../../utils/downloadImage';
import JSZip from 'jszip';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './PreviewPanel.css';

function EmptyState({ t }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty-icon">
        <QrCode size={48} strokeWidth={1.2} />
      </div>
      <h3>{t.noItems}</h3>
      <p>{t.noItemsHint}</p>
    </motion.div>
  );
}

export default function PreviewPanel({ items, codeType, config, viewMode, setViewMode, onOpenSlideshow }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [isZipping, setIsZipping] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  // Força lista no mobile e monitora resize
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => {
      setIsMobile(e.matches);
      if (e.matches) setViewMode('list');
    };
    if (mq.matches) setViewMode('list');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setViewMode]);

  const effectiveViewMode = isMobile ? 'list' : viewMode;

  const gridStyle = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns:
        effectiveViewMode === 'grid'
          ? `repeat(auto-fill, ${config.size + config.padding * 2 + 24}px)`
          : '1fr',
      gap: `${config.gapY}px ${config.gapX}px`,
    }),
    [effectiveViewMode, config.size, config.padding, config.gapX, config.gapY]
  );

  const handleDownloadAll = async () => {
    setIsZipping(true);
    const zip = new JSZip();
    const cards = document.querySelectorAll('.code-card');
    
    try {
      for (let i = 0; i < cards.length; i++) {
        const renderEl = cards[i].querySelector('.code-render');
        const text = cards[i].getAttribute('data-text') || `code-${i + 1}`;
        if (renderEl) {
          const blob = await getPngBlob(renderEl);
          if (blob) {
            const safeName = text.replace(/[\\/:*?"<>|\n\r]/g, '-').slice(0, 100).trim() || `code-${i + 1}`;
            zip.file(`${safeName}.png`, blob);
          }
        }
        // Libera a thread principal do navegador para evitar congelamento da GPU / Canvas (tela preta)
        await new Promise((resolve) => setTimeout(resolve, 45));
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      triggerDownloadBlob(zipBlob, 'qr-codes.zip');
    } catch (e) {
      console.error('Error generating ZIP file:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <section className="preview-panel">
      {/* Toolbar */}
      <div className="preview-toolbar">
        <div className="toolbar-top">
          <div className="toolbar-left">
            {items.length > 0 && (
              <span className="badge badge-accent">
                {typeof t.itemCount === 'function' ? t.itemCount(items.length) : `${items.length}`}
              </span>
            )}
          </div>
          <div className="toolbar-right">
            {items.length > 0 && (
              <button className="btn btn-primary toolbar-btn" onClick={onOpenSlideshow} title={t.slideshowTitle}>
                <Play size={14} />
                <span className="btn-label">{t.slideshowBtn}</span>
              </button>
            )}
            {items.length > 1 && (
              <button
                className="btn btn-ghost toolbar-btn"
                onClick={handleDownloadAll}
                disabled={isZipping}
              >
                {isZipping ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                <span className="btn-label">{isZipping ? t.zipping : t.downloadAll}</span>
              </button>
            )}
            {!isMobile && (
              <div className="view-toggle">
              <button
                id="view-grid"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title={t.viewGrid}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                id="view-list"
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title={t.viewList}
              >
                <List size={16} />
              </button>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="preview-content">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <EmptyState key="empty" t={t} />
          ) : (
            <motion.div
              key="grid"
              style={gridStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {items.map((item, idx) => (
                <CodeCard
                  key={item.id}
                  item={item}
                  codeType={codeType}
                  config={config}
                  index={idx}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
