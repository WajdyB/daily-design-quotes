# Daily Design Quote with Voice Reader

A beautiful, fully responsive Progressive Web Application (PWA) that delivers daily design inspiration with text-to-speech functionality. Built with vanilla JavaScript, HTML5, and CSS3.

![Daily Design Quote Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=Daily+Design+Quote+Preview)

## ✨ Features

### 📅 Daily Quote System
- **50+ Curated Quotes**: Handpicked quotes from famous designers, artists, and creative professionals
- **Date-Based Display**: Shows the same quote throughout the day based on current date (not random)
- **Persistent Daily Quotes**: Quote remains consistent until midnight, then changes to the next day's quote

### 🔊 Text-to-Speech Integration
- **Auto-Read on Load**: Automatically reads the quote when the page loads (can be disabled)
- **Voice Selection**: Choose from available system voices via dropdown menu
- **Read Again Button**: Replay the current quote at any time
- **Mute Toggle**: Disable/enable auto-read functionality
- **Audio Indicator**: Visual feedback when speech is active

### 🎨 Beautiful Design
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Responsive Design**: Optimized for all screen sizes (mobile-first approach)
- **Elegant Typography**: Uses Google Fonts (Inter + Playfair Display)
- **Smooth Animations**: Subtle animations for quote transitions and interactions
- **Modern UI**: Clean, minimal interface with pleasing color palettes

### 📱 Progressive Web App (PWA)
- **Installable**: Can be installed on desktop and mobile devices
- **Offline Support**: Works offline with cached content
- **App-like Experience**: Standalone display mode
- **Service Worker**: Background caching and offline functionality

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support (Space to read, Ctrl+M to mute)
- **Screen Reader Friendly**: Semantic HTML and proper ARIA labels
- **High Contrast Support**: Adapts to system accessibility preferences
- **Reduced Motion**: Respects user's motion preferences

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Web server (for PWA features) or local development server

### Installation

1. **Download the files**:
   \`\`\`bash
   git clone [repository-url]
   cd daily-design-quote
   \`\`\`

2. **Serve the files**:
   
   **Option A: Using Python (if installed)**
   \`\`\`bash
   python -m http.server 8000
   \`\`\`
   
   **Option B: Using Node.js (if installed)**
   \`\`\`bash
   npx serve .
   \`\`\`
   
   **Option C: Using any web server**
   - Place files in your web server's document root
   - Access via your domain/localhost

3. **Open in browser**:
   \`\`\`
   http://localhost:8000
   \`\`\`

### File Structure
\`\`\`
daily-design-quote/
├── index.html          # Main HTML file
├── style.css           # Styles and themes
├── script.js           # Application logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── README.md          # This file
\`\`\`

## 🎯 Usage

### Basic Usage
1. **View Daily Quote**: The app automatically displays today's design quote
2. **Listen to Quote**: Quote is read aloud automatically (if not muted)
3. **Change Voice**: Select different voices from the dropdown menu
4. **Toggle Theme**: Switch between light and dark modes
5. **Mute/Unmute**: Control auto-read functionality

### Keyboard Shortcuts
- **Spacebar**: Read the current quote again
- **Ctrl + M**: Toggle mute/unmute

### PWA Installation
1. **Desktop**: Look for the install icon in your browser's address bar
2. **Mobile**: Use "Add to Home Screen" option in your browser menu
3. **Chrome**: Click the install button when prompted

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript**: ES6+ features, Web APIs
- **Web Speech API**: Text-to-speech functionality
- **Service Workers**: Offline support and caching
- **PWA Manifest**: App-like installation and behavior

### Browser Support
- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS 11.3+)
- **Speech Synthesis**: Supported in all modern browsers

### Performance Features
- **Lazy Loading**: Optimized font loading
- **Efficient Caching**: Service worker caches essential resources
- **Minimal Bundle**: No external dependencies
- **Optimized Images**: SVG icons for scalability

## 🎨 Customization

### Adding More Quotes
Edit the `quotes` array in `script.js`:
\`\`\`javascript
this.quotes = [
    {
        text: "Your inspiring quote here",
        author: "Quote Author"
    },
    // Add more quotes...
];
\`\`\`

### Changing Colors
Modify CSS custom properties in `style.css`:
\`\`\`css
:root {
  --accent-primary: #your-color;
  --bg-primary: #your-background;
  /* ... other variables */
}
\`\`\`

### Adjusting Speech Settings
Modify speech parameters in `script.js`:
\`\`\`javascript
utterance.rate = 0.9;    // Speech rate (0.1 to 10)
utterance.pitch = 1;     // Speech pitch (0 to 2)
utterance.volume = 1;    // Speech volume (0 to 1)
\`\`\`

## 🔧 Development

### Code Structure
- **`DailyDesignQuote` Class**: Main application class
- **Modular Methods**: Each feature is separated into focused methods
- **Error Handling**: Comprehensive error handling throughout
- **Comments**: Well-documented code for easy maintenance

### Key Methods
- `getTodaysQuote()`: Calculates daily quote based on date
- `speakQuote()`: Handles text-to-speech functionality
- `setTheme()`: Manages theme switching
- `loadVoices()`: Populates available speech voices

## 📱 PWA Features

### Manifest Configuration
- **App Name**: "Daily Design Quote with Voice Reader"
- **Display Mode**: Standalone (app-like)
- **Theme Color**: Indigo (#6366f1)
- **Icons**: SVG-based for all sizes
- **Shortcuts**: Quick actions for reading quotes

### Service Worker
- **Caching Strategy**: Cache-first for static resources
- **Offline Support**: Serves cached content when offline
- **Background Sync**: Ready for future enhancements
- **Push Notifications**: Framework ready (not implemented)

## 🐛 Troubleshooting

### Common Issues

**Speech not working:**
- Check if browser supports Web Speech API
- Ensure audio is not muted in browser/system
- Try different voices from the dropdown

**PWA not installing:**
- Ensure you're serving over HTTPS (or localhost)
- Check that manifest.json is accessible
- Verify service worker is registered

**Quotes not changing:**
- Quotes change daily at midnight
- Clear browser cache if needed
- Check browser's date/time settings

### Browser Console
Check the browser console for any error messages and ensure:
- All files are loading correctly
- No JavaScript errors are present
- Service worker is registered successfully

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Add more inspiring design quotes
- Improve accessibility features
- Enhance the UI/UX design
- Fix bugs or optimize performance
- Add new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Quote Sources**: Various designers, artists, and creative professionals
- **Fonts**: Google Fonts (Inter & Playfair Display)
- **Icons**: Unicode emoji characters
- **Inspiration**: The design community and daily inspiration needs

---

**Made with ❤️**

*Inspiring creativity, one quote at a time.*
