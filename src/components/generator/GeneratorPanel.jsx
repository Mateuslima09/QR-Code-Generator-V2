import TypeSelector from './TypeSelector';
import InputArea from './InputArea';
import StyleControls from './StyleControls';
import './GeneratorPanel.css';

export default function GeneratorPanel({
  inputText,
  setInputText,
  codeType,
  setCodeType,
  config,
  updateConfig,
  generate,
  clearAll,
}) {
  return (
    <aside className="generator-panel glass">
      <TypeSelector codeType={codeType} setCodeType={setCodeType} />
      <InputArea
        inputText={inputText}
        setInputText={setInputText}
        generate={generate}
        clearAll={clearAll}
      />
      <StyleControls config={config} updateConfig={updateConfig} />
    </aside>
  );
}
