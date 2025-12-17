document.addEventListener('DOMContentLoaded', async () => {
  const fab = document.getElementById('ai-fab');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-chat-close');
  const sendBtn = document.getElementById('ai-chat-send');
  const input = document.getElementById('ai-chat-input');
  const chatBody = document.getElementById('ai-chat-body');

  let session = null;

  // 1. Check Availability
  if (!('LanguageModel' in window)) {
    console.log('AI API not supported in this browser.');
    return;
  }

  try {
    // New Syntax: Use availability() to check availability
    const { available } = await LanguageModel.availability();
    if (available !== 'no') {
      fab.style.display = 'flex'; // Show FAB
    } else {
      console.log('AI model not available.');
    }
  } catch (e) {
    console.error('Error checking AI capabilities:', e);
  }

  // 2. Toggle Chat Window
  fab.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    fab.style.display = 'none';
    if (!session) initSession();
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    fab.style.display = 'flex';
  });

  // 3. Initialize Session
  async function initSession() {
    try {
      // Get page content for context
      const pageContent = document.querySelector('.markdown-body')?.innerText || document.body.innerText;
      const systemPrompt = `You are a helpful assistant for the "DevFest Kigali Built-in AI Workshop". 
      The user is currently reading a documentation page. 
      Here is the content of the page they are looking at:
      
      ---
      ${pageContent.substring(0, 4000)} 
      ---
      
      Answer their questions based on this context if relevant. Be concise.`;

      // New Syntax: create()
      session = await LanguageModel.create({
        systemPrompt: systemPrompt
      });
      
      appendMessage('model', 'Hello! I can help you understand this page. Ask me anything.');
    } catch (e) {
      console.error('Failed to create session:', e);
      appendMessage('system', 'Error: Could not start AI session.');
    }
  }

  // 4. Send Message
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    if (!session) await initSession();

    try {
      const responseDiv = appendMessage('model', 'Thinking...');
      
      // New Syntax: promptStreaming()
      const stream = session.promptStreaming(text);
      
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        responseDiv.textContent = fullResponse;
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    } catch (e) {
      console.error('Prompt failed:', e);
      appendMessage('system', 'Error: Failed to get response.');
    }
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `ai-message ${role}`;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  }
});
