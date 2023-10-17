//main.js

//get app display
var appDisplay = document.getElementById("appDisplay");

//create questions global variable
var quiz;
var scores;
var checkedAnswers = false;

//create menu
function createMenu(){
	//clear menu display
	appDisplay.innerHTML = "";
	
	//set html string
	var htmlString = "<h2>Menu</h2>";
	htmlString += "<h3>Please Choose An Option From The List Below:</h3>";
	htmlString += "<button onclick=\"startQuiz('databases1RelationalAlgebra.json')\">Test Quiz</button>";

	//set app display inner html
	appDisplay.innerHTML = htmlString;
};

var test;

//start quiz
function startQuiz(fileName){
	//reset question data
	questionNumber = 0;
	questionPart = 0;
	scores = [];
	
	//get JSON file for quiz
	var xmlHttp = new XMLHttpRequest();
	
	//set callback function
	xmlHttp.onreadystatechange = function(){
		//check that resposne worked
		if(this.readyState == 4 && this.status == 200){
			//get response text
			quiz = JSON.parse(this.responseText);
			console.log(this.responseText);
		
			//start quiz properly
			startQuestion(0, 0);
		};
	};
	
	//start request
	xmlHttp.open("GET", fileName, true);
	xmlHttp.send();
};

//start question
function startQuestion(num, part){
	//reset checked answers
	checkedAnswers = false;
	
	//set global variables
	questionNumber = num;
	questionPart = part;
	
	//set question to question num
	var htmlStr = "<h2>Question: " + (num + 1) + "</h2>";
	htmlStr += "<h3>" + quiz.questions[num].questionStr + "</h3>";
	
	//check for images
	if(quiz.questions[num].imgStr != ""){
		//add image
		htmlStr += "<img src=\"" + quiz.questions[num].imgStr + "\">";
	};
	
	//add question box
	//htmlStr += "<p style=\"display:inline-block\">Complete the answer: </p>";
	
	//get answer str
	var answerCounter = 0;
	var answerStr = quiz.questions[num].answerStr;
	while(answerStr.indexOf(quiz.blankStr) > -1){
		answerStr = answerStr.replace(quiz.blankStr, "<input style=\"display:inline-block\" type=\"text\" size=\"" + quiz.questions[num].answers[answerCounter][0].length + "\" id='ans" + answerCounter + "'></input>");
		//answerStr = answerStr.replace(quiz.blankStr, "<textarea oninput=\"this.value = this.value.replace(/\n/g, '')\" wrap=\"off\" style=\"display:inline-block; resize:none;\" rows=\"1\" cols=" + quiz.questions[num].answers[0][0].length + " id='ans" + answerCounter + toString(answerCounter) +  "'></textarea>");
		
		answerCounter += 1;
		console.log(answerStr);
	};
	
	//add answer string
	htmlStr += answerStr;
	
	//add check answers button
	htmlStr += "<br/><br/><button onclick=\"checkAnswers()\">Check Answers</button>";
	
	//set app display
	appDisplay.innerHTML = htmlStr;
};

//check answers
function checkAnswers(){
	if(!checkedAnswers){
		//score
		var questionScore = 0;
	
		//iterate through text boxes
		for(i = 0; i < quiz.questions[questionNumber].answers.length; i++){
			//check if answer is correct
			var userAnswer = document.getElementById("ans" + i).value;
			var correct = false;
		
			for(j = 0; j < quiz.questions[questionNumber].answers[i].length; j++){
				if(userAnswer.toLowerCase().replaceAll(" ", "") == quiz.questions[questionNumber].answers[i][j].toLowerCase().replaceAll(" ", "")){
					//correct - set question to green
					document.getElementById("ans" + i).style.color = "green";
					document.getElementById("ans" + i).disabled = true;
					correct = true;
					questionScore += 1;
					break;
				};
			};
		
			if(!correct){
				console.log("test");
				document.getElementById("ans" + i).style.color = "red";
				document.getElementById("ans" + i).value = quiz.questions[questionNumber].answers[i][0];
				document.getElementById("ans" + i).disabled = true;	
			};
		};
	
		console.log("argj");
	
		//add question to scores
		scores.push([quiz.questions[questionNumber].questionStr, questionScore, quiz.questions[questionNumber].answers.length]);
	
		//add score feedback
		var feedback = document.createElement("h3");
		feedback.innerHTML = "<h3>You scored " + questionScore + " out of " + quiz.questions[questionNumber].answers.length + ".</h3><br/><button onclick=\"nextQuestion()\">Next Question</button>";
		appDisplay.appendChild(feedback);
		
		checkedAnswers = true;
	};
};

//next question
function nextQuestion(){
	//increment question number by 1
	if(questionNumber + 1 > quiz.questions.length - 1){
		//go to feedback
		feedbackScreen();
	} else {
		startQuestion(questionNumber + 1, 0);
	};
};


//feedback screen
function feedbackScreen(){
	//add feedback
	var htmlString = "<h1>You completed the quiz!</h1>";
	
	var userScore = 0;
	var totalScore = 0;
	var scoreReport = "";
	
	for(i = 0; i < scores.length; i++){
		userScore += scores[i][1];
		totalScore += scores[i][2];
		scoreReport += "<p>On question: \"" + scores[i][0] + "\", you scored " + scores[i][1] + " out of " + scores[i][2] + ".</p>"
	};
	
	htmlString += "You scored " + userScore + " out of " + totalScore + ".";
	
	htmlString += scoreReport;
	
	htmlString += "<br/><button onclick=\"createMenu()\">Return to Menu</button>";
	
	appDisplay.innerHTML = htmlString;
};

//create menu
createMenu();