const config = {
    // "change" describes when a graph has been clicked,
    // and a second graph may also be clicked as a result of the first click,
    // we cap this at two so the second graph does trigger the first graph again but
    // the first graph reads "change" and returns out of the click function.
    change: 0,

    zoomableTransition: 0,
    zoomZooming: null,
    prvClk: {
        pack: '',
        zoomable:'',
        tree: '',
        treemap: '',
        sunburst: ''
    },
    fileData: null
};

let cfg = Object.assign({}, config);


function resetCfg(){
    cfg = Object.assign({}, config);
}

var FileData

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
    resetCfg();

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
    resetCfg();

    d3.select("#g" + position+ "-div")
        .html("")
        .append("svg")
        .attr("id", "g" + position)
        .attr("viewBox", "0 0 500 500");

    d3.select("#layout" + position + "_treemap").style("visibility", "hidden");

    var objS = document.getElementById("dropdown" + position);
    var grade = objS.options[objS.selectedIndex].text;

    if(grade == "Pack"){
        this.draw_pack("#g" + position, cfg.fileData);
    }
    else if(grade == "Sunburst"){
        this.draw_sunburst("#g" + position, cfg.fileData);
    }
    else if(grade == "Treemap"){
        d3.select("#layout" + position + "_treemap").style("visibility", "visible");

        this.draw_treemap("#g" + position, document.getElementById("dropdown" + position + "_treemap").selectedIndex, cfg.fileData);
    }
    else if(grade == "Zoomable_Treemap"){
        this.draw_zoomable_treemap("#g" + position, cfg.fileData);
    }
    else if(grade == "Tree"){
        this.draw_tree("#g" + position, cfg.fileData);
    }

    d3.select("#g"+position).attr("viewBox", function(){
        return "0 0 500 500";
    })
}

function change_num(){
    d3.json(FileName, function(error, root) {
        if (error) throw error;

        cfg.fileData = Object.assign({}, root); 

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

    d3.json(FileName, function(error, root) {
        cfg.fileData = Object.assign({}, root);
    
        // this.draw_sunburst("#g1");
        this.draw_pack("#g1", cfg.fileData);
        // this.draw_tree("#g1");
        //this.draw_treemap("#g1");
        //this.draw_new_treemap("#g1");    
        this.draw_zoomable_treemap("#g2", cfg.fileData);
    });
        
}
