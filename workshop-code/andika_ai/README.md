# Andika AI - Chrome Extension

A modern Chrome extension that provides on-device AI assistance through content script injection and a powerful sidepanel chat interface with multimodal support.

## Features

### 💬 AI Chat
- **Multimodal Support**: Send text and images to the AI
- **Image Analysis**: Attach images and ask questions about them
- **Markdown Rendering**: Code blocks, inline code, bold, italic, and links
- **Streaming Responses**: Real-time AI responses
- **Keyboard Shortcuts**: `Enter` to send, `Shift+Enter` for new line

### 🔧 Content Script
- **Floating AI Button**: Appears on text inputs and textareas
- **LinkedIn Support**: Works with contenteditable elements
- **AI Rewriting**: Rewrite selected text with AI assistance

### ⚙️ Settings
- **Tone**: Casual, Formal, or Neutral
- **Format**: Plain Text or Markdown
- **Length**: Short, Medium, or Long
- **Shared Context**: Personal information for AI system prompt
- **Language Support**: English, Spanish, Japanese

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `chrome-extension` folder

## Usage

### Chat Interface
1. Click the extension icon to open the sidepanel
2. Type your message or attach an image using the 📷 button
3. Press `Enter` or click the send button (✈️)

### Content Script
1. Focus on any text input or textarea
2. A floating AI button will appear
3. Select text and click the button to rewrite with AI

## Technical Details

### Prompt API
The extension uses Chrome's built-in Prompt API with multimodal support:

```javascript
const session = await window.LanguageModel.create({
  systemPrompt: "You are a helpful AI assistant.",
  expectedInputs: [{ type: "image" }]
});
```

### Architecture
```
Extension
├── Content Script (on all pages)
│   └── Floating AI button on inputs
└── Sidepanel
    ├── Chat (with image support)
    └── Settings
```

## Files

- **manifest.json**: Extension configuration
- **background.js**: Service worker for extension lifecycle
- **sidepanel.html/css/js**: Chat interface
- **content.js/css**: Content script for floating button
- **lib/**: Shared utilities and settings management

## Requirements

- Chrome 127+ (for Prompt API)
- Built-in AI enabled in `chrome://flags`

## License

MIT
