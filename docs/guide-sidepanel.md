---
title: "Part 4: Side Panel AI"
group: "Build Guide: AI Extension"
order: 5
---

# Side Panel AI Assistant

The Side Panel acts as a persistent AI assistant that stays with the user across tabs. It handles:
1.  **Chat**: General Q&A using the Prompt API.
2.  **Tools**: Handling Translation and Detection requests from the background script.

## UI Structure (`sidepanel.html`)

A simple structure with Tabs (Chat vs Tools) and a chat history area.

```html
<!-- sidepanel.html -->
<div class="container">
  <nav class="tabs">
    <button class="tab-btn active" data-tab="chat">Chat</button>
    <button class="tab-btn" data-tab="tools">Tools</button>
  </nav>

  <main id="chat-tab" class="tab-content active">
    <div id="chat-history"></div>
    <textarea id="prompt-input"></textarea>
    <button id="send-btn">Send</button>
  </main>

  <main id="tools-tab" class="tab-content">
    <div id="tool-output"></div>
  </main>
</div>
<script src="sidepanel.js"></script>
```

## Logic (`sidepanel.js`)

This is the brain of the side panel.

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  initializeTabs();
  
  // 1. Initialize the General Prompt API Session
  const session = await initializeSession();
  
  // 2. Setup Listeners
  setupChatListeners(session); // Handle Chat
  setupToolListeners();        // Handle Context Menu Messages
});

/* ... Helper Functions ... */

/**
 * Initializes the AI Session (Prompt API)
 */
async function initializeSession() {
  const { available } = await window.LanguageModel.availability();
  if (available === 'no') return null;
  
  return await window.LanguageModel.create({
    systemPrompt: "You are a helpful AI assistant."
  });
}

/**
 * Sets up chat input listeners.
 */
function setupChatListeners(session) {
  const promptInput = document.getElementById('prompt-input');
  const sendBtn = document.getElementById('send-btn');

  async function onSend() {
    const text = promptInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    promptInput.value = '';

    if (!session) {
       session = await initializeSession();
       if (!session) return appendMessage('system', 'AI session not ready.');
    }

    try {
      const stream = session.promptStreaming(text);
      const messageDiv = appendMessage('system', '');
      
      for await (const chunk of stream) {
        // ACCUMULATE the chunks (do not overwrite)
        messageDiv.textContent += chunk; 
        const chatHistory = document.getElementById('chat-history');
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }
    } catch (e) {
      appendMessage('system', `Error: ${e.message}`);
    }
  }

  sendBtn.addEventListener('click', onSend);
}

/**
 * Handles Logic for "Translate Selection" context menu
 */
function setupToolListeners() {
  chrome.runtime.onMessage.addListener((message) => {
    // message = { action: 'translate-selection', text: '...' }
    
    if (message.action === 'translate-selection') {
      // Use the Translator API
      const translator = await window.Translator.create({
          targetLanguage: 'fr' 
      });

      const toolOutput = document.getElementById('tool-output');
      toolOutput.innerHTML = `
        <p>Original: ${message.text}</p>
        <p>Translation: <span id="translation-result"></span></p>
      `;
      const translationResultSpan = document.getElementById('translation-result');

      const stream = await translator.translate(message.text);
      for await (const chunk of stream) {
        translationResultSpan.textContent += chunk;
        toolOutput.scrollTop = toolOutput.scrollHeight; // Scroll to bottom
      }
    }
  });
}
```

> **Congratulations!** You have built the full "AI Power Tools" extension.
