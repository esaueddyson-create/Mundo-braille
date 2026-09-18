// ============================================
// Mundo Braille - Shared Application Module
// ============================================

// --- Navigation Active Tab ---
(function initNavigation() {
  var pageMap = {
    "index.html": "home",
    "ejercicios_interactivos.html": "explore",
    "reproductor_leccion.html": "videos",
    "ejercicio_practica.html": "explore",
    "musica.html": "explore",
    "perfil_usuario.html": "profile"
  };

  function normalizeFile(raw) {
    if (!raw) return "";
    try {
      raw = String(raw).split("?")[0].split("#")[0].trim();
      var parts = raw.split("/");
      var last = parts.pop() || "";
      return last.trim().toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function getCurrentFile() {
    var f = "";
    try { f = normalizeFile(window.location.pathname); } catch (e) { f = ""; }
    var hrefLower = "";
    try { hrefLower = String(window.location.href).toLowerCase(); } catch (e2) {}
    // Fallback: si pathname no dio archivo ( "/" , "" , file:// sin nombre ), buscar en href
    if (!f || f === "/" ) {
      for (var k in pageMap) { if (hrefLower.indexOf(k.toLowerCase()) !== -1) return k.toLowerCase(); }
    }
    if (!f) {
      for (var k2 in pageMap) { if (hrefLower.indexOf(k2.toLowerCase()) !== -1) return k2.toLowerCase(); }
      f = "index.html";
    }
    // Si el archivo detectado no está en pageMap pero la URL contiene uno conocido, usar ese
    if (!pageMap[f]) {
      for (var k3 in pageMap) { if (hrefLower.indexOf(k3.toLowerCase()) !== -1) return k3.toLowerCase(); }
    }
    return f;
  }

  var activeClasses = ["bg-secondary-container", "dark:bg-secondary", "text-on-secondary-container", "dark:text-on-secondary", "rounded-full", "px-5", "py-1", "translate-y-[-2px]"];
  var inactiveClasses = ["text-on-surface-variant", "dark:text-on-tertiary-container", "p-2", "hover:bg-surface-container-highest", "dark:hover:bg-on-tertiary-fixed-variant"];

  function paintNavigation() {
    var currentPage = getCurrentFile();
    var activeTab = pageMap[currentPage] || "home";

    var links = document.querySelectorAll("nav.fixed.bottom-0 a[href]");
    if (!links || links.length === 0) links = document.querySelectorAll("nav a[href]");

    links.forEach(function(link) {
      var href = link.getAttribute("href");
      if (!href || href === "#") return;
      var linkPage = normalizeFile(href);
      if (!linkPage || !pageMap[linkPage]) return;

      // Reset a estado inactivo primero (solo estilos de navegación)
      link.classList.remove.apply(link.classList, activeClasses);
      // Evitar duplicar clases inactivas
      inactiveClasses.forEach(function(c){ if(!link.classList.contains(c)) link.classList.add(c); });
      link.removeAttribute("aria-current");
      var icon = link.querySelector(".material-symbols-outlined");
      if (icon) icon.setAttribute("style", "font-variation-settings: 'FILL' 0;");

      var tab = pageMap[linkPage];
      if (tab === activeTab) {
        link.classList.add.apply(link.classList, activeClasses);
        link.classList.remove.apply(link.classList, inactiveClasses);
        link.setAttribute("aria-current", "page");
        if (icon) icon.setAttribute("style", "font-variation-settings: 'FILL' 1;");
      }
    });
  }

  function schedulePaint(){ try{ paintNavigation(); }catch(e){} }

  // Pintar en cuanto el nav exista
  schedulePaint();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedulePaint);
  }
  window.addEventListener("pageshow", schedulePaint);
  // Reintento por si el nav se inyecta tarde
  setTimeout(schedulePaint, 100);
  setTimeout(schedulePaint, 500);
})();

// --- Font Scale Override Styles (injected after Tailwind for proper cascade) ---
// Escala global: el nivel de "Tamaño del Texto" (Mi perfil, 1-4) se guarda en
// --font-scale y TODAS estas reglas lo multiplican, de modo que el cambio se
// aplica a todos los textos de todas las pantallas (no solo a algunas clases).
(function injectFontScaleStyles() {
  if (document.getElementById("font-scale-overrides")) return;
  var style = document.createElement("style");
  style.id = "font-scale-overrides";
  style.textContent = [
    // Escala tipográfica propia (bases de tailwind-config.js)
    ".text-body-lg { font-size: calc(18px * var(--font-scale, 1)) !important; }",
    ".text-body-md { font-size: calc(16px * var(--font-scale, 1)) !important; }",
    ".text-body-sm { font-size: calc(14px * var(--font-scale, 1)) !important; }",
    ".text-title-lg { font-size: calc(24px * var(--font-scale, 1)) !important; }",
    ".text-title-md { font-size: calc(20px * var(--font-scale, 1)) !important; }",
    ".text-title-sm { font-size: calc(14px * var(--font-scale, 1)) !important; }",
    ".text-label-lg { font-size: calc(16px * var(--font-scale, 1)) !important; }",
    ".text-label-md { font-size: calc(16px * var(--font-scale, 1)) !important; }",
    ".text-label-sm { font-size: calc(14px * var(--font-scale, 1)) !important; }",
    ".text-headline-lg { font-size: calc(clamp(22px, 6.5vw, 32px) * var(--font-scale, 1)) !important; }",
    ".text-headline-lg-mobile { font-size: calc(clamp(20px, 6vw, 28px) * var(--font-scale, 1)) !important; }",
    ".text-display-lg { font-size: calc(clamp(28px, 8vw, 40px) * var(--font-scale, 1)) !important; }",
    // Utilidades por defecto de Tailwind usadas en la app
    ".text-xs { font-size: calc(12px * var(--font-scale, 1)) !important; }",
    ".text-sm { font-size: calc(14px * var(--font-scale, 1)) !important; }",
    ".text-base { font-size: calc(16px * var(--font-scale, 1)) !important; }",
    ".text-lg { font-size: calc(18px * var(--font-scale, 1)) !important; }",
    ".text-xl { font-size: calc(20px * var(--font-scale, 1)) !important; }",
    ".text-2xl { font-size: calc(24px * var(--font-scale, 1)) !important; }",
    ".text-3xl { font-size: calc(30px * var(--font-scale, 1)) !important; }",
    ".text-4xl { font-size: calc(36px * var(--font-scale, 1)) !important; }",
    ".text-5xl { font-size: calc(48px * var(--font-scale, 1)) !important; }",
    ".text-6xl { font-size: calc(60px * var(--font-scale, 1)) !important; }",
    ".text-7xl { font-size: calc(72px * var(--font-scale, 1)) !important; }",
    ".text-8xl { font-size: calc(clamp(3rem, 18vw, 6rem) * var(--font-scale, 1)) !important; }",
    ".text-9xl { font-size: calc(128px * var(--font-scale, 1)) !important; }",
    // Tamaños arbitrarios text-[Npx] usados en la app (etiquetas, iconos, emojis)
    ".text-\\[10px\\] { font-size: calc(10px * var(--font-scale, 1)) !important; }",
    ".text-\\[16px\\] { font-size: calc(16px * var(--font-scale, 1)) !important; }",
    ".text-\\[20px\\] { font-size: calc(20px * var(--font-scale, 1)) !important; }",
    ".text-\\[24px\\] { font-size: calc(24px * var(--font-scale, 1)) !important; }",
    ".text-\\[28px\\] { font-size: calc(28px * var(--font-scale, 1)) !important; }",
    ".text-\\[32px\\] { font-size: calc(32px * var(--font-scale, 1)) !important; }",
    ".text-\\[36px\\] { font-size: calc(36px * var(--font-scale, 1)) !important; }",
    ".text-\\[44px\\] { font-size: calc(44px * var(--font-scale, 1)) !important; }",
    ".text-\\[48px\\] { font-size: calc(48px * var(--font-scale, 1)) !important; }",
    // Excepciones responsive de shared.css (misma especificidad + escala)
    "header h1 { font-size: calc(clamp(14px, 4vw, 20px) * var(--font-scale, 1)) !important; }",
    "nav.fixed.bottom-0 .material-symbols-outlined { font-size: calc(clamp(20px, 6vw, 24px) * var(--font-scale, 1)) !important; }",
    "nav.fixed.bottom-0 .text-label-sm { font-size: calc(clamp(10px, 2.8vw, 12px) * var(--font-scale, 1)) !important; }",
    ".stat-card .text-3xl { font-size: calc(30px * var(--font-scale, 1)) !important; }",
    // Popup Braille (unidades vw -> tambien escalan)
    "#braille-popup .popup-image { font-size: calc(clamp(64px, 22vw, 160px) * var(--font-scale, 1)) !important; }",
    "#braille-popup .popup-letter { font-size: calc(clamp(48px, 16vw, 120px) * var(--font-scale, 1)) !important; }",
    "#braille-popup .popup-word { font-size: calc(clamp(16px, 4.5vw, 28px) * var(--font-scale, 1)) !important; }",
    // Entradas de texto: escalan pero sin bajar de 16px (evita zoom auto en iOS)
    "input[type=\"text\"], input[type=\"email\"], input[type=\"password\"], textarea, select, .input-field { font-size: calc(max(16px, 16px * var(--font-scale, 1))) !important; }",
    "#traduccion-input { font-size: calc(clamp(18px, 5vw, 28px) * var(--font-scale, 1)) !important; }"
  ].join("\n");
  document.head.appendChild(style);
})();

// --- Global Visual Preferences (persisted across all pages) ---
(function applyVisualPreferences() {
  try {
    var prefs = JSON.parse(localStorage.getItem("bl_visualPrefs"));
    if (!prefs) return;

    // Dark mode
    if (prefs.darkMode) {
      document.documentElement.classList.add("dark");
    }

    // ADHD mode
    if (prefs.adhdMode) {
      document.body.classList.add("adhd-mode");
    }

    // Font size (stored as level 1-4, mapped to scale factor)
    if (prefs.fontSize) {
      var scales = [0, 0.85, 1.0, 1.2, 1.4];
      var level = (prefs.fontSize >= 1 && prefs.fontSize <= 4) ? prefs.fontSize : 2;
      document.documentElement.style.setProperty("--font-scale", scales[level]);
    }
  } catch (e) {}
})();

// --- ADHD Mode: zona de enfoque persistente ---
// Con el Modo TDAH activo, el usuario toca una zona de la pantalla (sección,
// tarjeta, formulario, encabezado, navegación o ventana modal) y SOLO esa zona
// queda resaltada mientras el resto de la interfaz se atenúa, para reducir
// distracciones. Tocar otra zona mueve el resaltado; tocar la misma zona (o el
// fondo) lo libera. Al desactivar el modo todo vuelve a la normalidad.
// No interfiere con la interacción: nunca hace preventDefault ni stopPropagation.
(function initADHDTracking() {
  var currentZone = null;

  function isADHD() {
    return document.body.classList.contains('adhd-mode');
  }

  // Unidad visual resaltable: contenedores de pantalla y ventanas modales.
  var ZONE_SELECTOR = 'section, article, li, form, header, nav, .tactile-card, .option-card, .popup-card, [role="dialog"], #braille-popup, #reto-popup, #mf-feedback-toast';

  function findZone(target) {
    if (!target || target === document.body || target === document.documentElement) return null;
    try {
      if (target.closest) {
        var z = target.closest(ZONE_SELECTOR);
        if (z && z !== document.body && z !== document.documentElement) return z;
      }
    } catch (e) {}
    // Respaldo: bloque de nivel superior dentro de main.
    try {
      var main = document.querySelector('main');
      var n = target;
      while (n && n.parentElement && n.parentElement !== main && n.parentElement !== document.body) {
        n = n.parentElement;
      }
      if (n && n.parentElement === main) return n;
    } catch (e2) {}
    return null;
  }

  function ensurePosition(el) {
    if (!el || el === document.body || el === document.documentElement) return;
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
      el.setAttribute('data-adhd-pos', '1');
    }
  }

  function restorePosition(el) {
    if (!el) return;
    if (el.hasAttribute('data-adhd-pos')) {
      el.style.position = '';
      el.removeAttribute('data-adhd-pos');
    }
  }

  function select(zone) {
    if (!isADHD() || !zone) return;
    if (currentZone === zone) return;
    clearSelection(false);
    currentZone = zone;
    ensurePosition(zone);
    zone.classList.add('adhd-highlight');
    document.body.classList.add('adhd-focus');
  }

  function clearSelection(removeFocus) {
    if (currentZone) {
      currentZone.classList.remove('adhd-highlight');
      restorePosition(currentZone);
      currentZone = null;
    } else {
      // Limpieza de restos (compatibilidad con versiones anteriores).
      document.querySelectorAll('.adhd-highlight').forEach(function(el) {
        el.classList.remove('adhd-highlight');
        restorePosition(el);
        if (el.style.position === 'relative' && !el.hasAttribute('data-adhd-pos')) {
          el.style.position = '';
        }
      });
    }
    if (removeFocus !== false) document.body.classList.remove('adhd-focus');
  }

  // Limpieza pública (la usa Mi perfil al desactivar el modo).
  window.clearADHDZone = function() { clearSelection(true); };

  // Toque/clic: selecciona la zona, o libera si se repite zona o es fondo.
  document.addEventListener('click', function(e) {
    if (!isADHD()) return;
    var zone = null;
    try { zone = findZone(e.target); } catch (err) { zone = null; }
    if (!zone || zone === currentZone) {
      clearSelection(true);
      return;
    }
    select(zone);
  }, true);

  // Teclado/lector: al enfocar, la zona del elemento queda resaltada.
  document.addEventListener('focusin', function(e) {
    if (!isADHD()) return;
    var zone = null;
    try { zone = findZone(e.target); } catch (err) { zone = null; }
    if (zone && zone !== currentZone) select(zone);
  });

  // Si el modo se apaga por cualquier vía, se restaura todo.
  if (typeof MutationObserver !== 'undefined' && document.body) {
    var bodyObs = new MutationObserver(function() {
      if (!isADHD() && (currentZone || document.body.classList.contains('adhd-focus'))) {
        clearSelection(true);
      }
    });
    bodyObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
})();

// --- Header Scroll Shadow ---
(function initHeaderScroll() {
  window.addEventListener("scroll", function() {
    var header = document.querySelector("header");
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("shadow-md");
      header.classList.remove("shadow-sm");
    } else {
      header.classList.add("shadow-sm");
      header.classList.remove("shadow-md");
    }
  });
})();

// --- Shared Store (localStorage-based) ---
window.BrailleStore = {
  // How long the backup cookie persists (1 year) so the session survives
  // browser/app restarts even if localStorage is wiped.
  SESSION_COOKIE_MAX_AGE: 60 * 60 * 24 * 365,

  hasSession: function() {
    var s = this.getSession();
    return !!(s && s.email);
  },

  set: function(key, value) {
    try { localStorage.setItem("bl_" + key, JSON.stringify(value)); } catch (e) {}
  },
  get: function(key) {
    try { return JSON.parse(localStorage.getItem("bl_" + key)); } catch (e) { return null; }
  },
  remove: function(key) {
    try { localStorage.removeItem("bl_" + key); } catch (e) {}
  },
  clear: function() {
    try {
      Object.keys(localStorage).filter(function(k) { return k.startsWith("bl_"); }).forEach(function(k) { localStorage.removeItem(k); });
    } catch (e) {}
  },
  // App-specific state
  getUser: function() { return this.get("user"); },
  setUser: function(user) { this.set("user", user); },
  saveSession: function(user) {
    this.setUser(user);
    try { sessionStorage.setItem("bl_user", JSON.stringify(user)); } catch (e1) {}
    try {
      var expires = new Date(Date.now() + this.SESSION_COOKIE_MAX_AGE * 1000).toUTCString();
      document.cookie = "bl_user=" + encodeURIComponent(JSON.stringify(user)) +
        "; path=/; max-age=" + this.SESSION_COOKIE_MAX_AGE + "; expires=" + expires + "; SameSite=Lax";
    } catch (e2) {}
  },
  getSession: function() {
    var raw = null;
    try { raw = localStorage.getItem("bl_user"); } catch (e1) {}
    if (!raw) { try { raw = sessionStorage.getItem("bl_user"); } catch (e2) {} }
    if (!raw) {
      try {
        var m = document.cookie.match(/(?:^|;\s*)bl_user=([^;]*)/);
        if (m) raw = decodeURIComponent(m[1]);
      } catch (e3) {}
    }
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  },
  clearSession: function() {
    this.remove("user");
    try { sessionStorage.removeItem("bl_user"); } catch (e1) {}
    try { document.cookie = "bl_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; } catch (e2) {}
  },
getProgress: function() {
      var p = this.get("progress") || { streak: 0, lessons: {} };
      if (p.totalPoints == null) p.totalPoints = 0;
      if (!p.badges) p.badges = [];
      if (!p.level) p.level = 0;
      return p;
    },
    setProgress: function(progress) { this.set("progress", progress); },
    getLevel: function(points) {
      var p = Math.max(0, points || 0);
      if (p <= 100) return { level: 0, name: "Principiante", icon: "🌱", min: 0, max: 100 };
      if (p <= 250) return { level: 1, name: "Explorador", icon: "🔎", min: 101, max: 250 };
      if (p <= 500) return { level: 2, name: "Aprendiz", icon: "📚", min: 251, max: 500 };
      if (p <= 800) return { level: 3, name: "Practicante", icon: "✏️", min: 501, max: 800 };
      if (p <= 1200) return { level: 4, name: "Estudiante Braille", icon: "🎓", min: 801, max: 1200 };
      if (p <= 1700) return { level: 5, name: "Experto", icon: "⭐", min: 1201, max: 1700 };
      if (p <= 2500) return { level: 6, name: "Maestro Braille", icon: "🏆", min: 1701, max: 2500 };
      if (p <= 3500) return { level: 7, name: "Maestro Avanzado", icon: "💎", min: 2501, max: 3500 };
      if (p <= 5000) return { level: 8, name: "Gran Maestro Braille", icon: "👑", min: 3501, max: 5000 };
      return { level: 9, name: "Leyenda Braille", icon: "👑", min: 5001, max: Infinity };
    },
    getLevelInfo: function(points) {
      var p = Math.max(0, points || 0);
      var info = this.getLevel(p);
      if (info.max === Infinity) return Object.assign({}, info, { percent: 100 });
      var range = info.max - info.min;
      var current = p - info.min;
      var percent = range <= 0 ? 100 : Math.min(Math.round((current / range) * 100), 100);
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;
      return Object.assign({}, info, { percent: percent });
    },
    addPoints: function(pts) {
      var p = this.getProgress();
      p.totalPoints = (p.totalPoints || 0) + pts;
      var info = this.getLevelInfo(p.totalPoints);
      p.level = info.level;
      this.setProgress(p);
      return p;
    },
    getBadges: function() {
      var p = this.getProgress();
      return p.badges || [];
    },
    addBadge: function(badgeId) {
      var p = this.getProgress();
      if (!p.badges) p.badges = [];
      if (p.badges.indexOf(badgeId) === -1) {
        p.badges.push(badgeId);
        this.setProgress(p);
      }
      return p.badges;
    },
    completeLesson: function(lessonId) {
    var p = this.getProgress();
    p.lessons[lessonId] = { completed: true, date: new Date().toISOString() };
    p.streak = (p.streak || 0) + 1;
    this.setProgress(p);
  }
};

// --- Exercise Bank (shared exercise/lesson data) ---
window.ExerciseBank = {

  // ==================== ALFABETO ====================

  "leccion-letra-b": {
    mode: "lesson",
    category: "alfabeto",
    label: "El Alfabeto Braille",
    progressCurrent: 1,
    progressTotal: 6,
    character: "B",
    dots: [1,1,0,0,0,0],
    interactive: true,
    description: 'Forma la letra <b>B</b> activando los puntos <b>1 y 2</b> del cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Ejemplo: <b>B</b> de <u>Braille</u>.',
    next: "identificar-letra-a"
  },

  "identificar-letra-a": {
    mode: "quiz",
    category: "alfabeto",
    label: "El Alfabeto Braille",
    progressCurrent: 2,
    progressTotal: 6,
    character: "A",
    dots: [1,0,0,0,0,0],
    question: "Identifica el símbolo para la letra 'A'",
    hint: "Selecciona la celda Braille correcta.",
    options: [
      { dots: [1,0,0,0,0,0], label: "A" },
      { dots: [1,1,0,0,0,0], label: "B" },
      { dots: [1,0,0,1,0,0], label: "C" },
      { dots: [1,1,0,1,0,0], label: "F" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! Has representado la letra A en Braille.",
    next: "leccion-letra-c"
  },

  "leccion-letra-c": {
    mode: "lesson",
    category: "alfabeto",
    label: "El Alfabeto Braille",
    progressCurrent: 3,
    progressTotal: 6,
    character: "C",
    dots: [1,0,0,1,0,0],
    interactive: true,
    description: 'Forma la letra <b>C</b> activando los puntos <b>1 y 4</b> del cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Ejemplo: <b>C</b> de <u>Comunicación</u>.',
    next: "identificar-letra-b"
  },

  "identificar-letra-b": {
    mode: "quiz",
    category: "alfabeto",
    label: "El Alfabeto Braille",
    progressCurrent: 4,
    progressTotal: 6,
    character: "B",
    dots: [1,1,0,0,0,0],
    question: "Identifica el símbolo para la letra 'B'",
    hint: "Selecciona la celda Braille correcta.",
    options: [
      { dots: [1,0,0,0,0,0], label: "A" },
      { dots: [1,1,0,0,0,0], label: "B" },
      { dots: [1,0,0,1,0,0], label: "C" },
      { dots: [1,0,0,0,1,0], label: "E" }
    ],
    correctIndex: 1,
    successMessage: "¡Correcto! Has representado la letra B en Braille.",
    next: "leccion-letra-d"
  },

  "leccion-letra-d": {
    mode: "lesson",
    category: "alfabeto",
    label: "El Alfabeto Braille",
    progressCurrent: 5,
    progressTotal: 6,
    character: "D",
    dots: [1,0,0,1,1,0],
    interactive: true,
    description: 'Forma la letra <b>D</b> activando los puntos <b>1, 4 y 5</b> del cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Ejemplo: <b>D</b> de <u>Dedo</u>.',
    next: "identificar-letra-c"
  },

  "identificar-letra-c": {
    mode: "quiz",
    category: "alfabeto",
    label: "El Alfabeto Braille",
    progressCurrent: 6,
    progressTotal: 6,
    character: "C",
    dots: [1,0,0,1,0,0],
    question: "Identifica el símbolo para la letra 'C'",
    hint: "Selecciona la celda Braille correcta.",
    options: [
      { dots: [1,1,0,0,0,0], label: "B" },
      { dots: [1,0,0,1,0,0], label: "C" },
      { dots: [1,0,0,0,1,0], label: "E" },
      { dots: [1,0,0,0,0,0], label: "A" }
    ],
    correctIndex: 1,
    successMessage: "¡Excelente! Has representado la letra C en Braille.",
    next: null
  },

  // ==================== NÚMEROS ====================

  "leccion-numero-1": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 1,
    progressTotal: 34,
    character: "1",
    dots: [1,0,0,0,0,0],
    interactive: true,
    description: 'Forma el número <b>1</b> (como en la pantalla de Números: 🍎) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>1</b> se muestra con 🍎 en la pantalla de Números.',
    next: "identificar-numero-1"
  },

  "identificar-numero-1": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 2,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0]], label: "3" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 1 (🍎).",
    next: "leccion-numero-2"
  },

  "leccion-numero-2": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 3,
    progressTotal: 34,
    character: "2",
    dots: [1,1,0,0,0,0],
    interactive: true,
    description: 'Forma el número <b>2</b> (como en la pantalla de Números: 🍌) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>2</b> se muestra con 🍌 en la pantalla de Números.',
    next: "identificar-numero-2"
  },

  "identificar-numero-2": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 4,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0]], label: "3" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 2 (🍌).",
    next: "leccion-numero-3"
  },

  "leccion-numero-3": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 5,
    progressTotal: 34,
    character: "3",
    dots: [1,0,0,1,0,0],
    interactive: true,
    description: 'Forma el número <b>3</b> (como en la pantalla de Números: 🍇) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>3</b> se muestra con 🍇 en la pantalla de Números.',
    next: "identificar-numero-3"
  },

  "identificar-numero-3": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 6,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,1,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0]], label: "3" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 3 (🍇).",
    next: "leccion-numero-4"
  },

  "leccion-numero-4": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 7,
    progressTotal: 34,
    character: "4",
    dots: [1,0,0,1,1,0],
    interactive: true,
    description: 'Forma el número <b>4</b> (como en la pantalla de Números: 🍓) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>4</b> se muestra con 🍓 en la pantalla de Números.',
    next: "identificar-numero-4"
  },

  "identificar-numero-4": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 8,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,1,1,0]], label: "4" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 4 (🍓).",
    next: "leccion-numero-5"
  },

  "leccion-numero-5": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 9,
    progressTotal: 34,
    character: "5",
    dots: [1,0,0,0,1,0],
    interactive: true,
    description: 'Forma el número <b>5</b> (como en la pantalla de Números: 🌟) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>5</b> se muestra con 🌟 en la pantalla de Números.',
    next: "identificar-numero-5"
  },

  "identificar-numero-5": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 10,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,0,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,0,1,0]], label: "5" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 5 (🌟).",
    next: "leccion-numero-6"
  },

  "leccion-numero-6": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 11,
    progressTotal: 34,
    character: "6",
    dots: [1,1,0,1,0,0],
    interactive: true,
    description: 'Forma el número <b>6</b> (como en la pantalla de Números: 🎈) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>6</b> se muestra con 🎈 en la pantalla de Números.',
    next: "identificar-numero-6"
  },

  "identificar-numero-6": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 12,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,1,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,1,0,0]], label: "6" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 6 (🎈).",
    next: "leccion-numero-7"
  },

  "leccion-numero-7": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 13,
    progressTotal: 34,
    character: "7",
    dots: [1,1,0,1,1,0],
    interactive: true,
    description: 'Forma el número <b>7</b> (como en la pantalla de Números: 🌼) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>7</b> se muestra con 🌼 en la pantalla de Números.',
    next: "identificar-numero-7"
  },

  "identificar-numero-7": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 14,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,1,1,0]], label: "7" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 7 (🌼).",
    next: "leccion-numero-8"
  },

  "leccion-numero-8": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 15,
    progressTotal: 34,
    character: "8",
    dots: [1,1,0,0,1,0],
    interactive: true,
    description: 'Forma el número <b>8</b> (como en la pantalla de Números: ⚽) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>8</b> se muestra con ⚽ en la pantalla de Números.',
    next: "identificar-numero-8"
  },

  "identificar-numero-8": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 16,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,0,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,0,1,0]], label: "8" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 8 (⚽).",
    next: "leccion-numero-9"
  },

  "leccion-numero-9": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 17,
    progressTotal: 34,
    character: "9",
    dots: [0,1,0,1,0,0],
    interactive: true,
    description: 'Forma el número <b>9</b> (como en la pantalla de Números: 🍪) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'Recuerda: el número <b>9</b> se muestra con 🍪 en la pantalla de Números.',
    next: "identificar-numero-9"
  },

  "identificar-numero-9": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 18,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[0,1,0,1,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[0,1,0,1,0,0]], label: "9" },
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 9 (🍪).",
    next: "leccion-numero-0"
  },

  "leccion-numero-0": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 19,
    progressTotal: 34,
    character: "0",
    dots: [0,1,0,1,1,0],
    interactive: true,
    description: 'Forma el número <b>0</b> (el 0 no tiene ejemplos en la pantalla de Números) activando los puntos correspondientes en el cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'El <b>0</b> no tiene ejemplos en la pantalla de Números.',
    next: "identificar-numero-0"
  },

  "identificar-numero-0": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 20,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[0,1,0,1,1,0]], label: "0" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0]], label: "1" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0]], label: "2" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0]], label: "3" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 0.",
    next: "identificar-numero-10"
  },

  "identificar-numero-10": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 21,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,1,0],[1,1,0,1,1,0]], label: "47" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 10.",
    next: "identificar-numero-22"
  },

  "identificar-numero-22": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 22,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,1,0],[1,1,0,1,1,0]], label: "47" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 22.",
    next: "identificar-numero-35"
  },

  "identificar-numero-35": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 23,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,1,0],[1,1,0,1,1,0]], label: "47" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 35.",
    next: "identificar-numero-47"
  },

  "identificar-numero-47": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 24,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,1,1,0],[1,1,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,1,1,0],[1,1,0,1,1,0]], label: "47" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 47.",
    next: "identificar-numero-58"
  },

  "identificar-numero-58": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 25,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,0,1,0],[1,1,0,0,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,0,1,0],[1,1,0,0,1,0]], label: "58" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 58.",
    next: "identificar-numero-64"
  },

  "identificar-numero-64": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 26,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,1,0,0],[1,0,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,1,0,0],[1,0,0,1,1,0]], label: "64" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 64.",
    next: "identificar-numero-73"
  },

  "identificar-numero-73": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 27,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,1,1,0],[1,0,0,1,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,1,1,0],[1,0,0,1,0,0]], label: "73" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 73.",
    next: "identificar-numero-99"
  },

  "identificar-numero-99": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 28,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[0,1,0,1,0,0],[0,1,0,1,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[0,1,0,1,0,0],[0,1,0,1,0,0]], label: "99" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0]], label: "10" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,1,0,0,0,0]], label: "22" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,0,0,0,1,0]], label: "35" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 99.",
    next: "identificar-numero-105"
  },

  "identificar-numero-105": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 29,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0],[1,0,0,0,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0],[1,0,0,0,1,0]], label: "105" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,0,0,1,1,0],[0,1,0,1,1,0]], label: "240" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,1,0,1,1,0],[1,1,0,0,1,0]], label: "378" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,1,0],[1,0,0,0,0,0],[1,1,0,0,0,0]], label: "512" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 105.",
    next: "identificar-numero-240"
  },

  "identificar-numero-240": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 30,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,0,0,1,1,0],[0,1,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,0,0,1,1,0],[0,1,0,1,1,0]], label: "240" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0],[1,0,0,0,1,0]], label: "105" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,1,0,1,1,0],[1,1,0,0,1,0]], label: "378" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,1,0],[1,0,0,0,0,0],[1,1,0,0,0,0]], label: "512" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 240.",
    next: "identificar-numero-378"
  },

  "identificar-numero-378": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 31,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,1,0,1,1,0],[1,1,0,0,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,1,0,1,1,0],[1,1,0,0,1,0]], label: "378" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0],[1,0,0,0,1,0]], label: "105" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,0,0,1,1,0],[0,1,0,1,1,0]], label: "240" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,1,0],[1,0,0,0,0,0],[1,1,0,0,0,0]], label: "512" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 378.",
    next: "identificar-numero-512"
  },

  "identificar-numero-512": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 32,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,0,0,0,1,0],[1,0,0,0,0,0],[1,1,0,0,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,0,0,0,1,0],[1,0,0,0,0,0],[1,1,0,0,0,0]], label: "512" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0],[1,0,0,0,1,0]], label: "105" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,0,0,1,1,0],[0,1,0,1,1,0]], label: "240" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,1,0,1,1,0],[1,1,0,0,1,0]], label: "378" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 512.",
    next: "identificar-numero-684"
  },

  "identificar-numero-684": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 33,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[1,1,0,1,0,0],[1,1,0,0,1,0],[1,0,0,1,1,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[1,1,0,1,0,0],[1,1,0,0,1,0],[1,0,0,1,1,0]], label: "684" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0],[1,0,0,0,1,0]], label: "105" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,0,0,1,1,0],[0,1,0,1,1,0]], label: "240" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,1,0,1,1,0],[1,1,0,0,1,0]], label: "378" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 684.",
    next: "identificar-numero-999"
  },

  "identificar-numero-999": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 34,
    progressTotal: 34,
    cells: [[0,0,1,1,1,1],[0,1,0,1,0,0],[0,1,0,1,0,0],[0,1,0,1,0,0]],
    question: "¿Qué número representan estos puntos Braille?",
    hint: "Observa las celdas activas (el primer símbolo es el signo de número).",
    options: [
      { cells: [[0,0,1,1,1,1],[0,1,0,1,0,0],[0,1,0,1,0,0],[0,1,0,1,0,0]], label: "999" },
      { cells: [[0,0,1,1,1,1],[1,0,0,0,0,0],[0,1,0,1,1,0],[1,0,0,0,1,0]], label: "105" },
      { cells: [[0,0,1,1,1,1],[1,1,0,0,0,0],[1,0,0,1,1,0],[0,1,0,1,1,0]], label: "240" },
      { cells: [[0,0,1,1,1,1],[1,0,0,1,0,0],[1,1,0,1,1,0],[1,1,0,0,1,0]], label: "378" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El número es 999.",
    next: null
  },


  // ==================== PALABRAS Y FRASES ====================

  "traducir-hola": {
    mode: "traduccion",
    category: "palabras",
    label: "Palabras y Frases",
    progressCurrent: 1,
    progressTotal: 4,
    question: "Traduce la siguiente palabra en Braille:",
    hint: "Escribe la palabra en texto convencional.",
    displayLabel: "¿Qué palabra es?",
    answer: "hola",
    braille: [
      [1,1,0,0,1,0],
      [1,0,1,0,1,0],
      [1,1,1,0,0,0],
      [1,0,0,0,0,0]
    ],
    successMessage: "¡Excelente! Has traducido 'hola' correctamente.",
    next: "traducir-mama"
  },

  "traducir-mama": {
    mode: "traduccion",
    category: "palabras",
    label: "Palabras y Frases",
    progressCurrent: 2,
    progressTotal: 4,
    question: "Traduce la siguiente palabra en Braille:",
    hint: "Escribe la palabra en texto convencional.",
    displayLabel: "¿Qué palabra es?",
    answer: "mama",
    braille: [
      [1,0,1,1,0,0],
      [1,0,0,0,0,0],
      [1,0,1,1,0,0],
      [1,0,0,0,0,0]
    ],
    successMessage: "¡Correcto! Has traducido 'mamá' (mama).",
    next: "traducir-sol"
  },

  "traducir-sol": {
    mode: "traduccion",
    category: "palabras",
    label: "Palabras y Frases",
    progressCurrent: 3,
    progressTotal: 4,
    question: "Traduce la siguiente palabra en Braille:",
    hint: "Escribe la palabra en texto convencional.",
    displayLabel: "¿Qué palabra es?",
    answer: "sol",
    braille: [
      [0,1,1,1,0,0],
      [1,0,1,0,1,0],
      [1,1,1,0,0,0]
    ],
    successMessage: "¡Muy bien! 'Sol' se escribe así en Braille.",
    next: "traducir-abeja"
  },

  "traducir-abeja": {
    mode: "traduccion",
    category: "palabras",
    label: "Palabras y Frases",
    progressCurrent: 4,
    progressTotal: 4,
    question: "Traduce la siguiente palabra en Braille:",
    hint: "Escribe la palabra en texto convencional.",
    displayLabel: "¿Qué palabra es?",
    answer: "abeja",
    braille: [
      [1,0,0,0,0,0],
      [1,1,0,0,0,0],
      [1,0,0,0,1,0],
      [0,1,0,1,1,0],
      [1,0,0,0,0,0]
    ],
    successMessage: "¡Perfecto! Has completado todos los ejercicios de palabras.",
    next: null
  },

  // ==================== MÚSICA ====================

  "notas-musicales-eval": {
    mode: "lesson",
    category: "musica",
    label: "Música en Braille",
    progressCurrent: 1,
    progressTotal: 6,
    character: "♪",
    dots: [0,1,0,0,1,0],
    interactive: true,
    description: 'Forma la <b>Nota Musical</b> activando los puntos <b>2 y 5</b> del cajetín Braille.',
    audioLabel: "Escuchar nota",
    mnemonic: 'Ejemplo: <b>♪</b> de <u>Nota Musical</u>.',
    next: "identificar-nota"
  },

  "identificar-nota": {
    mode: "quiz",
    category: "musica",
    label: "Música en Braille",
    progressCurrent: 2,
    progressTotal: 6,
    character: "♪",
    dots: [0,1,0,0,1,0],
    question: "Identifica el símbolo de la Nota Musical en Braille",
    hint: "Selecciona la celda Braille correcta.",
    options: [
      { dots: [0,1,0,0,1,0], label: "♪" },
      { dots: [0,1,1,0,0,0], label: "♩" },
      { dots: [0,1,0,0,0,1], label: "♫" },
      { dots: [1,1,0,0,0,1], label: "♬" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! Has representado la Nota Musical en Braille.",
    next: "notas-corchea"
  },

  "notas-corchea": {
    mode: "lesson",
    category: "musica",
    label: "Música en Braille",
    progressCurrent: 3,
    progressTotal: 6,
    character: "♩",
    dots: [0,1,1,0,0,0],
    interactive: true,
    description: 'Forma la <b>Corchea</b> activando los puntos <b>2 y 3</b> del cajetín Braille.',
    audioLabel: "Escuchar nota",
    mnemonic: 'Ejemplo: <b>♩</b> de <u>Corchea</u>.',
    next: "identificar-corchea"
  },

  "identificar-corchea": {
    mode: "quiz",
    category: "musica",
    label: "Música en Braille",
    progressCurrent: 4,
    progressTotal: 6,
    character: "♩",
    dots: [0,1,1,0,0,0],
    question: "Identifica la Corchea en Braille",
    hint: "Selecciona la celda Braille correcta.",
    options: [
      { dots: [0,1,1,0,0,0], label: "♩" },
      { dots: [0,1,0,0,1,0], label: "♪" },
      { dots: [0,1,0,0,0,1], label: "♫" },
      { dots: [0,1,0,0,0,0], label: "♭" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! Has representado la Corchea en Braille.",
    next: "notas-bemol"
  },

  "notas-bemol": {
    mode: "lesson",
    category: "musica",
    label: "Música en Braille",
    progressCurrent: 5,
    progressTotal: 6,
    character: "♭",
    dots: [0,1,0,0,0,0],
    interactive: true,
    description: 'Forma el <b>Bemol</b> activando solo el punto <b>2</b> del cajetín Braille.',
    audioLabel: "Escuchar nota",
    mnemonic: 'Ejemplo: <b>♭</b> de <u>Bemol</u>.',
    next: "identificar-bemol"
  },

  "identificar-bemol": {
    mode: "quiz",
    category: "musica",
    label: "Música en Braille",
    progressCurrent: 6,
    progressTotal: 6,
    character: "♭",
    dots: [0,1,0,0,0,0],
    question: "Identifica el Símbolo en Braille",
    hint: "Selecciona la celda Braille correcta.",
    options: [
      { dots: [0,1,0,0,0,0], label: "♭" },
      { dots: [0,1,0,0,1,0], label: "♪" },
      { dots: [0,1,1,0,0,0], label: "♩" },
      { dots: [1,1,0,0,0,1], label: "♬" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! Has representado el Bemol en Braille.",
    next: null
  }

};

// --- Alfabeto Braille (A-Z + Ñ) tabla compartida - FUENTE ÚNICA DE VERDAD ---
// Esta es la única definición de equivalencias letra → dots. Alfabeto Braille y Reto del día deben usarla.
window.BrailleAlphabet = [
  { letter: "A", dots: [1,0,0,0,0,0] },
  { letter: "B", dots: [1,1,0,0,0,0] },
  { letter: "C", dots: [1,0,0,1,0,0] },
  { letter: "D", dots: [1,0,0,1,1,0] },
  { letter: "E", dots: [1,0,0,0,1,0] },
  { letter: "F", dots: [1,1,0,1,0,0] },
  { letter: "G", dots: [1,1,0,1,1,0] },
  { letter: "H", dots: [1,1,0,0,1,0] },
  { letter: "I", dots: [0,1,0,1,0,0] },
  { letter: "J", dots: [0,1,0,1,1,0] },
  { letter: "K", dots: [1,0,1,0,0,0] },
  { letter: "L", dots: [1,1,1,0,0,0] },
  { letter: "M", dots: [1,0,1,1,0,0] },
  { letter: "N", dots: [1,0,1,1,1,0] },
  { letter: "O", dots: [1,0,1,0,1,0] },
  { letter: "P", dots: [1,1,1,1,0,0] },
  { letter: "Q", dots: [1,1,1,1,1,0] },
  { letter: "R", dots: [1,1,1,0,1,0] },
  { letter: "S", dots: [0,1,1,1,0,0] },
  { letter: "T", dots: [0,1,1,1,1,0] },
  { letter: "U", dots: [1,0,1,0,0,1] },
  { letter: "V", dots: [1,1,1,0,0,1] },
  { letter: "W", dots: [0,1,0,1,1,1] },
  { letter: "X", dots: [1,0,1,1,0,1] },
  { letter: "Y", dots: [1,0,1,1,1,1] },
  { letter: "Z", dots: [1,0,1,0,1,1] },
  { letter: "Ñ", dots: [1,1,1,1,1,1] }
];

// --- Alfabeto Quechua (Runasimi) - FUENTE ÚNICA DE VERDAD ---
// Solo se usa cuando el modo Quechua está activo. Contiene EXACTAMENTE las
// 18 letras del alfabeto quechua oficial, en este orden:
// Vocales (3): A, I, U. Consonantes (15): CH, H, K, L, LL, M, N, Ñ,
// P, Q, R, S, T, W, Y.
// No incluye E, O ni otras letras, combinaciones aspiradas o glotalizadas.
// Convención Braille para esta app (celdas de 6 puntos [d1..d6]):
// - Grafías de una letra: celda estándar del Braille español.
// - Dígrafos CH y LL: dos celdas (CH=C+H, LL=L+L).
window.BrailleQuechuaAlphabet = [
  { grapheme: "A",  cells: [[1,0,0,0,0,0]] },
  { grapheme: "I",  cells: [[0,1,0,1,0,0]] },
  { grapheme: "U",  cells: [[1,0,1,0,0,1]] },
  { grapheme: "CH", cells: [[1,0,0,1,0,0],[1,1,0,0,1,0]] },
  { grapheme: "H",  cells: [[1,1,0,0,1,0]] },
  { grapheme: "K",  cells: [[1,0,1,0,0,0]] },
  { grapheme: "L",  cells: [[1,1,1,0,0,0]] },
  { grapheme: "LL", cells: [[1,1,1,0,0,0],[1,1,1,0,0,0]] },
  { grapheme: "M",  cells: [[1,0,1,1,0,0]] },
  { grapheme: "N",  cells: [[1,0,1,1,1,0]] },
  { grapheme: "Ñ",  cells: [[1,1,1,1,1,1]] },
  { grapheme: "P",  cells: [[1,1,1,1,0,0]] },
  { grapheme: "Q",  cells: [[1,1,1,1,1,0]] },
  { grapheme: "R",  cells: [[1,1,1,0,1,0]] },
  { grapheme: "S",  cells: [[0,1,1,1,0,0]] },
  { grapheme: "T",  cells: [[0,1,1,1,1,0]] },
  { grapheme: "W",  cells: [[0,1,0,1,1,1]] },
  { grapheme: "Y",  cells: [[1,0,1,1,1,1]] }
];

// Palabra ejemplo (quechua) + emoji por cada letra, mismo orden y grafías.
window.BrailleQuechuaWords = [
  { grapheme: "A",  word: "atuq",   emoji: "🦊" },
  { grapheme: "I",  word: "inti",   emoji: "☀️" },
  { grapheme: "U",  word: "urpi",   emoji: "🕊️" },
  { grapheme: "CH", word: "chaski", emoji: "🏃" },
  { grapheme: "H",  word: "hatun",  emoji: "🐘" },
  { grapheme: "K",  word: "killa",  emoji: "🌙" },
  { grapheme: "L",  word: "laqhu",  emoji: "🌿" },
  { grapheme: "LL", word: "llama",  emoji: "🦙" },
  { grapheme: "M",  word: "mama",   emoji: "🤱" },
  { grapheme: "N",  word: "nina",   emoji: "🔥" },
  { grapheme: "Ñ",  word: "ñan",    emoji: "🛤️" },
  { grapheme: "P",  word: "pacha",  emoji: "🌍" },
  { grapheme: "Q",  word: "quri",   emoji: "🪙" },
  { grapheme: "R",  word: "runa",   emoji: "🧑" },
  { grapheme: "S",  word: "sara",   emoji: "🌽" },
  { grapheme: "T",  word: "tuta",   emoji: "🌃" },
  { grapheme: "W",  word: "wasi",   emoji: "🏠" },
  { grapheme: "Y",  word: "yaku",   emoji: "💧" }
];

// Convierte una palabra quechua a celdas Braille (aplanadas) usando SOLO las
// 18 letras (coincidencia más larga: CH y LL antes que sus letras simples).
// Devuelve null si la palabra contiene letras fuera del alfabeto quechua.
window.quechuaWordToBraille = function(word) {
  if (!word) return null;
  var map = {};
  window.BrailleQuechuaAlphabet.forEach(function(e) { map[e.grapheme] = e.cells; });
  var s = String(word).toLowerCase().replace(/[’‘`]/g, "'");
  var order = ["CH", "LL",
               "A", "I", "U", "H", "K", "L", "M", "N", "Ñ", "P", "Q", "R", "S", "T", "W", "Y"];
  var cells = [];
  var i = 0;
  while (i < s.length) {
    var matched = null;
    for (var k = 0; k < order.length; k++) {
      var g = order[k];
      if (s.substr(i, g.length).toUpperCase() === g) { matched = g; break; }
    }
    if (!matched || !map[matched]) return null;
    var gc = map[matched];
    for (var c = 0; c < gc.length; c++) cells.push(gc[c].slice());
    i += matched.length;
  }
  return cells.length ? cells : null;
};

// Palabras quechuas para el Reto del día (todas tokenizables con las 18 letras).
window.BrailleQuechuaWordList = (function() {
  var list = ["mama", "wasi", "yaku", "tuta", "nina", "sara", "runa", "llama",
              "allqu", "tayta", "chaski", "hatun", "yachay", "qillqa", "simi", "inti"];
  var out = [];
  list.forEach(function(w) {
    var b = window.quechuaWordToBraille(w);
    if (b) out.push({ word: w, braille: b });
  });
  return out;
})();

// Renderiza una o varias celdas Braille de 6 puntos como SVG (multicelda en fila).
// cells: [[d1..d6], ...]. opts: {active, inactive, stroke}.
window.BrailleCellsSVG = function(cells, cls, opts) {
  var o = opts || {};
  var activeFill = o.active || "#000613";
  var inactiveFill = o.inactive || "#e5e2e1";
  var inactiveStroke = o.stroke || "#c4c6cf";
  var pos = [[12,14],[12,30],[12,46],[38,14],[38,30],[38,46]];
  var n = Math.max(1, cells.length);
  var svg = '<svg viewBox="0 0 ' + (50 * n) + ' 70" class="' + (cls || "w-full h-16") + '" xmlns="http://www.w3.org/2000/svg">';
  for (var ci = 0; ci < cells.length; ci++) {
    var ox = ci * 50;
    for (var d = 0; d < 6; d++) {
      var fill = cells[ci][d] ? activeFill : inactiveFill;
      var stroke = cells[ci][d] ? activeFill : inactiveStroke;
      svg += '<circle cx="' + (pos[d][0] + ox) + '" cy="' + pos[d][1] + '" r="6" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1"/>';
    }
  }
  return svg + "</svg>";
};

// Atajo: ¿está activo el modo Quechua?
window.isQuechuaMode = function() {
  return !!(window.AppLang && window.AppLang.isQuechua && window.AppLang.isQuechua());
};

// --- Números Braille (0-9) tabla compartida - espejo de Alfabeto ---
window.BrailleNumbers = [
  { number: "1", dots: [1,0,0,0,0,0] },
  { number: "2", dots: [1,1,0,0,0,0] },
  { number: "3", dots: [1,0,0,1,0,0] },
  { number: "4", dots: [1,0,0,1,1,0] },
  { number: "5", dots: [1,0,0,0,1,0] },
  { number: "6", dots: [1,1,0,1,0,0] },
  { number: "7", dots: [1,1,0,1,1,0] },
  { number: "8", dots: [1,1,0,0,1,0] },
  { number: "9", dots: [0,1,0,1,0,0] },
  { number: "0", dots: [0,1,0,1,1,0] }
];

// --- Palabras y Frases Braille - generadas desde BrailleAlphabet (fuente de verdad) ---
window.BrailleWords = (function(){
  var map = {};
  window.BrailleAlphabet.forEach(function(e){ map[e.letter] = e.dots; });
  function wordToBraille(w){
    return w.toUpperCase().split('').map(function(ch){
      // Solo A-Z tienen equivalencia; espacio se ignora
      return map[ch] || null;
    }).filter(Boolean);
  }
  // Lista curada: solo letras A-Z, sin tildes/ñ, correcta según alfabeto
  var list = ["hola","mama","sol","abeja","casa","luz","pan","mesa","libro","agua","luna","perro","gato","flor","cielo","mar","fuego","aire","noche","dia","mano","ojo","boca","pie","vaca","toro","oso","pato","pez","arbol"];
  return list.map(function(w){
    return { word: w, braille: wordToBraille(w) };
  });
})();

// --- Música Braille ---
window.BrailleMusic = [
  { name: "Nota Musical", sym: "♪", dots: [0,1,0,0,1,0] },
  { name: "Corchea", sym: "♩", dots: [0,1,1,0,0,0] },
  { name: "Fusa", sym: "♫", dots: [0,1,0,0,0,1] },
  { name: "Compás", sym: "♬", dots: [1,1,0,0,0,1] },
  { name: "Bemol", sym: "♭", dots: [0,1,0,0,0,0] },
  { name: "Sostenido", sym: "♯", dots: [0,1,1,0,1,0] }
];

// --- Course Router (centralized navigation) ---
window.CourseRouter = {
  categories: {
    "alfabeto":  { page: "ejercicio_practica.html", course: "braille-basico", lesson: "alphabet-eval" },
    "numeros":   { page: "ejercicio_practica.html", course: "numeros",        lesson: "numeros-eval" },
    "palabras":  { page: "ejercicio_practica.html", course: "palabras",       lesson: "palabras-eval" },
    "lectura":   { page: "ejercicio_practica.html", course: "braille-basico", lesson: "leccion-letra-b" },
    "escritura": { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-a" },
    "musica":   { page: "ejercicio_practica.html", course: "musica",        lesson: "notas-musicales-eval" }
  },

  nextSteps: {
    "leccion-letra-b":      { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-a" },
    "identificar-letra-a":  { page: "ejercicio_practica.html", course: "braille-basico", lesson: "leccion-letra-c" },
    "leccion-letra-c":      { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-b" },
    "identificar-letra-b":  { page: "ejercicio_practica.html", course: "braille-basico", lesson: "leccion-letra-d" },
    "leccion-letra-d":      { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-c" },
    "identificar-letra-c":  null,
    "leccion-numero-1": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-1" },
    "identificar-numero-1": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-2" },
    "leccion-numero-2": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-2" },
    "identificar-numero-2": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-3" },
    "leccion-numero-3": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-3" },
    "identificar-numero-3": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-4" },
    "leccion-numero-4": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-4" },
    "identificar-numero-4": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-5" },
    "leccion-numero-5": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-5" },
    "identificar-numero-5": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-6" },
    "leccion-numero-6": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-6" },
    "identificar-numero-6": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-7" },
    "leccion-numero-7": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-7" },
    "identificar-numero-7": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-8" },
    "leccion-numero-8": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-8" },
    "identificar-numero-8": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-9" },
    "leccion-numero-9": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-9" },
    "identificar-numero-9": { page: "ejercicio_practica.html", course: "numeros", lesson: "leccion-numero-0" },
    "leccion-numero-0": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-0" },
    "identificar-numero-0": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-10" },
    "identificar-numero-10": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-22" },
    "identificar-numero-22": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-35" },
    "identificar-numero-35": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-47" },
    "identificar-numero-47": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-58" },
    "identificar-numero-58": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-64" },
    "identificar-numero-64": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-73" },
    "identificar-numero-73": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-99" },
    "identificar-numero-99": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-105" },
    "identificar-numero-105": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-240" },
    "identificar-numero-240": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-378" },
    "identificar-numero-378": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-512" },
    "identificar-numero-512": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-684" },
    "identificar-numero-684": { page: "ejercicio_practica.html", course: "numeros", lesson: "identificar-numero-999" },
    "identificar-numero-999": null,
    "traducir-hola":  { page: "ejercicio_practica.html", course: "palabras", lesson: "traducir-mama" },
    "traducir-mama":  { page: "ejercicio_practica.html", course: "palabras", lesson: "traducir-sol" },
    "traducir-sol":   { page: "ejercicio_practica.html", course: "palabras", lesson: "traducir-abeja" },
    "traducir-abeja": null
  },

  getExercise: function(lesson) {
    return ExerciseBank[lesson] || null;
  },

  open: function(course, lesson, progress) {
    var params = "?course=" + encodeURIComponent(course) + "&lesson=" + encodeURIComponent(lesson);
    if (progress !== undefined) params += "&progress=" + progress;
    window.location.href = "ejercicio_practica.html" + params;
  },

  openCategory: function(slug) {
    var cat = this.categories[slug];
    if (!cat) return;
    var params = "?course=" + encodeURIComponent(cat.course) + "&lesson=" + encodeURIComponent(cat.lesson);
    window.location.href = cat.page + params;
  },

  isLastStep: function(currentLesson) {
    return !this.nextSteps[currentLesson];
  },

  goNext: function(currentLesson) {
    var next = this.nextSteps[currentLesson];
    if (!next) {
      window.location.href = "ejercicios_interactivos.html";
      return;
    }
    var params = "?course=" + encodeURIComponent(next.course) + "&lesson=" + encodeURIComponent(next.lesson);
    if (next.progress !== undefined) params += "&progress=" + next.progress;
    window.location.href = next.page + params;
  },

  goBack: function() {
    window.history.back();
  }
};

// --- Idioma Quechua (Runasimi) - Traducción global de la interfaz ---
// Cuando se activa "Quechua" en Mi perfil, toda la interfaz visible
// (menús, botones, títulos, mensajes y configuraciones de todas las
// pantallas) se muestra en quechua sureño del Perú. Al desactivarlo,
// todo vuelve al español. Funciona también con contenido generado
// dinámicamente (tarjetas, ejercicios, resultados) mediante un
// MutationObserver. Los iconos (material-symbols) nunca se traducen.
window.AppLang = (function() {
  var DICT = {
    // Navegación principal
    "Inicio": "Qallariy",
    "Mi aprendizaje": "Yachayniy",
    "Ejercicios": "Ruraykuna",
    "Perfil": "Ñuqamanta",
    "Mi Perfil": "Ñuqamanta",
    // Inicio
    "¡Hola, Aprendiz!": "¡Rimaykullayki, yachaq!",
    "Continúa tu camino": "Ñannikita qatiy",
    "Empieza tu camino": "Ñannikita qallariy",
    "Cajetillas Braille": "Braille cajitillakuna",
    "Alfabeto": "Achahala",
    "Números": "Yupaykuna",
    "Numeros": "Yupaykuna",
    "Escritura": "Qillqay",
    "Música": "Taki",
    "Videos recomendados para ti": "Qanpaq akllasqa videokuna",
    "Ver todos": "Tukuyta qhaway",
    "Los más populares": "Aswan riqsisqakuna",
    "Historia del Braille Digital": "Digital Braillepa wiñaynin",
    "Introducción al Alfabeto Braille": "Braille achahalata riqsiy",
    "Escritura con Regleta y Punzón": "Reglawan punzunwan qillqay",
    "Aprende el Alfabeto Braille": "Braille achahalata yachay",
    "Lectura en Braille Paso a Paso": "Braillepi ñawinchay, allmanta",
    "Números en Braille": "Yupaykuna Braillepi",
    // Alfabeto / Números / Música / Signos
    "Alfabeto Braille": "Achahala Braille",
    "Aprende cada letra del alfabeto con su representación en puntos Braille.": "Sapa qillqata Braille unchakunawan yachay.",
    "Números Braille": "Yupaykuna Braille",
    "Aprende cada número con su representación en puntos Braille y un ejemplo.": "Sapa yupayta Braille unchakunawan yachay, rikch'ayniyuq.",
    "0 ejemplos": "0 rikch'aykuna",
    "Música en Braille": "Taki Braillepi",
    "Aprende a leer y escribir notas musicales en Braille.": "Braillepi taki unanchakunata ñawinchayta qillqaytapas yachay.",
    "Signos de puntuación": "Unanchakuna",
    "Conoce los signos de puntuación en Braille y su escritura.": "Braillepi unanchakunata riqsiy, qillqayta yachay.",
    // Mi perfil
    "Aprendiz Mundo Braille": "Braille yachaq",
    "Estudiante": "Yachaq",
    "3 EN CURSO": "3 purichkaq",
    "Uso de la Regleta y el Punzón": "Reglata punzunta llamk'achiy",
    "Apasionado por el aprendizaje del Braille y la comunicación inclusiva. Estudiante comprometido con dominar el sistema de lectura y escritura táctil para construir un mundo más accesible.": "Braille yachayta tukuykuq rimanakuytapas munakuq yachaqmi kani.",
    "Preferencias de lectura del usuario": "Ñawinchay akllaykikuna",
    "Tamaño del Texto": "Qillqap hatunnin",
    "Pequeño": "Uchuy",
    "Normal": "Kikin",
    "Grande": "Hatun",
    "Muy grande": "Ancha hatun",
    "Modo Oscuro": "Tuta modo",
    "Reduce la fatiga visual en entornos oscuros.": "Tutapi ñawikunata samachin.",
    "Modo TDAH": "TDAH modo",
    "Interfaz simplificada, sin animaciones y mayor contraste.": "Sasalla chawpi, mana kuyuywan, ancha rikhuriywan.",
    "Cambia toda la aplicación al quechua (runasimi).": "Tukuy aplicacionta runasimiman tikray.",
    "Cerrar sesión": "Sesión wichq'ay",
    // Acceso / Registro
    "Bienvenido de nuevo": "Kutimunki, allinmi",
    "Ingresa para continuar tu aprendizaje": "Yachaynikita qatinkapak yaykuy",
    "Ingresa un correo válido.": "Allin correota yaykuchiy.",
    "Contraseña": "Pakasqa simi",
    "Ingresa tu contraseña.": "Pakasqa simikita yaykuchiy.",
    "¿Olvidaste tu contraseña?": "¿Pakasqa simikita qunqarunki?",
    "Recuérdame": "Yuyariway",
    "Iniciar sesión": "Yaykuy",
    "Inicia sesión": "Yaykuy",
    "¿Aún no tienes cuenta?": "¿Manaraq cuentayki kanchu?",
    "Crea una gratis": "Hukta ruwakuy yanqalla",
    "Crea tu cuenta": "Cuentaykita ruwakuy",
    "Comienza tu viaje con el Braille": "Braillewan puriykita qallariy",
    "Nombre completo": "Hunt'asqa suti",
    "Escribe tu nombre.": "Sutikita qillqay.",
    "La contraseña debe tener al menos 6 caracteres.": "Pakasqa simipi 6 sanampakunamanta aswan kanan.",
    "Confirmar contraseña": "Pakasqa simita takyachiy",
    "Las contraseñas no coinciden.": "Pakasqa simikuna mana kikinchu.",
    "Crear Cuenta": "Cuenta ruwakuy",
    // Ejercicios y práctica
    "Siguiente": "Qatiq",
    "Anterior": "Ñawpaq",
    "Comprobar": "Takyachiy",
    "Reintentar": "Yapamanta",
    "Continuar": "Qatiy",
    "Volver": "Kutiy",
    "Volver a ejercicios": "Ruraykunaman kutiy",
    "Aceptar": "Chaskiy",
    "¡Correcto!": "¡Allinmi!",
    "¡Felicidades!": "¡Kusirikuy!",
    "¡Respuesta correcta!": "¡Allin kutichiy!",
    "Has completado exitosamente todos los ejercicios de esta actividad.": "Tukuy ruraykunata allinta tukurunki.",
    "Escuchar pronunciación": "Rimayta uyarikuy",
    "Escuchar nota": "Takita uyarikuy",
    "Escribe la palabra:": "Simita qillqay:",
    "Escribe aquí...": "Kaypi qillqay...",
    "Letra": "Qillqa",
    "Número": "Yupay",
    "Ejercicio no encontrado.": "Rurayqa mana tarisqachu.",
    "Error al cargar el ejercicio.": "Rurayta churaypi pantay.",
    "Evaluación de Alfabeto": "Achahala takyachiy",
    "Comprobar respuesta": "Kutichiyta takyachiy",
    "La combinación de puntos no es correcta. Inténtalo de nuevo.": "Unchakunap huñusqan mana allinchu. Yapamanta ruray.",
    "Error de configuración del Alfabeto.": "Achahala churaypi pantay.",
    "Punto de la celda Braille": "Cajitillap unchan",
    "Este nivel está bloqueado. Completa el nivel anterior para desbloquearlo.": "Kay pataqa wichq'asqam. Ñawpaq patata tukuy, kicharinaykipaq.",
    "Traduce la siguiente palabra en Braille:": "Braillepi simita tikrachiy:",
    "¿Qué palabra es?": "¿Ima simitaq?",
    "Escribe la palabra en texto convencional.": "Simita qillqay.",
    "Construye la palabra en Braille": "Simita Braillepi ruwakuy",
    "Construye la letra en Braille pulsando los puntos": "Unchakunata ñit'ispa qillqata ruwakuy",
    "Pulsa los puntos para formar cada letra": "Sapa qillqapak unchakunata ñit'iy",
    "Selecciona la celda Braille correcta.": "Allin Braille cajitillata akllay.",
    "Observa las celdas activas (el primer símbolo es el signo de número).": "K'ancharisqa cajitillakunata qhaway.",
    "¿Qué número representan estos puntos Braille?": "¿Ima yupaytan kay Braille unchakuna rikuchin?",
    "Palabras y Frases": "Simikuna",
    "Palabras": "Simikuna",
    // Ejercicios interactivos
    "Reto del dia": "P'unchaw sasachakuy",
    "Desafio de hoy": "Kunan p'unchaw sasachakuy",
    "Identifica el Braille": "Brailleta riqsiy",
    "Observa las cajetillas Braille y escribe la palabra correcta": "Braille cajitillakunata qhaway, allin simita qillqay",
    "Laboratorio Braille": "Braille llamk'ana",
    "Explora y practica el Braille de forma interactiva.": "Brailleta maskhay, ruraykuy.",
    "Aprende y practica las letras en Braille.": "Braillepi qillqakunata yachay, ruraykuy.",
    "Nivel": "Pata",
    "Practica la representación de números en Braille.": "Braillepi yupaykunata ruraykuy.",
    "Pon en práctica el Braille formando palabras.": "Simikunata ruwaspa Brailleta ruraykuy.",
    "Mi progreso": "Ñuqap wiñayniy",
    "Puntos totales": "Tukuy puntokuna",
    "Racha": "Kuti kuti",
    "Lecciones": "Yachaykuna",
    "Puntos": "Puntokuna",
    "Insignias": "Suñaykuna",
    "0 obtenidas": "0 chaskisqakuna",
    "Progreso por Cajetilla": "Cajitillakunapi wiñay",
    "¡EXCELENTE!": "¡ALLINMI!",
    "¡Has formado correctamente la palabra!": "¡Simita allinta ruwarunki!",
    "🎉 ¡Completaste los 3 retos de hoy!": "🎉 ¡Kimsa p'unchaw sasachakuykunata tukurunki!",
    "Vuelve mañana para nuevos retos.": "Paqarinta kutimuy, musuq sasachakuykunapaq.",
    "⏰ ¡Tiempo agotado! Reto no completado.": "⏰ ¡Pacha tukurun! Sasachakuyqa mana tukusqachu.",
    "❌ Inténtalo nuevamente.": "❌ Yapamanta ruray.",
    // Reproductor
    "Completado": "Tukusqa",
    "Progreso guardado": "Wiñay waqaychasqa",
    "Continuar viendo": "Qhawayta qatiy",
    "Ver de nuevo": "Musuqmanta qhaway",
    "Curso:": "Yachay:",
    "Lecciones Relacionadas": "Tinkisqa yachaykuna",
    // Modelo de ejercicio
    "Ejercicios Interactivos": "Ruraykuna",
    "Practica y domina el sistema Braille con estas actividades.": "Kay ruranakunawan Brailleta yachay.",
    "Categorías de Ejercicio": "Ruray layakuna",
    "Aprende las letras del alfabeto Braille con lecciones y ejercicios interactivos.": "Achahala qillqakunata yachaykunawan ruraykunawan yachay.",
    "6 Actividades": "6 ruranakuna",
    "Domina los números en Braille mediante lecciones y práctica guiada.": "Yupaykunata yachaykunawan ruraykuy.",
    "4 Actividades": "4 ruranakuna",
    "Traduce palabras escritas en Braille a texto convencional.": "Braillepi qillqasqa simikunata tikrachiy.",
    // Títulos de pestaña (segmentos antes de " - ")
    "Iniciar Sesión": "Yaykuy",
    "Educación Inclusiva": "Tukuykuq yachay",
    "Video Player": "Video qhaway",
    "Práctica": "Ruray",
    // Generales
    "Guardar": "Waqaychay",
    "Error": "Pantay"
  };

  var quechua = false;
  var titleEs = null;

  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }

  function t(es) {
    var k = norm(es);
    return DICT.hasOwnProperty(k) ? DICT[k] : es;
  }

  function isQuechua() { return quechua; }

  function acceptNode(node) {
    var p = node.parentElement;
    if (!p) return NodeFilter.FILTER_REJECT;
    var tag = p.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
    if (p.classList && p.classList.contains("material-symbols-outlined")) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }

  function translateTextNode(node) {
    if (node.__qu) return;
    var orig = node.nodeValue;
    if (!orig || !norm(orig)) return;
    var key = norm(orig);
    if (DICT.hasOwnProperty(key)) {
      node.__es = orig;
      node.nodeValue = DICT[key];
      node.__qu = true;
    }
  }

  function restoreTextNode(node) {
    if (node.__qu) {
      node.nodeValue = node.__es;
      node.__qu = false;
    }
  }

  var ATTRS = ["placeholder", "aria-label", "title"];

  function translateAttrs(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var attr = ATTRS[i];
      var v = el.getAttribute(attr);
      if (!v) continue;
      var key = norm(v);
      if (DICT.hasOwnProperty(key)) {
        var flag = "__es_" + attr;
        if (!el[flag]) el[flag] = v;
        if (el.getAttribute(attr) !== DICT[key]) el.setAttribute(attr, DICT[key]);
        el.__quAttr = true;
      }
    }
  }

  function restoreAttrs(el) {
    if (!el.__quAttr || !el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var attr = ATTRS[i];
      var flag = "__es_" + attr;
      if (el[flag]) el.setAttribute(attr, el[flag]);
    }
    el.__quAttr = false;
  }

  function walk(root, textFn, elFn) {
    if (!root) return;
    if (root.nodeType === 3) { textFn(root); return; }
    if (!root.nodeType || root.nodeType !== 1) return;
    if (root.tagName === "SCRIPT" || root.tagName === "STYLE" || root.tagName === "NOSCRIPT") return;
    if (root.classList && root.classList.contains("material-symbols-outlined")) return;
    elFn(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: acceptNode });
    var n;
    var batch = [];
    while ((n = walker.nextNode())) batch.push(n);
    for (var i = 0; i < batch.length; i++) textFn(batch[i]);
    var els = root.querySelectorAll ? root.querySelectorAll("[placeholder],[aria-label],[title]") : [];
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      if (el.classList && el.classList.contains("material-symbols-outlined")) continue;
      elFn(el);
    }
  }

  function applyTitle() {
    if (titleEs === null) titleEs = document.title;
    var parts = titleEs.split(" - ");
    document.title = parts.map(function(p) { return t(p); }).join(" - ");
  }

  function restoreTitle() {
    if (titleEs !== null) document.title = titleEs;
  }

  function apply() {
    walk(document.body, translateTextNode, translateAttrs);
    applyTitle();
  }

  function restore() {
    walk(document.body, restoreTextNode, restoreAttrs);
    restoreTitle();
  }

  function set(on) {
    quechua = !!on;
    try { document.documentElement.setAttribute("lang", quechua ? "qu" : "es"); } catch (e) {}
    if (quechua) apply(); else restore();
  }

  // Traduce el contenido que se agregue después (tarjetas, ejercicios, toasts)
  if (typeof MutationObserver !== "undefined") {
    var obs = new MutationObserver(function(muts) {
      if (!quechua) return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        for (var j = 0; j < m.addedNodes.length; j++) {
          var nd = m.addedNodes[j];
          if (nd.nodeType === 3) translateTextNode(nd);
          else if (nd.nodeType === 1) walk(nd, translateTextNode, translateAttrs);
        }
      }
    });
    if (document.body) obs.observe(document.body, { childList: true, subtree: true });
    else document.addEventListener("DOMContentLoaded", function() {
      obs.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Aplica la preferencia guardada en cada pantalla al cargar
  try {
    var prefs = JSON.parse(localStorage.getItem("bl_visualPrefs"));
    if (prefs && prefs.quechua === true) set(true);
  } catch (e) {}

  return { t: t, isQuechua: isQuechua, set: set, apply: apply, restore: restore };
})();
