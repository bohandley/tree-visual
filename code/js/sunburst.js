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
            .attr("d", arc)
            .style("fill", function(d) { 
                return getColor(d, color);
            })
            .style("stroke", "white")
            .style("stroke-width", 0.5)
            .attr("id", d => buildNodeOrLeafId(d, position1))
            .on("mouseover", d => mouseoverLinking(position1, position2, d))
            .on("mouseout", d => mouseoutLinking(position1, position2, d))
            .on("click", click)
            .append("title")
            .text( d => d.data.name + "\n" + formatNumber(d.value));
    });
    
    function click(d) {
        svg.transition()
            .duration(750)
            .tween("scale", function() {
            var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]),
                yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
            return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            })
        .selectAll("path")
            .attrTween("d", function(d) { return function() { return arc(d); }; });
    }
    
    d3.select(self.frameElement).style("height", height + "px");

}
