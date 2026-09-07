import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useCodeGenerator } from './hooks/useCodeGenerator';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GeneratorPanel from './components/generator/GeneratorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import SlideshowView from './components/preview/SlideshowView';
import ErrorModal from './components/preview/ErrorModal';
import ScannerModal from './components/scanner/ScannerModal';
import './styles/global.css';
import './styles/animations.css';
import './App.css';

function AppContent() {
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const {
    inputText, setInputText,
    codeType, setCodeType,
    viewMode, setViewMode,
    config, updateConfig,
    items, generate, clearAll,
    error, setError,
  } = useCodeGenerator();

  // When user clicks "Use as Input" in the scanner, populate the generator input
  const handleScannerUseAsInput = (text) => {
    setInputText((prev) => prev ? `${prev}\n${text}` : text);
  };

  return (
    <div className="app-layout">
      <Header onOpenScanner={() => setIsScannerOpen(true)} />
      <main className="app-main">
        <GeneratorPanel
          inputText={inputText}
          setInputText={setInputText}
          codeType={codeType}
          setCodeType={setCodeType}
          config={config}
          updateConfig={updateConfig}
          generate={generate}
          clearAll={clearAll}
        />
        <PreviewPanel
          items={items}
          codeType={codeType}
          config={config}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenSlideshow={() => setIsSlideshowOpen(true)}
        />
      </main>
      <Footer />
      {isSlideshowOpen && (
        <SlideshowView
          items={items}
          codeType={codeType}
          config={config}
          onClose={() => setIsSlideshowOpen(false)}
        />
      )}
      {isScannerOpen && (
        <ScannerModal
          onClose={() => setIsScannerOpen(false)}
          onUseAsInput={handleScannerUseAsInput}
        />
      )}
      {error && (
        <ErrorModal
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
