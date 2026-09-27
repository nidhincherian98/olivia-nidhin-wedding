(() => {
  'use strict';
  const c = window.INVITATION;
  const side = document.body.dataset.side === 'nidhin' ? 'nidhin' : 'olivia';
  const family = c.families[side];
  document.querySelectorAll('[data-text]').forEach(el => { el.textContent = c[el.dataset.text] || ''; });
  document.querySelectorAll('[data-family]').forEach(el => { el.textContent = family[el.dataset.family] || ''; });
  const relatedName = side === 'nidhin' ? 'bride' : 'groom';
  const relatedHeading = document.querySelector(`.couple-names [data-text="${relatedName}"]`);
  const relation = document.querySelector('.relation');
  const relationHome = document.querySelector('[data-family="relationHome"]');
  relatedHeading.after(relation, relationHome);
  relation.style.marginTop = '16px';
  document.querySelector('#maps-link').href = c.mapsUrl;
  const gallery = document.querySelector('#photos');
  c.photoUrls.forEach((url, i) => { const img = new Image(); img.src = url; img.alt = `Olivia and Nidhin — photograph ${i + 1}`; img.loading = 'lazy'; img.decoding = 'async'; gallery.append(img); });
  gallery.hidden = !c.photoUrls.length;
  const cover = document.querySelector('#cover');
  const openButton = document.querySelector('#open-invitation');

  // Keep the original satin artwork, but articulate its loops, tails and knot separately.
  openButton.innerHTML = `<svg class="silk-bow" viewBox="0 0 1300 1200" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id="silk-left-loop"><path d="M0 0H650V275L578 322L558 375L497 412L435 454L373 512H0Z"/></clipPath>
      <clipPath id="silk-right-loop"><path d="M650 0H1300V560L1040 542L884 494L795 426L711 354L690 287Z"/></clipPath>
      <clipPath id="silk-left-tail"><path d="M578 322L650 389L667 1200H0V512H373L435 454L497 412L558 375Z"/></clipPath>
      <clipPath id="silk-right-tail"><path d="M711 354L795 426L884 494L1040 542L1300 560V1200H667V389Z"/></clipPath>
      <clipPath id="silk-knot"><path d="M583 272L741 299L703 439L589 390L565 325Z"/></clipPath>
      <linearGradient id="silk-strand" x1="0" y1="0" x2="0.1" y2="1">
        <stop stop-color="#bfb6a4"/><stop offset=".18" stop-color="#f8f4e9"/>
        <stop offset=".46" stop-color="#fffdf5"/><stop offset=".72" stop-color="#d9d1c0"/><stop offset="1" stop-color="#b7ad98"/>
      </linearGradient>
    </defs>
    <g class="silk-tail silk-tail-left"><image href="/olivia-nidhin-wedding/bow.webp" width="1300" height="1200" clip-path="url(#silk-left-tail)"/></g>
    <g class="silk-tail silk-tail-right"><image href="/olivia-nidhin-wedding/bow.webp" width="1300" height="1200" clip-path="url(#silk-right-tail)"/></g>
    <g class="silk-loop silk-loop-left"><image href="/olivia-nidhin-wedding/bow.webp" width="1300" height="1200" clip-path="url(#silk-left-loop)"/></g>
    <g class="silk-loop silk-loop-right"><image href="/olivia-nidhin-wedding/bow.webp" width="1300" height="1200" clip-path="url(#silk-right-loop)"/></g>
    <g class="silk-free silk-free-left"><path d="M650 338C529 353 423 478 293 456S128 338 13 390"/></g>
    <g class="silk-free silk-free-right"><path d="M650 338C763 385 793 547 948 565S1127 474 1287 541"/></g>
    <g class="silk-knot"><image href="/olivia-nidhin-wedding/bow.webp" width="1300" height="1200" clip-path="url(#silk-knot)"/></g>
  </svg>`;
  const main = document.querySelector('main');
  let opened = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const musicWrap = document.querySelector('#music-wrap');
  const musicButton = document.querySelector('#music-button');
  const musicPanel = document.querySelector('#music-panel');
  const audio = c.audioUrl ? new Audio(c.audioUrl) : null;
  if (audio) {
    audio.loop = true;
    audio.preload = 'none';
    musicButton.removeAttribute('aria-expanded');
    musicButton.setAttribute('aria-pressed', 'false');
    audio.addEventListener('playing', () => setAudioState(true));
    audio.addEventListener('pause', () => setAudioState(false));
    audio.addEventListener('error', () => setAudioState(false));
  }
  function setAudioState(playing) { musicButton.classList.toggle('is-playing', playing); musicButton.setAttribute('aria-label', playing ? 'Pause wedding music' : 'Play wedding music'); if (audio) { musicButton.setAttribute('aria-pressed', String(playing)); musicButton.querySelector('span').textContent = playing ? 'Pause' : 'Music'; } }
  function openInvitation() {
    if (opened) return;
    opened = true;
    window.scrollTo(0, 0);
    main.inert = false;
    document.body.classList.remove('sealed');
    document.body.classList.add('opened');
    cover.classList.add('opening');
    openButton.disabled = true;
    if (audio) audio.play().then(() => setAudioState(true)).catch(() => setAudioState(false));
    setTimeout(() => { cover.hidden = true; musicWrap.hidden = false; document.querySelector('h1').focus({ preventScroll: true }); }, reducedMotion ? 20 : 4200);
  }
  cover.addEventListener('click', openInvitation);
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  function closeMusic() { musicPanel.hidden = true; document.querySelector('#youtube-player').replaceChildren(); musicButton.setAttribute('aria-expanded', 'false'); setAudioState(false); }
  musicButton.addEventListener('click', () => {
    if (audio) {
      if (audio.paused) audio.play().then(() => setAudioState(true)).catch(() => setAudioState(false));
      else { audio.pause(); setAudioState(false); }
      return;
    }
    if (!musicPanel.hidden) return closeMusic();
    musicPanel.hidden = false;
    musicButton.setAttribute('aria-expanded', 'true');
    const frame = document.createElement('iframe');
    frame.title = 'Wedding soundtrack on YouTube';
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(c.youtubeId)}?autoplay=1&playsinline=1&loop=1&playlist=${encodeURIComponent(c.youtubeId)}`;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    document.querySelector('#youtube-player').replaceChildren(frame);
  });
  document.querySelector('#youtube-link').href = `https://www.youtube.com/watch?v=${encodeURIComponent(c.youtubeId)}`;
  document.querySelector('#close-music').addEventListener('click', closeMusic);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !musicPanel.hidden) { closeMusic(); musicButton.focus(); } });
  const form = document.querySelector('#rsvp-form');
  const status = document.querySelector('#rsvp-status');
  const submit = form.querySelector('button[type=submit]');
  const participants = form.elements.guests;
  const removeParticipant = document.querySelector('#remove-participant');
  const addParticipant = document.querySelector('#add-participant');
  function updateParticipantCount() {
    const count = participants.valueAsNumber;
    const valid = Number.isInteger(count) && count >= 1 && count <= 50;
    removeParticipant.disabled = !valid || count === 1;
    addParticipant.disabled = !valid || count === 50;
  }
  participants.addEventListener('input', updateParticipantCount);
  removeParticipant.addEventListener('click', () => { participants.stepDown(); updateParticipantCount(); });
  addParticipant.addEventListener('click', () => { participants.stepUp(); updateParticipantCount(); });
  updateParticipantCount();
  if (!c.rsvpEndpoint) status.textContent = 'RSVP will open soon.';
  let requestId = null;
  let requestFingerprint = null;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fullName = form.elements.fullName.value.trim();
    const guests = participants.valueAsNumber;
    if (fullName.length < 2 || !Number.isInteger(guests) || guests < 1 || guests > 50) { status.textContent = 'Please enter your full name and a valid number of guests.'; return; }
    if (form.elements.website.value) return;
    if (!c.rsvpEndpoint) { status.textContent = 'RSVP is not open yet. Your details have not been sent. Please check back soon.'; return; }
    const fingerprint = JSON.stringify([fullName, guests, side]);
    if (fingerprint !== requestFingerprint) { requestFingerprint = fingerprint; requestId = crypto.randomUUID(); }
    submit.disabled = true; status.textContent = 'Sending your RSVP…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(c.rsvpEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fullName, guests, side, requestId, website: '' }), signal: controller.signal, redirect: 'follow' });
      if (!response.ok) throw new Error('Response error');
      const result = await response.json();
      if (result.ok !== true || result.requestId !== requestId) throw new Error('Unconfirmed response');
      status.textContent = `Thank you, ${fullName}. Your RSVP for ${guests} ${guests === 1 ? 'guest' : 'guests'} has been received. We look forward to celebrating with you!`;
      form.reset(); updateParticipantCount(); requestId = null; requestFingerprint = null;
    } catch { status.textContent = 'We could not confirm your RSVP. Please try again. Retrying the same details will not create a duplicate.'; }
    finally { clearTimeout(timeout); submit.disabled = false; }
  });
})();
