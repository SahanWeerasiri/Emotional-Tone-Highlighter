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
    console.error('Error injecting content script for tab', tabId, ':', error);
  }
}

/**
 * @function initialize
 * @description Initializes the extension, including setting up listeners.
 */
function initialize() {
  const urlFilter = { url: [{ urlMatches: '^https?://.*' }] };

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      await injectContentScript(tabId);
    }
  }, urlFilter);
}

initialize();