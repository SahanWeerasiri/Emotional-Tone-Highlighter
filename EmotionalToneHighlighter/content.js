/**
 * @file content.js
 * @description Content script for the Emotional Tone Highlighter extension. Analyzes text and highlights based on user-defined tones.
 */

/**
 * @typedef {Object} ToneDefinition
 * @property {string} tone - The emotional tone (e.g., 'happy').
 * @property {string[]} keywords - An array of keywords associated with the tone.
 * @property {string} color - The highlight color for the tone.
 */

/**
 * @function getToneDefinitions
 * @description Retrieves tone definitions from local storage.
 * @returns {Promise<ToneDefinition[]>} - A promise that resolves with an array of tone definitions.
 */
async function getToneDefinitions() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['toneDefinitions'], (result) => {
            console.log('Retrieved tone definitions:', result.toneDefinitions || []);
            resolve(result.toneDefinitions || []);
        });
    });
}

/**
 * @function highlightText
 * @description Highlights text on the page based on tone definitions.
 */
async function highlightText() {
    const toneDefinitions = await getToneDefinitions();
    console.log('Starting text highlight with definitions:', toneDefinitions);

    if (!toneDefinitions || toneDefinitions.length === 0) {
        console.log('No tone definitions found, skipping highlighting');
        return;
    }

    // Get all text nodes properly
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                // Skip script, style, and other non-content elements
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;

                const tagName = parent.tagName.toLowerCase();
                if (['script', 'style', 'noscript', 'iframe', 'object', 'embed'].includes(tagName)) {
                    return NodeFilter.FILTER_REJECT;
                }

                // Only process nodes with meaningful text
                if (node.nodeValue.trim().length === 0) {
                    return NodeFilter.FILTER_REJECT;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    console.log(`Found ${textNodes.length} text nodes to process`);

    for (const toneDefinition of toneDefinitions) {
        const { tone, keywords, color } = toneDefinition;
        console.log(`Processing tone: ${tone} with ${keywords.length} keywords and color: ${color}`);

        if (!keywords || keywords.length === 0) continue;

        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');

        for (const textNode of textNodes) {
            if (!textNode.parentNode) {
                console.log('Skipping node with no parent');
                continue;
            }

            const originalText = textNode.nodeValue;
            if (regex.test(originalText)) {
                console.log(`Match found for tone "${tone}" in: "${originalText.substring(0, 50)}${originalText.length > 50 ? '...' : ''}"`);

                const replacementText = originalText.replace(regex, (match) => {
                    console.log(`Highlighting "${match}" with color ${color}`);
                    return `<span class="emotional-tone-highlight" style="background-color: ${color};" data-tone="${tone}">${match}</span>`;
                });

                if (replacementText !== originalText) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = replacementText;
                    const fragment = document.createDocumentFragment();

                    while (tempDiv.firstChild) {
                        fragment.appendChild(tempDiv.firstChild);
                    }

                    textNode.parentNode.replaceChild(fragment, textNode);
                }
            }
        }
    }
    console.log('Highlighting process completed');
}

// Make highlightText available globally for popup script
window.highlightText = highlightText;

/**
 * @function initialize
 * @description Initializes the content script by running highlightText().
 */
async function initialize() {
    console.log('Initializing content script');

    // Wait a bit for the page to fully load
    setTimeout(async () => {
        await highlightText();
        console.log('Content script initialization complete');
    }, 500);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'ping') {
        sendResponse({ status: 'active' });
        return true;
    }
    if (request.action === 'highlight') {
        highlightText();
        sendResponse({ status: 'highlighted' });
        return true;
    }
});

// Re-run highlighting when storage changes (when user saves new tones)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.toneDefinitions) {
        console.log('Tone definitions changed, re-highlighting...');

        // Remove existing highlights first
        document.querySelectorAll('.emotional-tone-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });

        // Re-highlight with new definitions
        setTimeout(() => {
            highlightText();
        }, 100);
    }
});

initialize();