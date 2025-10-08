# Interactive 3D Portfolio Website

A personal portfolio website featuring an interactive Nintendo 3DS model built with Three.js. The 3DS opens to reveal navigation links to different sections of the portfolio.

## Features

- 🎮 **Interactive 3D Model**: Fully functional Nintendo 3DS that opens when clicked
- 🔄 **Orbit Controls**: Users can rotate and view the 3DS from different angles
- 📱 **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- ✨ **Smooth Animations**: Elegant opening/closing animations with easing
- 🎨 **Modern UI**: Dark theme with Nintendo-inspired red and blue accent colors
- 📍 **Single-Page Navigation**: Smooth scrolling between sections

## Sections

1. **Hero**: Interactive 3D Nintendo 3DS model
2. **About**: Personal introduction and skills
3. **Experience**: Professional timeline
4. **Projects**: Portfolio showcase
5. **Contact**: Get in touch information

## Tech Stack

- **Three.js**: 3D graphics and WebGL rendering
- **Vanilla JavaScript (ES6 Modules)**: Clean, modern JavaScript
- **CSS3**: Modern styling with animations and transitions
- **HTML5**: Semantic markup

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ewen.github.io.git
cd ewen.github.io
```

2. Open with a local server (Three.js modules require a server):

**Option 1 - Python:**
```bash
python -m http.server 8000
```

**Option 2 - Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Option 3 - VS Code Live Server:**
- Install the "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

3. Open your browser and navigate to `http://localhost:8000`

## GitHub Pages Deployment

This site is designed to work with GitHub Pages out of the box:

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Select the `main` branch and `/ (root)` folder
5. Click "Save"
6. Your site will be live at `https://yourusername.github.io`

## Customization

### Update Personal Information

Edit the content in `index.html`:
- Update the title and meta tags
- Replace placeholder content in each section
- Update contact links with your social media

### Modify 3DS Appearance

In `js/main.js`, adjust the `create3DSModel()` function:
- Change colors by modifying material properties
- Adjust model scale and position
- Customize button layouts

### Change Color Scheme

In `css/style.css`, modify the CSS variables:
```css
:root {
    --bg-primary: #0a0a0a;      /* Main background */
    --accent-red: #e60012;       /* Red accent */
    --accent-blue: #009ac7;      /* Blue accent */
}
```

### Adjust Animations

In `js/animations.js`, modify:
- Animation duration
- Rotation angles
- Easing functions

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Requires WebGL support for 3D rendering.

## Performance

- Optimized for smooth 60 FPS rendering
- Shadow mapping for realistic lighting
- Responsive performance scaling for mobile devices
- Efficient geometry with minimal polygon count

## Credits

Inspired by modern interactive portfolio designs and Nintendo's iconic handheld gaming device.

## License

MIT License - feel free to use this for your own portfolio!

---

Built with ❤️ using Three.js
