// set up the containers in treeLib config
treeLib.buildConfig(["g1", "g2"]);

// global variable for dataset, passed to all d3 generators in the future
var dataGlobal,
    leavesGlobals,
    dataFilterSubsetGlobal;

$(document).ready(function () {
    updateDataTypeAndFileName();
        
    menu.setupCheckBoxes();

    setupSliderValueTooltip();
    setupToolTips();

    menu.dataFilterSubset();
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
    menu.unlockPosition(position);

    // what does the locked element mean for this?
    menu.resetLeafSelection();

    // which map was changed?
    var position2 = position == "1" ? "2" : "1";
    var position1 = position == "1" ? "1" : "2";

    // resetCfg();
    // reset both maps when one layout is changed
    // remember to lock the choices???
    var locked1 = menu.isLocked(position1);
    var locked2 = menu.isLocked(position2);

    loadVisualization(position1, locked1);

    loadVisualization(position2, locked2);
}

function loadVisualization(position, locked) {
    clearVisualization(position);

    // hide specific tags for treemap and radial trees
    $("#layout" + position + "_treemap").addClass("hide-tag");
    $("#nodeSizeDiv" + position + "_radialtree").addClass("hide-tag");
    $("#edgeThicknessDiv" + position + "_radialtree").addClass("hide-tag");

    // various resets on changing a layout unless locked
    if (!locked) {
        menu.resetProportionalSize(position);
    }

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
    var objD = document.getElementById("dataDropdown");

    var dataType = d3.select(objD.selectedOptions[0]).attr("data");

    // update the stored dataType in menu config
    menu.updateConfig("dataType", dataType)

    // update the selected node in treeLib
    treeLib.displayedNode(objD.value);

    var filename = "datasets/" + objD.value + ".txt";

    // update the stored filename in menu config
    menu.updateConfig("filename", filename)
}

function updateDataset() {
    updateDataTypeAndFileName();
    // allow user to select from intermediate levels of nodes
    // and only display them in the graph
    // 1. iterate through data
    // 2. make a collection of of distinct nodes from each level
    // 3. build a multiselect for each level from the nodes
    // 4. filter dataset on load of json

    menu.dataFilterSubset();

    $(document).on("spc", function (e) {
        addSelectpickerTitles();

        menu.resetLeafSelection();

        menu.changeDataset();

        menu.dataTypeSpanText();

        var locked1 = menu.isLocked("1");
        var locked2 = menu.isLocked("2");

        loadVisualization("1", locked1);

        loadVisualization("2", locked2);
    });
}

function setupFilterEvent() {
    $(document).on("spc", function (e) {
        $("#filter-levels").on("click", function () {
            var locked1 = menu.isLocked("1");
            var locked2 = menu.isLocked("2");

            menu.resetLeafSelection();

            loadVisualization("1", locked1);

            loadVisualization("2", locked2);
        });        
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
