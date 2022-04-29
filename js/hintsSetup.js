var hintsSetup = (function (d3, $) {

	config = {
		// give special hints to layouts that have special features
		specialLayouts: [],
		// prepare the onboarding help steps
		options: { 
			steps: [
				{
					element: ".graphInsideDiv1",
			    intro: "This panel shows the drawing of the tree. Click on a node to select it.",
			    position: "right"
				},
				{
					element: "#widgetsDiv1",
			    intro: "Use these widgets to modify the tree layout.",
			    position: "top"
				},
				{
					element: "#graphInfoDiv",
			    intro: "Here we display the numbers of leaves and accumulated attribute values of leaves.",
			    position: "bottom"
				},
				{
					element: "#dataDropdownIntro",
			    intro: "Here you can select a different data set.",
			    position: "left"
				},
				{
					element: "#appearancePanel",
			    intro: "Toggle to adjust the general appearance of the tree drawing.<br><br>This section and the two sections below can be folded/unfolded.",
			    position: "left"
				},
				{
					 element: "#filterPanel",
			    intro: "Prune tree branches based on the labels of intermediate nodes. This cannot be used when a selection is active.",
			    position: "left"
				},
				{
					element: "#selectionPanel",
			    intro: "Select one leaf or leaves to highlight. Automatically adjust the unselected nodes' opacity.",
			    position: "left"
				},
				{
					element: "#describeDivIntro",
	        intro: "Learn more about the data set here.",
	        position: "left",
	        scrollTo: "tooltip",				},
				{
					element: "#help",
			    intro: "Click 'help?' to review this introduction.",
			    position: "bottom"
				},
			]
		}
	};


	// open folded "Appearance"
	function openSection(targetElement) {
	    if (targetElement.id == "appearancePanel") {
	        $("#filterDiv").collapse("show");
	    }
	}

	// fold "Appearance"
	function foldSection() {
	    $("#filterDiv").collapse("hide");
	}

	function hintList() {
		let intro = introJs();

		intro.setOptions(config.options)
			.start()
			.onbeforechange(function (targetElement) {
				// debugger;
				// resetSection(targetElement, elements1, elements2, currentGraph, graphic1, graphic2, svgs);
			})
			.onchange(function (targetElement) {
				// debugger;
				// resetForBackwards(targetElement, elements1, elements2, currentGraph, graphic1, graphic2, svgs);
				openSection(targetElement);
			})
			.onafterchange(function (targetElement) {
				// debugger;
				// resetFilterBackwards(targetElement, svgs, currentGraph);
			})
			.onexit(() => {
				foldSection()
			});
	}

	function dataFilterHint() {
		let hint = introJs();

		hint.addHints();

		let scrollHandler = addSidebarScrollListener(hint);

		hint.onhintclose(()=> {
			hint.removeHints();
			$("sidebar").off("scroll", scrollHandler);
		})
	}

	// listen to sidebar's scroll event and move the hint
	function addSidebarScrollListener(hint)
	{
	    let scrollHandler = function()
	    {
	        hint.refresh();
	    };
	    $("#sidebar").scroll(scrollHandler);
	    return scrollHandler;
	}

	return {
		onboarding() {
			// if (localStorage.getItem("hasLoadBefore") == null) {
				hintList();
				// localStorage.setItem("hasLoadBefore", true);
			// }
		},

		help() {
			hintList()
		},

		dataFilterHint
	}

})(d3, $);