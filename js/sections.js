// ==========================================
// MOTOR INTERACTIVO: MENÚ Y SECCIONES 1 AL 4
// ==========================================

// --- LÓGICA DEL MENÚ PRINCIPAL ---
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
// --- SECCIÓN UNO (ARRASTRAR PALABRAS) ---
// =========================================================

const sectionOneData = [
    { type: "text", content: "El diseño actual de la tecnología exige un peaje alto. El adulto promedio pasa más de " },
    { type: "blank", options: ["2 horas", "6 horas"], correct: "6 horas" },
    { type: "text", content: " al día mirando una pantalla. No estamos aprendiendo ni creando; la mayor parte de este tiempo es un consumo " },
    { type: "blank", options: ["activo", "pasivo"], correct: "pasivo" },
    { type: "text", content: " que alimenta algoritmos. A largo plazo, esta inyección constante de dopamina superficial eleva nuestros niveles de " },
    { type: "blank", options: ["creatividad", "ansiedad"], correct: "ansiedad" },
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
// --- SECCIÓN DOS (TIEMPO DE PANTALLA Y ESTADÍSTICAS) ---
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
    
    // Reseteamos también el texto de feedback
    const feedbackEl = document.getElementById('screen-time-feedback');
    if(feedbackEl) feedbackEl.style.opacity = '0';
    
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

// --- LOGICA DE FEEDBACK DINÁMICO ---
const screenTimeInput = document.getElementById('screen-time-input');
const screenTimeFeedback = document.getElementById('screen-time-feedback');

if (screenTimeInput && screenTimeFeedback) {
    screenTimeInput.addEventListener('input', (e) => {
        // Leemos el número incluso si el usuario usa una coma o un punto
        const hours = parseFloat(e.target.value.replace(',', '.'));
        
        if (isNaN(hours) || hours <= 0) {
            screenTimeFeedback.style.opacity = '0';
            return;
        }

        let msg = "";
        let color = "#b0b0b0"; 

        if (hours <= 2) {
            msg = "¡Excelente! Estás dentro del límite máximo recomendado por la OMS.";
            color = "#a8ffb2"; 
        } else if (hours <= 4) {
            msg = "Buen equilibrio. Estás bastante por debajo de la media mundial.";
        } else if (hours <= 6.6) {
            msg = "Promedio. La media global es de 6 horas y 38 minutos al día.";
        } else if (hours <= 8.6) {
            msg = "Alto. Superas el promedio global (la media en Argentina es de 8.6 horas).";
            color = "#ffb088"; 
        } else if (hours <= 12) {
            msg = "Peligro. Tu consumo supera al 80% de la población. Alto riesgo de fatiga mental.";
            color = "#ff8888"; 
        } else {
            msg = "Alerta severa. Estás en el percentil más extremo de sedentarismo digital.";
            color = "#ff4444"; 
        }

        screenTimeFeedback.innerText = msg;
        screenTimeFeedback.style.color = color;
        screenTimeFeedback.style.opacity = '1';
    });
}

// --- LOGICA DEL BOTON CONFIRMAR ---
const submitTimeBtn = document.getElementById('submit-time-btn');
if (submitTimeBtn) {
    submitTimeBtn.addEventListener('click', () => {
        const input = document.getElementById('screen-time-input');
        
        if (!input || input.value === "" || parseFloat(input.value) < 0) {
            if(input) input.style.borderColor = "#ff4444";
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

            // Desbloqueamos la sección 3 buscando su ID (Mucho más seguro)
            const btnSec3 = document.getElementById('btn-sec-3'); 
            if(btnSec3) {
                btnSec3.classList.remove('locked');
                const lockIcon = btnSec3.querySelector('.lock-icon');
                if (lockIcon) lockIcon.remove();
            }
        }

        const screen2 = document.getElementById('section-two-screen');
        const mScreen = document.getElementById('menu-screen');
        
        if(screen2 && mScreen) {
            screen2.style.transition = 'opacity 0.8s ease';
            screen2.style.opacity = '0';
            
            setTimeout(() => {
                screen2.style.display = 'none';
                screen2.style.opacity = '1';
                mScreen.style.display = 'flex';
                mScreen.style.opacity = '1'; // Forzamos que vuelva a ser visible
            }, tiempos.menuFadeOut);
        }
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
        const oldBtn = document.getElementById('finish-sec3-btn');
        const activeBtn = oldBtn.cloneNode(true);
        oldBtn.parentNode.replaceChild(activeBtn, oldBtn);
        
        activeBtn.classList.remove('show-btn');
        
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
                    activeBtn.addEventListener('click', () => {
                        if (currentParagraph < parrafosReflexion.length - 1) {
                            fadeOutAndNext();
                        } else {
                            finishSectionThree();
                        }
                    });
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

        // Desbloqueamos la sección 4 de forma segura
        const btnSec4 = document.getElementById('btn-sec-4'); 
        if(btnSec4) {
            btnSec4.classList.remove('locked');
            const lockIcon = btnSec4.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        }
    }

    const s3 = document.getElementById('section-three-screen');
    const mScreen = document.getElementById('menu-screen');
    
    s3.style.transition = 'opacity 0.8s ease';
    s3.style.opacity = '0';
    
    setTimeout(() => {
        s3.style.display = 'none';
        s3.style.opacity = '1';
        if(mScreen) {
            mScreen.style.display = 'flex';
            mScreen.style.opacity = '1';
        }
    }, tiempos.menuFadeOut);
}

// =========================================================
// --- SECCIÓN CUATRO (DESAFÍO FINAL Y ATAJO) ---
// =========================================================

const pledges = [
    { prompt: "El primer paso requiere cortar la fuente principal.<br><br>Escribe la siguiente frase para aceptar el reto:", target: "Me comprometo a desinstalar TikTok" },
    { prompt: "El algoritmo de videos cortos altera tu enfoque profundo.<br><br>Sella tu segundo compromiso:", target: "Me comprometo a dejar de mirar Reels" },
    { prompt: "El último paso requiere intención pura.<br><br>Teclea esta frase para recuperar el control:", target: "Mi atención me pertenece" }
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