# Emotional Tone Highlighter

A Chrome extension that highlights text on web pages based on user-defined emotional tones and keywords.

## Features

- **Custom Tone Definitions**: Define your own emotional tones with associated keywords and colors
- **Real-time Highlighting**: Automatically highlights text as you browse
- **Context Menu Integration**: Right-click to re-highlight any page
- **Dynamic Updates**: Changes are applied immediately when you update your tone definitions

## How to Use

1. **Install the Extension**: Load the extension in Chrome's developer mode
2. **Define Tones**: Click the extension icon to open the popup
3. **Add Tone Definitions**:
   - Enter a tone name (e.g., "happy", "sad", "angry")
   - Add comma-separated keywords that represent that tone
   - Choose a highlight color
   - Click "Add Tone" for multiple definitions
4. **Save**: Click "Save Tones" to store your definitions
5. **Highlight**: Click "Highlight Current Page" or right-click and select "Highlight Emotional Tones"

## Example Tone Definitions

- **Happy**: keywords: "happy, joy, excited, great, awesome, wonderful" - Yellow highlight
- **Sad**: keywords: "sad, disappointed, upset, cry, tears" - Blue highlight  
- **Angry**: keywords: "angry, mad, furious, rage, hate" - Red highlight

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the extension folder
4. The extension icon will appear in your toolbar

## Permissions

- **Storage**: To save your tone definitions
- **Active Tab**: To highlight text on the current page
- **Scripting**: To inject highlighting code
- **Context Menus**: For right-click highlighting option
- **All URLs**: To work on any website

## Support

The extension works on most websites. Some sites with strict Content Security Policies may prevent highlighting.

A browser extension that highlights text on web pages based on user-defined emotional tones.

## Features

*   Define emotional tones (e.g., happy, sad, angry).
*   Specify keywords or phrases for each tone.
*   Highlight text matching the defined tones.
*   Customize highlighting styles (color, font).

## Installation

1.  Clone this repository.
2.  Open your browser's extension management page (e.g., `chrome://extensions` in Chrome).
3.  Enable "Developer mode".
4.  Click "Load unpacked" and select the project directory.

## Usage

1.  Click the extension icon in your browser toolbar.
2.  Define your emotional tones and their keywords/phrases in the extension's popup.
3.  Browse the web and see the highlighted text!

## Technologies

*   JavaScript
*   LocalStorage (for data persistence)

## License

This project is licensed under the [MIT License](LICENSE).