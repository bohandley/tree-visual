function draw_treemap(position, selectindex){
    var svg = d3.select(position);
    var width = 500;
    var height = 500;

    var format = d3.format(",d");

    var tilings = [d3.treemapResquarify, d3.treemapBinary, d3.treemapDice, d3.treemapSlice, d3.treemapSliceDice];
        
    var treemap = d3.treemap()
        .tile(tilings[selectindex])
        .size([width, height])
        .round(true)
        .paddingInner(1);

    d3.json(FileName, function(error, data) {
        if (error) throw error;
        var root = d3.hierarchy(data)
            .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
            .sum(function(d){return d.size;})
            .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

        treemap(root);
        var cell = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
        cell.append("rect")
            .attr("id", function(d) { return d.data.id; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d) { 
                if(d.parent && d.parent.data.name == "flare"){
                    //console.log(d.data.name)
                    return color(parseInt(d.data.name));
                }
                else if(d.parent){
                    while(d.parent.data.name != "flare"){
                        d = d.parent;
                    }
                    return color(parseInt(d.data.name));
                }
                return color(d.data.name);   
            })
            .on("mouseover", function(d){
                d3.select(this).style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
            })
            .on("mouseout", function(){
                d3.select(this).style("stroke", "white").style("stroke-width", 0.1);
            });

        cell.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.data.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.data.id; });
        
        cell.append("title")
            .text(function(d) { return d.data.id + "\n" + format(d.value); });
    });
}