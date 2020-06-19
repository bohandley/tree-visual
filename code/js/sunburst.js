function draw_sunburst(position){
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = getOtherGraphType(position2);

    var width = 500,
        height = 500,
        radius = (Math.min(width, height) / 2) - 10;

    var formatNumber = d3.format(",d");

    var x = d3.scaleLinear()
        .range([0, 2 * Math.PI]);

    var y = d3.scaleSqrt()
        .range([0, radius]);

    var partition = d3.partition();

    var arc = d3.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y1)); });


    var svg = d3.select(position)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    d3.json(FileName, function(error, root) {
        if (error) throw error;
        // FILTER JSON
        root.children = root.children.filter(function(el, i){ if(i<10){ return el }})
        root = d3.hierarchy(root);
        // console.log(root)

        // var year_list = new Array();
        // for(var i =0; i < root.children.length; i++){
        //     year_list.push(parseInt(root.children[i].data.name));
        // }

        // console.log(year_list)
        // var color = d3.scaleLinear()
        // .domain(year_list)
        // .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        // .interpolate(d3.interpolateHcl);

        root.sum(function(d) { return d.size; });
        svg.selectAll("path")
            .data(partition(root).descendants())
        .enter().append("path")
            .attr("d", function(d){
                // if collapsible tree comparison or zoomable tree map!!!
                // only show the root and first level to match these
                if (treeLib.restrictLevels(d, 2, position2))
                    return;

                return arc(d);
            })
            .style("fill", function(d) {
                // if (!d.parent) {
                //         return "#e6e6e6";
                //     } else {
                //         return getColor(d, color);    
                //     }
                if (!d.parent)
                    return "#e6e6e6";
                else
                    return getColor(d, color);
            })
            .style("stroke", "white")
            .style("stroke-width", 0.5)
            .attr("id", d => {
                return treeLib.pathId(d, position1);
                // buildNodeOrLeafId(d, position1)
            })
            .attr("class", d => {
                var cls = treeLib.isLeaf(d) ? 'leaf cursor-default' : '';

                // if (!d.parent)
                //     cls += ' sunburst-back-button';

                return cls;
            })
            .classed(position1, true)
            .on("mouseover", d => mouseoverLinking(position1, position2, d))
            .on("mouseout", d => mouseoutLinking(position1, position2, d))
            .on('linkedClick', d => linkedClickClick(d))
            .on("click", d => {
                displaySelectedNode(d);

                var prevent = treeLib.preventLeaf(d, position1);

                if (prevent)
                    return;

                click(d);
            })
            .append("title")
            .text( d => {
                var dataName = d.data.name;
                // do we need to shorten the title in the tooltip?
                // if (treeLib.isLeaf(d))
                //     dataName = dataName.split(' ')[0] + '...';

                return dataName + "\n" + formatNumber(d.value)
            });

            d3.select("svg#"+position1).dispatch('doneDrawing');
    });
    
    function click(d) {
        var response = treeLib.linkedClick(d, position2);

        if (response == 'prevent')
            return;

        svg.transition()
            .duration(750)
            .tween("scale", function() {
                var ccn = treeLib.config().containers[1].currentClickedNode;
                var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);

                

                return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            
            })
        .selectAll("path")
            .attrTween("d", function(d) { 
                return function() {
                    // returns the arc(d) for acceptable things
                    // to show the only first level on return to root CT & ZT
                    return treeLib.restrictOnReturn(d, position1, position2, arc)
                }; 
            });
    }

    function linkedClickClick(d) {
        svg.transition()
            .duration(750)
            .tween("scale", function() {
            var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]),
                yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
            return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            })
        .selectAll("path")
            .attrTween("d", function(d) { 
                return function() { 
                    // return arc(d); 
                    return treeLib.restrictOnReturn(d, position1, position2, arc);
                }; 
            })
            .style("visibility", "visible")
            .style("visibility", function(d) {
                return treeLib.hideArcs(position1, d);
            })

    }
    
    d3.select(self.frameElement).style("height", height + "px");

}
