// ==========================================
// MOTOR INTERACTIVO: MENÚ Y SECCIONES 1 AL 4
// ==========================================
function markBtnAsCompleted(btnId) {
    const btn = document.getElementById(btnId);
    if (btn && !btn.querySelector('.check-icon')) {
        const tickSVG = `
            <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
        btn.insertAdjacentHTML('beforeend', tickSVG);
    }
}

// --- RESTAURAR ESTADO VISUAL DEL MENÚ ---
function restoreMenuState() {
    if (sectionOneCompleted) {
        markBtnAsCompleted('btn-sec-1');
        const b2 = document.getElementById('btn-sec-2');
        if(b2) { b2.classList.remove('locked'); const i = b2.querySelector('.lock-icon'); if(i) i.remove(); }
    }
    if (sectionTwoCompleted) {
        markBtnAsCompleted('btn-sec-2');
        const b3 = document.getElementById('btn-sec-3');
        if(b3) { b3.classList.remove('locked'); const i = b3.querySelector('.lock-icon'); if(i) i.remove(); }
    }
    if (sectionThreeCompleted) {
        markBtnAsCompleted('btn-sec-3');
        const b4 = document.getElementById('btn-sec-4');
        if(b4) { b4.classList.remove('locked'); const i = b4.querySelector('.lock-icon'); if(i) i.remove(); }
    }
    if (sectionFourCompleted) {
        markBtnAsCompleted('btn-sec-4');
    }
}
restoreMenuState(); // Ejecutar al cargar la página

// --- LÓGICA DEL MENÚ PRINCIPAL ---
const btnReady = document.getElementById('readyBtn');
const reflectionScreen = document.getElementById('reflection-screen');
const menuScreen = document.getElementById('menu-screen');
const menuBtns = document.querySelectorAll('.menu-btn');

if (btnReady) {
    btnReady.addEventListener('click', () => {
        // Al hacer clic, ocultamos la pantalla de reflexión
        if(reflectionScreen) {
            reflectionScreen.style.transition = 'opacity 0.8s ease';
            reflectionScreen.style.opacity = '0';
        }
        
        // Y mostramos el menú principal
        setTimeout(() => {
            if(reflectionScreen) reflectionScreen.style.display = 'none';
            if(menuScreen) {
                menuScreen.style.display = 'flex';
                menuScreen.style.opacity = '1';
            }
            // Agregamos la clase de animación a los botones del menú
            menuBtns.forEach(btn => btn.classList.add('cascade-in'));
            
            // Forzamos la actualización del puntaje visual por si hay datos guardados
            const scoreUI = document.getElementById('score-value');
            if(scoreUI) scoreUI.innerText = playerScore;
            
        }, tiempos.menuFadeOut);
    });
}

// =========================================================
// --- SECCIÓN UNO (INTRODUCCIÓN + ARRASTRAR PALABRAS) ---
// =========================================================

// --- 1. DATOS DE LOS TEXTOS INTRODUCTORIOS ---
// --- 1. DATOS DE LOS TEXTOS INTRODUCTORIOS CON FUENTES ---
const sectionOneIntroData = [
    {
        text: "La Unión Europea actualmente está llevando a cabo una ofensiva legal sin precedentes contra el denominado 'diseño adictivo'.",
        link: "https://www.theguardian.com/technology/2025/nov/26/social-media-ban-under-16s-european-parliament-resolution#:~:text=Su%20informe%20solicitaba%20la%20desactivaci%C3%B3n%20por%20defecto,j%C3%B3venes%20presentaba%20un%20uso%20%C2%ABproblem%C3%A1tico%C2%BB%20o%20%C2%ABdisfuncional%C2%BB"
    },
    {
        text: "En febrero de 2026, se dictaminó que cierta empresa líder de contenido rápido ha violado sistemáticamente la Ley de Servicios Digitales.",
        link: "https://ec.europa.eu/newsroom/comm_rep_es/items/921620/es" // Fuente sobre la investigación formal de la CE
    },
    {
        text: "Para finales de este año, se está preparando una nueva legislación estricta para desmantelar los patrones de su algoritmo.",
        link: "https://dig.watch/updates/dutch-court-increases-pressure-on-meta-over-non-profiling-social-media-feeds#:~:text=The%20court%20concluded%20that%20the%20automatic%20resetting,transparency%20and%20user%20control%20over%20recommendation%20systems."
    },
    {
        text: "Por su parte, un exingeniero de otra gran plataforma testificó bajo juramento ante el Senado de EE.UU.",
        link: "https://www.abc.es/tecnologia/arturo-bejar-exdirectivo-meta-instagram-ensenando-videos-20260327043309-nt.html"
    },
    {
        text: "Afirmó haber enviado correos personales a altos directivos advirtiendo del daño psicológico de sus funciones adictivas. Fue ignorado y minimizado.",
    },
    {
        text: "Mientras tanto, el gran país asiático de donde se origina una de estas plataformas, utiliza internamente un algoritmo completamente distinto (enfocado en ciencia y arte) al que nos proporcionan a nosotros. ",
    },
	{
        text: "...Para su mercado interno ofrecen una versión de 'espinacas' mientras que para el resto del mundo exportan opio. Cita textual de Tristan Harris (ex-diseñador de ética de Google)",
        link: "https://www.cbsnews.com/news/tiktok-cybersecurity-china-60-minutes-2020-11-15/"
    },
		{
        text: "¿Por qué?",       
    },
	{
        text: "Y a nosotros, que no residimos ni en Estados Unidos ni en Europa... ¿Quién nos protege?",
    },
	{
        text: "Quiero aportar un grano de arena y darte la información cruda y las herramientas para que tú mismo tomes el mando de tu tiempo.",
    },
];

// --- 2. DATOS DEL JUEGO DE ARRASTRAR ---
const sectionOneData = [
    { isNewGroup: true, type: "text", content: "El diseño actual de la tecnología exige un peaje alto. El adulto promedio pasa más de " },
    { type: "blank", options: ["2 horas", "6 horas"], correct: "6 horas" },
    { type: "text", content: " al día mirando una pantalla. " },
    
    { isNewGroup: true, type: "text", content: "No estamos aprendiendo ni creando; la mayor parte de este tiempo es un consumo " },
    { type: "blank", options: ["activo", "pasivo"], correct: "pasivo" },
    { type: "text", content: " que alimenta algoritmos. " },
    
    { isNewGroup: true, type: "text", content: "A largo plazo, esta inyección constante de dopamina superficial eleva nuestros niveles de " },
    { type: "blank", options: ["creatividad", "ansiedad"], correct: "ansiedad" },
    { type: "text", content: "." },
	
	{ isNewGroup: true, type: "text", content: "y daña gravemente nuestra " },
    { type: "blank", options: ["atención", "posesión"], correct: "atención" },
    { type: "text", content: "." }
];

let currentSec1IntroStep = 0;
let currentGameStep = 0;
let currentSentenceGroup = null; 

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
            
            // Iniciamos primero la introducción
            startSectionOneIntro();
        }, tiempos.menuFadeOut);
    });
}

// --- LÓGICA DE LA INTRODUCCIÓN ---
function startSectionOneIntro() {
    document.getElementById('sec1-intro-container').style.display = 'flex';
    document.getElementById('sec1-intro-container').style.opacity = '1';
    document.getElementById('sec1-game-container').style.display = 'none';
    currentSec1IntroStep = 0;
    playSec1IntroParagraph();
}

function playSec1IntroParagraph() {
    const out = document.getElementById('sec1-intro-text');
    const oldBtn = document.getElementById('sec1-next-btn');
    const activeBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(activeBtn, oldBtn);
    
    activeBtn.style.opacity = '0';
    activeBtn.style.pointerEvents = 'none';
    out.style.opacity = '1';
    out.innerHTML = "";
    
    // Detectamos si es un string simple o un objeto con link
    const currentItem = sectionOneIntroData[currentSec1IntroStep];
    const msg = (typeof currentItem === 'string') ? currentItem : currentItem.text;
    
    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < msg.length) {
            out.innerHTML += msg.charAt(charIndex);
            charIndex++;
            let speed = tiempos.typewriterSpeed;
            if (msg.charAt(charIndex-1) === ".") speed = tiempos.reflectionSpeedPunto;
            else if (msg.charAt(charIndex-1) === ",") speed = tiempos.reflectionSpeedComa;
            setTimeout(typeChar, speed);
        } else {
            // AL TERMINAR EL TEXTO:
            if (currentItem.link) {
                const linkWrap = document.createElement('span');
                linkWrap.innerHTML = ` <a href="${currentItem.link}" target="_blank" class="fact-link"> [Ver fuente]</a>`;
                out.appendChild(linkWrap);
            }

            setTimeout(() => {
                activeBtn.style.opacity = '1';
                activeBtn.style.pointerEvents = 'auto';
                activeBtn.addEventListener('click', () => {
                    if (currentSec1IntroStep < sectionOneIntroData.length - 1) {
                        out.style.transition = `opacity ${tiempos.reflectionFadeOut / 1000}s ease`;
                        out.style.opacity = '0';
                        activeBtn.style.opacity = '0';
                        setTimeout(() => {
                            currentSec1IntroStep++;
                            playSec1IntroParagraph();
                        }, tiempos.reflectionFadeOut);
                    } else {
                        transitionToGame();
                    }
                });
            }, 500);
        }
    }
    typeChar();
}

// --- TRANSICIÓN SUAVE DE LA INTRO AL JUEGO ---
function transitionToGame() {
    const introContainer = document.getElementById('sec1-intro-container');
    const gameContainer = document.getElementById('sec1-game-container');
    
    introContainer.style.transition = 'opacity 0.8s ease';
    introContainer.style.opacity = '0';
    
    setTimeout(() => {
        introContainer.style.display = 'none';
        gameContainer.style.display = 'flex';
        
        setTimeout(() => {
            gameContainer.style.transition = 'opacity 0.8s ease';
            gameContainer.style.opacity = '1';
            startGame();
        }, 50);
        
    }, 800);
}

// --- LÓGICA DEL JUEGO DE ARRASTRAR ---
function startGame() {
    currentGameStep = 0;
    currentSentenceGroup = null; 
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
				markBtnAsCompleted('btn-sec-1');
				saveProgress();
                
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
            const mScreen = document.getElementById('menu-screen');
            if(gameScreen) {
                gameScreen.style.transition = 'opacity 0.8s ease';
                gameScreen.style.opacity = '0';
            }
            
            setTimeout(() => {
                if(gameScreen) gameScreen.style.display = 'none';
                if(gameScreen) gameScreen.style.opacity = '1';
                if(mScreen) {
                    mScreen.style.display = 'flex';
                    mScreen.style.opacity = '1';
                }
            }, tiempos.menuFadeOut);

        }, 2000);
        return;
    }

    const stepData = sectionOneData[currentGameStep];

    if (stepData.isNewGroup || !currentSentenceGroup) {
        currentSentenceGroup = document.createElement('span');
        currentSentenceGroup.className = 'sentence-group';
        currentSentenceGroup.style.transition = 'opacity 0.8s ease';
        storyEl.appendChild(currentSentenceGroup);

        const groups = storyEl.querySelectorAll('.sentence-group');
        if (groups.length > 2) {
            const oldestGroup = groups[groups.length - 3];
            oldestGroup.style.opacity = '0';
            setTimeout(() => { oldestGroup.style.display = 'none'; }, 800); 
        }
    }

    if (stepData.type === "text") {
        let i = 0;
        const textSpan = document.createElement('span');
        currentSentenceGroup.appendChild(textSpan);

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
        currentSentenceGroup.appendChild(dropZone);

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
// --- MODIFICACIÓN EN SECCIÓN DOS ---
const submitTimeBtn = document.getElementById('submit-time-btn');
if (submitTimeBtn) {
    submitTimeBtn.addEventListener('click', () => {
        const input = document.getElementById('screen-time-input');
        if (!input || input.value === "" || parseFloat(input.value) < 0) return;

        // En lugar de cerrar la pantalla, mostramos el cartel de Scroll
        showPrankModal();
    });
}

function showPrankModal() {
    const overlay = document.getElementById('prank-modal-overlay');
    const btnAccept = document.getElementById('accept-prank-btn');
    const btnReject = document.getElementById('reject-prank-btn');
    
    overlay.style.display = 'flex';

    // Forzamos el comportamiento dinámico desde JS para evitar que el CSS lo bloquee
    btnAccept.style.transition = 'transform 0.15s ease-out';
    btnAccept.style.position = 'relative';

    const moveButton = (e) => {
        if (e) e.preventDefault();
        
        // Calculamos un salto seguro independiente del tamaño de la pantalla
        // Saltará entre 60 y 150 píxeles hacia cualquier dirección
        const xDir = Math.random() < 0.5 ? -1 : 1;
        const yDir = Math.random() < 0.5 ? -1 : 1;
        
        const randomX = (Math.floor(Math.random() * 100) + 60) * xDir;
        const randomY = (Math.floor(Math.random() * 60) + 40) * yDir;

        // Aplicamos el movimiento
        btnAccept.style.transform = `translate(${randomX}px, ${randomY}px)`;
    };

    // Atacamos el botón con múltiples eventos por si el navegador bloquea alguno
    btnAccept.addEventListener('mouseover', moveButton);
    btnAccept.addEventListener('mouseenter', moveButton);
    btnAccept.addEventListener('click', moveButton);
    
    // El escudo para pantallas táctiles (cuando lo subas al celular)
    btnAccept.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    }, { passive: false });

    // La única salida posible
    btnReject.onclick = () => {
        overlay.style.display = 'none';
        finishSectionTwoLogic(); 
    };
}

// Mueve la lógica que tenías antes aquí para que se ejecute al rechazar
function finishSectionTwoLogic() {
    if (!sectionTwoCompleted) {
        sectionTwoCompleted = true;
        playerScore += 1;
		saveProgress();

        // 1. Actualizar el marcador visual de puntos
        const scoreUI = document.getElementById('score-value');
        if (scoreUI) {
            scoreUI.innerText = playerScore;
            scoreUI.classList.add('score-highlight');
            setTimeout(() => scoreUI.classList.remove('score-highlight'), 1000);
        }

        // 2. Poner el tick verde en el botón de la sección 2
        markBtnAsCompleted('btn-sec-2');

        // 3. Desbloquear la sección 3 (quitar clase y borrar el candado)
        const btnSec3 = document.getElementById('btn-sec-3'); 
        if (btnSec3) {
            btnSec3.classList.remove('locked');
            const lockIcon = btnSec3.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        }
    }

    // 4. Animación de regreso al menú
    const screen2 = document.getElementById('section-two-screen');
    const mScreen = document.getElementById('menu-screen');
    
    if(screen2 && mScreen) {
        screen2.style.transition = 'opacity 0.8s ease';
        screen2.style.opacity = '0';
        
        setTimeout(() => {
            screen2.style.display = 'none';
            screen2.style.opacity = '1';
            mScreen.style.display = 'flex';
            mScreen.style.opacity = '1';
        }, tiempos.menuFadeOut);
    }
}

// =========================================================
// --- SECCIÓN TRES (TEXTOS REFLEXIVOS) ---
// =========================================================

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
		saveProgress();
		markBtnAsCompleted('btn-sec-3');
        
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
// --- SECCIÓN CUATRO (DESAFÍO FINAL Y ATAJO ADMIN) ---
// =========================================================

const pledges = [
    { prompt: "El primer paso requiere cortar la fuente principal.<br><br>Escribe la siguiente frase para aceptar el reto:", target: "Me comprometo a desinstalar TikTok" },
    { prompt: "El algoritmo de videos cortos altera tu enfoque profundo.<br><br>Sella tu segundo compromiso:", target: "Me comprometo a dejar de mirar Reels" },
    { prompt: "El último paso requiere intención pura.<br><br>Teclea esta frase para recuperar el control:", target: "Mi atención me pertenece" }
];

let currentPledgeStep = 0;


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
            
            const pInput = document.getElementById('pledge-input');
            pInput.value = "";
            pInput.classList.remove('pledge-success');
            
            // Bloqueamos el input mientras la máquina de escribir hace su trabajo
            pInput.disabled = true; 
            
            updatePledgeUI(() => {
                pInput.disabled = false;
                pInput.focus();
            });
        }, tiempos.menuFadeOut);
    });
}

function updatePledgeUI(onComplete) {
    const promptEl = document.getElementById('pledge-prompt');
    const targetEl = document.getElementById('pledge-target-text');
    const currentPledge = pledges[currentPledgeStep];

    promptEl.innerHTML = "";
    targetEl.innerText = ""; 

    let msg = currentPledge.prompt;
    let i = 0;
    let speed = tiempos.typewriterSpeed; 

    function typePledge() {
        if (i < msg.length) {
            // Si detecta un código HTML (como <br>), lo imprime de golpe para no romper el texto
            if (msg.charAt(i) === '<') {
                let tagEnd = msg.indexOf('>', i);
                if (tagEnd !== -1) {
                    promptEl.innerHTML += msg.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                }
            } else {
                promptEl.innerHTML += msg.charAt(i);
                i++;
            }
            setTimeout(typePledge, speed);
        } else {
            // Al terminar de escribir, aparece suavemente la frase objetivo
            targetEl.style.opacity = '0';
            targetEl.innerText = `"${currentPledge.target}"`;
            targetEl.style.transition = 'opacity 0.6s ease';
            
            setTimeout(() => {
                targetEl.style.opacity = '1';
                if (onComplete) onComplete(); // Dispara la reactivación del teclado
            }, 50);
        }
    }
    
    typePledge();
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
                        this.value = "";
                        this.classList.remove('pledge-success');
                        pContent.style.opacity = '1';
                        this.style.opacity = '1';
                        
                        // Bloquear nuevamente para la siguiente animación
                        this.disabled = true;
                        
                        updatePledgeUI(() => {
                            this.disabled = false;
                            this.focus();
                        });
                    }, 500);
                } else {
                    sectionFourCompleted = true;
					playerScore += 1;
					saveProgress();
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