const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildQuiz() {
    const output = [];

    shuffle(quizQuestions).forEach((currentQuestion, questionNumber) => {
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
}

buildQuiz();

submitButton.addEventListener('click', showResults);
