class Stopwatch {
    constructor(displayElement, startStopButton, resetButton) {
        this.displayElement = displayElement;
        this.startStopButton = startStopButton;
        this.resetButton = resetButton;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.interval = null;

        this.startStopButton.addEventListener('click', () => this.toggle());
        this.resetButton.addEventListener('click', () => this.reset());
    }

    formatTime(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        const milliseconds = ms % 1000;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;
    }

    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.interval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.displayElement.textContent = this.formatTime(this.elapsedTime);
        }, 10);
        this.isRunning = true;
        this.startStopButton.textContent = "Stop";
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.startStopButton.textContent = "Start";
    }

    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.displayElement.textContent = "00:00:00:000";
    }
}
class CountdownTimer {
    constructor(displayElement, startStopButton, resetButton, quickTimerButtons, inputElement) {
        this.displayElement = displayElement;
        this.startStopButton = startStopButton;
        this.resetButton = resetButton;
        this.quickTimerButtons = quickTimerButtons;
        this.inputElement = inputElement;
        this.remainingTime = 0;
        this.isRunning = false;
        this.interval = null;

        this.startStopButton.addEventListener('click', () => this.toggle());
        this.resetButton.addEventListener('click', () => this.reset());

        this.quickTimerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const minutes = parseInt(button.innerText.split()[0]);
                this.setQuickTimer(minutes);
            });
        });
    }

    start(inputMinutes = 0) {
        if (inputMinutes === 0) {
            inputMinutes = parseInt(this.inputElement.value);
        }

        if (isNaN(inputMinutes) || inputMinutes <= 0) {
            alert("Please enter a valid number of minutes.");
            return;
        } else {
            this.remainingTime = inputMinutes * 60;
        }

        this.updateDisplay();
        this.interval = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            if (this.remainingTime <= 0) {
                clearInterval(this.interval);
                alert("Countdown finished!");
                this.isRunning = false;
                this.startStopButton.innerText = "Start";
            }
        }, 1000);

        this.isRunning = true;
        this.startStopButton.innerText = "Stop";
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.startStopButton.innerText = "Start";
    }

    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    reset() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.remainingTime = 0;
        this.updateDisplay();
        this.startStopButton.innerText = "Start";
        this.inputElement.value = '';
    }

    updateDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.displayElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    setQuickTimer(minutes) {
        this.reset();
        this.start(minutes);
    }
}

class TimerUtils{
    static formatTimeMinutes(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
    
    }
}


class PomodoroTimer{
    constructor(displayElement, startButton, resetButton) {
        this.displayElement = displayElement;
        this.startButton = startButton;
        this.resetButton = resetButton;
        this.isRunning = false;
        this.isBreak = false;
        this.interval = null;
        this.workTime = 25 * 60;
        this.breakTime = 5 * 60;
        this.remainingTime = this.workTime;

        this.startButton.addEventListener('click', () => this.toggle());
        this.resetButton.addEventListener('click', () => this.reset());
    }

    start() {
        this.interval = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            if (this.remainingTime <= 0) {
                clearInterval(this.interval);
                this.isRunning = false;
                this.switchMode();
            }
        }, 1000);
        this.isRunning = true;
        this.startButton.textContent = "Stop";
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.startButton.textContent = 'Start';
    }

    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
    reset() {
        this.stop();
        this.isBreak = false;
        this.remainingTime = this.workTime;
        this.updateDisplay();
        this.startButton.textContent = "Start";
    }

    switchMode() {
        if (this.isBreak) {
            this.remainingTime = this.workTime;
            this.isBreak = false;
            alert("Work time! Get back to work.");
        } else {
            this.remainingTime = this.breakTime;
            this.isBreak = true;
            alert("Break time! Take some rest.");
        }
        this.updateDisplay();
        this.start();
    }

    updateDisplay() {
        this.displayElement.textContent=TimerUtils.formatTimeMinutes(this.remainingTime)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const pomodoroDisplay = document.querySelector(".pomodoro-timer h3");
    const pomodoroStartBtn = document.querySelector('#pomodoro-start-btn');
    const pomodoroResetBtn = document.querySelector('#pomodoro-reset-btn');
    new PomodoroTimer(pomodoroDisplay, pomodoroStartBtn, pomodoroResetBtn);
});


document.addEventListener("DOMContentLoaded", () => {
    // Stopwatch initialization
    const stopwatchDisplay = document.querySelector(".stopwatch-timer h3");
    const startStopBtn = document.querySelector("#stopwatch-start-stop-btn");
    const resetBtn = document.querySelector("#stopwatch-reset-btn");
    const stopwatch = new Stopwatch(stopwatchDisplay, startStopBtn, resetBtn);

    // Countdown Timer initialization
    const countdownDisplay = document.querySelector("#countdown-display");
    const countdownStartStopBtn = document.querySelector("#countdown-start-stop-btn");
    const countdownResetBtn = document.querySelector("#countdown-reset-btn");
    const quickTimerBtns = document.querySelectorAll(".quick-timer-btn");
    const inputElement = document.querySelector("#set-time-input");
    const countdownTimer = new CountdownTimer(countdownDisplay, countdownStartStopBtn, countdownResetBtn, quickTimerBtns, inputElement);

    // Pomodoro Timer initialization
    const pomodoroDisplay = document.querySelector(".pomodoro-timer h3");
    const pomodoroStartBtn = document.querySelector('#pomodoro-start-btn');
    const pomodoroResetBtn = document.querySelector('#pomodoro-reset-btn');
    const pomodoroTimer = new PomodoroTimer(pomodoroDisplay, pomodoroStartBtn, pomodoroResetBtn);

    // Update current time display
    function updateClock() {
        const currentDate = new Date();
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentSeconds = currentDate.getSeconds();
        const currentTime = `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}:${String(currentSeconds).padStart(2, "0")}`;
        document.querySelector('.display-current-time h2').textContent = currentTime;
    }

    setInterval(updateClock, 1000);
    updateClock();
});
