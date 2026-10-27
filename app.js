(() => {
  const form = document.getElementById('commandForm');
  const input = document.getElementById('commandInput');
  const conversation = document.getElementById('conversation');
  const voiceButton = document.getElementById('voiceButton');
  const toast = document.getElementById('toast');
  const sidebar = document.getElementById('sidebar');
  let recognition = null;
  let toastTimer;
  const customizer = document.getElementById('customizer');
  const customizerBackdrop = document.getElementById('customizerBackdrop');
  const accents = {
    red: { hex: '#ff435d', soft: '#ff7180', rgb: '255,67,93' },
    cyan: { hex: '#16b8d4', soft: '#66d9f5', rgb: '22,184,212' },
    violet: { hex: '#9b7bff', soft: '#c0adff', rgb: '155,123,255' },
    green: { hex: '#20c997', soft: '#70e7c1', rgb: '32,201,151' },
    amber: { hex: '#f4a623', soft: '#ffd078', rgb: '244,166,35' }
  };

  function openCustomizer(open = true) {
    customizer.classList.toggle('open', open);
    customizerBackdrop.classList.toggle('open', open);
    customizer.setAttribute('aria-hidden', String(!open));
    if (open) document.getElementById('closeCustomizer').focus();
  }
  function applyAccent(name, save = true) {
    const accent = accents[name] || accents.red;
    document.documentElement.style.setProperty('--red', accent.hex);
    document.documentElement.style.setProperty('--red2', accent.soft);
    document.documentElement.style.setProperty('--red-rgb', accent.rgb);
    document.querySelectorAll('[data-accent]').forEach(button => button.classList.toggle('active', button.dataset.accent === name));
    if (save) localStorage.setItem('ultron-accent', name);
  }
  function applyMode(mode, save = true) {
    const light = mode === 'light';
    document.body.classList.toggle('light-mode', light);
    document.querySelectorAll('[data-mode]').forEach(button => button.classList.toggle('active', button.dataset.mode === (light ? 'light' : 'dark')));
    document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f1f4fa' : '#090d18');
    if (save) localStorage.setItem('ultron-mode', light ? 'light' : 'dark');
  }

  // Restore saved appearance preferences on this device.
  try {
    applyAccent(localStorage.getItem('ultron-accent') || 'red', false);
    applyMode(localStorage.getItem('ultron-mode') || 'dark', false);
  } catch (_) { /* Private browsing may disable local storage. */ }

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function addMessage(text, who = 'assistant') {
    const wrap = document.createElement('div');
    wrap.className = `message ${who === 'user' ? 'user-message' : 'assistant-message'}`;
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = who === 'user' ? 'Y' : 'U';
    const body = document.createElement('div');
    body.className = 'message-body';
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = who === 'user' ? 'YOU • COMMAND' : 'ULTRON • RESPONSE';
    const p = document.createElement('p');
    p.textContent = text;
    body.append(meta, p);
    wrap.append(avatar, body);
    conversation.appendChild(wrap);
    wrap.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 0.82;
    window.speechSynthesis.speak(utterance);
  }
  function openSite(url, label) {
    addMessage(`Opening ${label} in a new browser tab.`, 'assistant');
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) notify('Your browser blocked the new tab. Allow pop-ups to open this site.');
  }
  function respond(command) {
    const raw = command.trim();
    const q = raw.toLowerCase();
    if (!raw) return;
    addMessage(raw, 'user');
    input.value = '';

    if (/^(open|go to|launch)\s+(youtube|you tube)$/.test(q)) return openSite('https://www.youtube.com/', 'YouTube');
    if (/^(open|go to|launch)\s+(google|google search)$/.test(q)) return openSite('https://www.google.com/', 'Google');
    if (/^(open|go to|launch)\s+(github|git hub)$/.test(q)) return openSite('https://github.com/', 'GitHub');
    if (/^(open|go to|launch)\s+(gmail|email)$/.test(q)) return openSite('https://mail.google.com/', 'Gmail');
    if (/^(open|go to|launch)\s+(chatgpt|chat gpt)$/.test(q)) return openSite('https://chatgpt.com/', 'ChatGPT');
    if (/^(open|go to|launch)\s+(instagram)$/.test(q)) return openSite('https://www.instagram.com/', 'Instagram');
    if (/^(open|go to|launch)\s+(whatsapp|whatsapp web)$/.test(q)) return openSite('https://web.whatsapp.com/', 'WhatsApp Web');

    let answer;
    if (/what can you do|capabilit|help|commands/.test(q)) {
      answer = 'Current browser capabilities: open supported websites, answer a few built-in questions, speak responses where speech synthesis is supported, and accept voice input where speech recognition is available. This website cannot directly control Android settings, read notifications, or manage other apps. Those features require native Android permissions or an installed companion app.';
    } else if (/what time|current time|time is it/.test(q)) {
      answer = `Your device reports ${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}.`;
    } else if (/what date|today.?s date|date is it/.test(q)) {
      answer = `Your device date is ${new Date().toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'long', day:'numeric'})}.`;
    } else if (/technology fact|tell me a fact|interesting fact/.test(q)) {
      answer = 'Technology fact: HTTPS encrypts data in transit between your browser and a website, but it does not make a website trustworthy by itself. Security depends on the destination and how the service handles your data.';
    } else if (/who are you|your name|what are you/.test(q)) {
      answer = 'I am ULTRON, a browser-based assistant interface. This build runs locally in your browser and uses predefined commands; it is not connected to a live language model yet.';
    } else if (/clear (chat|conversation|session)|new session/.test(q)) {
      conversation.replaceChildren();
      answer = 'Session cleared. Awaiting your next command.';
    } else if (/^(open|go to|launch)\s+https?:\/\//.test(q)) {
      const match = raw.match(/(?:open|go to|launch)\s+(https?:\/\/\S+)/i);
      try {
        const url = new URL(match[1]);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('protocol');
        openSite(url.href, url.hostname);
        return;
      } catch (_) { answer = 'That URL is not valid. Use a complete http:// or https:// address.'; }
    } else {
      answer = 'Command received. This website version currently uses built-in local responses, not a connected AI model. To enable real Gemini conversations safely, connect a backend that keeps the API key on the server. Do not paste an API key into this public website.';
    }
    addMessage(answer);
  }

  form.addEventListener('submit', event => { event.preventDefault(); respond(input.value); });
  document.querySelectorAll('[data-command]').forEach(button => {
    button.addEventListener('click', () => respond(button.dataset.command));
  });
  document.getElementById('newChat').addEventListener('click', () => {
    conversation.replaceChildren();
    addMessage('New session initialized. Awaiting your next command.');
    sidebar.classList.remove('open');
  });
  document.getElementById('menuToggle').addEventListener('click', () => {
    const opened = sidebar.classList.toggle('open');
    document.getElementById('menuToggle').setAttribute('aria-expanded', String(opened));
    notify(opened ? 'Navigation opened.' : 'Navigation closed.');
  });

  document.getElementById('settingsToggle').addEventListener('click', () => openCustomizer(true));
  document.getElementById('closeCustomizer').addEventListener('click', () => openCustomizer(false));
  customizerBackdrop.addEventListener('click', () => openCustomizer(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') openCustomizer(false); });
  document.querySelectorAll('[data-accent]').forEach(button => button.addEventListener('click', () => {
    applyAccent(button.dataset.accent);
    notify(`${button.dataset.accent[0].toUpperCase()}${button.dataset.accent.slice(1)} accent applied.`);
  }));
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    applyMode(button.dataset.mode);
    notify(`${button.dataset.mode === 'light' ? 'Light' : 'Dark'} mode enabled.`);
  }));
  document.getElementById('resetAppearance').addEventListener('click', () => {
    applyAccent('red'); applyMode('dark');
    notify('Appearance reset to ULTRON default.');
  });

  document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-nav]').forEach(item => item.classList.toggle('active', item === button));
    sidebar.classList.remove('open');
    if (button.dataset.nav === 'center') {
      document.getElementById('hero').scrollIntoView({ behavior: 'smooth', block: 'start' });
      notify('Command center selected.');
    } else if (button.dataset.nav === 'quick') {
      document.querySelector('.quick-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.querySelector('.quick-card').focus({ preventScroll: true });
      notify('Choose a quick command.');
    } else {
      conversation.scrollIntoView({ behavior: 'smooth', block: 'start' });
      notify('Session history: messages in this current session are shown here.');
    }
  }));

  document.querySelector('.brand-mark').setAttribute('role', 'button');
  document.querySelector('.brand-mark').setAttribute('tabindex', '0');
  document.querySelector('.brand-mark').setAttribute('aria-label', 'ULTRON status');
  const brandMark = document.querySelector('.brand-mark');
  const showCoreStatus = () => notify('ULTRON CORE ONLINE • Browser interface active.');
  brandMark.addEventListener('click', showCoreStatus);
  brandMark.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showCoreStatus(); } });
  document.querySelector('.reactor').setAttribute('role', 'button');
  document.querySelector('.reactor').setAttribute('tabindex', '0');
  document.querySelector('.reactor').setAttribute('aria-label', 'Check ULTRON core status');
  const reactor = document.querySelector('.reactor');
  const reactorStatus = () => { reactor.classList.remove('reactor-active'); void reactor.offsetWidth; reactor.classList.add('reactor-active'); notify('Core diagnostic complete: browser systems nominal.'); };
  reactor.addEventListener('click', reactorStatus);
  reactor.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); reactorStatus(); } });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.addEventListener('result', event => {
      input.value = event.results[0][0].transcript;
      form.requestSubmit();
    });
    recognition.addEventListener('error', event => notify(`Voice input: ${event.error}. You can type instead.`));
    recognition.addEventListener('end', () => {
      voiceButton.classList.remove('recording');
      voiceButton.textContent = '⌁';
    });
    voiceButton.addEventListener('click', () => {
      try {
        voiceButton.classList.add('recording');
        voiceButton.textContent = '●';
        recognition.start();
        notify('Listening… speak your command.');
      } catch (_) { notify('Voice input is already active.'); }
    });
  } else {
    voiceButton.addEventListener('click', () => notify('Voice recognition is not supported in this browser. Try typing your command.'));
  }
})();
