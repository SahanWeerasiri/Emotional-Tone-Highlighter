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

    if (!toneDefinitions || toneDefinitions.length === 0) {
        return;
    }

    const textNodes = Array.from(document.body.querySelectorAll('*:not(script):not(style):not(iframe):not(textarea):not(input):not(head) *'))
        .filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0);

    for (const toneDefinition of toneDefinitions) {
        const { keywords, color } = toneDefinition;
        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');

        for (const textNode of textNodes) {
            if (!textNode.parentNode) continue;

            const originalText = textNode.nodeValue;
            if (regex.test(originalText)) {
                const replacementText = originalText.replace(regex, (match) => `<span style="background-color: ${color};">${match}</span>`);
                if (replacementText !== originalText) {
                    const tempDiv = document.createElement('span');
                    tempDiv.innerHTML = replacementText;
                    const fragment = document.createDocumentFragment();
                    Array.from(tempDiv.childNodes).forEach(child => fragment.appendChild(child));
                    textNode.parentNode.replaceChild(fragment, textNode);
                }
            }
        }
    }
}

/**
 * @function initialize
 * @description Initializes the content script by running highlightText().
 */
async function initialize() {
    await highlightText();
}

initialize();