let exercises = 5;
let exerciseDuration = 5; // seconds
let restDuration = 3; // seconds
let currentStep = 0;
let timer;
let isRunning = false;
let countdownInterval;
let paused = false;
let remainingTime = 0;
let currentDisplayText = "";
let isRestStep = false;

// Build the steps array: first two exercises have no rest after, others do
const steps = [
    { type: "exercise", index: 0 },
    { type: "rest", index: 0 },
    { type: "exercise", index: 1 },
    { type: "rest", index: 1 },
    { type: "exercise", index: 2 },
    { type: "rest", index: 2 },
    { type: "exercise", index: 3 },
    { type: "rest", index: 3 },
    { type: "exercise", index: 4 },
    { type: "rest", index: 4 }
];

function startTimer() {
    if (isRunning && !paused) return;
    if (paused) {
        paused = false;
        isRunning = true;
        document.getElementById("start-timer").innerText = "Pause";
        resumeCountdown();
        return;
    }
    isRunning = true;
    currentStep = 0;
    document.getElementById("start-timer").innerText = "Pause";
    nextStep();
}

function pauseTimer() {
    paused = true;
    isRunning = false;
    clearTimeout(timer);
    if (countdownInterval) clearInterval(countdownInterval); // Fix: only clear if exists
    document.getElementById("start-timer").innerText = "Continue";
}

function nextStep() {
    if (currentStep < steps.length) {
        const step = steps[currentStep];
        isRestStep = step.type === "rest";
        const duration = isRestStep ? restDuration : exerciseDuration;
        currentDisplayText = isRestStep ? "Rest" : `Exercise ${step.index + 1}`;
        remainingTime = duration;
        updateDisplay(currentDisplayText, remainingTime);

        if (isRestStep) {
            highlightExercise(-1);
            highlightRest(step.index + 1); // highlight next exercise for rest
        } else {
            highlightRest(-1);
            highlightExercise(step.index);
        }

        startCountdown(() => {
            currentStep++;
            nextStep();
        });
    } else {
        highlightExercise(-1);
        highlightRest(-1);
        endWorkout();
    }
}

function startCountdown(callback) {
    if (countdownInterval) clearInterval(countdownInterval);
    if (timer) clearTimeout(timer);

    countdownInterval = setInterval(() => {
        if (paused) {
            clearInterval(countdownInterval);
            clearTimeout(timer);
            return;
        }
        remainingTime--;
        updateDisplay(currentDisplayText, remainingTime);
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            callback();
        }
    }, 1000);

    timer = setTimeout(() => {
        if (!paused) {
            clearInterval(countdownInterval);
            callback();
        }
    }, remainingTime * 1000);
}

function resumeCountdown() {
    startCountdown(() => {
        currentStep++;
        nextStep();
    });
}

function updateDisplay(text, duration) {
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.innerText = `${text}: ${duration} seconds`;
}

function highlightExercise(index) {
    for (let i = 0; i < exercises; i++) {
        const el = document.getElementById(`exercise-${i}`);
        el.classList.remove("active-exercise");
        el.classList.remove("restHighlight");
        if (i === index) {
            el.classList.add("active-exercise");
        }
    }
}

function highlightRest(index) {
    for (let i = 0; i < exercises; i++) {
        const el = document.getElementById(`exercise-${i}`);
        el.classList.remove("restHighlight");
        if (i === index) {
            el.classList.add("restHighlight");
        }
    }
}

function endWorkout() {
    isRunning = false;
    paused = false;
    clearTimeout(timer);
    if (countdownInterval) clearInterval(countdownInterval);
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.innerText = "Workout Complete!";
    document.getElementById("start-timer").innerText = "Start Workout";
}

document.getElementById("start-timer").addEventListener("click", function () {
    if (!isRunning || paused) {
        startTimer();
    } else {
        pauseTimer();
    }
});