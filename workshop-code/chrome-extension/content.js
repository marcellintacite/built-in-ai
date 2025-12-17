let activeInput = null;
let rewriteBtn = null;

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
  
  btn.addEventListener('mousedown', async (e) => {
    e.preventDefault(); // Prevent losing focus
    if (activeInput) {
      await handleRewrite(activeInput);
    }
  });
  
  return btn;
}

function updateButtonPosition(input) {
  if (!rewriteBtn) return;
  
  const rect = input.getBoundingClientRect();
  rewriteBtn.style.top = `${window.scrollY + rect.top - 40}px`; // Moved up slightly
  rewriteBtn.style.left = `${window.scrollX + rect.right - 100}px`; // Adjusted left
  
  // Use class for transition
  requestAnimationFrame(() => {
    rewriteBtn.classList.add('visible');
  });
}

document.addEventListener('focusin', (e) => {
  const target = e.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    // Modify: Only show for text-like inputs
    if (target.tagName === 'INPUT' && !['text', 'search', 'email', 'url'].includes(target.type)) return;
    
    activeInput = target;
    if (!rewriteBtn) rewriteBtn = createButton();
    updateButtonPosition(target);
  }
});

document.addEventListener('focusout', (e) => {
  setTimeout(() => {
    if (rewriteBtn && activeInput !== document.activeElement) {
      rewriteBtn.classList.remove('visible');
      activeInput = null;
    }
  }, 200);
});

async function handleRewrite(inputElement) {
  const originalText = inputElement.value;
  rewriteBtn.classList.add('thinking');
  // Store original innerHTML to restore icon later
  const originalContent = rewriteBtn.innerHTML;
  rewriteBtn.innerHTML = `
    <svg class="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Thinking...</span>
  `;
  
  try {
    if (originalText.trim().length > 0) {
      // Use Rewriter API
      if (!('Rewriter' in window)) {
        alert('Chrome Rewriter API not available.');
        return;
      }
      
      const availability = await window.Rewriter.availability();
      if (availability === 'no') {
        alert('Rewriter model not available on this device.');
        return;
      }

      const rewriter = await window.Rewriter.create({
        monitor(m) {
          m.addEventListener("downloadprogress", e => {
             console.log(`Rewriter download: ${e.loaded * 100}%`);
          });
        }
      });
      
      const result = await rewriter.rewrite(originalText);
      inputElement.value = result;
      
    } else {
      // Use Writer API (Ask user for content)
      const userPrompt = prompt('What would you like to write about?');
      if (!userPrompt) return;
      
      if (!('Writer' in window)) {
        alert('Chrome Writer API not available.');
        return;
      }

      const availability = await window.Writer.availability();
      if (availability === 'no') {
        alert('Writer model not available on this device.');
        return;
      }
      
      const options = {
          sharedContext: 'Writing assistance',
          tone: 'casual',
          format: 'plain-text',
          length: 'medium',
      };
      
      let writer;
      if (availability === 'readily') {
         writer = await window.Writer.create(options);
      } else {
         // Downloadable
         writer = await window.Writer.create({
            ...options,
            monitor(m) {
              m.addEventListener("downloadprogress", e => {
                console.log(`Writer download: ${e.loaded * 100}%`);
              });
            }
         });
      }

      const stream = writer.writeStreaming(userPrompt);
      
      inputElement.value = '';
      for await (const chunk of stream) {
        inputElement.value += chunk;
      }
    }
  } catch (error) {
    console.error(error);
    alert('AI Error: ' + error.message);
  } finally {
    rewriteBtn.classList.remove('thinking');
    rewriteBtn.innerHTML = originalContent;
  }
}
