---
title: Environment Setup
group: Getting Started
order: 2
---

# Environment Setup

Before using the Built-in AI APIs, ensure your development environment meets the necessary requirements.

## 1. Browser Requirements
These APIs are currently experimental. You may need to use:
- **Chrome Dev** or **Chrome Canary** (Version 138+ recommended)
- **Chrome Stable** (check for specific API availability)

## 2. Hardware Requirements
To run Gemini Nano locally, your device must meet these specs:
- **Operating System**: Windows 10/11, macOS 13+ (Ventura+), Linux, or ChromeOS (Chromebook Plus).
- **RAM**: At least 16 GB (recommended).
- **Video Memory (VRAM)**: Strictly more than 4 GB (if using GPU acceleration).
- **Free Disk Space**: At least 22 GB available (the model itself is smaller, but this is a safety check).
- **Network**: Unmetered connection (for initial model download).

## 3. Enable APIs on Localhost

By default, some APIs might be restricted. To develop on `localhost` or `127.0.0.1`:

1.  Open `chrome://flags/#optimization-guide-on-device-model`.
    -   Select **Enabled BypassPrefRequirement**.
2.  Open `chrome://flags/#prompt-api-for-gemini-nano`.
    -   Select **Enabled**.
3.  **Relaunch Chrome**.

## 4. Verify Setup

Open the **DevTools Console** (F12) and run:

```javascript
await window.LanguageModel.availability();
```

-   **"available"**: You are ready to go!
-   **"downloadable"**: Chrome needs to download the model (see below).
-   **"no"** / **"unavailable"**: Your device or browser version isn't supported yet.

### Troubleshooting
If the model doesn't work:
1.  Go to `chrome://on-device-internals`.
2.  Check the **Model Status** tab for errors.
3.  Ensure you have completely restarted Chrome after setting flags.
