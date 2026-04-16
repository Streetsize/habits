// ==========================================
// CONFIGURACIÓN GLOBAL Y ESTADO DEL JUGADOR
// ==========================================

// ⚡ Modo de Pruebas (Cambiar a false antes de publicar)
const DEV_MODE = false; 

// Tabla de control de tiempos (Velocidad de animaciones)
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
    typewriterSpeed: DEV_MODE ? 1 : 50,
    reflectionSpeedNormal: DEV_MODE ? 1 : 50,
    reflectionSpeedComa: DEV_MODE ? 1 : 300,
    reflectionSpeedPunto: DEV_MODE ? 1 : 600,
    reflectionPauseBeforeMenu: DEV_MODE ? 10 : 1000,
    menuFadeOut: DEV_MODE ? 10 : 800,
    reflectionPauseBetweenParagraphs: DEV_MODE ? 10 : 2500,
    reflectionFadeOut: DEV_MODE ? 10 : 800
};

// Constantes visuales
const symbols = "χψωαβγδεζηθικλμν0189$#";
const aggressiveSymbols = "█▓▒░><?/[]{}-=+*^!";
const identities = [
    "Podrias aprender algo nuevo",
    "O pasar tiempo con tu familia",
    "Quizas volverte un gran pintor",
    "Un emprendedor audaz",
    "¿Un gran escritor?",
    "Tal vez un astronauta tocando el silencio.",
    "O podrías ser todas ellas, cada treinta segundos.",
    "Suena fantástico, ¿no?",
	"Por favor, sigue scrolleando ¡Ya vienen los videos de gatitos!",
	"Bueno... son generados por IA ¿Importa?"
];

// ==========================================
// SISTEMA DE GUARDADO (LOCALSTORAGE)
// ==========================================

// Leer la memoria del navegador o crear una nueva si es la primera vez
let savedProgress = JSON.parse(localStorage.getItem('scrollProgress')) || {
    s1: false, s2: false, s3: false, s4: false, score: 0
};

// Asignar los valores guardados a las variables globales
let playerScore = savedProgress.score;
let sectionOneCompleted = savedProgress.s1;
let sectionTwoCompleted = savedProgress.s2;
let sectionThreeCompleted = savedProgress.s3;
let sectionFourCompleted = savedProgress.s4;

// Función que llamaremos cada vez que se gane un punto
function saveProgress() {
    const progress = {
        s1: sectionOneCompleted,
        s2: sectionTwoCompleted,
        s3: sectionThreeCompleted,
        s4: sectionFourCompleted,
        score: playerScore
    };
    localStorage.setItem('scrollProgress', JSON.stringify(progress));
}