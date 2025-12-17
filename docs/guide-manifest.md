---
title: "Part 1: Manifest & Configuration"
group: "Build Guide: AI Extension"
order: 2
---

# Extension Configuration (`manifest.json`)

The `manifest.json` file is the blueprint of your Chrome Extension. It defines permissions, background scripts, and UI elements.

## Code Explanation

We need several specific permissions for this workshop:

-   `sidePanel`: To show the AI chat assistant.
-   `contextMenus`: To add "Translate" options to the right-click menu.
-   `activeTab`: To access the current page's content when needed.
-   `scripting`: To execute scripts if we needed simpler injection (though we use `content_scripts` here).

## Source Code

Copy this into `chrome-extension/manifest.json`.

```json
{
  "manifest_version": 3,
  "name": "Chrome Built-in AI Workshop",
  "version": "1.0",
  "description": "Demonstrates Chrome's Built-in AI APIs.",
  "permissions": [
    "sidePanel",
    "contextMenus",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  // The background Service Worker handles Context Menus
  "background": {
    "service_worker": "background.js"
  },
  // Define our AI Assistant Side Panel
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  // The Toolbar Icon configuration
  "action": {
    "default_title": "Open AI Assistant"
  },
  // Scripts injected into web pages (The Rewrite Button)
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "icons": {
    "16": "images/icon-16.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  }
}
```

> **Next**: Let's set up the [Background Script](guide-background.md).
