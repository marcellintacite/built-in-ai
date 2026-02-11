const steps = [
  {
    id: 0,
    title: 'Introduction',
    content: `
      <h1>1. Introduction</h1>
      <p>
        Welcome to the Chrome Built-in AI workshop! In this codelab, you will learn how to build a Chrome Extension that leverages the new experimental <strong>Prompt API</strong> to access Gemini Nano, Chrome's built-in local AI model.
      </p>

      <h2>What is Chrome Built-in AI?</h2>
      <p>
        Chrome Built-in AI allows web applications to run AI models directly in the browser, on the user's device. This means:
      </p>
      <ul>
        <li><strong>Privacy:</strong> Data doesn't leave the device.</li>
        <li><strong>Latency:</strong> No network round-trips.</li>
        <li><strong>Cost:</strong> No server costs for inference.</li>
        <li><strong>Offline:</strong> Works without an internet connection.</li>
      </ul>

      <h2>What is Gemini Nano?</h2>
      <p>
        Gemini Nano is the most efficient version of the Gemini model family, designed to run locally on most modern desktop and laptop computers. It enables tasks such as:
      </p>
      <ul>
        <li><strong>Summarization:</strong> Condensing long text.</li>
        <li><strong>Translation:</strong> Converting text between languages.</li>
        <li><strong>Rewriting:</strong> Changing the tone or length of text.</li>
        <li><strong>Proofreading:</strong> Checking for grammar and spelling errors.</li>
        <li><strong>Autocomplete:</strong> Suggesting next words or sentences.</li>
      </ul>

      <h2>The Prompt API</h2>
      <p>
        The Prompt API is a flexible API that allows you to send natural language prompts to the local model and receive responses. It supports both one-shot (single response) and streaming (token by token) interactions.
      </p>
    `
  },
  {
    id: 1,
    title: 'Environment Check',
    content: `
      <h1>2. Environment Check</h1>
      <p>
        Before we begin, we need to ensure your environment is ready for the Prompt API. This API is currently experimental and requires specific setup.
      </p>

      <div class="warning-box" style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; margin-bottom: 1.5rem; border-radius: 0.25rem;">
        <strong style="color: #9a3412;">Requirements:</strong>
        <ul style="margin-bottom: 0; color: #9a3412;">
          <li><strong>Chrome Version:</strong> Chrome Canary 128.0.6545.0 or higher.</li>
          <li><strong>OS:</strong> Windows, macOS, or Linux.</li>
          <li><strong>Disk Space:</strong> At least 22 GB free.</li>
          <li><strong>Hardware:</strong> GPU support is recommended.</li>
        </ul>
      </div>

      <h2>Step 1: Enable Flags</h2>
      <p>
        1. Open Chrome Canary.
        <br />
        2. Navigate to <code>chrome://flags/#prompt-api-for-gemini-nano</code>.
        <br />
        3. Select <strong>Enabled</strong>.
        <br />
        4. Click <strong>Relaunch</strong> to restart Chrome.
      </p>

      <h2>Step 2: Confirm Availability</h2>
      <p>
        Open the Chrome DevTools Console (F12 or Cmd+Option+J) and run the following command:
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">await LanguageModel.availability();</code></pre>
      <p>
        If the result is <code>"available"</code>, you are good to go!
      </p>
      <p>
        If the result is <code>"no"</code> or <code>"after-download"</code>, proceed to the next step.
      </p>

      <h2>Step 3: Force Model Download</h2>
      <p>
        If the model is not available, try creating a session to trigger the download:
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">await LanguageModel.create();</code></pre>
      <p>
        After running this, go to <code>chrome://components</code> and look for <strong>Optimization Guide On Device Model</strong>.
      </p>
      <p>
        Click <strong>Check for update</strong>. You should see a version number equal to or greater than <strong>2024.5.21.1031</strong>.
      </p>
      <p>
        If it says "Component not updated" or similar, keep retrying or wait a few minutes. The download can take some time.
      </p>

      <h2>Step 4: Verify Again</h2>
      <p>
        Once the component is updated, relaunch Chrome and check availability again:
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">await LanguageModel.availability();</code></pre>
      <p>
        It should now return <code>"available"</code>.
      </p>

      <div class="info-box" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-top: 1.5rem; border-radius: 0.25rem;">
        <strong style="color: #1e40af;">Demo:</strong> You can also test if it works by visiting the <a href="https://chrome.dev/web-ai-demos/prompt-api-playground/" target="_blank" rel="noreferrer" style="color: #2563eb; text-decoration: underline;">Prompt API Playground</a>.
      </div>
    `
  },
  {
    id: 2,
    title: 'Chrome Extension Setup',
    content: `
      <h1>3. Chrome Extension Setup</h1>
      <p>
        We will create a simple Chrome Extension using Manifest V3.
      </p>

      <h2>Folder Structure</h2>
      <p>
        Create a new folder for your extension (e.g., <code>my-ai-extension</code>) and set up the following structure:
      </p>
      <pre>my-ai-extension/
├── manifest.json
├── background.js
├── popup.html
├── popup.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png</pre>

      <h2>manifest.json</h2>
      <p>
        Create a <code>manifest.json</code> file with the following content. Note the <code>"permissions"</code> section.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-json">{
  "manifest_version": 3,
  "name": "Chrome Built-in AI Demo",
  "version": "1.0",
  "description": "A demo extension using the Prompt API",
  "permissions": ["sidePanel", "storage"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}</code></pre>

      <h2>popup.html</h2>
      <p>
        Create a simple <code>popup.html</code> interface.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-html"><!DOCTYPE html>
<html>
<head>
  <title>AI Demo</title>
  <style>
    body { width: 300px; padding: 10px; font-family: sans-serif; }
    button { width: 100%; margin-bottom: 5px; padding: 8px; }
    #output { margin-top: 10px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h2>Built-in AI</h2>
  <button id="summarizeBtn">Summarize</button>
  <button id="translateBtn">Translate</button>
  <div id="output"></div>
  <script src="popup.js"></script>
</body>
</html></code></pre>

      <h2>background.js</h2>
      <p>
        Create an empty <code>background.js</code> file for now. We will add the AI logic here.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">// background.js - Logic will go here</code></pre>
    `
  },
  {
    id: 3,
    title: 'Use Prompt API',
    content: `
      <h1>4. Use the Prompt API</h1>
      <p>
        Now let's write the code to interact with the model. We'll put this logic in <code>background.js</code> or <code>popup.js</code>. For this demo, let's use <code>popup.js</code> for simplicity, but for heavy tasks, <code>background.js</code> or a Side Panel is better.
      </p>

      <h2>Check Availability</h2>
      <p>
        Always check if the model is available before using it.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">async function checkAvailability() {
  const availability = await LanguageModel.availability();
  console.log("Model availability:", availability);
  return availability;
}</code></pre>

      <h2>Create a Session</h2>
      <p>
        You need to create a session to send prompts. You can configure the system prompt here if needed.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">let session;

async function createSession() {
  if (!session) {
    session = await LanguageModel.create({
      systemPrompt: "You are a helpful assistant."
    });
  }
  return session;
}</code></pre>

      <h2>Run a One-Shot Prompt</h2>
      <p>
        For simple tasks, wait for the full response.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">async function runPrompt(prompt) {
  const session = await createSession();
  const result = await session.prompt(prompt);
  console.log("Result:", result);
  return result;
}</code></pre>

      <h2>Run a Streaming Prompt</h2>
      <p>
        For longer responses, stream the output to show progress to the user.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">async function runStreamingPrompt(prompt, onChunk) {
  const session = await createSession();
  const stream = session.promptStreaming(prompt);
  
  for await (const chunk of stream) {
    onChunk(chunk);
  }
}</code></pre>

      <h2>Track Download Progress</h2>
      <p>
        If the model needs to download, you can track the progress.
      </p>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">LanguageModel.create({
  monitor(m) {
    m.addEventListener("downloadprogress", (e) => {
      console.log(\`Downloaded \${e.loaded} of \${e.total} bytes.\`);
    });
  }
});</code></pre>
    `
  },
  {
    id: 4,
    title: 'Real Text Tasks',
    content: `
      <h1>5. Real Text Tasks</h1>
      <p>
        Let's implement specific functions for common AI tasks. Add these to your <code>popup.js</code>.
      </p>

      <h2>Summarize Text</h2>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">async function summarizeText(text) {
  const session = await LanguageModel.create({
    systemPrompt: "Summarize the following text in 3 bullet points."
  });
  return await session.prompt(text);
}</code></pre>

      <h2>Translate Text</h2>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">async function translateText(text, targetLanguage = "Spanish") {
  const session = await LanguageModel.create({
    systemPrompt: \`Translate the following text to \${targetLanguage}.\`
  });
  return await session.prompt(text);
}</code></pre>

      <h2>Rewrite Text</h2>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">async function rewriteText(text, tone = "professional") {
  const session = await LanguageModel.create({
    systemPrompt: \`Rewrite the following text to be more \${tone}.\`
  });
  return await session.prompt(text);
}</code></pre>

      <h2>Proofread Text</h2>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">async function proofreadText(text) {
  const session = await LanguageModel.create({
    systemPrompt: "Fix any grammar and spelling errors in the following text. Return only the corrected text."
  });
  return await session.prompt(text);
}</code></pre>
    `
  },
  {
    id: 5,
    title: 'UI Integration',
    content: `
      <h1>6. UI Integration</h1>
      <p>
        Now let's connect the UI to our logic. Update <code>popup.js</code> to handle button clicks.
      </p>

      <h2>Event Listeners</h2>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">document.addEventListener('DOMContentLoaded', () => {
  const outputDiv = document.getElementById('output');
  
  document.getElementById('summarizeBtn').addEventListener('click', async () => {
    outputDiv.textContent = "Summarizing...";
    try {
      // In a real extension, you might get this text from the active tab
      const textToSummarize = "Chrome Built-in AI is a powerful new feature that allows web developers to run large language models directly in the browser. This enables privacy-preserving, low-latency, and offline-capable AI applications without the need for complex server-side infrastructure.";
      
      const result = await summarizeText(textToSummarize);
      outputDiv.textContent = result;
    } catch (error) {
      outputDiv.textContent = "Error: " + error.message;
    }
  });

  document.getElementById('translateBtn').addEventListener('click', async () => {
    outputDiv.textContent = "Translating...";
    try {
      const textToTranslate = "Hello, world!";
      const result = await translateText(textToTranslate, "French");
      outputDiv.textContent = result;
    } catch (error) {
      outputDiv.textContent = "Error: " + error.message;
    }
  });
});</code></pre>

      <h2>Message Passing (Optional)</h2>
      <p>
        If your logic is in <code>background.js</code> (recommended for long tasks), use message passing.
      </p>
      
      <h3>popup.js</h3>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">chrome.runtime.sendMessage({ action: "summarize", text: "..." }, (response) => {
  document.getElementById('output').textContent = response.result;
});</code></pre>

      <h3>background.js</h3>
      <pre><button class="copy-button">Copy</button><code class="language-javascript">chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    summarizeText(request.text).then(result => {
      sendResponse({ result });
    });
    return true; // Keep channel open for async response
  }
});</code></pre>
    `
  },
  {
    id: 6,
    title: 'Testing',
    content: `
      <h1>7. Testing</h1>
      <p>
        Time to test your extension!
      </p>

      <h2>Load Unpacked Extension</h2>
      <ol>
        <li>Open <code>chrome://extensions</code>.</li>
        <li>Enable <strong>Developer mode</strong> (top right).</li>
        <li>Click <strong>Load unpacked</strong>.</li>
        <li>Select your <code>my-ai-extension</code> folder.</li>
      </ol>

      <h2>Debug in DevTools</h2>
      <p>
        Right-click your extension icon and select <strong>Inspect popup</strong> to open DevTools for the popup. You can see <code>console.log</code> output here.
      </p>
      <p>
        To debug the background script, click the <strong>service worker</strong> link in the extension card on <code>chrome://extensions</code>.
      </p>

      <h2>Check Model Status</h2>
      <p>
        If prompts are failing, check <code>chrome://components</code> again to ensure <strong>Optimization Guide On Device Model</strong> is fully downloaded and updated.
      </p>
    `
  },
  {
    id: 7,
    title: 'Wrap Up',
    content: `
      <h1>8. Wrap Up</h1>
      <p>
        Congratulations! You've built a Chrome Extension that uses the built-in Gemini Nano model.
      </p>

      <h2>Improvement Ideas</h2>
      <ul>
        <li><strong>Context Menu:</strong> Add a right-click menu option to summarize selected text on any page.</li>
        <li><strong>Side Panel:</strong> Use the Side Panel API for a persistent chat interface.</li>
        <li><strong>Settings:</strong> Allow users to configure the system prompt or temperature.</li>
      </ul>

      <h2>Optional Exercises</h2>
      <ol>
        <li>Implement a "Explain this code" feature for developer docs.</li>
        <li>Create a "Reply suggestion" tool for email.</li>
        <li>Build a "Tone changer" to make text more formal or casual.</li>
      </ol>

      <p>
        Happy coding with Chrome Built-in AI!
      </p>
    `
  }
];
