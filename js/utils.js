// ==========================================
// FUNCIONES DE UTILIDAD GENERAL
// ==========================================

/**
 * Función genérica de máquina de escribir sin glitch
 * @param {string} text - El texto a escribir
 * @param {HTMLElement} el - El contenedor HTML
 * @param {Function} cb - Función que se ejecuta al terminar (Callback)
 */
function typeEffect(text, el, cb) {
    let i = 0;
    el.textContent = "";
    const interval = setInterval(() => {
        if (i < text.length) {
            el.textContent += text[i];
            i++;
        } else {
            clearInterval(interval);
            if (cb) cb();
        }
    }, tiempos.typewriterSpeed);
}