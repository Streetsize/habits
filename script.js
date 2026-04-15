// --- ⚙️ CONFIGURACIÓN GLOBAL DE TIEMPOS ---
const DEV_MODE = false; 

const tiempos = {
    glitchInitialInterval: DEV_MODE ? 50 : 2500,
    glitchInitialDuration: DEV_MODE ? 10 : 500,
    screenFadeOut: DEV_MODE ? 10 : 800,
    glitchAggressiveStart: DEV_MODE ? 10 : 2000,
    glitchAggressiveDuration: DEV_MODE ? 50 : 5000,
    scrollProgressDuration: DEV_MODE ? 10 : 3000,
    scrollPauseAfterMove: DEV_MODE ? 10 : 800,
    scrollFadeOutEnd: DEV_MODE ? 10 : 600,
    scrollPauseBeforeReflection: DEV_MODE ? 10 : 1800,
    scrollReadingTime: DEV_MODE ? 10 : 1400,
    typewriterSpeed: DEV_MODE ? 1 : 60,
    reflectionSpeedNormal: DEV_MODE ? 1 : 50,
    reflectionSpeedComa: DEV_MODE ? 1 : 400,
    reflectionSpeedPunto: DEV_MODE ? 1 : 800,
    reflectionPauseBeforeMenu: DEV_MODE ? 10 : 1000,
    menuFadeOut: DEV_MODE ? 10 : 800,
    reflectionPauseBetweenParagraphs: DEV_MODE ? 10 : 2500,
    reflectionFadeOut: DEV_MODE ? 10 : 800
};

// ------------------------------------------

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
    if (targets.length === 0) return;
    const target = targets[Math.floor(Math.random() * targets.length)];
    const original = target.innerText;
    const words = original.split(" ");
    const idx = Math.floor(Math.random() * words.length);
    
    words[idx] = `<span style="color:#888">${words[idx].replace(/./g, c => 
        Math.random() < 0.3 ? symbols[Math.floor(Math.random() * symbols.length)] : c
    )}</span>`;
    
    target.innerHTML = words.join(" ");
    setTimeout(() => target.innerText = original, tiempos.glitchInitialDuration);
}, tiempos.glitchInitialInterval);

// --- FASE 2: EVENTO INICIO ---
const startBtn = document.getElementById('startBtn');
if (startBtn) {
    startBtn.addEventListener('click', function() {
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

// --- MÁQUINA DE ESCRIBIR (GENERAL) ---
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

// --- FASE 5: REFLEXIÓN INICIAL ---
function runFinalReflection() {
    const screen = document.getElementById('reflection-screen');
    const out = document.getElementById('reflection-output');
    const readyBtn = document.getElementById('readyBtn');
    
    if(!screen || !out) return;
    screen.style.display = 'flex';
    out.innerHTML = "";
    
    const msg = "Hoy, estamos consumidos por el contenido rápido.\n\nY ellos lo saben, y así lo quieren.";
    let i = 0;
    
    function type() {
        if (i < msg.length) {
            out.innerHTML += msg.charAt(i);
            i++;
            let speed = tiempos.reflectionSpeedNormal;
            if (msg.charAt(i-1) === ".") speed = tiempos.reflectionSpeedPunto;
            else if (msg.charAt(i-1) === ",") speed = tiempos.reflectionSpeedComa;
            
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                if(readyBtn) readyBtn.classList.add('show-btn');
            }, tiempos.reflectionPauseBeforeMenu);
        }
    }
    type();
}

// --- LÓGICA DE ICONOS SOCIALES ---
const allIcons = document.querySelectorAll('.icon');
allIcons.forEach(icon => {
    icon.addEventListener('click', function(event) {
        event.stopPropagation();
        this.classList.toggle('active');
    });
});

// --- LÓGICA DEL MENÚ EN CASCADA ---
const btnReady = document.getElementById('readyBtn');
const reflectionScreen = document.getElementById('reflection-screen');
const menuScreen = document.getElementById('menu-screen');
const menuBtns = document.querySelectorAll('.menu-btn');

if (btnReady) {
    btnReady.addEventListener('click', () => {
        if(reflectionScreen) {
            reflectionScreen.style.transition = 'opacity 0.8s ease';
            reflectionScreen.style.opacity = '0';
        }
        
        setTimeout(() => {
            if(reflectionScreen) reflectionScreen.style.display = 'none';
            if(menuScreen) {
                menuScreen.style.display = 'flex';
                menuScreen.style.opacity = '1';
            }
            menuBtns.forEach(btn => btn.classList.add('cascade-in'));
        }, tiempos.menuFadeOut);
    });
}

// =========================================================
// --- VARIABLE GLOBAL DE PUNTUACIÓN ---
// =========================================================
let playerScore = 0;


// =========================================================
// --- SECCIÓN UNO (ARRASTRAR PALABRAS) ---
// =========================================================

const sectionOneData = [
    { type: "text", content: "Este es un texto de " },
    { type: "blank", options: ["ejemplo2", "ejemplo1"], correct: "ejemplo1" },
    { type: "text", content: ", estamos programando el típico hello " },
    { type: "blank", options: ["world", "sea"], correct: "world" },
    { type: "text", content: "." }
];

let currentGameStep = 0;
let sectionOneCompleted = false; 

const btnSectionOne = document.getElementById('btn-sec-1');
if (btnSectionOne) {
    btnSectionOne.addEventListener('click', () => {
        const mScreen = document.getElementById('menu-screen');
        mScreen.style.transition = 'opacity 0.8s ease';
        mScreen.style.opacity = '0';
        
        setTimeout(() => {
            mScreen.style.display = 'none';
            mScreen.style.opacity = '1'; 
            document.getElementById('section-one-screen').style.display = 'flex';
            startGame();
        }, tiempos.menuFadeOut);
    });
}

function startGame() {
    currentGameStep = 0;
    const storyEl = document.getElementById('story-text');
    const optionsEl = document.getElementById('options-container');
    if(!storyEl || !optionsEl) return;
    
    storyEl.innerHTML = '';
    optionsEl.innerHTML = '';
    processGameStep();
}

function processGameStep() {
    const storyEl = document.getElementById('story-text');
    const optionsEl = document.getElementById('options-container');
    
    if (currentGameStep >= sectionOneData.length) {
        optionsEl.innerHTML = '<span style="color:#b0b0b0; letter-spacing: 2px;">Pensamiento completado.</span>';
        
        setTimeout(() => {
            if (!sectionOneCompleted) {
                sectionOneCompleted = true;
                playerScore += 1;
                
                const scoreUI = document.getElementById('score-value');
                if(scoreUI) {
                    scoreUI.innerText = playerScore;
                    scoreUI.classList.add('score-highlight');
                    setTimeout(() => scoreUI.classList.remove('score-highlight'), 1000);
                }

                const btnSec2 = document.getElementById('btn-sec-2');
                if(btnSec2) {
                    btnSec2.classList.remove('locked');
                    const lockIcon = btnSec2.querySelector('.lock-icon');
                    if (lockIcon) lockIcon.remove();
                }
            }

            const gameScreen = document.getElementById('section-one-screen');
            if(gameScreen) {
                gameScreen.style.transition = 'opacity 0.8s ease';
                gameScreen.style.opacity = '0';
            }
            
            setTimeout(() => {
                if(gameScreen) gameScreen.style.display = 'none';
                if(gameScreen) gameScreen.style.opacity = '1';
                document.getElementById('menu-screen').style.display = 'flex';
            }, tiempos.menuFadeOut);

        }, 2000);
        return;
    }

    const stepData = sectionOneData[currentGameStep];

    if (stepData.type === "text") {
        let i = 0;
        const textSpan = document.createElement('span');
        storyEl.appendChild(textSpan);

        const interval = setInterval(() => {
            if (i < stepData.content.length) {
                textSpan.textContent += stepData.content[i];
                i++;
            } else {
                clearInterval(interval);
                currentGameStep++;
                processGameStep(); 
            }
        }, tiempos.typewriterSpeed);
        
    } else if (stepData.type === "blank") {
        const dropZone = document.createElement('span');
        dropZone.className = 'drop-zone';
        storyEl.appendChild(dropZone);

        const shuffledOptions = [...stepData.options].sort(() => Math.random() - 0.5);
        optionsEl.innerHTML = '';

        shuffledOptions.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'drag-option';
            btn.textContent = opt;
            btn.draggable = true;

            btn.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', opt));
            btn.addEventListener('click', () => evaluateAnswer(opt, btn, dropZone, stepData.correct));

            optionsEl.appendChild(btn);
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('active');
            const draggedWord = e.dataTransfer.getData('text/plain');
            const draggedElement = [...optionsEl.children].find(el => el.textContent === draggedWord);
            evaluateAnswer(draggedWord, draggedElement, dropZone, stepData.correct);
        });
    }
}

function evaluateAnswer(selectedWord, element, dropZone, correctWord) {
    const optionsEl = document.getElementById('options-container');
    if (selectedWord === correctWord) {
        dropZone.textContent = selectedWord;
        dropZone.classList.add('filled');
        dropZone.classList.remove('drop-zone');
        
        if(optionsEl) optionsEl.innerHTML = ''; 
        currentGameStep++;
        setTimeout(processGameStep, 300); 
    } else {
        if(element) {
            element.classList.add('wrong');
            setTimeout(() => element.classList.remove('wrong'), 500);
        }
    }
}


// =========================================================
// --- SECCIÓN DOS (TIEMPO DE PANTALLA) ---
// =========================================================

let sectionTwoCompleted = false;

const btnSectionTwo = document.getElementById('btn-sec-2');
if (btnSectionTwo) {
    btnSectionTwo.addEventListener('click', () => {
        if (btnSectionTwo.classList.contains('locked')) return;
        
        const mScreen = document.getElementById('menu-screen');
        mScreen.style.transition = 'opacity 0.8s ease';
        mScreen.style.opacity = '0';
        
        setTimeout(() => {
            mScreen.style.display = 'none';
            document.getElementById('section-two-screen').style.display = 'flex';
            resetSectionTwo();
        }, tiempos.menuFadeOut);
    });
}

function resetSectionTwo() {
    document.getElementById('device-selection').style.display = 'block';
    document.getElementById('device-guide').style.display = 'none';
    document.getElementById('screen-time-input').value = '';
    document.querySelector('.input-area').classList.remove('show');
}

window.showSteps = function(os) {
    const selection = document.getElementById('device-selection');
    const guide = document.getElementById('device-guide');
    const guideText = document.getElementById('guide-text');
    
    selection.style.display = 'none';
    guide.style.display = 'block';
    
    let steps = "";
    if (os === 'ios') {
        steps = "1. Abre 'Ajustes'\n2. Toca en 'Tiempo de uso'\n3. Mira el gráfico de 'Actividad diaria'.";
    } else {
        steps = "1. Abre 'Ajustes'\n2. Busca 'Bienestar digital y controles parentales'\n3. Observa el círculo de tiempo total de hoy.";
    }
    
    guideText.innerText = "";
    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            guideText.innerText += steps[i];
            i++;
        } else {
            clearInterval(interval);
            document.querySelector('.input-area').classList.add('show');
        }
    }, tiempos.typewriterSpeed);
}

const submitTimeBtn = document.getElementById('submit-time-btn');
if (submitTimeBtn) {
    submitTimeBtn.addEventListener('click', () => {
        const input = document.getElementById('screen-time-input');
        if (input.value === "" || input.value < 0) {
            input.style.borderColor = "#ff4444";
            return;
        }

        if (!sectionTwoCompleted) {
            sectionTwoCompleted = true;
            playerScore += 1;
            
            const scoreUI = document.getElementById('score-value');
            if(scoreUI) {
                scoreUI.innerText = playerScore;
                scoreUI.classList.add('score-highlight');
                setTimeout(() => scoreUI.classList.remove('score-highlight'), 1000);
            }

            const menuBtns = document.querySelectorAll('.menu-btn');
            const btnSec3 = menuBtns[2]; 
            if(btnSec3) {
                btnSec3.classList.remove('locked');
                const lockIcon = btnSec3.querySelector('.lock-icon');
                if (lockIcon) lockIcon.remove();
            }
        }

        const screen2 = document.getElementById('section-two-screen');
        const menuScreen = document.getElementById('menu-screen');
        
        screen2.style.transition = 'opacity 0.8s ease';
        screen2.style.opacity = '0';
        
        setTimeout(() => {
            screen2.style.display = 'none';
            screen2.style.opacity = '1';
            menuScreen.style.display = 'flex';
            menuScreen.style.opacity = '1';
        }, tiempos.menuFadeOut);
    });
}


// =========================================================
// --- SECCIÓN TRES (TEXTOS REFLEXIVOS) ---
// =========================================================

let sectionThreeCompleted = false;
const parrafosReflexion = [
    "El diseño de estas plataformas no es accidental.",
    "Cada color, cada notificación y cada scroll infinito está clínicamente calibrado para hackear tu sistema de recompensa.",
    "No eres el cliente de la aplicación. Tu atención es el producto que se vende.",
    "Recuperar tu tiempo es tu primer acto de rebeldía."
];

const btnSectionThree = document.getElementById('btn-sec-3');
if (btnSectionThree) {
    btnSectionThree.addEventListener('click', () => {
        if (btnSectionThree.classList.contains('locked')) return;
        
        const mScreen = document.getElementById('menu-screen');
        mScreen.style.transition = 'opacity 0.8s ease';
        mScreen.style.opacity = '0';
        
        setTimeout(() => {
            mScreen.style.display = 'none';
            document.getElementById('section-three-screen').style.display = 'flex';
            runSectionThreeReflection();
        }, tiempos.menuFadeOut);
    });
}

function runSectionThreeReflection() {
    const out = document.getElementById('section-three-text');
    if(!out) return;
    
    let currentParagraph = 0;

    function playParagraph() {
        const activeBtn = document.getElementById('finish-sec3-btn');
        activeBtn.classList.remove('show-btn');
        activeBtn.onclick = null; 
        
        out.style.transition = 'none'; 
        out.style.opacity = '1';
        out.innerHTML = "";
        
        const msg = parrafosReflexion[currentParagraph];
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < msg.length) {
                out.innerHTML += msg.charAt(charIndex);
                charIndex++;
                let speed = tiempos.reflectionSpeedNormal;
                if (msg.charAt(charIndex-1) === ".") speed = tiempos.reflectionSpeedPunto;
                else if (msg.charAt(charIndex-1) === ",") speed = tiempos.reflectionSpeedComa;
                setTimeout(typeChar, speed);
            } else {
                setTimeout(() => {
                    activeBtn.classList.add('show-btn');
                    activeBtn.onclick = () => {
                        if (currentParagraph < parrafosReflexion.length - 1) {
                            fadeOutAndNext();
                        } else {
                            finishSectionThree();
                        }
                    };
                }, 500);
            }
        }
        typeChar();
    }
    
    function fadeOutAndNext() {
        out.style.transition = `opacity ${tiempos.reflectionFadeOut / 1000}s ease`;
        out.style.opacity = '0';
        document.getElementById('finish-sec3-btn').classList.remove('show-btn');
        
        setTimeout(() => {
            currentParagraph++;
            playParagraph();
        }, tiempos.reflectionFadeOut);
    }
    
    playParagraph();
}

function finishSectionThree() {
    if (!sectionThreeCompleted) {
        sectionThreeCompleted = true;
        playerScore += 1;
        
        const scoreUI = document.getElementById('score-value');
        if(scoreUI) scoreUI.innerText = playerScore;

        const mBtns = document.querySelectorAll('.menu-btn');
        const btnSec4 = mBtns[3]; 
        if(btnSec4) {
            btnSec4.classList.remove('locked');
            const lockIcon = btnSec4.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        }
    }

    const s3 = document.getElementById('section-three-screen');
    s3.style.transition = 'opacity 0.8s ease';
    s3.style.opacity = '0';
    
    setTimeout(() => {
        s3.style.display = 'none';
        s3.style.opacity = '1';
        document.getElementById('menu-screen').style.display = 'flex';
        document.getElementById('menu-screen').style.opacity = '1';
    }, tiempos.menuFadeOut);
}

// =========================================================
// --- SECCIÓN CUATRO (DESAFÍO FINAL Y ATAJO) ---
// =========================================================

const pledges = [
    {
        prompt: "El primer paso requiere cortar la fuente principal.<br><br>Escribe la siguiente frase para aceptar el reto:",
        target: "Me comprometo a desinstalar TikTok"
    },
    {
        prompt: "El algoritmo de videos cortos altera tu enfoque profundo.<br><br>Sella tu segundo compromiso:",
        target: "Me comprometo a dejar de mirar Reels"
    },
    {
        prompt: "El último paso requiere intención pura.<br><br>Teclea esta frase para recuperar el control:",
        target: "Mi atención me pertenece"
    }
];

let currentPledgeStep = 0;
let sectionFourCompleted = false;

const btnSectionFour = document.getElementById('btn-sec-4'); 
if (btnSectionFour) {
    btnSectionFour.addEventListener('click', () => {
        if (btnSectionFour.classList.contains('locked')) return;

        const mScreen = document.getElementById('menu-screen');
        mScreen.style.transition = 'opacity 0.8s ease';
        mScreen.style.opacity = '0';

        setTimeout(() => {
            mScreen.style.display = 'none';
            document.getElementById('section-four-screen').style.display = 'flex';
            currentPledgeStep = 0;
            updatePledgeUI();
            
            const pInput = document.getElementById('pledge-input');
            pInput.value = "";
            pInput.disabled = false;
            pInput.focus();
        }, tiempos.menuFadeOut);
    });
}

function updatePledgeUI() {
    document.getElementById('pledge-prompt').innerHTML = pledges[currentPledgeStep].prompt;
    document.getElementById('pledge-target-text').innerText = `"${pledges[currentPledgeStep].target}"`;
}

const pledgeInput = document.getElementById('pledge-input');
if (pledgeInput) {
    pledgeInput.addEventListener('input', function() {
        if (sectionFourCompleted) return;

        const targetPledge = pledges[currentPledgeStep].target;
        const currentText = this.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const targetText = targetPledge.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (currentText === targetText || currentText === "admin") {
            this.disabled = true;
            this.classList.add('pledge-success');

            setTimeout(() => {
                currentPledgeStep++;
                
                if (currentPledgeStep < pledges.length) {
                    const pContent = document.getElementById('pledge-content');
                    pContent.style.opacity = '0';
                    this.style.opacity = '0';
                    
                    setTimeout(() => {
                        updatePledgeUI();
                        this.value = "";
                        this.classList.remove('pledge-success');
                        pContent.style.opacity = '1';
                        this.style.opacity = '1';
                        this.disabled = false;
                        this.focus();
                    }, 500);
                } else {
                    sectionFourCompleted = true;
                    setTimeout(triggerEpicFinale, 1000);
                }
            }, 800);
        }
    });
}

// =========================================================
// --- CIERRE ÉPICO ---
// =========================================================

function triggerEpicFinale() {
    const s4 = document.getElementById('section-four-screen');
    const fScreen = document.getElementById('epic-finale-screen');
    const comingSoonBtn = document.getElementById('coming-soon-btn');

    if (comingSoonBtn) {
        comingSoonBtn.style.display = 'none';
        comingSoonBtn.style.opacity = '0';
    }

    s4.style.transition = 'opacity 1.5s ease';
    s4.style.opacity = '0';

    setTimeout(() => {
        s4.style.display = 'none';
        fScreen.style.display = 'flex';

        const out = document.getElementById('finale-text');
        const finalMsg = "El sistema está diseñado para que te quedes.\n\nYa sabes cómo funciona.\n\nApaga la pantalla.";
        let i = 0;

        function typeFinale() {
            if (i < finalMsg.length) {
                out.innerHTML += finalMsg.charAt(i);
                i++;
                let speed = (finalMsg.charAt(i-1) === ".") ? 1200 : 90;
                setTimeout(typeFinale, speed);
            } else {
                setTimeout(() => {
                    if (comingSoonBtn) {
                        comingSoonBtn.style.display = 'flex';
                        setTimeout(() => {
                            comingSoonBtn.style.opacity = "0.4";
                        }, 50);
                    }
                }, 1500); 
            }
        }
        setTimeout(typeFinale, 1000);
    }, 1500);
}
