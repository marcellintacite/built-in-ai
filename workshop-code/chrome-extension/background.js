// Open side panel on clicking the action icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Create context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translate-selection',
    title: 'Translate Selection',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'detect-language',
    title: 'Detect Language',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-selection' || info.menuItemId === 'detect-language') {
    // Open the side panel first just in case it's closed
    chrome.sidePanel.open({ windowId: tab.windowId }, () => {
      // Small delay to ensure sidepanel is ready to receive message
      setTimeout(() => {
        chrome.runtime.sendMessage({
          action: info.menuItemId,
          text: info.selectionText
        });
      }, 500);
    });
  }
});
