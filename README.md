# ULTRON AI Website

Static website with responsive design, voice input (where supported), text commands, quick launch tiles, and a light/dark toggle. No API key, server, Node.js, or APK is needed.

## Commands
- `open YouTube`, `open WhatsApp`, `open Instagram`, `open Google Maps`, `open Gmail`, `open Spotify`
- `open Google`, `open Chrome`, `open GitHub`, `open Facebook`, `open Telegram`, `open Reddit`, `open Netflix`, `open Amazon`, `open LinkedIn`
- `search Java tutorials`
- `what time is it`, `what date is it`, `help`

## Publish on GitHub Pages
1. Upload `index.html`, `styles.css`, `app.js`, and `README.md` into the repository root.
2. Open **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then Save.
5. Wait for GitHub to show the published URL.

## Browser limits
This website cannot discover every installed app, guarantee app launch, toggle Android system settings, read notifications, or run commands in the background. It tries selected Android intent links and provides website fallbacks. The browser or Android may block links or show an app chooser. Voice recognition support varies by browser and typically needs HTTPS and microphone permission. If a link fails, use the fallback URL shown in the command result.
