// ============================================================
// Mundo Braille - Retroalimentación inmediata al equivocarse
// ------------------------------------------------------------
// Módulo 100% aislado. Se suma sobre los ejercicios de
// ejercicio_practica.html y NO altera la navegación, el progreso
// ni el resto de la aplicación. Solo reacciona en el instante
// en que el usuario comete un error, e indica EL MOTIVO.
// Se puede desactivar en cualquier momento con:
//   window.IMMEDIATE_FEEDBACK = false;
// ============================================================
(function () {
  "use strict";

  var STORAGE_KEY = "mf_feedback_inmediato";

  function isEnabled() {
    try {
      var v = sessionStorage.getItem(STORAGE_KEY);
      if (v === "off") return false;
    } catch (e) {}
    return window.IMMEDIATE_FEEDBACK !== false;
  }

  function setEnabled(on) {
    try { sessionStorage.setItem(STORAGE_KEY, on ? "on" : "off"); } catch (e) {}
    window.IMMEDIATE_FEEDBACK = on;
    syncToggle();
  }

  // --------- Utilidades de estilo (inyectadas, sin tocar CSS global) ---------
  function injectStyleOnce(id, css) {
    if (document.getElementById(id)) return;
    var s = document.createElement("style");
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  }

  injectStyleOnce("mf-feedback-styles", [
    ".braille-dot-cell.dot-error{background:#ef4444!important;box-shadow:0 2px 6px rgba(239,68,68,.55)!important;}",
    "@keyframes mf-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}",
    ".mf-shake{animation:mf-shake .4s ease;}"
  ].join("\n"));

  // --------- Toast de aviso reutilizable (fijo, fuera del flujo) ---------
  var toast = null;
  function showToast(text, type) {
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "mf-feedback-toast";
      toast.setAttribute("role", "alert");
      toast.style.cssText =
        "position:fixed;left:50%;bottom:96px;transform:translateX(-50%) translateY(8px);" +
        "z-index:60;max-width:90%;padding:10px 18px;border-radius:14px;" +
        "font:700 14px/1.3 'Atkinson Hyperlegible Next',system-ui,sans-serif;" +
        "box-shadow:0 8px 24px rgba(0,0,0,.18);opacity:0;pointer-events:none;" +
        "transition:opacity .2s ease, transform .2s ease;text-align:center;";
      document.body.appendChild(toast);
    }
    var bg = type === "ok" ? "#16a34a" : type === "info" ? "#006b6b" : "#ef4444";
    toast.style.background = bg;
    toast.style.color = "#fff";
    toast.textContent = text;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(8px)";
    }, 2200);
  }

  function getEx() { return window.__ejercicioActual || null; }

  // --------- Helpers de explicación ----------
  function joinPuntos(arr) {
    return arr.length > 1 ? arr.join(", ") : arr.join(", ");
  }

  // Explica por qué la selección de puntos es incorrecta
  function describeDotError(userDots, correctDots) {
    var extras = [], missing = [];
    for (var i = 0; i < 6; i++) {
      if (userDots[i] && !correctDots[i]) extras.push(i + 1);
      if (!userDots[i] && correctDots[i]) missing.push(i + 1);
    }
    var parts = [];
    if (extras.length) {
      parts.push((extras.length > 1 ? "Los puntos " : "El punto ") + joinPuntos(extras) +
        (extras.length > 1 ? " están activados de más" : " está activado de más"));
    }
    if (missing.length) {
      parts.push("Falta activar el " + (missing.length > 1 ? "puntos " : "punto ") + joinPuntos(missing));
    }
    return parts.join(". ");
  }

  // Devuelve las celdas (array de arrays de 6) de una opción de quiz
  function optionCells(opt) {
    if (opt.cells) return opt.cells;
    if (opt.dots) return [opt.dots];
    return [[0,0,0,0,0,0]];
  }

  // Explica la diferencia entre la opción elegida y la correcta
  function describeOptionDiff(sel, corr) {
    var sc = optionCells(sel), cc = optionCells(corr);
    var diffs = [];
    var n = Math.max(sc.length, cc.length);
    for (var c = 0; c < n && diffs.length < 2; c++) {
      var sCell = sc[c] || [0,0,0,0,0,0];
      var cCell = cc[c] || [0,0,0,0,0,0];
      for (var i = 0; i < 6; i++) {
        if (sCell[i] !== cCell[i]) {
          diffs.push("en la celda " + (c + 1) + " el punto " + (i + 1) +
            " debería estar " + (cCell[i] ? "activado" : "apagado"));
          if (diffs.length >= 2) break;
        }
      }
    }
    var msg = diffs.join("; ");
    if (diffs.length > 2) msg += "…";
    return msg;
  }

  // Explica por qué la palabra escrita no es correcta
  function describeWordError(val, ans) {
    var di = 0;
    while (di < val.length && di < ans.length && val[di] === ans[di]) di++;
    if (di >= ans.length) {
      return "La palabra correcta es '" + ans + "', más corta de lo que escribiste.";
    }
    return "En la posición " + (di + 1) + " debería ir '" + ans[di].toUpperCase() +
      "', no '" + val[di].toUpperCase() + "'.";
  }

  // --------- 1) Celdas Braille interactivas (letras/números y evaluación) ---------
  function attachDotFeedback() {
    var wrap = document.getElementById("interactive-dots") || document.getElementById("eval-dots");
    if (!wrap) return;
    var ex = getEx();
    if (!ex || !ex.dots) return;

    function validate() {
      if (!isEnabled()) return;
      var correct = ex.dots;
      var anyWrong = false;
      var userDots = [];
      wrap.querySelectorAll(".braille-dot-cell").forEach(function (dot) {
        var idx = parseInt(dot.getAttribute("data-idx"), 10);
        var active = dot.classList.contains("active");
        userDots[idx] = active ? 1 : 0;
        if (active && !correct[idx]) {
          dot.classList.add("dot-error");
          anyWrong = true;
        } else {
          dot.classList.remove("dot-error");
        }
      });
      if (anyWrong) {
        var tipo = ex.category === "numeros" ? "el número " : "la letra ";
        showToast("✗ Esa selección no forma " + tipo + ex.character + ". " + describeDotError(userDots, correct), "error");
      }
    }

    // setTimeout 0 para ejecutar DESPUÉS del toggle del script original
    wrap.addEventListener("click", function () { setTimeout(validate, 0); });
  }

  // --------- 2) Quiz de opciones múltiples ---------
  function attachQuizFeedback() {
    var grid = document.getElementById("options-grid");
    if (!grid) return;
    var ex = getEx();
    if (!ex || typeof ex.correctIndex === "undefined") return;

    grid.addEventListener("click", function (e) {
      if (!isEnabled()) return;
      var card = e.target.closest(".option-card");
      if (!card || card.classList.contains("wrong")) return;
      var idx = parseInt(card.getAttribute("data-index"), 10);
      if (idx === ex.correctIndex) return; // acierto: no revelar, dejar flujo original

      // Error inmediato: marcar, sacudir y forzar a elegir otra opción
      card.classList.add("wrong", "mf-shake");
      var razon = describeOptionDiff(ex.options[idx], ex.options[ex.correctIndex]);
      showToast("✗ Esa opción no es correcta. " + (razon ? razon + "." : ""), "error");
      setTimeout(function () {
        card.classList.remove("wrong", "mf-shake", "selected");
        var btn = document.getElementById("check-button");
        if (btn) {
          btn.classList.add("bg-surface-container-highest", "text-on-surface-variant");
          btn.classList.remove("bg-primary", "text-on-primary", "shadow-lg");
          btn.disabled = true;
        }
      }, 800);
    });
  }

  // --------- 3) Traducción (escritura de palabras) ---------
  function attachTraduccionFeedback() {
    var input = document.getElementById("traduccion-input");
    if (!input) return;
    var ex = getEx();
    if (!ex || !ex.answer) return;
    var warned = false;

    input.addEventListener("input", function () {
      if (!isEnabled()) return;
      var val = input.value.trim().toLowerCase();
      if (!val) {
        warned = false;
        input.classList.remove("border-red-500", "bg-red-50");
        return;
      }
      var ans = String(ex.answer).toLowerCase();
      // Error inmediato: lo escrito ya no puede ser el inicio de la respuesta
      if (ans.indexOf(val) !== 0) {
        if (!warned) {
          input.classList.add("border-red-500", "bg-red-50");
          showToast("✗ No es correcto. " + describeWordError(val, ans), "error");
          warned = true;
          setTimeout(function () {
            input.classList.remove("border-red-500", "bg-red-50");
            warned = false;
          }, 1200);
        }
      } else {
        warned = false;
        input.classList.remove("border-red-500", "bg-red-50");
      }
    });
  }

  // --------- Toggle flotante (solo en página de ejercicios) ---------
  var toggleBtn = null;
  function buildToggle() {
    if (document.getElementById("mf-feedback-toggle")) return;
    toggleBtn = document.createElement("button");
    toggleBtn.id = "mf-feedback-toggle";
    toggleBtn.type = "button";
    toggleBtn.style.cssText =
      "position:fixed;right:14px;bottom:78px;z-index:60;display:flex;align-items:center;gap:6px;" +
      "padding:8px 12px;border-radius:9999px;font:700 12px/1 'Atkinson Hyperlegible Next',system-ui,sans-serif;" +
      "box-shadow:0 6px 18px rgba(0,0,0,.18);cursor:pointer;border:0;transition:transform .15s ease;";
    toggleBtn.addEventListener("click", function () {
      setEnabled(!isEnabled());
    });
    document.body.appendChild(toggleBtn);
    syncToggle();
  }

  function syncToggle() {
    if (!toggleBtn) return;
    var on = isEnabled();
    toggleBtn.style.background = on ? "#006b6b" : "#9ca3af";
    toggleBtn.style.color = "#fff";
    toggleBtn.innerHTML = (on ? "⚡ Retroalimentación: ON" : "⚡ Retroalimentación: OFF");
  }

  // --------- Inicialización (aislada a esta página) ---------
  function init() {
    if (!document.getElementById("main-content")) return; // solo ejercicio_practica.html
    attachDotFeedback();
    attachQuizFeedback();
    attachTraduccionFeedback();
    buildToggle();
    syncToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expone API mínima por si se quiere controlar desde fuera
  window.ImmediateFeedback = {
    enable: function () { setEnabled(true); },
    disable: function () { setEnabled(false); },
    isEnabled: isEnabled
  };
})();
