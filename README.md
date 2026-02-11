# Chrome Built-in AI Workshop

A collection of projects demonstrating Chrome's Built-in AI APIs including Prompt API, Writer API, Rewriter API, Translator API, and Language Detection API.

## Projects

### 🤖 Andika AI - Chrome Extension
**Location**: `workshop-code/chrome-extension/`

A modern Chrome extension providing on-device AI assistance with:
- **Multimodal Chat**: Send text and images to AI with markdown rendering
- **Content Script**: Floating AI button on text inputs for rewriting
- **Settings**: Customizable tone, format, length, and shared context
- **Modern UI**: Glassmorphism design with smooth animations

**Features**:
- Image analysis in chat
- Streaming AI responses
- LinkedIn contenteditable support
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

**[View Extension README →](workshop-code/chrome-extension/README.md)**

### 📚 Documentation
**Location**: `docs/`

Comprehensive guides and examples for Chrome's Built-in AI APIs:
- Prompt API documentation
- Writer API examples
- Translator API usage
- Language Detection samples

## Getting Started

### Chrome Extension
```bash
cd workshop-code/chrome-extension
# Load unpacked extension in Chrome
```

### Requirements
- Chrome 127+ (for Prompt API)
- Built-in AI enabled in `chrome://flags`

## Project Structure

```
workshop/
├── workshop-code/
│   └── chrome-extension/     # Andika AI Extension
│       ├── manifest.json
│       ├── background.js
│       ├── sidepanel.html/css/js
│       ├── content.js/css
│       └── lib/
├── docs/                     # API Documentation
└── README.md                 # This file
```

## Technologies

- Chrome Built-in AI APIs (Prompt, Writer, Translator)
- Vanilla JavaScript
- Chrome Extension Manifest V3
- CSS Glassmorphism

## License

MIT
