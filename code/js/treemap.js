function draw_treemap(position, selectindex){
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = getOtherGraphType(position2);

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

        // FILTER JSON
        data.children = data.children.filter((el, i) => { 
            if(i<10){ 
                return el 
            }
        });

        var root = d3.hierarchy(data)
            .eachBefore( d => d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name )
            .sum( d => d.size )
            .sort((a, b) => b.height - a.height || b.value - a.value );

        treemap(root);

        var cell = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")" );

        cell.append("rect")
            .attr("id", d => buildNodeOrLeafId(d, position1))
            .attr("width", d => d.x1 - d.x0 )
            .attr("height", d => d.y1 - d.y0 )
            .attr("fill", d => getColor(d, color))
            .on("mouseover", d => mouseoverLinking(position1, position2, d))
            .on("mouseout", d => mouseoutLinking(position1, position2, d));

        cell.append("clipPath")
            .attr("id", d => "clip-" + d.data.id )
            .append("use")
            .attr("xlink:href", d => "#" + d.data.id );
        
        cell.append("title")
            .text( d => d.data.id + "\n" + format(d.value) );
    });
}