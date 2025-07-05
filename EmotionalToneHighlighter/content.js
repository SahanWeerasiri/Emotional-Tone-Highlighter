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

    const textNodes = Array.from(document.body.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);

    for (const toneDefinition of toneDefinitions) {
        const { keywords, color } = toneDefinition;
        const regexes = keywords.map(keyword => new RegExp(`\\b${keyword}\\b`, 'gi'));

        for (const textNode of textNodes) {
            if (!textNode.parentNode) continue;

            let text = textNode.nodeValue;
            let matchFound = false;

            for (const regex of regexes) {
                if (!text) continue;
                if (regex.test(text)) {
                    matchFound = true;
                    text = text.replace(regex, (match) => `<span style="background-color: ${color};">${match}</span>`);
                }
            }
            if (matchFound) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = text;
                Array.from(tempDiv.childNodes).forEach(child => {
                    textNode.parentNode.insertBefore(child, textNode);
                });
                textNode.remove();
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