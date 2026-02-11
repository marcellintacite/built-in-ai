// Open side panel on clicking the action icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Create welcome page on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: "welcome.html" });
});

// Handle messages from content scripts (e.g., requesting settings)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    // Get settings from chrome.storage and send back to content script
    chrome.storage.sync.get(["andikaSettings"], (result) => {
      const defaultSettings = {
        tone: "casual",
        format: "plain-text",
        length: "medium",
        sharedContext: "",
        inputLanguages: ["en", "es", "ja"], // Only browser-supported languages
        outputLanguage: "auto",
      };
      sendResponse(result.andikaSettings || defaultSettings);
    });
    return true; // Keep the message channel open for async response
  }
});
