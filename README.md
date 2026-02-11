# Chrome Built-in AI Workshop

A collection of projects demonstrating Chrome's Built-in AI APIs including Prompt API, Writer API, Rewriter API, Translator API, and Language Detection API.

## Projects

### 🤖 Andika AI - Chrome Extension

**Location**: `workshop-code/andika_ai/`

A privacy-focused Chrome extension providing on-device AI assistance with:

- **Multimodal Chat**: Send text and images to AI with markdown rendering
- **AI Writing Button**: Floating button on text inputs for instant rewriting
- **Settings**: Customizable tone, format, length, and shared context
- **Modern UI**: Warm golden design with smooth animations
- **100% Private**: All processing on-device with Gemini Nano

**Features**:

- Image analysis in chat
- Streaming AI responses
- Works on all text inputs (Gmail, LinkedIn, Twitter, etc.)
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- No data sent to servers

**[View Extension README →](workshop-code/andika_ai/README.md)**

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
│   └── andika_ai/            # Andika AI Extension
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
