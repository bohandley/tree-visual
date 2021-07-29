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
										// and
										// iterate through options or place textarea
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
                </div>
								</div>
							</div>`

		$("#graphDiv2").html(el);					
	}

	const questionOptionInput = (id, type, option) => {
		return `<input id="${id}" name="question${id}" type="${type}" value="${option}" label="${option}">&#9; ${option}<br>`;
	}

	const questionTextAreaInput = (id) => {
		return `<textarea id="${id}" name="question${id}" style="width:100%;" rows="6" placeholder="Briefly state your answer and explain your decision."></textarea>`;;
	}

	const questionText = (q) => {
		return `<p>${q.text}</p>`;
	}

	const attachQuestionHtml = (q, total) => {
		$("#questionId").text(q.id);
		$("#questions-counter").text("(" + q.id + " of " + total + ")");
		// build the question
		// question text and then
		// either place textarea or
		// iterate through the options
		let type = q.type;

		let question = questionText(q);

		let answers = "";
		if (type == "radio")
			answers = q.options.reduce((acc, el) => acc + questionOptionInput(q.id, q.type, el),"")
		else if (type == "text")
			answers = questionTextAreaInput(q.id);

		$("#questions").html(question + answers + "<hr />");
	}

	const selectLayouts = (q) => {
		
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

	const runQuiz = (questions) => {
		let total = questions.length;
		// questions.forEach(q => {
		let i = 0;
		let q = questions[i];
		
		attachQuestionHtml(q, total);
		// change the dataSets in quizQuestions
		updateDataSelect(q);
		selectLayouts(q);
		i++;
		$("#bNext").on("click", () => {
			// check that an answer has been selected or typed
			if (!hasBeenAnswered(q) && !confirm("The question has not been answered. Proceed anyway?"))
				return

			q = questions[i];
			attachQuestionHtml(q, total);
			// change the dataSets in quizQuestions
			updateDataSelect(q);
			selectLayouts(q);
			i++

			if(i == total) {
				$("#bNext").hide();
				$("#bSubmit").show();
				// TODO: Add a "congratulation page"
			}
		});	
	}

	const hasBeenAnswered = (q) => {
		let type = q.type;

		let hasBeenAnswered = false
		if (type == "radio") {
			$("#questions input").each((idx,el) => {
				if ($(el).is(":checked"))
					hasBeenAnswered = true;
			});
		} else if (type == "text") {
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
