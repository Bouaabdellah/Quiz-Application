// select element
let answersArea = document.querySelector(".answers-area");
let quizArea = document.querySelector(".quiz-area");
let category = document.querySelector(".info .category span");
let spanQuestionsNumber = document.querySelector(".info .count > span");
let bulletsContainer = document.querySelector(".bulllets .spans");
let submitButton = document.getElementById("submit-button");
let result = document.querySelector(".result");
let timer = document.querySelector(".countdown");
// set right and wrong answers
let sumRightAnswers = 0, sumWrongAnswers = 0;
// set timer duration
let duration = 60, timerDown;
// Function to shuffle the array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// generate my data
let questionsNumber = 10;
function displayAnswers(currentQ,array,indexOfcq){
    for (let i = 1; i <= array.length; i++){
        let input = document.createElement("input");
        input.type = "Radio";
        input.id = `answer-${i}`;
        input.name = `answers-${indexOfcq}`;
        let label = document.createElement("label");
        label.textContent = currentQ[array[i-1]];
        label.setAttribute("for",`answer-${i}`);
        let answer = document.createElement("div");
        answer.classList.add("answer");
        answer.appendChild(input);
        answer.appendChild(label);
        answersArea.appendChild(answer);
    };
};
// add the question
function addQuestions(currentQ, indexOfcq){
    // add category
    category.innerHTML = currentQ.category;
    // add question
    let theQuestion = document.createElement("h2");
    theQuestion.textContent = currentQ.title;
    quizArea.appendChild(theQuestion);
    // add the answers
    let answer = /answer-\d/;
    let array = [];
    for (let value in currentQ)
        if (answer.test(value))
        array.push(value);
    shuffle(array);
    displayAnswers(currentQ,array,indexOfcq);
};
// show result
function showResult(){
    submitButton.remove();
    quizArea.remove();
    answersArea.remove();
    document.querySelector(".info").remove();
    let bulletsContainer = document.querySelector(".bulllets").remove();
    let degree = document.createElement("span");
    let percent = sumRightAnswers * 100 / questionsNumber;
    if (percent >= 80){
        degree.innerHTML = "Perfect";
        degree.className = "perfect";
    }
    else if (percent <= 40){
        degree.innerHTML = "bad";
        degree.className = "bad";
    }
    else{
        degree.innerHTML = "good";
        degree.className = "good";
    }
    let textResult = document.createTextNode(`you answer ${sumRightAnswers} from ${questionsNumber} questions`);
    result.appendChild(degree);
    result.appendChild(textResult);
    result.style.display = "block";
};
// check answer
let cmp = 0;
function checkAnswer(questionsObeject,array){
    submitButton.addEventListener("click", () =>{
        clearInterval(timerDown);
        let indexOfcq = array[cmp];
        let labelOfCheckedInput = document.querySelector(`input[name = answers-${indexOfcq}]:checked + label`);
        let rightAnswer = questionsObeject[indexOfcq]["right-answer"];
        if (labelOfCheckedInput !== null){
        if (labelOfCheckedInput.textContent === rightAnswer){
            sumRightAnswers++;
            labelOfCheckedInput.parentElement.classList.add("right-answer");
        }
        else{
            sumWrongAnswers++;
            labelOfCheckedInput.parentElement.classList.add("wrong-answer");
        }
        }
        else
        sumWrongAnswers++;
        // remove the current
        answersArea.textContent = "";
        quizArea.textContent = "";
        bulletsContainer.children[cmp].classList.remove("active")
        // move to the next question
        if (cmp < questionsNumber-1){
            cmp ++;
            // add a bullet
            bulletsContainer.children[cmp].classList.add("completed","active");
            addQuestions(questionsObeject[array[cmp]],array[cmp]);
            countdown(duration,cmp);
        }
        else
            showResult();
    })
};
function getData(){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (this.status === 200 && this.readyState === 4){
            let questionsObeject = JSON.parse(this.responseText);
            let allQustions = questionsObeject.length;
            // we do this array to make the question randomly
            let array = [];
            for (let i = 0; i < allQustions; i++)
                array.push(i);
            shuffle(array);
            if (cmp < questionsNumber){
            let currentQuestion = array[cmp];
            addQuestions(questionsObeject[currentQuestion], currentQuestion);
            checkAnswer(questionsObeject,array);
            }
        }
    };
    request.open("GET","questions.json");
    request.send();
};
getData();

// generate number of questions
function createBullets(qn){
        spanQuestionsNumber.innerHTML = qn;
        for (let i = 0; i < qn; i++){
            let bullet = document.createElement("span");
            bulletsContainer.appendChild(bullet);
        }
        bulletsContainer.firstChild.classList.add("completed","active");
}
createBullets(questionsNumber);

// set time 
function countdown(duration,currentQ){
    if (currentQ < questionsNumber){
        timerDown = setInterval(() => {
        if (duration >= 0){
        timer.innerHTML = "";
        let minutes = parseInt(duration / 60), seconds = parseInt(duration % 60);
        let minuteSpan = document.createElement("span");
        let secondSpan = document.createElement("span");
        if (minutes < 10)
            minuteSpan.innerHTML = `0${minutes} : `;
        else
            minuteSpan.innerHTML = `${minutes} : `;
        if (seconds < 10)
            secondSpan.innerHTML = `0${seconds}`;
        else
            secondSpan.innerHTML = `${seconds}`;
        timer.appendChild(minuteSpan);
        timer.appendChild(secondSpan);
        duration -= 1;
        }
        else{
            submitButton.click();
        }
    }, 1000)
};
};
countdown(duration,cmp);