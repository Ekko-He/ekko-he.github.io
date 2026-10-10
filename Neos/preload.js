(() => {
  'use strict';
  const cases = window.NEOS_CASES || [];
  const assetRoot = new URL('assets/', document.baseURI);
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const states = new Map();
  const queue = [];
  let active = 0;
  let started = false;

  function assetURL(source) {
    if (!source) return null;
    try {
      const url = new URL(source, document.baseURI);
      return url.origin === assetRoot.origin && url.pathname.startsWith(assetRoot.pathname) ? url.href : null;
    } catch { return null; }
  }

  function canLoad() {
    return started && !document.hidden && !connection?.saveData &&
      !['slow-2g', '2g'].includes(connection?.effectiveType);
  }

  function pump() {
    if (!canLoad()) return;
    while (active < 2 && queue.length) {
      const url = queue.shift();
      if (states.get(url) !== 'queued') continue;
      states.set(url, 'loading');
      active += 1;
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = 'low';
      let finished = false;
      let timeout;
      const finish = success => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
        if (!success) image.removeAttribute('src');
        states.set(url, success ? 'loaded' : 'failed');
        active -= 1;
        pump();
      };
      image.onload = () => finish(image.naturalWidth > 0);
      image.onerror = () => finish(false);
      timeout = setTimeout(() => finish(false), 25000);
      image.src = url;
    }
  }

  function enqueue(sources, priority = false) {
    const front = [];
    for (const url of new Set(sources.map(assetURL).filter(Boolean))) {
      const state = states.get(url);
      if (state && state !== 'queued') continue;
      if (!state) {
        states.set(url, 'queued');
        if (priority) front.push(url);
        else queue.push(url);
      } else if (priority) {
        const index = queue.indexOf(url);
        if (index >= 0) queue.splice(index, 1);
        front.push(url);
      }
    }
    if (front.length) queue.unshift(...front);
    pump();
  }

  function caseImages(example) {
    return [...Object.values(example.images).map(image => image.src), example.paperFigure];
  }

  function prioritize(event) {
    const control = event.target.closest?.('[data-case], [data-figure-target], [data-full-image]');
    if (!control) return;
    if (control.dataset.case) {
      const example = cases.find(item => item.id === control.dataset.case);
      if (example) enqueue(caseImages(example), true);
    } else if (control.dataset.figureTarget) {
      const panel = document.getElementById(control.dataset.figureTarget);
      enqueue(Array.from(panel?.querySelectorAll('img[src]') || []).map(image => image.src), true);
    } else {
      enqueue([control.dataset.fullImage], true);
    }
  }

  function start() {
    for (const image of document.images) {
      const url = assetURL(image.getAttribute('src'));
      if (url && image.complete && image.naturalWidth > 0) states.set(url, 'loaded');
    }
    started = true;
    const figures = [...document.querySelectorAll('.paper-figure img[src]')].map(image => image.src);
    const caseAssets = cases.flatMap(caseImages);
    enqueue([...figures, ...caseAssets]);
  }

  function scheduleStart() {
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, {timeout: 1200});
    else window.setTimeout(start, 250);
  }

  for (const name of ['pointerover', 'focusin', 'click']) document.addEventListener(name, prioritize);
  document.addEventListener('visibilitychange', pump);
  connection?.addEventListener?.('change', pump);
  if (document.readyState === 'complete') scheduleStart();
  else window.addEventListener('load', scheduleStart, {once: true});
})();
