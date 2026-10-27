# ULTRON AI — Website

A responsive, dark sci-fi assistant interface designed to run in a mobile or desktop browser. This is a **website**, not an Android APK project.

## Features
- Responsive mobile and desktop layout
- Built-in commands: time, date, capabilities, technology fact
- Opens supported websites: YouTube, Google, GitHub, Gmail, ChatGPT, Instagram and WhatsApp Web
- Voice input where the browser supports the Web Speech API
- Appearance customizer with red, cyan, violet, green, and amber accent colours
- Dark/light display modes with preferences saved on the device
- Interactive navigation, status reactor, settings panel, and responsive icon feedback
- Spoken responses where speech synthesis is available
- No build tools or package installation required

## Run locally
Open `index.html` in a modern browser. Voice features generally require HTTPS or localhost and browser permission.

## Publish with GitHub Pages
1. Create a GitHub repository, for example `ultron-ai-website`.
2. Upload the contents of this ZIP so `index.html`, `style.css`, and `app.js` are in the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site.

The included GitHub Actions workflow also deploys the site to GitHub Pages after you enable Pages and select GitHub Actions as the deployment source.

## Important limits
This is a front-end website. A browser website cannot directly toggle Android system settings, read notifications, or control other apps. Those features require native Android capabilities and explicit permissions.

The current assistant uses built-in local responses; it is not connected to Gemini yet. To add Gemini, create a backend/API service and store the Gemini API key as a server-side secret. **Never put a real API key in `app.js`, HTML, or any public GitHub repository.**
