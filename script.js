const symbols = "χψωαβγδεζηθικλμν0189$#";
const aggressiveSymbols = "█▓▒░><?/[]{}-=+*^!";

const identities = [
    "Hoy podrías ser médico.",
    "Quizás un ingeniero brillante.",
    "Podrías ser una estrella del tenis.",
    "O un emprendedor audaz.",
    "¿Un gran escritor?",
    "Tal vez un astronauta tocando el silencio.",
    "O podrías ser todas ellas, cada treinta segundos.",
    "Suena fantástico, ¿no?"
];

// --- FASE 1: GLITCH INICIAL ---
let initialGlitch = setInterval(() => {
    const targets = document.querySelectorAll('.glitch-target');
    const target = targets[Math.floor(Math.random() * targets.length)];
    const original = target.innerText;
    const words = original.split(" ");
    const idx = Math.floor(Math.random() * words.length);
    
    words[idx] = `<span style="color:#888">${words[idx].replace(/./g, c => 
        Math.random() < 0.3 ? symbols[Math.floor(Math.random() * symbols.length)] : c
    )}</span>`;
    
    target.innerHTML = words.join(" ");
    setTimeout(() => target.innerText = original, 500);
}, 2500);

// --- FASE 2: EVENTO INICIO ---
document.getElementById('startBtn').addEventListener('click', function() {
    clearInterval(initialGlitch);
    document.getElementById('home-screen').classList.add('fade-out');
    
    setTimeout(() => {
        document.getElementById('home-screen').style.display = 'none';
        const overlay = document.getElementById('transition-overlay');
        overlay.style.display = 'flex';
        document.querySelector('.expanding-circle').classList.add('animate-circle');
    }, 800);

    setTimeout(() => {
        document.getElementById('final-text-container').style.opacity = "1";
        runIntenseGlitch();
    }, 2000);
});

// --- FASE 3: GLITCH AGRESIVO ---
function runIntenseGlitch() {
    const q = document.getElementById('question-text');
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
    }, 5000);
}

// --- FASE 4: SCROLL TIKTOK ---
function runScrollPhase() {
    const screen = document.getElementById('scroll-screen');
    const container = document.getElementById('scroll-container');
    const progressFill = document.getElementById('progress-fill');

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
            }, 600);
            return;
        }

        const slide = slides[current];
        animateProgress(3000); 

        typeEffect(identities[current], slide, () => {
            setTimeout(() => {
                current++;
                if (current < identities.length) {
                    track.style.transform = `translateY(-${current * 100}vh)`;
                    setTimeout(showCurrent, 800);
                } else {
                    setTimeout(() => {
                        screen.style.transition = 'opacity 0.6s ease';
                        screen.style.opacity = '0';
                        setTimeout(() => {
                            screen.style.display = 'none';
                            runFinalReflection();
                        }, 600);
                    }, 1800);
                }
            }, 1400);
        });
    }

    setTimeout(showCurrent, 150);
}

// --- MÁQUINA DE ESCRIBIR (SIN GLITCH) ---
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
    }, 60);
}

// --- FASE 5: REFLEXIÓN FINAL ---
function runFinalReflection() {
    const screen = document.getElementById('reflection-screen');
    const out = document.getElementById('reflection-output');
    const readyBtn = document.getElementById('readyBtn');
    screen.style.display = 'flex';
    
    const msg = "Hoy, estamos consumidos por el contenido rápido.\n\nY ellos lo saben, y así lo quieren.";
    let i = 0;
    
    function type() {
        if (i < msg.length) {
            out.innerHTML += msg.charAt(i);
            i++;
            let speed = (msg.charAt(i-1) === ".") ? 800 : (msg.charAt(i-1) === ",") ? 400 : 50;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                if(readyBtn) readyBtn.classList.add('show-btn');
            }, 1000);
        }
    }
    type();
}

// --- LÓGICA DEL BOTÓN LIKE ---
const heartBtn = document.querySelector('.heart-btn');
if (heartBtn) {
    heartBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        this.classList.toggle('liked');
    });
}