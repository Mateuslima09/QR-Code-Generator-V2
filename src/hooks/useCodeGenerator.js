import { useState, useCallback } from 'react';
import { parseInput } from '../utils/parseInput';
import { validate } from '../utils/validators';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

const DEFAULT_CONFIG = {
  size: 200,
  fgColor: '#000000',
  bgColor: '#ffffff',
  padding: 10,
  gapX: 12,
  gapY: 12,
};

export function useCodeGenerator() {
  const [inputText, setInputText] = useState('');
  const [codeType, setCodeType] = useState('qr');
  const [viewMode, setViewMode] = useState('grid');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();
  const t = translations[lang];

  const generate = useCallback(() => {
    const lines = parseInput(inputText);
    if (lines.length > 800) {
      setError(t.limitExceeded(lines.length));
      return;
    }
    const generated = lines.map((text, idx) => {
      const error = validate(text, codeType);
      return { id: `${idx}-${text}`, text, error };
    });
    setItems(generated);
  }, [inputText, codeType, t]);

  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setInputText('');
    setItems([]);
  }, []);

  return {
    inputText,
    setInputText,
    codeType,
    setCodeType,
    viewMode,
    setViewMode,
    config,
    updateConfig,
    items,
    generate,
    clearAll,
    error,
    setError,
  };
}
