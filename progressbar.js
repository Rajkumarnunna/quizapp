function updateProgress(questionNumber) {
    const progress = (questionNumber / quizQuestions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

function buildQuiz() {
    const output = [];
    shuffle(quizQuestions).forEach((currentQuestion, questionNumber) => {
        updateProgress(questionNumber);
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
