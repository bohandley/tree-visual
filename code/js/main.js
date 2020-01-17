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

function change_author(){
    var objD = document.getElementById("dataDropdown");
    FileName = "../datasets/" + objD.options[objD.selectedIndex].text + ".txt";

    document.getElementById("enter_authorname").innerHTML = objD.options[objD.selectedIndex].text;
    change_num();

    change_map("1");
    change_map("2");
}

function change_tiling(position){
    Remove_nodechildren("g" + position);
    draw_treemap("#g" + position, document.getElementById("dropdown" + position + "_treemap").selectedIndex);
}

function change_map(position){
    d3.select("#layout" + position + "_treemap").style("visibility", "hidden");

    var objS = document.getElementById("dropdown" + position);
    var grade = objS.options[objS.selectedIndex].text;
    if(grade == "Circle"){
        Remove_nodechildren("g"+position);
        draw_circle("#g" + position);
    }
    else if(grade == "Sunburst"){
        Remove_nodechildren("g"+position);
        draw_sunburst("#g" + position);
    }
    else if(grade == "Treemap"){
        d3.select("#layout" + position + "_treemap").style("visibility", "visible");

        Remove_nodechildren("g" + position);
        draw_treemap("#g" + position, document.getElementById("dropdown" + position + "_treemap").selectedIndex);
    }
    else if(grade == "Zoomable_Treemap"){
        Remove_nodechildren("g" + position);
        draw_zoomable_treemap("#g" + position);
    }
    else if(grade == "Tree"){
        Remove_nodechildren("g" + position);
        draw_tree("#g" + position);
    }

    d3.select("#g"+position).attr("viewBox", function(){
        return "0 0 500 500";
    })
}

function change_num(){
    d3.json(FileName, function(error, root) {
        if (error) throw error;

        document.getElementById("start_year").innerHTML = root.children[0].name;
        document.getElementById("end_year").innerHTML = root.children[root.children.length-1].name;

        root = d3.hierarchy(root);

        dataSourcePapers = document.getElementById("dataInfoPapers");
        dataSourceCitations = document.getElementById("dataInfoCitations");

        root.sum(function(d) { return d.size; });
        dataSourceCitations.innerHTML = "Number of citations: " + root.value;

        root.sum(function(d){ return d.children? 0 : 1;});
        dataSourcePapers.innerHTML = "Number of papers: " + root.value;
        
    })
}

var FileName;
var dataSourcePapers, dataSourceCitations;

window.onload = function(){
    var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); };
    color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

    var objD = document.getElementById("dataDropdown");
    FileName = "../datasets/" + objD.options[objD.selectedIndex].text + ".txt";

    document.getElementById("enter_authorname").innerHTML = objD.options[objD.selectedIndex].text;

    change_num();

    //this.draw_sunburst("#g1");
    //this.draw_circle("#g1");
    this.draw_tree("#g1");
    //this.draw_treemap("#g1");
    //this.draw_new_treemap("#g1");
    this.draw_zoomable_treemap("#g2");
}