var color;

function draw_pack(position){
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = treeLib.getOtherGraphType(position2);

    var svg = d3.select(position),
        margin = 20,
        diameter = +500,
        g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var formatNumber = d3.format(",d");

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2);

    d3.json(FileName, function(error, root) {
        if (error) throw error;

        // FILTER JSON
        // root.children = root.children.filter(function(el, i){ if(i<10){ return el }})
        
        root = d3.hierarchy(root)
            .sum(function(d) { return d.size; })
            .sort(function(a, b) { return b.value - a.value; });
            
        root.sum(function(d) { return d.size; });
        var focus = root,
            nodes = pack(root).descendants(),
            view;

        var circle = g.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf leaf cursor-default" : "node node--root"; })
            .classed(position1, true)
            .attr("id", function(d){
                return treeLib.pathId(d, position1);
            })
            .style("fill", d => {
                // refactor into treeLib as rootColor()
                if (!d.parent)
                    return "#e6e6e6";
                else
                    return treeLib.getColor(d, color);
            })
            .style("stroke", "white")
            .style("stroke", 1)
            .on("linkedClick", function(d) {
                if (focus !== d) {
                    zoom(d);
                    d3.event.stopPropagation(); 
                } else if (focus === d) {
                    // prevent the bubbling of same clicked node to root
                    d3.event.stopPropagation();
                }
            })
            .on("click", function(d) { 
                if (treeLib.isLeaf(d)) {
                    d3.event.stopPropagation();
                } else if (focus !== d) {
                    var response = treeLib.linkedClick(d, position2);

                    // prevent the intially clicked display from it's normal click action
                    if (response == 'prevent')
                        return;

                    zoom(d); 
                    d3.event.stopPropagation(); 
                } else if (focus === d) {
                    // PREVENT SAME NODE CLICK RETURN TO ROOT
                    // do nothing and stop propagation
                    // to prevent the event from bubbling up to the root
                    d3.event.stopPropagation(); 
                }
            })
            .on("mouseover", d => treeLib.mouseoverLinking(position1, position2, d))
            .on("mouseout", d => treeLib.mouseoutLinking(position1, position2, d));

        var text = g.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
            .text(function(d) {
                // refactor into nodeDisplayText() in treeLib
                var n = d.data.name;
                
                if (treeLib.isLeaf(d))
                    n = n.split(' ')[0] + '...';
                    
                return n;
            });

        var node = g.selectAll("circle,text");

        // events bubble up to root unless stop propagation
        svg.style("background", "white")
            .on("linkedClick", function() {
                zoom(root);
            })
            .on("click", function() {
                var response = treeLib.linkedClick(root, position2);

                if (response == 'prevent')
                    return;

                zoom(root);                
            });

        zoomTo([root.x, root.y, root.r * 2 + margin]);

        function zoom(d) {
            treeLib.displaySelectedNode(d);

            var focus0 = focus; focus = d;
            var transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", function(d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function(t) { zoomTo(i(t)); };
                });

            transition.selectAll("text")
                .filter(function(d) { 
                    var parent = d != null ? d.parent : null;
                    return parent === focus || this.style.display === "inline"; 
                })
                .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }
        function zoomTo(v) {
            var k = diameter / v[2]; view = v;
            node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
            circle.attr("r", function(d) { return d.r * k; });
        }

        d3.select("svg#"+position1).dispatch('doneDrawing');
    });
}