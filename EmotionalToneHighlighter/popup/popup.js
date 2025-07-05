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
  toneInput.placeholder = 'Tone';
  toneInput.classList.add('tone-input');

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
  const tones = [];

  toneGroups.forEach(group => {
    const toneInput = group.querySelector('.tone-input');
    const colorInput = group.querySelector('.color-input');
    if (toneInput && colorInput && toneInput.value.trim() !== '') {
      tones.push({
        tone: toneInput.value.trim(),
        color: colorInput.value
      });
    }
  });

  chrome.storage.local.set({ tones: tones }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving tones:', chrome.runtime.lastError);
    } else {
      // Optionally provide feedback to the user (e.g., a success message)
    }
  });
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

  chrome.storage.local.get('tones', (result) => {
    const savedTones = result.tones || [];
    savedTones.forEach(toneData => {
      addToneInput(); // Add input fields
      const lastInputGroup = document.querySelector('.tone-input-group:last-child');
      if (lastInputGroup) {
        const toneInput = lastInputGroup.querySelector('.tone-input');
        const colorInput = lastInputGroup.querySelector('.color-input');
        if (toneInput) {
            toneInput.value = toneData.tone;
        }
        if (colorInput) {
            colorInput.value = toneData.color;
        }
      }
    });
  });
});