---
title: "Built-in AI & Gemini Nano"
group: Core Concepts
order: 3
---

# Built-in AI & Gemini Nano

At the heart of our extension lies **Gemini Nano**, the most efficient model in the Gemini family, optimized for on-device tasks.

## The "Specialist" Approach

Chrome provides **Specialist APIs** for specific tasks, alongside the general **Prompt API**.

### 1. The Prompt API (`window.LanguageModel`)
The general-purpose interface for chatbots and complex reasoning.
```javascript
const session = await window.LanguageModel.create({ systemPrompt: "You are a helpful assistant." });
const stream = session.promptStreaming("Explain quantum physics.");
```

### 2. The Writer / Rewriter APIs (`window.Writer`, `window.Rewriter`)
Specialized for content generation and refinement.

### 3. The Translator API (`window.Translator`)
Real-time localization without server calls.

## Triggering Model Download

The first time a user uses an API, Chrome may need to download the model. You should provide a UI for this.

### Code Snippet: Triggering the Download

```javascript
// This function triggers the download and reports progress
await window.LanguageModel.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
       const percent = Math.round((e.loaded / e.total) * 100);
       console.log(`Downloading: ${percent}%`);
    });
  }
});
```

### Live Demo

Click the button below to attempt a model download on your device.

<!-- Interactive Demo -->
<div style="padding: 20px; border: 1px solid #ddd; background: #2d2d2d; border-radius: 8px; margin-top: 10px;">
  <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
    <button id="trigger-download-btn" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
      Trigger Download Now
    </button>
    <span id="demo-status" style="color: #ccc;">Status: Idle</span>
  </div>
  
  <div style="background:#444; height:10px; width:100%; border-radius: 5px; overflow: hidden;">
    <div id="demo-progress" style="background:#4f46e5; height:100%; width:0%; transition: width 0.3s;"></div>
  </div>
</div>

<script>
document.getElementById('trigger-download-btn').addEventListener('click', async () => {
    const btn = document.getElementById('trigger-download-btn');
    const status = document.getElementById('demo-status');
    const progress = document.getElementById('demo-progress');
    
    btn.disabled = true;
    btn.style.opacity = "0.5";
    status.textContent = "Checking availability...";
    
    try {
        if (!('LanguageModel' in window)) {
            status.textContent = "Error: LanguageModel API not supported in this browser.";
            btn.disabled = false;
            btn.style.opacity = "1";
            return;
        }

        const { available } = await window.LanguageModel.availability();
        
        if (available === 'no') {
             status.textContent = "Error: Model not available on this device.";
             btn.disabled = false;
             btn.style.opacity = "1";
             return;
        }
        
        if (available === 'readily') {
             status.textContent = "Success: Model is already downloaded and ready!";
             progress.style.width = "100%";
             btn.disabled = false;
             btn.style.opacity = "1";
             return;
        }
        
        // Trigger Download
        status.textContent = "Starting download...";
        await window.LanguageModel.create({
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progress.style.width = percent + '%';
                    status.textContent = `Downloading: ${percent}%`;
                });
            }
        });
        
        status.textContent = "Download Complete!";
        progress.style.width = "100%";
        
    } catch (err) {
        status.textContent = "Error: " + err.message;
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
});
</script>

## Use Cases
For more inspiration on what to build, check out the official [Built-in AI APIs Use Cases](https://developer.chrome.com/docs/ai/built-in-apis).
