---
title: "Part 3: Rewrite Button"
group: "Build Guide: AI Extension"
order: 4
---

# Content Script: The Rewrite Button

This script runs on every page you visit. Its job is to detect when you are typing in a text field (like an email or tweet) and offer an "AI Rewrite" button.

## How it works
1.  **Detection**: Listens for `focusin` events on `<input>` and `<textarea>` elements.
2.  **Injection**: Creates a floating button near the active input.
3.  **AI Processing**: When clicked, it uses the **Writer** or **Rewriter API** to modify the text.

## Source Code (`content.js`)

Copy this into `chrome-extension/content.js`.

```javascript
let activeInput = null;
let rewriteBtn = null;

/**
 * Creates the floating 'Rewrite' button with SVG Icon.
 */
function createButton() {
  const btn = document.createElement('button');
  btn.className = 'ai-rewrite-btn';
  
  // Sparkle Icon SVG
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21.035l3-3.035 3 3.035-3-3.035-3 3.035zm12-9c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-12.014-9c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm5.014-3c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zM2.5 19.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"/>
    </svg>
    <span>Rewrite</span>
  `;
  document.body.appendChild(btn);
  
  // Handle click (mousedown prevents focus loss from input)
  btn.addEventListener('mousedown', async (e) => {
    e.preventDefault(); 
    if (activeInput) {
      await handleRewrite(activeInput);
    }
  });
  
  return btn;
}

/**
 * Positions the button near the active input field.
 */
function updateButtonPosition(input) {
  if (!rewriteBtn) return;
  
  const rect = input.getBoundingClientRect();
  // Position slightly above and to the right of the input
  rewriteBtn.style.top = \`\${window.scrollY + rect.top - 40}px\`; 
  rewriteBtn.style.left = \`\${window.scrollX + rect.right - 100}px\`; 
  
  // Trigger animation
  requestAnimationFrame(() => {
    rewriteBtn.classList.add('visible');
  });
}

// 1. Listen for focus events to show the button
document.addEventListener('focusin', (e) => {
  const target = e.target;
  // Check if it's a text input
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    if (target.tagName === 'INPUT' && !['text', 'search', 'email', 'url'].includes(target.type)) return;
    
    activeInput = target;
    if (!rewriteBtn) rewriteBtn = createButton();
    updateButtonPosition(target);
  }
});

// 2. Hide button when focus is lost
document.addEventListener('focusout', (e) => {
  setTimeout(() => {
    if (rewriteBtn && activeInput !== document.activeElement) {
      rewriteBtn.classList.remove('visible');
      activeInput = null;
    }
  }, 200);
});

/**
 * Main Logic: Calls the AI APIs
 */
async function handleRewrite(inputElement) {
  const originalText = inputElement.value;
  
  // UI: Show "Thinking..." state
  rewriteBtn.classList.add('thinking');
  const originalContent = rewriteBtn.innerHTML;
  rewriteBtn.innerHTML = `<span>Thinking...</span>`; // Simplified for readability
  // (See full example for the SVG spinner code)

  try {
    if (originalText.trim().length > 0) {
      // CASE A: Rewrite existing text
      if (!('Rewriter' in window)) {
         return alert('Chrome Rewriter API not available.');
      }
      
      const rewriter = await window.Rewriter.create();
      const result = await rewriter.rewrite(originalText);
      inputElement.value = result;
      
    } else {
      // CASE B: Write new text from scratch
      const userPrompt = prompt('What would you like to write about?');
      if (!userPrompt) return;
      
      const writer = await window.Writer.create({
          sharedContext: 'Writing assistance',
      });

      const stream = writer.writeStreaming(userPrompt);
      
      // Stream output directly into input field
      inputElement.value = '';
      for await (const chunk of stream) {
        inputElement.value += chunk;
      }
    }
  } catch (error) {
    console.error(error);
    alert('AI Error: ' + error.message);
  } finally {
    // UI: Reset button
    rewriteBtn.classList.remove('thinking');
    rewriteBtn.innerHTML = originalContent;
  }
}
```

## Styling (`content.css`)

Copy this into `chrome-extension/content.css`.

```css
/* Unique class name to avoid conflicts */
.ai-rewrite-btn {
  position: absolute;
  z-index: 10000;
  padding: 6px 12px;
  
  /* Glassmorphism Effect */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  color: white;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  cursor: pointer;
  opacity: 0; /* Hidden by default */
  transition: all 0.3s ease;
}

.ai-rewrite-btn.visible {
  opacity: 1;
  transform: translateY(0);
}

.ai-rewrite-btn.thinking {
  cursor: wait;
  background: #333; /* Darker when thinking */
}
```

> **Next**: Finally, let's build the [Side Panel](guide-sidepanel.md).
