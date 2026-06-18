# 🤖 CONTEXT.md — Guia Completo do Projeto para IAs

> **Finalidade:** Este arquivo serve como fonte única de verdade para qualquer assistente de IA (Copilot, ChatGPT, Gemini, Claude, etc.) que estiver trabalhando neste repositório. Leia este arquivo **antes de qualquer outra coisa**.

---

## 📌 Identificação do Projeto

| Campo            | Valor                                                   |
| ---------------- | ------------------------------------------------------- |
| **Nome**         | QR Master                                               |
| **Versão**       | V2                                                      |
| **Repositório**  | https://github.com/Mateuslima09/QR-Code-Generator-V2   |
| **Site ao vivo** | https://max-qr-code.netlify.app                        |
| **Dono**         | Mateuslima09 (Barce)                                    |
| **Idioma base**  | Português Brasileiro (pt-BR)                            |
| **Status**       | Em desenvolvimento ativo                                |

---

## 🧠 Visão Geral (O que é este projeto?)

O **QR Master V2** é uma aplicação web **100% frontend** (sem backend/servidor) que permite ao usuário:

1. Gerar **QR Codes** e **Códigos de Barras** de vários formatos de forma instantânea.
2. Personalizar completamente a aparência (cores, tamanho, margens, espaçamentos).
3. Gerar códigos **em massa** (até 800 de uma vez) a partir de listas de texto.
4. Exportar os códigos gerados em formato **PNG** com um clique.
5. Alternar entre **tema claro e escuro**.
6. Usar a interface em **3 idiomas**: Português, Inglês e Espanhol.

**Não há banco de dados, login, autenticação ou chamadas de API externas.** Toda a lógica acontece no navegador do usuário.

---

## 🛠️ Stack Tecnológica

### Principais Bibliotecas

| Biblioteca          | Versão  | Função no Projeto                                          |
| ------------------- | ------- | ---------------------------------------------------------- |
| `react`             | ^19.2.0 | Framework base da interface (componentes, estado, etc.)    |
| `react-dom`         | ^19.2.0 | Renderização do React no DOM do navegador                  |
| `vite`              | ^7.2.2  | Servidor de desenvolvimento e bundler de produção          |
| `qrcode.react`      | ^4.2.0  | Renderiza QR Codes como SVG ou Canvas dentro do React      |
| `react-barcode`     | ^1.6.1  | Renderiza Códigos de Barras (Code128, Code39, EAN13, UPC)  |
| `framer-motion`     | ^12.23.24 | Animações, transições e gestos fluidos na UI             |
| `lucide-react`      | ^0.554.0 | Biblioteca de ícones SVG modernos e leves                 |

### Ferramentas de Dev

| Ferramenta                    | Função                                        |
| ----------------------------- | --------------------------------------------- |
| `eslint`                      | Linting e padronização de código              |
| `eslint-plugin-react-hooks`   | Regras específicas para hooks do React        |
| `@vitejs/plugin-react`        | Suporte ao JSX/React dentro do Vite           |

### Estilização
- **Vanilla CSS** com variáveis CSS (`--var`).
- **Nenhum framework CSS** (sem Tailwind, sem Bootstrap, sem Styled Components).
- Efeito **Glassmorphism** (`backdrop-filter: blur`) na UI.
- Suporte a **tema escuro/claro** via classe no `<body>` ou atributo `data-theme`.

---

## 📁 Estrutura de Arquivos (Esperada)

```
QR-Code-Generator-V2/
│
├── CONTEXT.md              ← ESTE ARQUIVO (leia primeiro)
├── README.md               ← Documentação pública do projeto
├── index.html              ← Ponto de entrada HTML (monta o #root)
├── package.json            ← Dependências e scripts npm
├── package-lock.json       ← Lock das versões exatas instaladas
├── vite.config.js          ← Configuração do Vite (alias, plugins)
├── eslint.config.js        ← Regras de linting
├── .gitignore              ← Arquivos ignorados pelo Git
│
└── src/                    ← TODO O CÓDIGO FONTE FICA AQUI
    │
    ├── main.jsx            ← Ponto de entrada do React (ReactDOM.render)
    ├── App.jsx             ← Componente raiz; gerencia rotas e providers
    │
    ├── styles/
    │   ├── global.css      ← Reset CSS, variáveis globais, tema claro/escuro
    │   └── animations.css  ← Keyframes e classes de animação reutilizáveis
    │
    ├── contexts/
    │   ├── ThemeContext.jsx     ← Provider do tema (claro/escuro) via Context API
    │   └── LanguageContext.jsx  ← Provider do idioma (pt/en/es) via Context API
    │
    ├── i18n/
    │   └── translations.js ← Objeto com todas as strings traduzidas (pt, en, es)
    │
    ├── hooks/
    │   ├── useTheme.js         ← Hook para consumir ThemeContext
    │   ├── useLanguage.js      ← Hook para consumir LanguageContext
    │   └── useCodeGenerator.js ← Lógica principal de geração de códigos (estado)
    │
    ├── components/
    │   │
    │   ├── layout/
    │   │   ├── Header.jsx      ← Barra superior com logo, seletor de idioma e tema
    │   │   └── Footer.jsx      ← Rodapé com créditos e links
    │   │
    │   ├── generator/
    │   │   ├── GeneratorPanel.jsx  ← Painel esquerdo: formulário de configuração
    │   │   ├── TypeSelector.jsx    ← Botões para selecionar o tipo de código (QR, Code128, etc.)
    │   │   ├── InputArea.jsx       ← Textarea para entrada de texto (1 por linha = 1 código)
    │   │   ├── StyleControls.jsx   ← Sliders e color pickers de personalização
    │   │   └── BulkInput.jsx       ← Área especial para entrada em massa
    │   │
    │   ├── preview/
    │   │   ├── PreviewPanel.jsx    ← Painel direito: exibe os códigos gerados
    │   │   ├── GridView.jsx        ← Visualização em grade (compacta)
    │   │   ├── ListView.jsx        ← Visualização em lista (detalhada)
    │   │   ├── CodeCard.jsx        ← Card individual de um código gerado
    │   │   └── DownloadButton.jsx  ← Botão de download individual em PNG
    │   │
    │   └── ui/
    │       ├── Toggle.jsx          ← Componente de toggle (tema claro/escuro)
    │       ├── Slider.jsx          ← Slider de range reutilizável
    │       ├── ColorPicker.jsx     ← Input de cor com preview
    │       └── Tooltip.jsx         ← Tooltip de ajuda ao passar o mouse
    │
    └── utils/
        ├── downloadImage.js    ← Função para converter SVG/Canvas em PNG e baixar
        ├── parseInput.js       ← Parseia o texto do usuário (1 item por linha)
        └── validators.js       ← Valida dados para formatos como EAN-13 (13 dígitos)
```

---

## 🔄 Fluxo de Dados (Como o App Funciona)

```
Usuário digita texto
       ↓
InputArea.jsx  →  useCodeGenerator.js (hook de estado)
                         ↓
              Atualiza estado: { items[], config{} }
                         ↓
              PreviewPanel.jsx recebe os dados
                         ↓
              Para cada item → CodeCard.jsx
                         ↓
              CodeCard renderiza:
               - <QRCodeSVG />  (se tipo = QR)
               - <Barcode />    (se tipo = Code128, Code39, EAN13, UPC)
```

### Estado Principal (`useCodeGenerator`)

```js
// Estado gerenciado pelo hook principal
{
  inputText: "",        // Texto bruto do usuário (1 linha = 1 código)
  codeType: "qr",       // "qr" | "code128" | "code39" | "ean13" | "upc"
  viewMode: "grid",     // "grid" | "list"
  config: {
    size: 200,          // Tamanho em pixels
    fgColor: "#000000", // Cor da frente (o código em si)
    bgColor: "#ffffff", // Cor do fundo
    padding: 10,        // Margem interna (quiet zone)
    gapX: 8,            // Espaçamento horizontal entre cards
    gapY: 8,            // Espaçamento vertical entre cards
  }
}
```

---

## 🎨 Sistema de Temas

O tema é controlado via `ThemeContext` e aplicado com a classe `data-theme` no `<html>` ou `<body>`:

```css
/* Tema Escuro (padrão) */
:root[data-theme="dark"] {
  --bg-primary: #0f0f13;
  --bg-secondary: #1a1a2e;
  --bg-glass: rgba(255, 255, 255, 0.05);
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --accent: #7c3aed;       /* Roxo vibrante */
  --accent-glow: rgba(124, 58, 237, 0.4);
  --border: rgba(255, 255, 255, 0.1);
}

/* Tema Claro */
:root[data-theme="light"] {
  --bg-primary: #f0f0f7;
  --bg-secondary: #ffffff;
  --bg-glass: rgba(0, 0, 0, 0.03);
  --text-primary: #111111;
  --text-secondary: #555577;
  --accent: #6d28d9;
  --accent-glow: rgba(109, 40, 217, 0.3);
  --border: rgba(0, 0, 0, 0.1);
}
```

**Regra de ouro:** Nunca use cores hardcoded (ex: `color: #fff`). Sempre use variáveis CSS (`color: var(--text-primary)`).

---

## 🌍 Sistema de Internacionalização (i18n)

O idioma é controlado via `LanguageContext`. Todas as strings de texto da UI ficam no arquivo `src/i18n/translations.js`:

```js
// Exemplo de estrutura de translations.js
export const translations = {
  pt: {
    title: "Gerador de QR Code",
    placeholder: "Digite um texto por linha...",
    download: "Baixar",
    // ...
  },
  en: {
    title: "QR Code Generator",
    placeholder: "Type one text per line...",
    download: "Download",
    // ...
  },
  es: {
    title: "Generador de Código QR",
    placeholder: "Escribe un texto por línea...",
    download: "Descargar",
    // ...
  }
};
```

**Regra:** Nunca escreva strings de UI diretamente nos componentes. Use sempre `t('chave')` via `useLanguage()`.

---

## 📦 Formatos de Código Suportados

| Tipo       | Identificador | Biblioteca       | Restrições de Entrada                          |
| ---------- | ------------- | ---------------- | ---------------------------------------------- |
| QR Code    | `"qr"`        | `qrcode.react`   | Qualquer texto, URL, JSON, etc. Até ~2953 bytes |
| Code 128   | `"code128"`   | `react-barcode`  | Qualquer caractere ASCII                        |
| Code 39    | `"code39"`    | `react-barcode`  | Apenas A-Z, 0-9 e alguns símbolos especiais     |
| EAN-13     | `"ean13"`     | `react-barcode`  | **Exatamente 13 dígitos numéricos**             |
| UPC        | `"upc"`       | `react-barcode`  | **Exatamente 12 dígitos numéricos**             |

> ⚠️ **Importante para IAs:** Ao gerar lógica de validação, lembre-se que EAN-13 e UPC têm requisitos estritos de formato. O app deve mostrar um erro claro ao usuário se o input não for válido para esses formatos.

---

## 📥 Lógica de Download (PNG)

A exportação é feita pela função `downloadImage.js`. O fluxo é:

1. Encontrar o elemento `<svg>` ou `<canvas>` do código gerado via `ref` ou `querySelector`.
2. Se for SVG: serializar com `XMLSerializer`, converter para `Blob`, criar URL e desenhar em `<canvas>`.
3. Usar `canvas.toDataURL("image/png")` para obter o Base64.
4. Criar um `<a>` temporário com `href` = Base64 e `download` = nome do arquivo, e clicar nele programaticamente.

---

## 🚀 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (http://localhost:5173)
npm run build    # Gera bundle otimizado em /dist para produção
npm run preview  # Serve o bundle de produção localmente para teste
npm run lint     # Verifica erros de linting no código
```

---

## 🌐 Deploy

O projeto é hospedado no **Netlify** (https://max-qr-code.netlify.app).

- Deploy automático: qualquer `push` para a branch `main` dispara um novo deploy.
- Build command: `npm run build`
- Publish directory: `dist`

---

## 📏 Convenções e Regras do Projeto

### Nomenclatura
- **Arquivos de componente:** PascalCase (`CodeCard.jsx`, `StyleControls.jsx`)
- **Hooks customizados:** camelCase com prefixo `use` (`useTheme.js`)
- **Utilitários:** camelCase (`downloadImage.js`, `parseInput.js`)
- **Contextos:** PascalCase com sufixo `Context` (`ThemeContext.jsx`)

### Componentes
- Sempre funcionais (sem classes).
- Props documentadas com comentário JSDoc no topo quando necessário.
- Animações sempre via `framer-motion` (não use `setTimeout` + CSS para animações complexas).
- Ícones sempre via `lucide-react`.

### CSS
- Cada componente tem seu próprio arquivo `.css` ou usa CSS Modules.
- Variáveis globais ficam em `global.css`.
- **Jamais** use `!important`.
- Breakpoints de responsividade: mobile-first.
  - `@media (max-width: 768px)` → mobile
  - `@media (max-width: 1024px)` → tablet

### Git
- Branch principal: `main`
- Commits em português, no formato:
  - `feat: adiciona suporte a EAN-13`
  - `fix: corrige download em Safari`
  - `style: ajusta espaçamento do header`
  - `refactor: simplifica hook useCodeGenerator`
  - `docs: atualiza CONTEXT.md`

---

## 🐞 Problemas Conhecidos e Atenções

1. **Safari e Download de SVG:** O método de download via `<a href>` com Blob pode não funcionar em Safari. Usar `canvas.toDataURL` é mais compatível.
2. **EAN-13 inválido:** Se o usuário inserir menos de 13 dígitos, `react-barcode` lança um erro silencioso. É necessário validar no `validators.js` antes de renderizar.
3. **Performance em massa:** Ao gerar mais de 200 códigos simultaneamente, pode haver lentidão. Usar `React.memo` nos `CodeCard` e `useMemo` na lista de itens é essencial.
4. **Framer Motion e listas grandes:** Evite usar `AnimatePresence` com `motion.div` em listas de mais de 50 itens — impacta a performance.

---

## 💡 Como uma IA deve trabalhar neste projeto

1. **Leia este arquivo primeiro** antes de fazer qualquer alteração.
2. **Nunca use TailwindCSS** — o projeto usa Vanilla CSS com variáveis.
3. **Nunca adicione dependências** sem verificar se já existe algo equivalente na lista de pacotes.
4. **Mantenha as convenções de nomenclatura** descritas acima.
5. **Teste mentalmente o fluxo de dados** antes de modificar qualquer hook ou contexto.
6. **Para adicionar um novo tipo de código:** adicione o identificador em `codeType`, a validação em `validators.js`, a renderização em `CodeCard.jsx` e o rótulo em `translations.js`.
7. **Para adicionar uma nova funcionalidade de UI:** crie o componente em `src/components/ui/`, estilize com CSS próprio usando variáveis globais, e importe onde necessário.

---

*Última atualização: Junho de 2026 | Mantido por Mateuslima09*
