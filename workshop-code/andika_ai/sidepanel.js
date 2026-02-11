/**
 * Side Panel Logic
 * Handles chat interactions, context menu tools, and settings management
 */

document.addEventListener('DOMContentLoaded', async () => {
  initializeTabs();
  const session = await initializeSession();
  setupChatListeners(session);
  await setupSettingsListeners();
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
 * Initializes the AI Language Model session with multimodal support.
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

    // Get user settings for shared context
    const settings = await AndikaSettings.getSettings();
    
    // Build system prompt with shared context
    let systemPrompt = "You are a helpful AI assistant.";
    
    if (settings.sharedContext && settings.sharedContext.trim()) {
      systemPrompt += ` ${settings.sharedContext}`;
    }

    // Simplified session options - just enable image support like the working example
    const sessionOptions = {
      systemPrompt: systemPrompt,
      expectedInputs: [{ type: "image" }]
    };

    console.log('Creating session with options:', sessionOptions);
    return await window.LanguageModel.create(sessionOptions);
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
 * @param {Array} images - Optional array of image data URLs to display
 * @returns {HTMLElement} The created message element
 */
function appendMessage(sender, text, images = []) {
  const chatHistory = document.getElementById('chat-history');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  
  // Add images if provided
  if (images && images.length > 0) {
    const imagesContainer = document.createElement('div');
    imagesContainer.classList.add('message-images');
    images.forEach(imageUrl => {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'Attached image';
      imagesContainer.appendChild(img);
    });
    messageDiv.appendChild(imagesContainer);
  }
  
  // Add text content
  const textDiv = document.createElement('div');
  textDiv.classList.add('message-text');
  
  // Render markdown for system messages
  if (sender === 'system') {
    textDiv.innerHTML = renderMarkdown(text);
  } else {
    textDiv.textContent = text;
  }
  
  messageDiv.appendChild(textDiv);
  chatHistory.appendChild(messageDiv);
  
  // Scroll to bottom smoothly
  requestAnimationFrame(() => {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  });
  
  return messageDiv;
}

/**
 * Simple markdown renderer
 */
function renderMarkdown(text) {
  // Escape HTML first
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Code blocks (```code```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
  });
  
  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * Sets up chat input listeners with multimodal support.
 * @param {LanguageModel} session - The active AI session
 */
function setupChatListeners(session) {
  const promptInput = document.getElementById('prompt-input');
  const sendBtn = document.getElementById('send-btn');
  const attachImageBtn = document.getElementById('attach-image-btn');
  const imageInput = document.getElementById('image-input');
  const attachmentsContainer = document.getElementById('input-attachments');
  
  let attachedImages = [];

  // Handle image attachment
  attachImageBtn.addEventListener('click', () => {
    imageInput.click();
  });

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          attachedImages.push({ blob: file, dataUrl: event.target.result });
          renderAttachments();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
    imageInput.value = ''; // Reset input
  });

  function renderAttachments() {
    attachmentsContainer.innerHTML = '';
    attachedImages.forEach((attachment, index) => {
      const preview = document.createElement('div');
      preview.className = 'attachment-preview';
      preview.innerHTML = `
        <img src="${attachment.dataUrl}" alt="Attachment ${index + 1}">
        <button class="attachment-remove" data-index="${index}">×</button>
      `;
      attachmentsContainer.appendChild(preview);
    });

    // Add remove listeners
    document.querySelectorAll('.attachment-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        attachedImages.splice(index, 1);
        renderAttachments();
      });
    });
  }

  async function onSend() {
    const text = promptInput.value.trim();
    if (!text && attachedImages.length === 0) return;

    // Collect image URLs for display
    const imageUrls = attachedImages.map(img => img.dataUrl);

    // Display user message with images
    let userMessageText = text || '';
    appendMessage('user', userMessageText, imageUrls);
    
    promptInput.value = '';
    promptInput.focus();

    if (!session) {
       session = await initializeSession();
       if (!session) {
         appendMessage('system', 'AI session not ready.');
         return;
       }
    }

    try {
      // Build multimodal prompt content
      const content = [];
      
      if (text) {
        content.push({ type: "text", value: text });
      }

      // Add images
      for (const attachment of attachedImages) {
        content.push({ type: "image", value: attachment.blob });
      }

      // Clear attachments
      attachedImages = [];
      renderAttachments();

      const stream = session.promptStreaming([
        {
          role: "user",
          content: content
        }
      ]);
      
      const messageDiv = appendMessage('system', '');
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        // Update only the text content, not the whole message
        const textDiv = messageDiv.querySelector('.message-text');
        if (textDiv) {
          textDiv.innerHTML = renderMarkdown(fullText);
        } else {
          messageDiv.innerHTML = renderMarkdown(fullText);
        }
        
        // Keep scroll at bottom during streaming
        const chatHistory = document.getElementById('chat-history');
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }
    } catch (e) {
      appendMessage('system', `Error: ${e.message}`);
      console.error(e);
    }
  }

  sendBtn.addEventListener('click', onSend);
  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
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
      const result = await AndikaAI.translateText(text, 'en', 'fr');
      
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
       const results = await AndikaAI.detectLanguage(text);
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

/**
 * Setup settings form listeners
 */
async function setupSettingsListeners() {
  const form = document.getElementById('settings-form');
  const resetBtn = document.getElementById('reset-btn');
  const statusDiv = document.getElementById('settings-status');

  // Load current settings
  const settings = await AndikaSettings.getSettings();
  document.getElementById('tone-select').value = settings.tone;
  document.getElementById('format-select').value = settings.format;
  document.getElementById('length-select').value = settings.length;
  document.getElementById('output-lang-select').value = settings.outputLanguage || 'auto';
  document.getElementById('context-input').value = settings.sharedContext;

  // Save settings
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newSettings = {
      tone: document.getElementById('tone-select').value,
      format: document.getElementById('format-select').value,
      length: document.getElementById('length-select').value,
      outputLanguage: document.getElementById('output-lang-select').value,
      sharedContext: document.getElementById('context-input').value,
      inputLanguages: ['en', 'es', 'ja'], // Only browser-supported languages
    };

    try {
      await AndikaSettings.saveSettings(newSettings);
      
      statusDiv.textContent = 'Settings saved successfully!';
      statusDiv.style.color = 'green';
      
      // Verify save by reading back
      const savedSettings = await AndikaSettings.getSettings();
      console.log('Verified saved settings:', savedSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      statusDiv.textContent = 'Failed to save settings: ' + error.message;
      statusDiv.style.color = 'red';
    }
    
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 3000);
  });

  // Reset settings
  resetBtn.addEventListener('click', async () => {
    await AndikaSettings.resetSettings();
    const defaults = await AndikaSettings.getSettings();
    
    document.getElementById('tone-select').value = defaults.tone;
    document.getElementById('format-select').value = defaults.format;
    document.getElementById('length-select').value = defaults.length;
    document.getElementById('output-lang-select').value = defaults.outputLanguage || 'auto';
    document.getElementById('context-input').value = defaults.sharedContext;

    statusDiv.textContent = 'Settings reset to defaults!';
    statusDiv.style.color = 'blue';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 3000);
  });
}
