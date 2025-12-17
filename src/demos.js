document.addEventListener('DOMContentLoaded', () => {
  // Shared Helper to update status
  function updateStatus(elementId, message, type = 'info') {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.className = `status-message ${type}`;
    }
  }

  // --- 1. Summarizer Demo ---
  const summarizeBtn = document.getElementById('demo-summarize-btn');
  if (summarizeBtn) {
    summarizeBtn.addEventListener('click', async () => {
      const input = document.getElementById('demo-summary-input').value;
      const output = document.getElementById('demo-summary-output');
      
      if (!input) return;
      output.textContent = "Summarizing...";
      
      try {
        if (!window.Summarizer) throw new Error("Summarizer API not active.");
        const available = (await Summarizer.availability()).available;
        if (available === 'no') throw new Error("Summarizer model not available.");

        const summarizer = await Summarizer.create({ type: 'key-points', format: 'plain-text' });
        const result = await summarizer.summarize(input);
        output.innerHTML = marked.parse(result);
        summarizer.destroy();
      } catch (e) {
        output.textContent = "Error: " + e.message + " (This demo requires Chrome Canary with flags enabled)";
      }
    });
  }

  // --- 2. Translator Demo ---
  const translateBtn = document.getElementById('demo-translate-btn');
  if (translateBtn) {
    translateBtn.addEventListener('click', async () => {
      const input = document.getElementById('demo-translate-input').value;
      const targetLang = document.getElementById('demo-translate-target').value;
      const output = document.getElementById('demo-translate-output');

      if (!input) return;
      output.innerHTML = "<em>Translating...</em>";

      try {
        if (!window.Translator) throw new Error("Translator API not active.");
        const available = (await Translator.availability({ sourceLanguage: 'en', targetLanguage: targetLang })).available;
        if (available === 'no') throw new Error("Translation pair not available.");

        const translator = await Translator.create({ sourceLanguage: 'en', targetLanguage: targetLang });
        const result = await translator.translate(input);
        output.innerHTML = marked.parse(result);
      } catch (e) {
        output.textContent = "Error: " + e.message;
      }
    });
  }

  // --- 3. Language Detector Demo ---
  const detectBtn = document.getElementById('demo-detect-btn');
  if (detectBtn) {
    detectBtn.addEventListener('click', async () => {
      const input = document.getElementById('demo-detect-input').value;
      const output = document.getElementById('demo-detect-output');

      if (!input) return;
      output.innerHTML = "<em>Detecting...</em>";

      try {
        if (!window.LanguageDetector) throw new Error("LanguageDetector API not active.");
        const available = (await LanguageDetector.availability()).available;
        if (available === 'no') throw new Error("LanguageDetector model not available.");

        const detector = await LanguageDetector.create();
        const results = await detector.detect(input);
        
        // Format results
        output.innerHTML = results.map(r => 
          `<div><strong>${r.detectedLanguage}</strong>: ${(r.confidence * 100).toFixed(1)}%</div>`
        ).join('');
        
      } catch (e) {
        output.textContent = "Error: " + e.message;
      }
    });
  }

  // --- 4. Writer Demo ---
  const writeBtn = document.getElementById('demo-write-btn');
  if (writeBtn) {
    writeBtn.addEventListener('click', async () => {
      const input = document.getElementById('demo-write-input').value;
      const output = document.getElementById('demo-write-output');

      if (!input) return;
      output.innerHTML = "<em>Writing...</em>";

      try {
        if (!window.Writer) throw new Error("Writer API not active.");
        const available = (await Writer.availability()).available;
        if (available === 'no') throw new Error("Writer model not available.");

        const writer = await Writer.create({ tone: 'formal', format: 'markdown' });
        const stream = writer.writeStreaming(input);
        
        let fullText = "";
        for await (const chunk of stream) {
          fullText += chunk;
          output.innerHTML = marked.parse(fullText);
        }
        writer.destroy();
      } catch (e) {
        output.textContent = "Error: " + e.message;
      }
    });
  }

  // --- 5. Rewriter Demo ---
  const rewriteBtn = document.getElementById('demo-rewrite-btn');
  if (rewriteBtn) {
    rewriteBtn.addEventListener('click', async () => {
      const input = document.getElementById('demo-rewrite-input').value;
      const tone = document.getElementById('demo-rewrite-tone').value;
      const output = document.getElementById('demo-rewrite-output');

      if (!input) return;
      output.innerHTML = "<em>Rewriting...</em>";

      try {
        if (!window.Rewriter) throw new Error("Rewriter API not active.");
        const available = (await Rewriter.availability()).available;
        if (available === 'no') throw new Error("Rewriter model not available.");

        const rewriter = await Rewriter.create({ tone: tone, length: 'as-is' });
        const result = await rewriter.rewrite(input);
        output.innerHTML = marked.parse(result);
        rewriter.destroy();
      } catch (e) {
        output.textContent = "Error: " + e.message;
      }
    });
  }
});
