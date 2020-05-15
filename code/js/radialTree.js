function draw_radial_tree(position){
	var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = getOtherGraphType(position2);

	var svg = d3.select(position);
    var radius = 250;
    var width = 500;
    var height = 500;

    function autoBox() {
        const {x, y, width, height} = this.getBBox();
        return [x, y, width, height];
    }

    var formatNumber = d3.format(",d");

    d3.json(FileName, function(error, data) {
        if (error) throw error;

        data.children = data.children.filter(function(el, i){ if(i<10){ return el }})

        var tree = d3.cluster().size([2 * Math.PI, radius - 100])
        var root = tree(d3.hierarchy(data)
            .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

        root.sum(function(d) { return d.size; });

        var link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1)
            .selectAll("path")
            .data(root.links())
            .enter().append("path")
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        var node = svg.append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(root.descendants().reverse())
            .enter().append("g")
            .attr("id", function(d){
        		return buildNodeOrLeafId(d, position1);
            })
            .attr("transform", d => `
                rotate(${d.x * 180 / Math.PI - 90})
                translate(${d.y},0)
            `);

        node.append("circle")
            .attr("fill", function(d){
                return getColor(d, color);
            })
            .attr("r", _=> {
            	// return 5;
            	return appearance.nodeSize*2/3;
            })
            .style("stroke", "steelblue")
    		.style("stroke-width", 1)
            .attr("class", "node-size")
            .on("mouseover", function(d){
            	mouseoverLinking(position1, position2, d);
                // d3.select(this).style("cursor", "pointer").attr("r", 5);
                // d3.select(this).append("title").text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
            })
            .on("mouseout", function(d){
            	mouseoutLinking(position1, position2, d);
                // d3.select(this).attr("r", 1);
            });

        node.append("text")
            .attr("class", "label")
            .style("font-size", 5)
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
            .filter(d => d.children)
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke", "white")
            .on("mouseover", function(d){
                d3.select(this).style("cursor", "pointer");
                d3.select(this).append("title").text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
            });;

        //yield svg.node();

        svg.attr("viewBox", autoBox);

    });
}
