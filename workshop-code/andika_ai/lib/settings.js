/**
 * Settings Manager - Handles user preferences storage
 * Uses chrome.storage.sync for cross-device synchronization
 * Exposed as global AndikaSettings object
 */

const AndikaSettings = (function() {
  'use strict';

  const DEFAULT_SETTINGS = {
    tone: 'casual',
    format: 'plain-text',
    length: 'medium',
    sharedContext: '',
    inputLanguages: ['en', 'es', 'ja'], // Only browser-supported languages
    outputLanguage: 'auto', // 'auto' means same as input
  };

  /**
   * Get all settings
   */
  async function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['andikaSettings'], (result) => {
        console.log('Loading settings:', result.andikaSettings || DEFAULT_SETTINGS);
        resolve(result.andikaSettings || DEFAULT_SETTINGS);
      });
    });
  }

  /**
   * Save settings
   */
  async function saveSettings(settings) {
    return new Promise((resolve, reject) => {
      console.log('Saving settings:', settings);
      chrome.storage.sync.set({ andikaSettings: settings }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving settings:', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          console.log('Settings saved successfully');
          resolve();
        }
      });
    });
  }

  /**
   * Get a specific setting
   */
  async function getSetting(key) {
    const settings = await getSettings();
    return settings[key];
  }

  /**
   * Update a specific setting
   */
  async function updateSetting(key, value) {
    const settings = await getSettings();
    settings[key] = value;
    await saveSettings(settings);
  }

  /**
   * Reset settings to defaults
   */
  async function resetSettings() {
    await saveSettings(DEFAULT_SETTINGS);
  }

  /**
   * Get Writer options from settings
   */
  async function getWriterOptions() {
    const settings = await getSettings();
    return {
      tone: settings.tone,
      format: settings.format,
      length: settings.length,
      sharedContext: settings.sharedContext,
    };
  }

  // Public API
  return {
    getSettings,
    saveSettings,
    getSetting,
    updateSetting,
    resetSettings,
    getWriterOptions,
  };
})();
