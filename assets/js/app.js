// ============================================
// Mundo Braille - Shared Application Module
// ============================================

// --- Navigation Active Tab ---
(function initNavigation() {
  const pageMap = {
    "index.html": "home",
    "ejercicios_interactivos.html": "explore",
    "reproductor_leccion.html": "videos",
    "ejercicio_practica.html": "explore",
    "perfil_usuario.html": "profile"
  };

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const activeTab = pageMap[currentPage] || "home";

  var activeClasses = ["bg-secondary-container", "dark:bg-secondary", "text-on-secondary-container", "dark:text-on-secondary", "rounded-full", "px-5", "py-1", "translate-y-[-2px]"];
  var inactiveClasses = ["text-on-surface-variant", "dark:text-on-tertiary-container", "p-2", "hover:bg-surface-container-highest", "dark:hover:bg-on-tertiary-fixed-variant"];

  document.querySelectorAll("nav a").forEach(function(link) {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    link.classList.remove.apply(link.classList, activeClasses);
    link.classList.add.apply(link.classList, inactiveClasses);
    var icon = link.querySelector(".material-symbols-outlined");
    if (icon) icon.removeAttribute("style");

    const linkPage = href.split("/").pop();
    const tab = pageMap[linkPage];
    if (tab === activeTab) {
      link.classList.add.apply(link.classList, activeClasses);
      link.classList.remove.apply(link.classList, inactiveClasses);
      if (icon) icon.setAttribute("style", "font-variation-settings: 'FILL' 1;");
    }
  });
})();

// --- Font Scale Override Styles (injected after Tailwind for proper cascade) ---
(function injectFontScaleStyles() {
  if (document.getElementById("font-scale-overrides")) return;
  var style = document.createElement("style");
  style.id = "font-scale-overrides";
  style.textContent = [
    ".text-body-lg { font-size: calc(18px * var(--font-scale, 1)); }",
    ".text-label-sm { font-size: calc(14px * var(--font-scale, 1)); }",
    ".text-title-md { font-size: calc(20px * var(--font-scale, 1)); }",
    ".text-body-md { font-size: calc(16px * var(--font-scale, 1)); }",
    ".text-headline-lg { font-size: calc(32px * var(--font-scale, 1)); }",
    ".text-headline-lg-mobile { font-size: calc(28px * var(--font-scale, 1)); }",
    ".text-display-lg { font-size: calc(40px * var(--font-scale, 1)); }",
    ".text-title-sm { font-size: calc(14px * var(--font-scale, 1)); }"
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

// --- ADHD Mode Focus Tracking ---
(function initADHDTracking() {
  var highlightTimers = [];

  function isADHD() {
    return document.body.classList.contains('adhd-mode');
  }

  function ensurePosition(el) {
    if (!el || el === document.body || el === document.documentElement) return;
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
  }

  function clearHighlights(delay) {
    if (delay) {
      var t = setTimeout(function() {
        document.querySelectorAll('.adhd-highlight').forEach(function(el) {
          el.classList.remove('adhd-highlight');
          if (el.style.position === 'relative' && !el.hasAttribute('data-adhd-pos')) {
            el.style.position = '';
          }
        });
      }, delay);
      highlightTimers.push(t);
      return;
    }
    document.querySelectorAll('.adhd-highlight').forEach(function(el) {
      el.classList.remove('adhd-highlight');
      if (el.style.position === 'relative' && !el.hasAttribute('data-adhd-pos')) {
        el.style.position = '';
      }
    });
  }

  function findInteractive(el) {
    while (el && el !== document.body) {
      var tag = el.tagName.toLowerCase();
      if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea' ||
          el.hasAttribute('onclick') || el.getAttribute('role') === 'button' ||
          el.hasAttribute('tabindex') || el.classList.contains('tactile-card') ||
          el.classList.contains('option-card') || el.classList.contains('cursor-pointer')) {
        return el;
      }
      if (el.hasAttribute('data-category') || el.classList.contains('group')) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function highlightFocused(el) {
    if (!isADHD()) return;
    highlightTimers.forEach(clearTimeout);
    highlightTimers = [];
    clearHighlights();

    if (!el) return;
    var target = findInteractive(el) || el;
    if (target === document.body || target === document.documentElement) return;

    ensurePosition(target);
    target.classList.add('adhd-highlight');

    // Also highlight parent container for spatial context
    var parent = target.parentElement;
    while (parent && parent !== document.body) {
      if (parent.classList.contains('tactile-card') || parent.classList.contains('option-card') ||
          parent.tagName === 'SECTION' || parent.tagName === 'ARTICLE' || parent.tagName === 'LI' ||
          parent.tagName === 'NAV') {
        ensurePosition(parent);
        parent.classList.add('adhd-highlight');
        break;
      }
      parent = parent.parentElement;
    }
  }

  document.addEventListener('touchstart', function(e) {
    highlightFocused(e.target);
  }, { passive: true });

  document.addEventListener('focusin', function(e) {
    highlightFocused(e.target);
  });

  document.addEventListener('mousedown', function(e) {
    highlightFocused(e.target);
  });

  document.addEventListener('touchend', function() {
    clearHighlights(300);
  });

  document.addEventListener('focusout', function() {
    clearHighlights(200);
  });

  document.addEventListener('mouseup', function() {
    clearHighlights(200);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
      setTimeout(function() {
        var focused = document.activeElement;
        if (focused && focused !== document.body && isADHD()) {
          highlightFocused(focused);
        }
      }, 50);
    }
  });
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
    try { document.cookie = "bl_user=" + encodeURIComponent(JSON.stringify(user)) + "; path=/"; } catch (e2) {}
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
  getProgress: function() { return this.get("progress") || { streak: 0, lessons: {} }; },
  setProgress: function(progress) { this.set("progress", progress); },
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
    progressTotal: 4,
    character: "1",
    dots: [1,0,0,0,0,0],
    interactive: true,
    description: 'Forma el número <b>1</b> activando el punto <b>1</b> del cajetín Braille (mismo patrón que la letra A).',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'El <b>1</b> es el primer punto, en la esquina superior izquierda.',
    next: "identificar-numero-1"
  },

  "identificar-numero-1": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 2,
    progressTotal: 4,
    question: "¿Qué número representa este patrón?",
    hint: "Observa los puntos activos en la celda Braille.",
    options: [
      { dots: [1,0,0,0,0,0], label: "1" },
      { dots: [1,0,1,0,0,0], label: "2" },
      { dots: [1,1,0,0,0,0], label: "3" },
      { dots: [0,1,1,0,0,0], label: "0" }
    ],
    correctIndex: 0,
    successMessage: "¡Correcto! El patrón del número 1 es igual al de la letra A.",
    next: "leccion-numero-2"
  },

  "leccion-numero-2": {
    mode: "lesson",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 3,
    progressTotal: 4,
    character: "2",
    dots: [1,0,1,0,0,0],
    interactive: true,
    description: 'Forma el número <b>2</b> activando los puntos <b>1 y 2</b> del cajetín Braille.',
    audioLabel: "Escuchar pronunciación",
    mnemonic: 'El <b>2</b> tiene dos puntos activos: el 1 y el 2.',
    next: "identificar-numero-2"
  },

  "identificar-numero-2": {
    mode: "quiz",
    category: "numeros",
    label: "Números en Braille",
    progressCurrent: 4,
    progressTotal: 4,
    question: "Identifica el número representado por los puntos activos 1 y 2",
    hint: "¿Qué número tiene el mismo patrón que la letra B?",
    options: [
      { dots: [1,0,0,0,0,0], label: "1" },
      { dots: [0,1,1,1,0,0], label: "0" },
      { dots: [1,0,1,0,0,0], label: "2" },
      { dots: [1,1,0,0,0,0], label: "3" }
    ],
    correctIndex: 2,
    successMessage: "¡Muy bien! El número 2 comparte su patrón con la letra B.",
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
      [1,0,1,1,0,0],
      [1,0,0,1,1,0],
      [1,0,1,0,1,0],
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
      [1,1,0,0,1,0],
      [1,0,0,0,0,0],
      [1,1,0,0,1,0],
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
      [0,1,1,0,1,0],
      [1,0,0,1,1,0],
      [1,0,1,0,1,0]
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
      [1,0,1,0,0,0],
      [1,0,0,1,0,0],
      [1,1,0,1,0,0],
      [1,0,0,0,0,0]
    ],
    successMessage: "¡Perfecto! Has completado todos los ejercicios de palabras.",
    next: null
  }
};

// --- Alfabeto Braille (A-Z) tabla compartida ---
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
  { letter: "Z", dots: [1,0,1,0,1,1] }
];

// --- Course Router (centralized navigation) ---
window.CourseRouter = {
  categories: {
    "alfabeto":  { page: "ejercicio_practica.html", course: "braille-basico", lesson: "alphabet-eval" },
    "numeros":   { page: "ejercicio_practica.html", course: "numeros",        lesson: "leccion-numero-1" },
    "palabras":  { page: "ejercicio_practica.html", course: "palabras",       lesson: "traducir-hola" },
    "lectura":   { page: "ejercicio_practica.html", course: "braille-basico", lesson: "leccion-letra-b" },
    "escritura": { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-a" }
  },

  nextSteps: {
    "leccion-letra-b":      { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-a" },
    "identificar-letra-a":  { page: "ejercicio_practica.html", course: "braille-basico", lesson: "leccion-letra-c" },
    "leccion-letra-c":      { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-b" },
    "identificar-letra-b":  { page: "ejercicio_practica.html", course: "braille-basico", lesson: "leccion-letra-d" },
    "leccion-letra-d":      { page: "ejercicio_practica.html", course: "braille-basico", lesson: "identificar-letra-c" },
    "identificar-letra-c":  null,
    "leccion-numero-1":     { page: "ejercicio_practica.html", course: "numeros",        lesson: "identificar-numero-1" },
    "identificar-numero-1": { page: "ejercicio_practica.html", course: "numeros",        lesson: "leccion-numero-2" },
    "leccion-numero-2":     { page: "ejercicio_practica.html", course: "numeros",        lesson: "identificar-numero-2" },
    "identificar-numero-2": null,
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
