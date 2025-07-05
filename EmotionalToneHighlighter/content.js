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
      const toneDefinitions = result.toneDefinitions || [];
      resolve(toneDefinitions);
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
        return; // No tones defined, do nothing
    }

    // Iterate through tone definitions and highlight text.
    toneDefinitions.forEach(toneDefinition => {
        const { tone, keywords, color } = toneDefinition;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi'); // Use word boundaries to match whole words
            const spans = document.body.innerHTML.matchAll(regex);
            for (const span of spans){
                const replacement = `<span style="background-color: ${color};">${span[0]}</span>`;
                document.body.innerHTML = document.body.innerHTML.replace(regex, replacement);
            }
        });
    });
}

/**
 * @function initialize
 * @description Initializes the content script by running highlightText().
 */
async function initialize() {
    await highlightText();
}

initialize();
