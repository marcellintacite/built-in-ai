/**
 * Side Panel Logic
 * Handles chat interactions and context menu tool executions.
 */

document.addEventListener('DOMContentLoaded', async () => {
  initializeTabs();
  const session = await initializeSession();
  setupChatListeners(session);
  setupToolListeners();
});

/**
 * Sets up tab switching logic.
 */
function initializeTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
  });
}

/**
 * Initializes the AI Language Model session.
 * @returns {Promise<LanguageModel|null>} The AI session or null if unavailable.
 */
async function initializeSession() {
  if (!('LanguageModel' in window)) {
    appendMessage('system', 'System: LanguageModel API is not available.');
    return null;
  }
  try {
    const { available } = await window.LanguageModel.availability();
    if (available === 'no') {
      appendMessage('system', 'System: AI model not available.');
      return null;
    }
    return await window.LanguageModel.create({
      systemPrompt: "You are a helpful AI assistant."
    });
  } catch (e) {
    console.error('Failed to create session:', e);
    appendMessage('system', 'System: Failed to create AI session (' + e.message + ')');
    return null;
  }
}

/**
 * Appends a message to the chat history.
 * @param {string} sender - 'user' or 'system'
 * @param {string} text - The message content
 * @returns {HTMLElement} The created message element
 */
function appendMessage(sender, text) {
  const chatHistory = document.getElementById('chat-history');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  messageDiv.textContent = text;
  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  return messageDiv;
}

/**
 * Sets up chat input listeners.
 * @param {LanguageModel} session - The active AI session
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
       if (!session) {
         appendMessage('system', 'AI session not ready.');
         return;
       }
    }

    try {
      const stream = session.promptStreaming(text);
      const messageDiv = appendMessage('system', '');
      
      for await (const chunk of stream) {
        messageDiv.textContent += chunk;
        const chatHistory = document.getElementById('chat-history'); // Re-query or pass in
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }
    } catch (e) {
      appendMessage('system', `Error: ${e.message}`);
      console.error(e);
    }
  }

  sendBtn.addEventListener('click', onSend);
  promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') onSend();
  });
}

/**
 * Listens for messages from the background script (context menus).
 */
function setupToolListeners() {
  const toolOutput = document.getElementById('tool-output');

  chrome.runtime.onMessage.addListener((message) => {
    // Switch to tools tab
    document.querySelector('[data-tab="tools"]').click();
    
    const { action, text } = message;
    
    if (action === 'translate-selection') {
      renderTranslationTool(text, toolOutput);
    } else if (action === 'detect-language') {
      renderDetectionTool(text, toolOutput);
    }
  });
}

/**
 * Renders the translation tool UI and handles execution.
 * @param {string} text - The text to translate
 * @param {HTMLElement} container - The container to render into
 */
function renderTranslationTool(text, container) {
  container.innerHTML = `
    <p><strong>Selected Text:</strong> "${text}"</p>
    <button id="confirm-translate-btn" style="background:var(--primary-color);color:white;border:none;padding:8px;border-radius:4px;cursor:pointer;">Translate to French</button>
  `;
  
  document.getElementById('confirm-translate-btn').addEventListener('click', async () => {
    const btn = document.getElementById('confirm-translate-btn');
    btn.textContent = 'Translating...';
    btn.disabled = true;
    
    try {
        if (!('Translator' in self)) {
             container.innerHTML += `<p style="color:red">Translator API not supported.</p>`;
             return;
        }
        
        const translator = await self.Translator.create({
            sourceLanguage: 'en',
            targetLanguage: 'fr',
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded / e.total * 100}%`);
                });
            }
        });
        const result = await translator.translate(text);
        
        container.innerHTML = `
          <h3>Translation (En -> Fr)</h3>
          <p class="original">${text}</p>
          <hr>
          <p class="result">${result}</p>
        `;
    } catch (error) {
        container.innerHTML += `<p style="color:red">Error: ${error.message}</p>`;
    }
  });
}

/**
 * Renders the language detection tool UI and handles execution.
 * @param {string} text - The text to analyze
 * @param {HTMLElement} container - The container to render into
 */
function renderDetectionTool(text, container) {
   container.innerHTML = `
    <p><strong>Selected Text:</strong> "${text}"</p>
    <button id="confirm-detect-btn" style="background:var(--primary-color);color:white;border:none;padding:8px;border-radius:4px;cursor:pointer;">Detect Language</button>
  `;
  
  document.getElementById('confirm-detect-btn').addEventListener('click', async () => {
     const btn = document.getElementById('confirm-detect-btn');
     btn.textContent = 'Detecting...';
     btn.disabled = true;

     try {
        if (!('LanguageDetector' in self)) {
             container.innerHTML += `<p style="color:red">Language Detector API not supported.</p>`;
             return;
        }
        const detector = await self.LanguageDetector.create();
        const results = await detector.detect(text);
        
        const best = results[0];
        container.innerHTML = `
          <h3>Language Detected</h3>
          <p class="result">Language: <strong>${best.detectedLanguage}</strong></p>
          <p>Confidence: ${(best.confidence * 100).toFixed(1)}%</p>
        `;
     } catch (error) {
        container.innerHTML += `<p style="color:red">Error: ${error.message}</p>`;
     }
  });
}
