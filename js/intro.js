// ==========================================
// FASES INICIALES: GLITCH, TIKTOK, REFLEXIÓN
// ==========================================

// --- FASE 1: GLITCH INICIAL (AJUSTABLE Y SUTIL) ---

// ⚡ AJUSTA ESTOS VALORES PARA CONTROLAR EL GLITCH:
const tiempoEntreFallas = 300;  // MILISEGUNDOS: Cada cuánto intenta fallar (ej: 300 es rápido, 1500 es lento)
const duracionFalla = 150;       // MILISEGUNDOS: Cuánto dura la letra rota antes de arreglarse (ej: 50 es un parpadeo, 500 es notable)
const probabilidadLetra = 0.8;  // DECIMAL (0 a 1): Qué tan probable es que la letra cambie por un símbolo (ej: 0.8 es alta)

let initialGlitch = setInterval(() => {
    const targets = document.querySelectorAll('.glitch-target');
    if (targets.length === 0) return;

    // Solo un elemento falla a la vez para mantenerlo sutil
    const target = targets[Math.floor(Math.random() * targets.length)];
    const original = target.innerText;
    
    // Convertimos el texto en un array de palabras
    const words = original.split(" ");
    
    // Elegimos UNA sola palabra al azar para molestar
    const idx = Math.floor(Math.random() * words.length);
    
    // Solo modificamos esa palabra específica
    words[idx] = `<span style="color:#888;">${words[idx].replace(/./g, c => 
        // Si no es un espacio en blanco y el azar lo decide, cambiamos la letra
        (Math.random() < probabilidadLetra && c.trim() !== "") 
        ? symbols[Math.floor(Math.random() * symbols.length)] 
        : c
    )}</span>`;
    
    // Unimos y mostramos
    target.innerHTML = words.join(" ");
    
    // Restauramos el texto original súper rápido
    setTimeout(() => target.innerText = original, duracionFalla);

}, tiempoEntreFallas);

// --- LÓGICA DEL BOTÓN DE REINICIO ---
const resetBtn = document.getElementById('reset-progress-btn');

if (resetBtn) {
    // Solo lo hacemos visible si el usuario ya completó el desafío final
    if (sectionFourCompleted) {
        resetBtn.style.display = 'block';
    }

    resetBtn.addEventListener('click', () => {
        // Borramos la memoria permanente del navegador
        localStorage.removeItem('scrollProgress');
        
        // Efecto visual de desvanecimiento
        document.getElementById('home-screen').style.opacity = '0';
        
        // Recargamos la página desde cero a los 500ms
        setTimeout(() => {
            window.location.reload();
        }, 500);
    });
}


// --- FASE 2: EVENTO BOTÓN INICIO ---
const startBtn = document.getElementById('startBtn');
if (startBtn) {
    // 1. Cambiar el texto del botón según el progreso guardado
    if (sectionFourCompleted) {
        startBtn.innerText = "Ir al sitio web";
    } else if (sectionOneCompleted || sectionTwoCompleted || sectionThreeCompleted) {
        startBtn.innerText = "Ir a las tareas";
    }

    startBtn.addEventListener('click', function() {
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic && !bgMusic.muted) {
            bgMusic.play().catch(e => console.log(e));
        }

        // CASO A: Ya terminó todo el proyecto
        if (sectionFourCompleted) {
            // Reemplaza esto con tu URL real
            window.location.href = "https://www.google.com"; 
            return;
        }

        // CASO B: Tiene progreso a medias (Salta el glitch y va al menú)
        if (sectionOneCompleted || sectionTwoCompleted || sectionThreeCompleted) {
            clearInterval(initialGlitch);
            document.getElementById('home-screen').style.display = 'none';
            const menuScreen = document.getElementById('menu-screen');
            if (menuScreen) {
                menuScreen.style.display = 'flex';
                menuScreen.style.opacity = '1';
            }
            document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.add('cascade-in'));
            
            const scoreUI = document.getElementById('score-value');
            if(scoreUI) scoreUI.innerText = playerScore;
            return;
        }

        // CASO C: Usuario nuevo (Comportamiento normal)
        clearInterval(initialGlitch);
        document.getElementById('home-screen').classList.add('fade-out');
        
        setTimeout(() => {
            document.getElementById('home-screen').style.display = 'none';
            const overlay = document.getElementById('transition-overlay');
            if(overlay) overlay.style.display = 'flex';
            const circle = document.querySelector('.expanding-circle');
            if(circle) circle.classList.add('animate-circle');
        }, tiempos.screenFadeOut);

        setTimeout(() => {
            const ftc = document.getElementById('final-text-container');
            if(ftc) ftc.style.opacity = "1";
            runIntenseGlitch();
        }, tiempos.glitchAggressiveStart);
    });
}

// --- FASE 3: GLITCH AGRESIVO ---
function runIntenseGlitch() {
    const q = document.getElementById('question-text');
    if (!q) return;
    const original = q.innerText;
    let restoreTimeout = null;
    
    const interval = setInterval(() => {
        q.innerText = original.split('').map(c => 
            Math.random() < 0.7 ? aggressiveSymbols[Math.floor(Math.random() * aggressiveSymbols.length)] : c
        ).join('');
        
        if (Math.random() < 0.2) q.style.color = "#ff4444";
        else q.style.color = "#e0e0e0";

        restoreTimeout = setTimeout(() => q.innerText = original, 70);
    }, 150);

    setTimeout(() => {
        clearInterval(interval);
        clearTimeout(restoreTimeout);
        document.getElementById('transition-overlay').style.display = 'none';
        requestAnimationFrame(() => requestAnimationFrame(() => runScrollPhase()));
    }, tiempos.glitchAggressiveDuration);
}

// --- FASE 4: SCROLL TIKTOK ---
function runScrollPhase() {
    const screen = document.getElementById('scroll-screen');
    const container = document.getElementById('scroll-container');
    const progressFill = document.getElementById('progress-fill');

    if(!screen || !container) return;

    container.innerHTML = '';
    screen.style.display = 'flex';
    screen.style.opacity = '1';

    const track = document.createElement('div');
    track.id = 'slide-track';
    track.style.cssText = `display: flex; flex-direction: column; width: 100%; will-change: transform;`;
    container.appendChild(track);

    identities.forEach(text => {
        const slide = document.createElement('div');
        slide.className = 'scroll-item';
        slide.style.cssText = `height: 100vh; min-height: 100vh; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; padding: 40px; text-align: center;`;
        slide.textContent = '';
        track.appendChild(slide);
    });

    let current = 0;
    const slides = track.querySelectorAll('.scroll-item');

    function animateProgress(duration) {
        if (!progressFill) return;
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.transition = `width ${duration}ms linear`;
            progressFill.style.width = '100%';
        }, 50);
    }

    function showCurrent() {
        if (current >= identities.length) {
            screen.style.transition = 'opacity 0.6s ease';
            screen.style.opacity = '0';
            setTimeout(() => {
                screen.style.display = 'none';
                runFinalReflection();
            }, tiempos.scrollFadeOutEnd);
            return;
        }

        const slide = slides[current];
        animateProgress(tiempos.scrollProgressDuration); 

        typeEffect(identities[current], slide, () => {
            setTimeout(() => {
                current++;
                if (current < identities.length) {
                    track.style.transform = `translateY(-${current * 100}vh)`;
                    setTimeout(showCurrent, tiempos.scrollPauseAfterMove);
                } else {
                    setTimeout(() => {
                        screen.style.transition = 'opacity 0.6s ease';
                        screen.style.opacity = '0';
                        setTimeout(() => {
                            screen.style.display = 'none';
                            runFinalReflection();
                        }, tiempos.scrollFadeOutEnd);
                    }, tiempos.scrollPauseBeforeReflection);
                }
            }, tiempos.scrollReadingTime);
        });
    }

    setTimeout(showCurrent, 150);
}

// --- FASE 5: REFLEXIÓN INICIAL ---
// --- FASE 5: REFLEXIÓN INICIAL (BOTÓN CORREGIDO) ---
function runFinalReflection() {
    const screen = document.getElementById('reflection-screen');
    const out = document.getElementById('reflection-output');
    const readyBtn = document.getElementById('readyBtn');
    
    if(!screen || !out) return;
    
    screen.style.display = 'flex';
    out.innerHTML = "";
    
    // Aseguramos que el botón esté oculto e intocable al inicio
    if (readyBtn) {
        readyBtn.style.opacity = '0';
        readyBtn.style.pointerEvents = 'none';
        readyBtn.style.transition = 'opacity 0.8s ease';
    }
    
    const msg = "Hoy, estamos consumidos por el contenido rápido.\n\nY ellos lo saben, y así lo quieren.";
    let i = 0;
    
    function type() {
        if (i < msg.length) {
            out.innerHTML += msg.charAt(i);
            i++;
            // Usamos la velocidad normal que unificamos antes
            let speed = tiempos.reflectionSpeedNormal;
            if (msg.charAt(i-1) === ".") speed = tiempos.reflectionSpeedPunto;
            else if (msg.charAt(i-1) === ",") speed = tiempos.reflectionSpeedComa;
            
            setTimeout(type, speed);
        } else {
            // El texto ha terminado. Esperamos 1.5 segundos (pausa dramática)
            setTimeout(() => {
                if(readyBtn) {
                    // Revelamos el botón
                    readyBtn.style.opacity = '1';
                    readyBtn.style.pointerEvents = 'auto'; // Lo hacemos clickeable de nuevo
                }
            }, 1500);
        }
    }
    
    type();
}

// --- LÓGICA DE ICONOS SOCIALES (TIKTOK) ---
const heartBtn = document.querySelector('.heart-btn');
if (heartBtn) {
    heartBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        this.classList.toggle('liked'); // Antes decía 'active', por eso no funcionaba
    });
}

// ==========================================
// LÓGICA DE AUDIO GLOBAL
// ==========================================

const bgMusic = document.getElementById('bg-music');
const audioToggleBtn = document.getElementById('audio-toggle-btn');

if (bgMusic && audioToggleBtn) {
    const soundOnIcon = audioToggleBtn.querySelector('.sound-on-icon');
    const soundOffIcon = audioToggleBtn.querySelector('.sound-off-icon');

    // Volumen tenue por defecto (20%)
    bgMusic.volume = 0.2; 

    // Enganchamos el Play al botón de inicio para sortear el bloqueo de los navegadores
    const startBtnEl = document.getElementById('startBtn');
    if (startBtnEl) {
        startBtnEl.addEventListener('click', () => {
            // Intentar reproducir solo si no está muteado intencionalmente
            if (!bgMusic.muted) {
                bgMusic.play().catch(e => console.log("Autoplay bloqueado por el navegador:", e));
            }
        });
    }

    // Botón para silenciar / activar manualmente
    audioToggleBtn.addEventListener('click', () => {
        if (bgMusic.muted) {
            // Activar sonido
            bgMusic.muted = false;
            bgMusic.play().catch(e => console.log(e));
            soundOnIcon.style.display = 'block';
            soundOffIcon.style.display = 'none';
            audioToggleBtn.classList.remove('muted');
        } else {
            // Silenciar
            bgMusic.muted = true;
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
            audioToggleBtn.classList.add('muted');
        }
    });
}