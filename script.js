const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const timerElement = document.getElementById('time');

const quizQuestions = [
    {
        question: "What is the first book of the Bible?",
        answers: {
            a: 'Genesis',
            b: 'Exodus',
            c: 'Leviticus'
        },
        correctAnswer: 'a'
    },
    {
        question: "Who led the Israelites out of Egypt?",
        answers: {
            a: 'Abraham',
            b: 'Moses',
            c: 'David'
        },
        correctAnswer: 'b'
    },
    {
        question: "How many days did God take to create the world?",
        answers: {
            a: '5',
            b: '6',
            c: '7'
        },
        correctAnswer: 'b'
    }
];

let timer;
let attempts = 0;
const maxAttempts = 3;

function buildQuiz() {
    const output = [];
    quizQuestions.forEach((currentQuestion, questionNumber) => {
        const answers = [];
        for (letter in currentQuestion.answers) {
            answers.push(
                `<label>
                    <input type="radio" name="question${questionNumber}" value="${letter}">
                    ${letter} :
                    ${currentQuestion.answers[letter]}
                </label>`
            );
        }
        output.push(
            `<div class="question">${currentQuestion.question}</div>
            <div class="answers">${answers.join('')}</div>`
        );
    });
    quizContainer.innerHTML = output.join('');
}

function showResults() {
    const answerContainers = quizContainer.querySelectorAll('.answers');
    let numCorrect = 0;
    quizQuestions.forEach((currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
        if (userAnswer === currentQuestion.correctAnswer) {
            numCorrect++;
            answerContainers[questionNumber].style.color = 'green';
        } else {
            answerContainers[questionNumber].style.color = 'red';
        }
    });
    resultsContainer.innerHTML = `${numCorrect} out of ${quizQuestions.length}`;
    clearInterval(timer); // Stop the timer when results are shown
    attempts++;
    if (attempts >= maxAttempts) {
        submitButton.disabled = true;
        resultsContainer.innerHTML += "<br>You have reached the maximum number of attempts.";
    } else {
        // Reset the timer and allow for another attempt
        startTimer();
    }
}

function startTimer() {
    let timeLeft = 60;
    timerElement.textContent = timeLeft;
    clearInterval(timer); // Clear any existing timer
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResults();
        } else {
            timeLeft--;
            timerElement.textContent = timeLeft;
        }
    }, 1000);
}

buildQuiz();
startTimer();
submitButton.addEventListener('click', showResults);
