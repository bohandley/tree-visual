// set up the containers in treeLib config
treeLib.buildConfig(['g1', 'g2']);

// global variable for dataset, passed to all d3 generators
var FileData;

$(document).ready(function(){
    menu.setupNodesizeScalar();
});


function Remove_nodechildren(id){
    var parent = document.getElementById(id)
    var childrens = parent.childNodes;
    if(childrens != ''){
        for(var i = childrens.length-1; i >=0; i--)
        {
        parent.removeChild(childrens[i]);
        }
    }
}

function change_tiling(type, position){
    change_map(position)
}       

function clearVisualization(position){
    d3.select("#g" + position+ "-div")
        .html("")
        .append("svg")
        .attr("id", "g" + position)
        .attr("viewBox", "0 0 500 500");

    d3.select("svg#g"+position).on('doneDrawing', function(){
        var objS = document.getElementById("dropdown" + position);
        
        // var grade = objS.options[objS.selectedIndex].text;
        var grade = objS.value;
        treeLib.updateConfig(grade,'g'+position);
    });
}

// update both maps if one is changed
function change_map(position){
    var position2 = position == '1' ? '2' : '1';
    var position1 = position == '1' ? '1' : '2';
    
    // resetCfg();

    loadVisualization(position1);

    loadVisualization(position2);
}

function loadVisualization(position){
    
    clearVisualization(position);

    d3.select("#layout" + position + "_treemap").style("visibility", "hidden");

    var objS = document.getElementById("dropdown" + position);
    
    var grade = objS.value;

    if(grade == "Pack"){
        this.draw_pack("#g" + position);
    }
    else if(grade == "Sunburst"){
        this.draw_sunburst("#g" + position);
    }
    else if(grade == "Treemap"){
        d3.select("#layout" + position + "_treemap").style("visibility", "visible");

        this.draw_treemap("#g" + position, document.getElementById("dropdown" + position + "_treemap").selectedIndex);
    }
    else if(grade == "Zoomable_Treemap"){
        this.draw_zoomable_treemap("#g" + position);
        
    }
    else if(grade == "Collapsible_Tree"){
        this.draw_collapsible_tree("#g" + position);
    }
    else if(grade == "Radial_Tree"){
        this.draw_radial_tree("#g" + position);
    }

    

    d3.select("#g"+position).attr("viewBox", function(){
        return "0 0 500 500";
    })
}

var FileName;
var dataSourcePapers, dataSourceCitations;

window.onload = function(){
    var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); };
    var colors = d3.schemeCategory20.map(fader);
    
    treeLib.shuffleArray(colors);
    
    color = d3.scaleOrdinal(colors);

    FileName = menu.changeAuthor(FileName, 1);
    
    loadVisualization("1");
    loadVisualization("2");
        
}

function updateDataset() {
    FileName = menu.changeAuthor(FileName);
    
    change_map("1");
    change_map("2");
}

