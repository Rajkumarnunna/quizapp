let timeLeft = 60;
const timerElement = document.getElementById('time');

function startTimer() {
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResults();
        } else {
            timeLeft--;
            timerElement.textContent = timeLeft;
        }
    }, 1000);
}

startTimer();
