# Chrome Built-in AI Workshop 🚀

Welcome to the **Chrome Built-in AI Workshop**! In this session, you will learn how to build "AI Everywhere" experiences using Gemini Nano directly in the browser—local, private, and free.

## 📂 Project Structure

- **`docs/`**: The source for the workshop documentation site.
- **`workshop-code/`**:
    - **`chrome-extension/`**: The source code for the "AI Power Tools" extension we will build.
    - **`web-app/`**: A sample e-commerce web app to test your extension on.
- **`scripts/`**: Build scripts for generating the documentation site.

---

## 🛠️ Quick Start (Documentation Site)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm start
    ```
    Visit `http://localhost:3000` to see the workshop guide.

3.  **Build Static Site**:
    ```bash
    npm run build
    ```
    The output will be in the `dist/` folder.

---

## 🧩 Installing the Extension

To test the "AI Power Tools" extension:

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer Mode** (top right toggle).
3.  Click **Load unpacked**.
4.  Select the `workshop-code/chrome-extension` folder from this repository.
5.  Pin the extension to your toolbar!

---

## 🛍️ Running the Sample Web App

We have provided a sample "Global Gadgets" e-commerce site to test your AI tools (rewriting reviews, translating descriptions).

1.  Navigate to the web app folder:
    ```bash
    cd workshop-code/web-app
    ```
2.  Open `index.html` in your browser.
    -   *Or simply drag and drop the file into a Chrome tab.*

---

## 🚀 Deployment (Vercel)

This repository is configured to deploy the **Workshop Documentation Site**.

1.  **Build Command**: `npm run build`
2.  **Output Directory**: `dist`
3.  **Root Directory**: `.` (default)

The documentation site includes all the guides and code snippets needed for attendees to follow along.

---

## 📜 Workshop Agenda

1.  **Introduction**: Generally understanding the "AI Everywhere" vision.
2.  **Environment Setup**: Configuring Chrome Flags and downloading Gemini Nano.
3.  **Core Concepts**: Learning about the Prompt API, Rewriter API, and Translator API.
4.  **Build Guide**: Creating the "AI Power Tools" extension step-by-step.
5.  **Hybrid Mode**: Using Firebase AI Logic for cloud fallbacks.

Happy Coding! ✨
