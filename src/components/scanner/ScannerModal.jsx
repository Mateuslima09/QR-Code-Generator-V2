import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Upload, Camera, Copy, Check, ArrowRight, ScanLine } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import './ScannerModal.css';

export default function ScannerModal({ onClose, onUseAsInput }) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [tab, setTab] = useState('upload'); // 'upload' | 'camera'
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [used, setUsed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const html5QrRef = useRef(null);
  const cameraStarted = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  // Stop camera when switching tabs
  useEffect(() => {
    if (tab !== 'camera') stopCamera();
  }, [tab]);

  const stopCamera = useCallback(async () => {
    if (html5QrRef.current && cameraStarted.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch (_) {}
      cameraStarted.current = false;
    }
    setScanning(false);
  }, []);

  // Scan from uploaded image file
  const scanFile = useCallback(async (file) => {
    if (!file) return;
    setResult(null);
    setError(null);
    setUsed(false);
    setPreviewUrl(URL.createObjectURL(file));

    const qr = new Html5Qrcode('qr-scanner-hidden');
    try {
      const decoded = await qr.scanFileV2(file, false);
      setResult(decoded.decodedText);
    } catch (_) {
      setError(t.scanError);
    } finally {
      try { qr.clear(); } catch (_) {}
    }
  }, [t.scanError]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) scanFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) scanFile(file);
  };

  // Start live camera scanning
  const startCamera = useCallback(async () => {
    setResult(null);
    setError(null);
    setUsed(false);
    setScanning(true);

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras?.length) {
        setError(t.scanNoCam);
        setScanning(false);
        return;
      }

      html5QrRef.current = new Html5Qrcode('qr-camera-reader');
      await html5QrRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setResult(decodedText);
          stopCamera();
        },
        () => {}
      );
      cameraStarted.current = true;
    } catch (_) {
      setError(t.scanCamError);
      setScanning(false);
    }
  }, [t.scanNoCam, t.scanCamError, stopCamera]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleUseAsInput = () => {
    if (!result) return;
    onUseAsInput(result);
    setUsed(true);
    setTimeout(() => onClose(), 900);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="scanner-backdrop" onClick={handleBackdropClick}>
      <div className="scanner-modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="scanner-header">
          <div className="scanner-title-row">
            <ScanLine size={20} className="scanner-title-icon" />
            <h2 className="scanner-title">{t.scanTitle}</h2>
          </div>
          <button className="scanner-close-btn" onClick={onClose} aria-label={t.close}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="scanner-tabs">
          <button
            className={`scanner-tab ${tab === 'upload' ? 'active' : ''}`}
            onClick={() => setTab('upload')}
          >
            <Upload size={15} />
            {t.scanUpload}
          </button>
          <button
            className={`scanner-tab ${tab === 'camera' ? 'active' : ''}`}
            onClick={() => setTab('camera')}
          >
            <Camera size={15} />
            {t.scanCamera}
          </button>
        </div>

        {/* Body */}
        <div className="scanner-body">

          {/* UPLOAD TAB */}
          {tab === 'upload' && (
            <div className="scanner-upload-tab">
              {/* Required hidden div for html5-qrcode file scanning */}
              <div id="qr-scanner-hidden" style={{ display: 'none' }} />

              <div
                className={`scanner-dropzone ${dragOver ? 'drag-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                aria-label={t.scanPlaceholder}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="QR preview" className="scanner-preview-img" />
                ) : (
                  <>
                    <div className="scanner-dropzone-icon"><Upload size={36} /></div>
                    <p className="scanner-dropzone-text">{t.scanPlaceholder}</p>
                    <p className="scanner-dropzone-hint">{t.scanDragHint}</p>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* CAMERA TAB */}
          {tab === 'camera' && (
            <div className="scanner-camera-tab">
              <div id="qr-camera-reader" className="scanner-camera-reader" />

              {!scanning && !result && (
                <button className="btn btn-primary scanner-start-btn" onClick={startCamera}>
                  <Camera size={16} />
                  {t.scanStartCamera}
                </button>
              )}

              {scanning && (
                <button className="btn scanner-stop-btn" onClick={stopCamera}>
                  <X size={16} />
                  {t.scanStopCamera}
                </button>
              )}
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="scanner-result">
              <div className="scanner-result-label">{t.scanResult}</div>
              <div className="scanner-result-text">{result}</div>
              <div className="scanner-result-actions">
                <button
                  className={`btn scanner-action-btn ${copied ? 'success' : ''}`}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? t.copied : t.scanCopy}
                </button>
                <button
                  className={`btn btn-primary scanner-action-btn ${used ? 'success' : ''}`}
                  onClick={handleUseAsInput}
                >
                  {used ? <Check size={15} /> : <ArrowRight size={15} />}
                  {used ? t.scanUsed : t.scanUseAsInput}
                </button>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="scanner-error">{error}</div>
          )}

        </div>
      </div>
    </div>
  );
}

