var mockQuiz = (function (d3, $, quizQuestions) {

	// - [ ] hide the data select tag
	const hideDataSelect = () => { 
		$("#dataDropdownIntro").hide()
	}
	
	// 	- [ ] fire the select as the questions move
	const updateDataSelect = (q) => {
		let dataSet = q.tree.dataSet;
		$("#dataDropdown option[value='"+ dataSet +"']").prop("selected", true);
		$("#dataDropdown").trigger("change");
	}

	// - [ ] replace the data select with the data description
	const moveDescribeDiv = () => {
		$("#dataPanel").show();

		let dd = $("#describeDivContainer").html();

		$("#dataDiv").html(dd);

		$("#describeDivContainer").html("");

		$("#describeDiv").css("margin-bottom","10px");
	}

	const hideG2Elements = () => {
		// hide the container
		$("#g2-div").css("border", "none");

		$("#g2-div").html();

		// hide the select
		$("#left-widget2").hide();

		$("#graphDiv2").css("line-height", 2);
	}

	const setupQuestionContainer = () => {
		let el = `<div class="container" style="padding-top: 20px; padding-left: 30px;">
					<input id="questionId" value="" type="hidden" style="display: none;" />`+
					// set the value of the question id here
					`<p id="questions-counter"></p>
					<div class="row">
						<div class="col-md-12" id="questions" style="font-family: arial;">`+
							// attach questions here
							// <p>Question text</p>
							// and iterate through options or place textarea
						`</div>
						<hr/>
						<div class="col-md-12 d-flex justify-content-center" id="buttons" style="font-family: arial;">`+
							// display the regular button unless last question, then display submitted button
							`<button style="margin-left: 5px; display: none;" type="button" class="btn btn-success float-right" id="bSubmit" aria-disabled="true">
							Submit
							</button>
							<button type="button" class="btn btn-primary float-right" id="bNext" aria-disabled="true">
							Next
							</button>
							<div class="spinner" id="submit-loading" style="position: absolute; right: 0%; display: none;">
								<div class="rect1"></div>
								<div class="rect2"></div>
								<div class="rect3"></div>
								<div class="rect4"></div>
								<div class="rect5"></div>
							</div>
						</div>
					</div>
				</div>`

		$("#graphDiv2").html(el);

	}

	const hideGraphInterface = () => {
		$("#graphDiv1").hide();
		$("#sidebarInsideDiv").hide();
		$("#graphInfoDiv").hide();
		$("#widgetsDiv1").hide();
		$("#graphsBottomDiv").hide();
		$("#graphDiv2WithWidgets").prop('class', 'col-lg-12');
		$("#questions").prop('class', 'offset-md-1 col-md-10');
	}

	const showGraphInterface = () => {
		$("#graphDiv2WithWidgets").prop('class', 'col-lg-6 col-md-12')
		$("#questions").prop('class', 'col-md-12');
		$("#graphDiv1").show();
		$("#sidebarInsideDiv").show();
		$("#graphInfoDiv").show();
		$("#widgetsDiv1").show();
		$("#graphsBottomDiv").show();
	}

	const questionOptionInput = (id, type, option) => {
		return `<input id="${id}" name="question${id}" type="${type}" value="${option}" label="${option}">&#9; ${option}<br>`;
	}

	const questionTextAreaInput = (id) => {
		return `<textarea id="${id}" name="question${id}" style="width:100%;" rows="6" placeholder="Briefly state your answer and explain your decision."></textarea>`;;
	}

	const questionText = (q, type) => {
		let extra = (type == "checkbox")? "<br>Select all applicable answers." : "";
		let text = `<p>${q.text}${extra}</p>`;
		return text;
	}

	const attachQuestionHtml = (q, total) => {
		$("#questionId").text(q.id);
		$("#questions-counter").text("(" + q.id + " of " + total + ")");
		// build the question
		// question text and then
		// either place textarea or
		// iterate through the options
		let type = q.type;

		let question = questionText(q, type);

		let answers = "";
		if (type == "radio" || type == "checkbox")
			answers = q.options.reduce((acc, el) => acc + questionOptionInput(q.id, q.type, el),"")
		else if (type == "text")
			answers = questionTextAreaInput(q.id);

		$("#questions").html(question + answers + "<hr />");
	}

	const selectLayouts = (q) => {

		if (q.tree.layouts === undefined){
			hideGraphInterface();
			return;
		}

		showGraphInterface();
		
		let selected = q.tree.layouts[0];

		// hide layouts that are not in the layouts collection
		$("#dropdown1").val(selected).trigger("change");

		$("#dropdown1 option").each((idx, el) => {
			if ( q.tree.layouts.includes($(el).val()) )
				$(el).show();
			else
				$(el).hide();
		});
	}

	const runQuiz = (quizQuestions, userId, userLevel, questionNumber) => {
		let questions = quizQuestions.questions,
			quizId = quizQuestions.quizId,
			questionStartTime = (new Date()).getTime();

		let total = questions.length;
		let i = questionNumber;
		let q = questions[i];

		if (i >= total) {
			// The user has finished the quiz
			window.location.replace("/submitted.html");
			return;
		}
		else if (i == total - 1) {
			$("#bNext").hide();
			$("#bSubmit").show();
		}

		const submitAnswer = (isLastQuestion) => {
			// check that an answer has been selected or typed
			if (!hasBeenAnswered(q) && !confirm("The question has not been answered. Proceed anyway?"))
				return;
	
			// if the question was answered, get the end time and send to backend
			let questionEndTime = (new Date()).getTime();
	
			let questionTime = (questionEndTime - questionStartTime)/1000,
				questionNumber = q.id,
				questionText = q.text,
				questionAnswer = q.answer,
				userSubmission;
	
			if(q.type == 'radio') {
				userSubmission = $('#questions input:checked').val();
			}
			else if(q.type == 'checkbox') {
				userSubmission = $('#questions input:checked').get().map(d => d.value).join(';');
			}
			else {
				userSubmission = $('textarea').val();
			}
	
			console.log('quizId: ' + quizId);
			console.log('questionText: ' + questionText);
			console.log('questionAnswer: ' + questionAnswer);
			console.log('questionNumber: ' + questionNumber);
			console.log('userId: ' + userId);
			console.log('userLevel: ' + userLevel);
			console.log('questionTime: ' + questionTime);
			console.log('userSubmission: ' + userSubmission);
			console.log('---------');

			$("#submit-loading").show();
	
			let params = {
				question: {
					"quiz_id": quizId,
					"question_text": questionText,
					"question_answer": questionAnswer,
					"question_number": questionNumber,
					"question_time": questionTime,
					"submission": userSubmission,
				},
				"user_name": userId,
				"user_level": userLevel
			};
			$.post( "http://localhost:3000/questions.json", params, function(data) {
				if (isLastQuestion) {
					window.location.replace("/submitted.html");
					return;
				}
					
				q = questions[i];
				attachQuestionHtml(q, total);
				// change the dataSets in quizQuestions
				updateDataSelect(q);
				selectLayouts(q);
				i++
	
				// quiz completed, show the submit button
				if(i == total) {
					$("#bNext").hide();
					$("#bSubmit").show();
				}
			})
			.fail(function() {
				$("#submit-loading").hide();
				alert( "Cannot submit the answer. Please check your connection and try again." );
			})
			.always(function() {
				$("#submit-loading").hide();
			});
		}
		
		attachQuestionHtml(q, total);
		
		// change the dataSets in quizQuestions
		updateDataSelect(q);
		selectLayouts(q);
		// iterate to the next question
		i++;
		$("#bNext").on("click", () => {
			submitAnswer(false);
		});
    
		$("#bSubmit").on("click", () => {
			submitAnswer(true);			
		});
	}

	const hasBeenAnswered = (q) => {
		let type = q.type;

		let hasBeenAnswered = false
		if (type == "radio" || type == "checkbox") {
			$("#questions input").each((idx,el) => {
				if ($(el).is(":checked"))
					hasBeenAnswered = true;
			});
		}
		else if (type == "text") {
			hasBeenAnswered = $("#questions textarea").val() != "";
		}
		
		return hasBeenAnswered;
	}		
// create a quiz
	// has a user
	// has a start time
	// user can answer
		// send to back end
			// user name, id, question number, answer
	// user can skip
		// user confirm() to skip question
	// on the final question, submit to switch html to show "quiz completed"


// - [x] replace the right diagram with a question
// - [ ] a question has
// 	- [x] a data set
// 		- [x] updates the data set in the menu
// 		- [x] loads the data description
// 	- [x] a selected tree diagram
// 		- [x] still allowed to switch the tree diagram
// 	- [x] text 
// 	- [x] has a set of answers 
// 	- [ ] has a correct answer for a question
	// - [ ] how will we store the answers?
// 	- [x] has a type, radio, text, etc
// 	- [x] an order
// - [ ] accepts an event for each question to click an answer
// - [ ] submit an answer with name and quiz type
				// submit chosen answer and correct answer?
				// analyze how they did?
// - [ ] has a backend that takes an answer

	return {
		hideDataSelect,
		updateDataSelect,
		moveDescribeDiv,
		hideG2Elements,
		setupQuestionContainer,
		runQuiz
	}

})(d3, $, quizQuestions.questions);
