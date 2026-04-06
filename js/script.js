
// Umbrella Terminal v3.5 — upgraded interactions
// Общая логика сайта: загрузка, интерактив, поиск, HUD-элементы и атмосфера.

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const loader = document.getElementById('loaderScreen');
  const intro = document.getElementById('introScreen');
  const enterBtn = document.getElementById('enterDatabase');
  const progressBar = document.querySelector('.progress-terminal span');
  const terminal = document.getElementById('bootTerminal');

  initLoader(loader, progressBar, terminal);
  initIntro(intro, enterBtn);
  initRedAlert(body);
  initTerminalReveal();
  initVirusCards3D();
  initFilterButtons();
  initScanningModals();
  initFacilityMap();
  initComparisonChart();
  initHoverSounds();
  initTimelineReveal();

  // Новые улучшения интерфейса
  initScrollProgress();
  initCustomCursor();
  initBackToTop();
  initStatusTicker();
  initTitleGlitch();
  initCommandPalette();
  initVirusSearch();
  initAmbientParallax();
  syncSoundButtons();
});

function initLoader(loader, progressBar, terminal) {
  const bootLines = [
    '[BOOT] UMBRELLA / SECURE TERMINAL v3.5.2',
    '[AUTH] clearance profile: research_black / provisional',
    '[SCAN] environment check: airborne particles detected',
    '[LINK] specimen archive: reachable',
    '[LOAD] viral dossiers / chronology / facility sectors',
    '[SYNC] telemetry / blackbox / audit queue',
    '[STATUS] red channels latent / siren muted',
    '[OK] database handshake complete'
  ];

  let progress = 0;
  if (!progressBar || !terminal) return;

  const bootInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 16, 100);
    progressBar.style.width = `${progress}%`;
    const lineIndex = Math.floor((progress / 100) * bootLines.length);
    terminal.innerHTML = bootLines.slice(0, lineIndex + 1).map(line => `<div>${line}</div>`).join('');

    if (progress >= 100) {
      clearInterval(bootInterval);
      setTimeout(() => loader?.classList.add('hidden'), 420);
    }
  }, 220);
}

function initIntro(intro, enterBtn) {
  if (sessionStorage.getItem('umbrellaEntered') === '1' && intro) {
    intro.classList.add('hidden');
  }

  enterBtn?.addEventListener('click', () => {
    sessionStorage.setItem('umbrellaEntered', '1');
    intro.classList.add('hidden');
    playUi('click');
    setTimeout(() => {
      document.getElementById('heroEntry')?.scrollIntoView({ behavior: 'smooth' });
    }, 280);
  });
}

function initRedAlert(body) {
  const buttons = document.querySelectorAll('[data-toggle-alert]');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    body.classList.toggle('alert-mode');
    const alertOn = body.classList.contains('alert-mode');
    localStorage.setItem('umbrellaAlert', alertOn ? 'on' : 'off');
    updateSystemState(alertOn ? 'RED ALERT ENABLED' : 'Threat monitor: live');
    playUi(alertOn ? 'alarm' : 'click');
  }));

  if (localStorage.getItem('umbrellaAlert') === 'on') {
    body.classList.add('alert-mode');
  }
}

function initTerminalReveal() {
  const terminalLines = document.querySelectorAll('.terminal-line');
  if (window.gsap && terminalLines.length) {
    gsap.to(terminalLines, {
      opacity: 1,
      y: 0,
      duration: .45,
      stagger: .08,
      scrollTrigger: {
        trigger: '.terminal',
        start: 'top 80%'
      }
    });
  }
}

function initVirusCards3D() {
  document.querySelectorAll('.virus-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - .5) * 12;
      const rotateX = -((y / rect.height) - .5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initFilterButtons() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-virus-type]');
  if (!filterButtons.length || !filterItems.length) return;

  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const value = btn.dataset.filter;
    filterItems.forEach(item => {
      const wrap = item.closest('.filter-target');
      if (!wrap) return;
      wrap.style.display = (value === 'all' || item.dataset.virusType.includes(value)) ? '' : 'none';
    });
    playUi('click');
  }));
}

function initScanningModals() {
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      playUi('click');
      const target = document.querySelector(btn.dataset.bsTarget);
      if (!target) return;
      target.classList.remove('scanning');
      void target.offsetWidth;
      target.classList.add('scanning');
    });
  });
}

function initFacilityMap() {
  document.querySelectorAll('.map-sector').forEach(sector => {
    sector.addEventListener('click', () => {
      document.querySelectorAll('.map-sector').forEach(s => s.classList.remove('active'));
      sector.classList.add('active');
      const output = document.getElementById('sectorOutput');
      if (!output) return;
      output.innerHTML = `
        <div class="badge-soft mb-3">${sector.dataset.risk || 'UNKNOWN RISK'}</div>
        <h4 class="mb-3">${sector.dataset.title || 'Sector not found'}</h4>
        <p class="text-muted-soft mb-0">${sector.dataset.detail || 'No archived details.'}</p>
      `;
      playUi('click');
    });
  });
}

function initComparisonChart() {
  const canvas = document.getElementById('virusComparisonChart');
  if (!(canvas && window.Chart)) return;

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Летальность', 'Скорость мутации', 'Контроль носителя', 'Инфекционность', 'Военный потенциал'],
      datasets: [
        {
          label: 'T-Virus',
          data: [82, 68, 20, 95, 88],
          borderColor: '#64e8ff',
          backgroundColor: 'rgba(100,232,255,.12)',
          pointBackgroundColor: '#64e8ff'
        },
        {
          label: 'G-Virus',
          data: [97, 96, 8, 45, 98],
          borderColor: '#ff4d5e',
          backgroundColor: 'rgba(255,77,94,.10)',
          pointBackgroundColor: '#ff4d5e'
        },
        {
          label: 'Las Plagas',
          data: [74, 44, 88, 54, 85],
          borderColor: '#ffbf66',
          backgroundColor: 'rgba(255,191,102,.08)',
          pointBackgroundColor: '#ffbf66'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,.12)' },
          grid: { color: 'rgba(255,255,255,.10)' },
          pointLabels: { color: '#d9f6ff', font: { size: 12 } },
          ticks: { display: false, stepSize: 20, backdropColor: 'transparent' },
          min: 0,
          max: 100
        }
      },
      plugins: {
        legend: { labels: { color: '#d9f6ff' } }
      }
    }
  });
}

function initHoverSounds() {
  document.querySelectorAll('.sound-trigger').forEach(el => {
    el.addEventListener('mouseenter', () => playUi('hover'));
  });
}

function initTimelineReveal() {
  const timelineRows = document.querySelectorAll('.timeline-item');
  if (window.gsap && timelineRows.length) {
    gsap.from(timelineRows, {
      opacity: 0,
      x: 24,
      duration: .6,
      stagger: .08,
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 82%'
      }
    });
  }
}

function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<span></span>';
  document.body.appendChild(bar);
  const fill = bar.querySelector('span');

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  const ring = document.createElement('div');
  cursor.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(cursor, ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  const animate = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animate);
  };
  animate();

  document.querySelectorAll('a, button, .virus-card, .map-sector, .filter-chip').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

function initBackToTop() {
  const button = document.createElement('button');
  button.className = 'backtop-btn btn btn-glow sound-trigger';
  button.type = 'button';
  button.innerHTML = '↑';
  button.setAttribute('aria-label', 'Наверх');
  document.body.appendChild(button);

  button.addEventListener('click', () => {
    playUi('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const update = () => button.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initStatusTicker() {
  const host = document.querySelector('.status-inner .d-flex.gap-3.align-items-center');
  if (!host) return;

  let ticker = document.querySelector('.status-live-badge');
  if (!ticker) {
    ticker = document.createElement('span');
    ticker.className = 'status-live-badge';
    host.prepend(ticker);
  }

  const messages = [
    'Specimen vault: sealed',
    'Telemetry: nominal',
    'Biohazard level: severe',
    'Audit trail: synced',
    'Cold storage: stable',
    'Neural lock: active'
  ];

  let index = 0;
  const render = () => {
    ticker.textContent = messages[index % messages.length];
    index += 1;
  };

  render();
  setInterval(render, 3200);
}

function updateSystemState(text) {
  const stateNode = document.querySelector('.status-live-text');
  if (stateNode) stateNode.textContent = text;
}

function initTitleGlitch() {
  document.querySelectorAll('.section-title, .display-glow').forEach(title => {
    const txt = title.textContent.trim();
    if (txt) title.setAttribute('data-text', txt);
  });
}

function initCommandPalette() {
  const palette = document.createElement('div');
  palette.className = 'command-palette';
  palette.innerHTML = `
    <div class="command-shell">
      <div class="command-head">
        <div>
          <div class="kicker mb-1">Quick access</div>
          <div class="fw-semibold">Umbrella Command Palette</div>
        </div>
        <div class="small-mono text-muted-soft">CTRL/CMD + K</div>
      </div>
      <input class="command-input" type="text" placeholder="Поиск раздела, вируса, архива..." aria-label="Быстрый поиск по сайту">
      <div class="command-list"></div>
    </div>
  `;
  document.body.appendChild(palette);

  const input = palette.querySelector('.command-input');
  const list = palette.querySelector('.command-list');
  const isIndex = location.pathname.endsWith('/index.html') || location.pathname === '/' || location.pathname === '';
  const base = isIndex ? 'pages/' : '';
  const links = [
    { label: 'Главная база данных', href: isIndex ? 'index.html' : '../index.html', tags: 'database home terminal' },
    { label: 'Каталог вирусов', href: `${base}viruses.html`, tags: 'dossiers virus viruses штаммы' },
    { label: 'Архив Александра Киреева', href: `${base}creator.html`, tags: 'kireev creator archive biography' },
    { label: 'Хронология экспериментов', href: `${base}archive.html`, tags: 'timeline chronology experiments' },
    { label: 'T-Virus', href: `${base}t-virus.html`, tags: 't-virus t virus necrosis' },
    { label: 'G-Virus', href: `${base}g-virus.html`, tags: 'g-virus g virus mutation' },
    { label: 'Uroboros', href: `${base}uroboros.html`, tags: 'uroboros black tentacles' },
    { label: 'Las Plagas', href: `${base}las-plagas.html`, tags: 'las plagas parasite control' },
    { label: 'T-Abyss', href: `${base}t-abyss.html`, tags: 't-abyss water aquatic' },
    { label: 'T-Veronica', href: `${base}t-veronica.html`, tags: 't-veronica prototype insect' }
  ];

  const render = items => {
    list.innerHTML = items.map(item => `
      <a class="command-item sound-trigger" href="${item.href}">
        <span>${item.label}</span>
        <span class="small-mono text-muted-soft">OPEN</span>
      </a>
    `).join('') || '<div class="command-empty">Ничего не найдено. Попробуй другое имя штамма.</div>';
  };

  const open = () => {
    palette.classList.add('open');
    input.value = '';
    render(links);
    setTimeout(() => input.focus(), 30);
  };
  const close = () => palette.classList.remove('open');

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.classList.contains('open') ? close() : open();
    }
    if (e.key === 'Escape') close();
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      open();
    }
  });

  palette.addEventListener('click', e => {
    if (e.target === palette) close();
  });

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const filtered = !query ? links : links.filter(item => `${item.label} ${item.tags}`.toLowerCase().includes(query));
    render(filtered);
  });
}

function initVirusSearch() {
  const pageTitle = document.querySelector('.hero-panel .section-title');
  const cards = [...document.querySelectorAll('.filter-target')];
  const onVirusesPage = /viruses\.html$/.test(location.pathname);
  if (!onVirusesPage || !pageTitle || !cards.length) return;

  const heroPanel = pageTitle.closest('.hero-panel');
  const searchWrap = document.createElement('div');
  searchWrap.className = 'search-panel mt-4';
  searchWrap.innerHTML = `
    <div class="search-panel-inner">
      <span class="small-mono search-hint">/ search dossiers</span>
      <input type="search" class="search-input" placeholder="Поиск по штамму, угрозе, симптомам..." aria-label="Поиск по досье">
      <button type="button" class="search-clear btn btn-sm btn-outline-light rounded-pill">Очистить</button>
    </div>
  `;
  heroPanel.appendChild(searchWrap);

  const input = searchWrap.querySelector('.search-input');
  const clear = searchWrap.querySelector('.search-clear');

  const applySearch = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const show = !q || text.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    updateSystemState(q ? `Search result: ${visible} dossier(s)` : 'Threat monitor: live');
  };

  input.addEventListener('input', applySearch);
  clear.addEventListener('click', () => {
    input.value = '';
    applySearch();
    input.focus();
    playUi('click');
  });
}

function initAmbientParallax() {
  const fog = document.querySelector('.laboratory-fog');
  if (!fog || window.matchMedia('(pointer: coarse)').matches) return;

  window.addEventListener('mousemove', e => {
    const x = ((e.clientX / window.innerWidth) - 0.5) * 10;
    const y = ((e.clientY / window.innerHeight) - 0.5) * 10;
    fog.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, { passive: true });
}

function syncSoundButtons() {
  const off = localStorage.getItem('umbrellaSound') === 'off';
  document.querySelectorAll('[onclick*="toggleSound"]').forEach(button => {
    button.innerText = off ? 'Sound: Off' : 'Sound: On';
  });
}

function playUi(type) {
  const enabled = localStorage.getItem('umbrellaSound') !== 'off';
  if (!enabled) return;
  const audio = document.querySelector(`[data-sound="${type}"]`);
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = type === 'alarm' ? .2 : .35;
  audio.play().catch(() => {});
}

function toggleSound(button) {
  const off = localStorage.getItem('umbrellaSound') === 'off';
  localStorage.setItem('umbrellaSound', off ? 'on' : 'off');
  button.innerText = off ? 'Sound: On' : 'Sound: Off';
}

window.toggleSound = toggleSound;
