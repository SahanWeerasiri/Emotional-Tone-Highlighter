/**
 * @file background.js
 * @description Background script for the Emotional Tone Highlighter extension. Handles extension events and content script injection.
 */

console.log('Background script loaded');

/**
 * @function initialize
 * @description Initializes the extension background script.
 */
function initialize() {
  console.log('Initializing extension background script');

  // Listen for tab updates to re-highlight when pages load
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
      console.log('Page loaded:', tab.url);

      // Inject and run highlighting after a short delay
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: () => {
            if (window.highlightText) {
              window.highlightText();
            }
          }
        }).catch(err => {
          console.log('Could not highlight page:', err.message);
        });
      }, 1000);
    }
  });

  // Create context menu for quick highlighting
  chrome.contextMenus.create({
    id: 'highlight-emotional-tone',
    title: 'Highlight Emotional Tones',
    contexts: ['page', 'selection']
  });

  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'highlight-emotional-tone') {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          // Remove existing highlights first
          document.querySelectorAll('.emotional-tone-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
          });

          // Re-highlight
          if (window.highlightText) {
            window.highlightText();
          }
        }
      }).catch(err => {
        console.log('Could not highlight page:', err.message);
      });
    }
  });

  console.log('Background script initialization complete');
}

initialize();