/**
 * @file background.js
 * @description Background script for the Emotional Tone Highlighter extension. Handles extension events and content script injection.
 */

/**
 * @function injectContentScript
 * @description Injects the content script into a specified tab.
 * @param {number} tabId - The ID of the tab to inject the script into.
 */
async function injectContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js'],
    });
  } catch (error) {
    console.error('Error injecting content script:', error);
  }
}

/**
 * @function initialize
 * @description Initializes the extension, including setting up listeners.
 */
function initialize() {
    // Listen for tab updates to inject the content script.
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
            injectContentScript(tabId);
        }
    });
}

initialize();
