(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  // Figure selectors are independent of the replay controls.
  $$('[data-figure-group]').forEach(group => {
    const buttons = $$('[data-figure-target]', group);
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      $$('[data-figure-panel]', group).forEach(panel => { panel.hidden = panel.id !== button.dataset.figureTarget; });
    }));
  });

  const dialog = $('#image-lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxScroll = $('.lightbox-scroll', dialog);
  function openImage(src, label) {
    pause();
    lightboxImage.src = src;
    lightboxImage.alt = label;
    $('#lightbox-caption').textContent = label;
    lightboxScroll.classList.remove('is-zoomed');
    $('#lightbox-zoom').setAttribute('aria-pressed', 'false');
    $('#lightbox-zoom').textContent = 'Zoom in';
    dialog.showModal();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-full-image]');
    if (button) openImage(button.dataset.fullImage, button.dataset.caption || 'Paper figure');
  });
  $('#lightbox-close').addEventListener('click', () => dialog.close());
  $('#lightbox-zoom').addEventListener('click', event => {
    const zoomed = lightboxScroll.classList.toggle('is-zoomed');
    event.currentTarget.textContent = zoomed ? 'Fit image' : 'Zoom in';
    event.currentTarget.setAttribute('aria-pressed', String(zoomed));
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });

  const cases = window.NEOS_CASES || [];
  if (!cases.length) return;
  const shortNames = {ReverseImageSearch: 'RS', TextSearch: 'TS', WebVisit: 'WV', ImageSearch: 'IS', FetchImage: 'FI', CropImage: 'CI', Answer: 'A'};
  const shell = $('#replay');
  const stage = $('#replay-stage');
  const question = $('#input-question');
  const playButton = $('#replay-play');
  const progress = $('#replay-progress');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentCase = cases[0];
  let index = -1;
  let playing = false;
  let timer = null;
  let speed = 1;
  let phase = 'ready';
  let pieces = [];
  let position = 0;
  let target = null;

  function schedule(delay = 58) {
    clearTimeout(timer);
    if (playing) timer = setTimeout(tick, delay / speed);
  }
  function controls() {
    playButton.textContent = playing ? 'Ⅱ Pause' : (index === currentCase.steps.length - 1 && phase === 'done' ? '↻ Replay' : '▶ Play');
    playButton.setAttribute('aria-pressed', String(playing));
    $('#replay-prev').disabled = index < 0;
    $('#replay-next').disabled = index >= currentCase.steps.length - 1;
    progress.max = currentCase.steps.length;
    progress.value = index + 1;
    progress.setAttribute('aria-valuetext', index < 0 ? 'Input question' : `Turn ${index + 1}: ${currentCase.steps[index].tool}`);
    $('#turn-count').textContent = index < 0 ? `Input / ${currentCase.steps.length}` : `${index + 1} / ${currentCase.steps.length}`;
    $('#replay-status').textContent = playing ? 'Playing' : (phase === 'done' ? 'Replay complete' : index < 0 ? 'Ready' : 'Paused');
    shell.dataset.state = playing ? 'playing' : phase;
    shell.dataset.turn = String(index + 1);
    $$('.turn-chip').forEach((button, number) => {
      const selected = number === index;
      button.classList.toggle('is-past', number < index);
      if (selected) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }
  function pause() {
    playing = false;
    clearTimeout(timer);
    timer = null;
    if (shell) controls();
    if (target) target.classList.remove('streaming');
  }
  function stream(element, text, nextPhase) {
    target?.classList.remove('streaming');
    target = element;
    target.textContent = '';
    target.classList.add('streaming');
    pieces = text.match(/\S+\s*/gu) || [];
    position = 0;
    phase = nextPhase;
    schedule();
  }
  function revealImages(step) {
    const container = $('#evidence-images');
    if (!container) return;
    container.replaceChildren();
    step.images.forEach(ref => {
      const asset = currentCase.images[ref];
      const button = make('button', 'evidence-image');
      button.type = 'button';
      button.dataset.fullImage = asset.src;
      button.dataset.caption = `${ref} · ${asset.label}`;
      button.setAttribute('aria-label', `Enlarge ${ref}: ${asset.label}`);
      const image = make('img');
      image.src = asset.src;
      image.alt = asset.label;
      image.width = asset.width;
      image.height = asset.height;
      image.decoding = 'async';
      button.append(image, make('span', '', `${ref} · ${asset.label}`));
      container.append(button);
    });
  }
  function renderInput() {
    index = -1;
    phase = 'ready';
    question.textContent = currentCase.question;
    question.classList.remove('streaming');
    stage.replaceChildren();
    const intro = make('div', 'stage-empty');
    const orbits = make('div', 'stage-orbits');
    orbits.setAttribute('aria-hidden', 'true');
    intro.append(orbits, make('h3', '', 'Follow the evidence.'), make('p', '', currentCase.subtitle), make('p', 'start-hint', 'Press play, or step through one turn at a time.'));
    stage.append(intro);
    $('#turn-announcement').textContent = `${currentCase.title}. ${currentCase.steps.length} turns. Ready to play.`;
    controls();
  }
  function renderTurn(nextIndex, animate = false) {
    index = nextIndex;
    const step = currentCase.steps[index];
    stage.replaceChildren();
    const header = make('div', 'turn-header');
    const isVisual = ['FetchImage', 'CropImage'].includes(step.tool);
    header.append(make('span', 'turn-label', `Turn ${String(step.turn).padStart(2, '0')}`), make('span', `tool-badge${isVisual ? ' visual' : ''}${step.tool === 'Answer' ? ' answer' : ''}${step.warning ? ' warning' : ''}`, step.tool));
    const summary = make('p', 'action-summary');
    summary.id = 'action-summary';
    stage.append(header, make('p', 'small-label', 'Action summary'), summary);
    if (step.args) {
      const details = make('details', 'tool-request');
      details.id = 'tool-request';
      details.hidden = animate;
      details.append(make('summary', '', `${step.tool}(…) · tool input`), make('pre', '', JSON.stringify(step.args, null, 2)));
      stage.append(details);
    }
    const observation = make('div', `observation-block${step.warning ? ' is-warning' : ''}`);
    observation.id = 'observation-block';
    observation.hidden = animate;
    const label = step.tool === 'Answer' ? 'Final answer' : step.warning ? 'Observation · request failed' : isVisual ? 'Observation · new visual evidence' : 'Observation · text & references';
    const content = make('p', step.tool === 'Answer' ? 'answer-text' : 'observation-text');
    content.id = 'observation-text';
    const images = make('div', 'evidence-images');
    images.id = 'evidence-images';
    observation.append(make('p', 'small-label', label), content, images);
    stage.append(observation);
    if (animate) stream(summary, step.summary, 'summary');
    else {
      summary.textContent = step.summary;
      content.textContent = step.answer || step.observation;
      revealImages(step);
      phase = index === currentCase.steps.length - 1 ? 'done' : 'dwell';
    }
    $('#turn-announcement').textContent = `Turn ${step.turn} of ${currentCase.steps.length}: ${step.tool}${step.warning ? ', request timeout' : ''}.`;
    controls();
  }
  function tick() {
    if (!playing) return;
    if (phase === 'dwell') {
      if (index + 1 < currentCase.steps.length) renderTurn(index + 1, true);
      else { phase = 'done'; pause(); }
      return;
    }
    if (!target) return;
    target.classList.add('streaming');
    const count = reduceMotion.matches ? pieces.length : 2;
    target.append(document.createTextNode(pieces.slice(position, position + count).join('')));
    position += count;
    if (position < pieces.length) { schedule(); return; }
    target.classList.remove('streaming');
    if (phase === 'question') { renderTurn(0, true); return; }
    if (phase === 'summary') {
      const step = currentCase.steps[index];
      if ($('#tool-request')) $('#tool-request').hidden = false;
      $('#observation-block').hidden = false;
      stream($('#observation-text'), step.answer || step.observation, 'observation');
      schedule(420);
    } else if (phase === 'observation') {
      revealImages(currentCase.steps[index]);
      if (index === currentCase.steps.length - 1) { phase = 'done'; pause(); }
      else { phase = 'dwell'; schedule(currentCase.steps[index].images.length ? 2800 : 1700); }
    }
  }
  function play() {
    if (playing) { pause(); return; }
    if (phase === 'done') renderInput();
    playing = true;
    if (phase === 'ready') stream(question, currentCase.question, 'question');
    else schedule();
    controls();
  }
  function jump(nextIndex) {
    pause();
    question.textContent = currentCase.question;
    question.classList.remove('streaming');
    if (nextIndex < 0) renderInput();
    else renderTurn(Math.min(nextIndex, currentCase.steps.length - 1));
  }
  function selectCase(caseId) {
    pause();
    currentCase = cases.find(item => item.id === caseId) || cases[0];
    $$('.case-selector').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.case === currentCase.id)));
    $('#replay-title').textContent = currentCase.title;
    $('#replay-meta').textContent = `${currentCase.benchmark} · ${currentCase.steps.length} turns`;
    $('#replay-insight').textContent = currentCase.insight;
    const input = currentCase.images[currentCase.initialImages[0]];
    $('#input-image').src = input.src;
    $('#input-image').alt = input.label;
    $('#input-image-open').dataset.fullImage = input.src;
    $('#input-image-open').dataset.caption = input.label;
    $('#input-caption').textContent = `img_1 · ${input.label}`;
    $('#paper-case').dataset.fullImage = currentCase.paperFigure;
    $('#paper-case').dataset.caption = `${currentCase.benchmark} case study`;
    const rail = $('#turn-rail');
    rail.replaceChildren();
    currentCase.steps.forEach((step, number) => {
      const button = make('button', 'turn-chip', `${String(step.turn).padStart(2, '0')} ${shortNames[step.tool]}`);
      button.type = 'button';
      button.title = `Turn ${step.turn}: ${step.tool}`;
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => jump(number));
      rail.append(button);
    });
    renderInput();
  }
  playButton.addEventListener('click', play);
  $('#replay-next').addEventListener('click', () => jump(index + 1));
  $('#replay-prev').addEventListener('click', () => jump(index - 1));
  $('#replay-reset').addEventListener('click', () => jump(-1));
  progress.addEventListener('input', () => jump(Number(progress.value) - 1));
  $('#replay-speed').addEventListener('change', event => { speed = Number(event.target.value); if (playing) schedule(); });
  $$('.case-selector').forEach(button => button.addEventListener('click', () => selectCase(button.dataset.case)));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  selectCase(cases[0].id);
})();
