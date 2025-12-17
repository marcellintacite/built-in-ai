---
title: Cross-Browser Support (Polyfill)
group: Advanced
order: 4
---

# Cross-Browser Support with Polyfills

One of the main challenges with "Built-in AI" today is browser support. Currently, the experimental APIs (like `window.LanguageModel`) are primarily available in **Chromium-based browsers** (Chrome Canary/Dev, Edge Canary).

But the vision is **AI Everywhere**, not just "AI in Chrome Canary".

## The Language Model Polyfill

To bridge this gap, we can use the **Language Model Polyfill**, created by Nico Martin.

**[> View on GitHub](https://github.com/nico-martin/language-model-polyfill)**

### What it does
This library provides a cross-platform implementation of Chrome's Prompt API using **Transformers.js** and **WebGPU**. It downloads and runs a model (like `Qwen3-4B` or `Phi-4-mini`) entirely in the browser, offering the same API surface as Chrome's native implementation.

### Key Features
- **Same API**: It polyfills `window.ai.languageModel` (or the newer `window.LanguageModel`).
- **WebGPU Powered**: Performance is accelerated by the user's GPU, making it viable on modern devices supporting WebGPU (Firefox, Safari, etc.).
- **On-Device**: Just like Gemini Nano, everything runs locally.

### How to use it

1.  **Install**:
    ```bash
    npm install language-model-polyfill
    ```

2.  **Import**:
    ```javascript
    import 'language-model-polyfill';
    ```

3.  **Run**:
    The polyfill will check if the native API is available. If not, it initializes the Transformers.js model. You can then use the standard Prompt API code found in our workshop:

    ```javascript
    const session = await window.LanguageModel.create();
    const result = await session.prompt("Hello from a polyfilled browser!");
    ```

## Vision for the Future

This polyfill demonstrates that the "Built-in AI" standard isn't tied to a single browser vendor. By agreeing on a standard API, we can allow browsers to ship their own optimized models (Gemini in Chrome, Llama in Firefox, Apple Intelligence in Safari) while developers write the same code once.
