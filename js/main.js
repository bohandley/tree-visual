// set up the containers in treeLib config
treeLib.buildConfig(["g1", "g2"]);

// global variable for dataset, passed to all d3 generators in the future
var dataGlobal,
    leavesGlobals,
    dataFilterSubsetGlobal;;

let MODE = "Study";

// if QUIZPREP, send QUIZPREP to backend for each question
// 	so when we can keep track of QUIZPREP questions order(navigating away from page and returning)
//	vs
//	the actual quiz. 
const QUIZPREP = 1;

$(document).ready(function () {
	
	// show the modal to decide on the quiz
	$("#quizModal").modal("show");

	// hide quiz for no
	$("#study-mode").on("click", function(){
		$("#quizModal").modal("hide");
	});

	// if user decides to take quiz
	$("#take-quiz").on("click", function(){
		// quiz user data
		let userId = $("#user-id").val(),
			userLevel = $("#user-level").val();

		if(!userId || !userLevel){
			alert("Please complete the quiz information before continuing.");
			return;
		}

        $("#loading").show();

        $("#take-quiz").attr("disabled", true);
        $("#study-mode").attr("disabled", true);
        $('#quizModal').data('bs.modal')._config.backdrop = 'static';

		// api call to backend to store userId, userLevel, userEmail address
		// if user has already tried to take the quiz, return the question they 
		// most recently completed
		// two possibilities
			// quizprep keeps track of questions done before the formal quiz
			// QUIZPREP == 0 is the formal quiz
		let params = {
			user: {
				user_name: userId,
				user_level: userLevel,
				quiz_prep: QUIZPREP
			}
		};

		$.post( "https://tree-vis-quiz-api.herokuapp.com/users.json", params, function(data) {
		// $.post( "http://localhost:3000/users.json", params, function(data) {
            let questionNumber = 0;
            if(data.update && data.questions.length > 0) {
                let qNums = data.questions.map(q => q.question_number).sort();
                questionNumber = qNums[qNums.length - 1];
            }

            $("#quizModal").modal("hide");

            MODE = 'Mock Quiz';

            var questions = quizQuestions;

            if(+QUIZPREP)
            	questions = quizPrepQuestions;
                
            mockQuiz.hideDataSelect();
            mockQuiz.hideG2Elements();
            mockQuiz.setupQuestionContainer();
            mockQuiz.moveDescribeDiv();
            mockQuiz.runQuiz(questions, userId, userLevel, questionNumber);
		})
	    .fail(function() {
	        alert( "Cannot enter the quiz. Please check your connection and try again." );
	    })
	    .always(function() {
	        $("#loading").hide();
            $("#take-quiz").attr("disabled", false);
            $("#study-mode").attr("disabled", false);
            $('#quizModal').data('bs.modal')._config.backdrop = true;
	    });
	});
    
    updateDataTypeAndFileName();
    menu.setupCheckBoxes();

    setupSliderValueTooltip();

    setupToolTips();

    // only load the onboarding if user chooses study mode
    // and has not seen the onboarding before
    $("#study-mode").on("click", function(){
        setupOnboarding();
    });

    // if (MODE == "Mock Quiz") {
    //     mockQuiz.hideDataSelect();
    //     mockQuiz.hideG2Elements();
    //     mockQuiz.setupQuestionContainer();
    //     // updateDataSelect
    //     mockQuiz.moveDescribeDiv();
    //     mockQuiz.runQuiz(quizQuestions.questions);
    // }
    // after the dataFilterSubset has completed, the spc event is called
    $(document).on("spc", function (e) {
        addSelectpickerTitles();

        setupFilterEvent();

        menu.changeDataset(1);

        menu.dataTypeSpanText();

        loadVisualization("1");
        
        loadVisualization("2");

    });
});

function setupOnboarding() {
    hintsSetup.onboarding();

    $("#help").on("click", function(){
        hintsSetup.help();
    });
}

function Remove_nodechildren(id) {
    var parent = document.getElementById(id);
    var childrens = parent.childNodes;
    if (childrens != "") {
        for (var i = childrens.length - 1; i >= 0; i--) {
            parent.removeChild(childrens[i]);
        }
    }
}

function change_tiling(type, position) {
    change_map(position);
}

function clearVisualization(position) {
    d3.select("#g" + position + "-div")
        .html("")
        .append("svg")
        .attr("id", "g" + position)
        .attr("viewBox", "0 0 500 500");

    d3.select("svg#g" + position).on("doneDrawing", function () {
        var objS = document.getElementById("dropdown" + position);

        // var grade = objS.options[objS.selectedIndex].text;
        var grade = objS.value;
        treeLib.updateConfig(grade, "g" + position);
    });
}

// update both maps if one is changed
function change_map(position) {
    // unlock the changed map
    // menu.unlockPosition(position);

    // what does the locked element mean for this?
    menu.resetLeafSelection();

    // which map was changed?
    var position2 = position == "1" ? "2" : "1";
    var position1 = position == "1" ? "1" : "2";

    // resetCfg();
    // reset both maps when one layout is changed
    // remember to lock the choices???
    // var locked1 = menu.isLocked(position1);
    // var locked2 = menu.isLocked(position2);
    
    // loadVisualization(position)
    loadVisualization(position1);//, locked1);

    loadVisualization(position2);//, locked2);
}

function loadVisualization(position){//, locked) {
    if (MODE != "Study" && position == "2")
        return

    clearVisualization(position);

    // hide specific tags for treemap and radial trees
    $("#layout" + position + "_treemap").addClass("hide-tag");
    $("#nodeSizeDiv" + position + "_radialtree").addClass("hide-tag");
    $("#edgeThicknessDiv" + position + "_radialtree").addClass("hide-tag");

    // various resets on changing a layout unless locked
    // if (!locked) {
    //     // menu.resetProportionalSize(position);
    // }

    var objS = document.getElementById("dropdown" + position);

    var grade = objS.value;

    if (grade == "Pack") {
        this.draw_pack("#g" + position);
    } else if (grade == "Sunburst") {
        this.draw_sunburst("#g" + position);
    } else if (grade == "Treemap") {
        $("#layout" + position + "_treemap").removeClass("hide-tag");

        this.draw_treemap("#g" + position, document.getElementById("dropdown" + position + "_treemap").selectedIndex);
    } else if (grade == "Zoomable_Treemap") {
        this.draw_zoomable_treemap("#g" + position);
    } else if (grade == "Collapsible_Tree") {
        $("#nodeSizeDiv" + position + "_radialtree").removeClass("hide-tag");
        $("#edgeThicknessDiv" + position + "_radialtree").removeClass("hide-tag");
        this.draw_collapsible_tree("#g" + position);
    } else if (grade == "Radial_Tree") {
        $("#nodeSizeDiv" + position + "_radialtree").removeClass("hide-tag");
        $("#edgeThicknessDiv" + position + "_radialtree").removeClass("hide-tag");
        this.draw_radial_tree("#g" + position);
    }

    d3.select("#g" + position).attr("viewBox", function () {
        return "0 0 500 500";
    });
}

window.onload = function () {
    // menu.changeDataset(1);

    // menu.dataFilterSubset();

    // menu.dataTypeSpanText();

    // loadVisualization("1");
    // loadVisualization("2");
};

function updateDataTypeAndFileName() {
    // get the filename and datatype for the initial dataset
    d3.select('#dataDropdown')
        .selectAll('optgroup')
        .data(datasetDescription)
        .enter().append('optgroup')
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .selectAll('option')
        //.data(d => d.options.filter(op => MODE == "Study"? op.mode == MODE : true))
        .data(d => d.options)
        .enter().append('option')
        .attr('value', d => d.value)
        .attr('data', d => d.data)
        .text(d => d.name);
    
    if(MODE == "Study"){
        let all_options = d3.select('#dataDropdown')
            .selectAll('option');
        let study_options = all_options.filter(d => d.mode == MODE),
            quiz_options = all_options.filter(d => d.mode != MODE);

        quiz_options.attr('hidden', 'hidden');
        // choose a dataset that is not filtered in the start
        let initialSelected = d3.select(study_options.nodes()[3]);
        // let initialSelected = d3.select(study_options.node());
        initialSelected.attr('selected', 'selected');

        updateDataset();

    }   

}

function updateDataset() {

    // allow user to select from intermediate levels of nodes
    // and only display them in the graph
    // 1. iterate through data
    // 2. make a collection of of distinct nodes from each level
    // 3. build a multiselect for each level from the nodes
    // 4. filter dataset on load of json

    let objD = $('#dataDropdown option:selected');
    let selectedDataValue = objD.attr('value');
    let filename = "datasets/" + selectedDataValue + ".txt";
    menu.updateConfig("filename", filename);

    let selectedDataType = objD.attr('data');
    menu.updateConfig("dataType", selectedDataType);

    menu.dataFilterSubset();
}

function setupFilterEvent() {
    $("#filter-levels").on("click", function () {
        // var locked1 = menu.isLocked("1");
        // var locked2 = menu.isLocked("2");

        menu.resetLeafSelection();

        loadVisualization("1");//, locked1);

        loadVisualization("2");//, locked2);
    });        

}

function addSelectpickerTitles() {
    // add the titles to the menus only after the selectpickers have been drawn
    setTimeout(_=> {

        leavesGlobals.forEach((opt,i) => {
            var option = $('#selectpicker-leaf-selection').find('ul.dropdown-menu li')[i];

            $(option).prop("title", opt.text);
        });

        Object.keys(dataFilterSubsetGlobal).forEach(level => {
            dataFilterSubsetGlobal[level].forEach((subset,i) => {
                var option = $('#selectpicker-filter-level-' + level).find('ul.dropdown-menu li')[i];

                $(option).prop("title", subset);
            });
            
        });
    }, 1000)
}

function setupSliderValueTooltip() {
    sidebarSliderDivs = ["#nodesizeScalarDiv", "#nodeDegreeDiv"];
    sliderDivs = sidebarSliderDivs;
    $.each(sliderDivs, function (index, sliderDiv) {
        setupEachSlider(sliderDiv);
    });
}

// set up one slider's value displaying effect
function setupEachSlider(sliderDivName) {
    var sliderDiv = $(sliderDivName),
        slider = $("input", sliderDiv),
        valueText = $(".sliderValue", sliderDiv),
        thumbwidth = 20;

    function setTooltip() {
        var value = slider.val();
        var percent = (value - slider.attr("min")) / (slider.attr("max") - slider.attr("min"));
        var thumbCorrect = thumbwidth * (percent - 0.5) * -1,
            textPos = Math.round(percent * slider.width() - thumbwidth / 4 + thumbCorrect);
        valueText.css("left", textPos);
        valueText.css("top", 25);
        valueText.text(value);
    }

    function setSliderEvent() {
        slider.on("input.slider change.slider keyup.slider mouseover.slider", function () {
            setTooltip();
            valueText.css("visibility", "visible");
        });

        slider.on("mouseout.slider", function () {
            valueText.css("visibility", "hidden");
        });

        // when window size changes
        $(window).on("resize.slider", function () {
            setTooltip();
        });
    }

    setSliderEvent();
}

/**
 * initiates the hover tool tips
 */
function setupToolTips() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        // initiate footer tooltip, and set hidden
        //updateFooterText(TOOLTIP.SVG_HOVER, "hidden");
    });
}

/**
 * mouseover and mouseout handler for showing and hiding tooltips
 */
function mouseOverOut(element, text) {
    element.on("mouseover", () => updateFooterText(text, "visible")).on("mouseout", () => updateFooterText(text, "hidden"));
}
