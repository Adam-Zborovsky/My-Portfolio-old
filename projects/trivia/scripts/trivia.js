let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let questionBatchSize = 10;
let selectedDifficulty = "";

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-btn");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const nextButton = document.getElementById("next-btn");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const scoreElement = document.getElementById("score");

async function fetchQuestions(amount, difficulty) {
    const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map(formatQuestion);
}

function formatQuestion(apiQuestion) {
    const formattedQuestion = {
        question: decodeHTML(apiQuestion.question),
        answers: []
    };
    const answerChoices = [...apiQuestion.incorrect_answers];
    const correctAnswerIndex = Math.floor(Math.random() * (answerChoices.length + 1));
    answerChoices.splice(correctAnswerIndex, 0, apiQuestion.correct_answer);
    formattedQuestion.answers = answerChoices.map(answer => ({
        text: decodeHTML(answer),
        correct: answer === apiQuestion.correct_answer
    }));
    return formattedQuestion;
}

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

async function startGame() {
    if (!selectedDifficulty) {
        alert("Please select a difficulty!");
        return;
    }
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    nextButton.style.display = "block";
    currentQuestionIndex = 0;
    questions = await fetchQuestions(questionBatchSize, selectedDifficulty);
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.textContent = question.question;
    answersElement.innerHTML = "";

    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answersElement.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";

    Array.from(answersElement.children).forEach(button => {
        button.disabled = true;
        button.style.background = button.dataset.correct === "true" ? "#28a745" : "#dc3545";
    });

    if (!correct) {
        setTimeout(() => {
            alert(`Game Over! Your score: ${score}`);
            resetGame();
        }, 1000);
    } else {
        score++;
        scoreElement.textContent = score;
        nextButton.disabled = false;
    }
}

async function setNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        nextButton.disabled = true;
    } else {
        questionBatchSize += 10;
        questions = await fetchQuestions(questionBatchSize, selectedDifficulty);
        currentQuestionIndex = 0;
        showQuestion(questions[currentQuestionIndex]);
        nextButton.disabled = true;
    }
}

async function resetGame() {
    score = 0;
    questionBatchSize = 10;
    scoreElement.textContent = score;
    startScreen.style.display = "flex";
    startScreen.style.flexDirection = "column";
    startScreen.style.justifyContent = "center";
    startScreen.style.alignItems = "center";
    gameScreen.style.display = "none";
    nextButton.style.display = "none";
    startButton.disabled = true;

    difficultyButtons.forEach(button => {
        button.classList.remove("selected");
        button.style.background = "#007aff";
    });
}

// Select difficulty
difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedDifficulty = button.dataset.difficulty;
        difficultyButtons.forEach(btn => {
            btn.classList.remove("selected");
            btn.style.background = "#007aff";
        });
        button.classList.add("selected");
        button.style.background = "#ff9500";
        startButton.disabled = false;
    });
});

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", setNextQuestion);
