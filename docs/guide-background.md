---
title: "Part 2: Background Script"
group: "Build Guide: AI Extension"
order: 3
---

# Background Script (`background.js`)

The service worker runs in the background and manages extension events. For our "AI Power Tools", it handles two main jobs:
1.  Opening the Side Panel when the icon is clicked.
2.  Creating and handling Context Menu items (Right-click "Translate").

## Code Explanation

We use `chrome.contextMenus.create` to add items to the browser's right-click menu. When clicked, we send a message to the Side Panel containing the selected text.

## Source Code

Copy this into `chrome-extension/background.js`.

```javascript
// 1. Configure the Side Panel to open when the toolbar icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// 2. Create Context Menus when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Menu item for Translation
  chrome.contextMenus.create({
    id: 'translate-selection',
    title: 'Translate Selection',
    contexts: ['selection'] // Only show when text is selected
  });

  // Menu item for Language Detection
  chrome.contextMenus.create({
    id: 'detect-language',
    title: 'Detect Language',
    contexts: ['selection']
  });
});

// 3. Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-selection' || info.menuItemId === 'detect-language') {
    
    // Open the side panel first just in case it's closed
    chrome.sidePanel.open({ windowId: tab.windowId }, () => {
      
      // Small delay to ensure sidepanel is ready to receive message
      setTimeout(() => {
        // Send the selected text to the Side Panel
        chrome.runtime.sendMessage({
          action: info.menuItemId,
          text: info.selectionText
        });
      }, 500);
      
    });
  }
});
```

> **Next**: Let's build the [Rewrite Button](guide-content-script.md).
