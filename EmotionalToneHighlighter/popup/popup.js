/**
 * @file popup.js
 * @description Manages the popup UI for the Emotional Tone Highlighter extension.
 */

/**
 * @function addToneInput
 * @description Adds a new tone input field to the popup.
 */
function addToneInput() {
  const toneContainer = document.getElementById('tone-container');
  if (!toneContainer) {
    console.error('Tone container not found.');
    return;
  }

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('tone-input-group');

  const toneInput = document.createElement('input');
  toneInput.type = 'text';
  toneInput.placeholder = 'Tone (e.g., happy)';
  toneInput.classList.add('tone-input');

  const keywordsInput = document.createElement('input');
  keywordsInput.type = 'text';
  keywordsInput.placeholder = 'Keywords (comma-separated)';
  keywordsInput.classList.add('keywords-input');

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = '#ff0000';
  colorInput.classList.add('color-input');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => {
    inputGroup.remove();
  });

  inputGroup.appendChild(toneInput);
  inputGroup.appendChild(keywordsInput);
  inputGroup.appendChild(colorInput);
  inputGroup.appendChild(deleteButton);
  toneContainer.appendChild(inputGroup);
}

/**
 * @function saveTones
 * @description Saves the defined tones to local storage.
 */
function saveTones() {
  const toneGroups = document.querySelectorAll('.tone-input-group');
  const toneDefinitions = [];

  toneGroups.forEach(group => {
    const toneInput = group.querySelector('.tone-input');
    const keywordsInput = group.querySelector('.keywords-input');
    const colorInput = group.querySelector('.color-input');

    if (toneInput && keywordsInput && colorInput &&
      toneInput.value.trim() !== '' && keywordsInput.value.trim() !== '') {
      const keywords = keywordsInput.value.split(',').map(k => k.trim()).filter(k => k.length > 0);
      toneDefinitions.push({
        tone: toneInput.value.trim(),
        keywords: keywords,
        color: colorInput.value
      });
    }
  });

  chrome.storage.local.set({ toneDefinitions: toneDefinitions }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving tones:', chrome.runtime.lastError);
      showStatus('Error saving tones!', 'error');
    } else {
      console.log('Tones saved successfully:', toneDefinitions);
      showStatus('Tones saved successfully!', 'success');
    }
  });
}

/**
 * @function showStatus
 * @description Shows a status message to the user.
 */
function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('status-message');
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = `status-${type}`;
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = '';
    }, 3000);
  }
}

/**
 * @function highlightCurrentPage
 * @description Triggers highlighting on the current active tab.
 */
async function highlightCurrentPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        // Remove existing highlights
        document.querySelectorAll('.emotional-tone-highlight').forEach(el => {
          const parent = el.parentNode;
          parent.replaceChild(document.createTextNode(el.textContent), el);
          parent.normalize();
        });

        // Trigger re-highlighting
        if (window.highlightText) {
          window.highlightText();
        }
      }
    });

    showStatus('Page highlighted successfully!', 'success');
  } catch (error) {
    console.error('Error highlighting page:', error);
    showStatus('Error highlighting page!', 'error');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const addToneButton = document.getElementById('add-tone-button');
  if (addToneButton) {
    addToneButton.addEventListener('click', addToneInput);
  }

  const saveButton = document.getElementById('save-button');
  if (saveButton) {
    saveButton.addEventListener('click', saveTones);
  }

  const highlightButton = document.getElementById('highlight-button');
  if (highlightButton) {
    highlightButton.addEventListener('click', highlightCurrentPage);
  }

  // Load existing tone definitions
  chrome.storage.local.get('toneDefinitions', (result) => {
    const savedToneDefinitions = result.toneDefinitions || [];
    savedToneDefinitions.forEach(toneData => {
      addToneInput();
      const lastInputGroup = document.querySelector('.tone-input-group:last-child');
      if (lastInputGroup) {
        const toneInput = lastInputGroup.querySelector('.tone-input');
        const keywordsInput = lastInputGroup.querySelector('.keywords-input');
        const colorInput = lastInputGroup.querySelector('.color-input');

        if (toneInput) {
          toneInput.value = toneData.tone;
        }
        if (keywordsInput) {
          keywordsInput.value = toneData.keywords.join(', ');
        }
        if (colorInput) {
          colorInput.value = toneData.color;
        }
      }
    });

    // Add a default tone if none exist
    if (savedToneDefinitions.length === 0) {
      addToneInput();
      const defaultGroup = document.querySelector('.tone-input-group:last-child');
      if (defaultGroup) {
        const toneInput = defaultGroup.querySelector('.tone-input');
        const keywordsInput = defaultGroup.querySelector('.keywords-input');
        const colorInput = defaultGroup.querySelector('.color-input');

        if (toneInput) toneInput.value = 'happy';
        if (keywordsInput) keywordsInput.value = 'happy, joy, excited, great, awesome, wonderful';
        if (colorInput) colorInput.value = '#ffff96';
      }
    }
  });
});