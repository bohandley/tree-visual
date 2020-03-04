var color;

function draw_pack(position){
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";



    var svg = d3.select(position),
        margin = 20,
        diameter = +500,
        g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var formatNumber = d3.format(",d");

    // color = d3.scaleLinear()
    //     .domain([-1, 5])
    //     .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    //     .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2);

    d3.json(FileName, function(error, root) {
        root.children = root.children.filter(function(el, i){ if(i<10){ return el }})
        // if (error) throw error;
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
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .attr("id", function(d){
                return [position1].concat(buildId(d).reverse()).join("-");
            })
            .style("fill", function(d) { 
                if(d.parent && d.parent.data.name == "flare"){
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
            .style("stroke", "white")
            .style("stroke", 1)
            .on("click", function(d) { 
                var otherGraphSelectTag = document.getElementById("dropdown" + position2[1]);
                var otherGraphType = otherGraphSelectTag.options[otherGraphSelectTag.selectedIndex].text;

                var response;
                if(otherGraphType == "Zoomable_Treemap")
                    response = zoomableTreeResponse(d, position1, position2);
                else if(otherGraphType == "Tree") 
                    response = treeResponse(d, position1, position2);
                
                if(response == 0)
                    return;

                if (focus !== d) zoom(d), d3.event.stopPropagation(); 
            })
            .on("mouseover", function(d){
                var position2Id = [position2].concat(buildId(d).reverse()).join("-");
                
                d3.select("#"+position2Id).select(".parent").style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
                d3.select(this).style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
                d3.select(this).append("title").text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })

            })
            .on("mouseout", function(d){
                var position2Id = [position2].concat(buildId(d).reverse()).join("-");
                d3.select("#"+position2Id).select(".parent").style("stroke", "white").style("stroke-width", 1);

                d3.select(this).style("stroke", "white").style("stroke-width", 1);
                
            });

        var text = g.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
            .text(function(d) { return d.data.name; });
        var node = g.selectAll("circle,text");
        svg.style("background", "white")
            .on("click", function() {
                var otherGraphSelectTag = document.getElementById("dropdown" + position2[1]);
                var otherGraphType = otherGraphSelectTag.options[otherGraphSelectTag.selectedIndex].text;

                var response;
                if(otherGraphType == "Zoomable_Treemap")
                    response = zoomableTreeResponse(root, position1, position2, 1);
                else if(otherGraphType == "Tree"){ 
                    if (cfg.zoomZooming){
                        console.log("Zooming in progress...")
                        response = 0;
                    } else {
                        response = 1;//treeResponse(root, position1, position2, 1);
                    }
                }

                if(response == 0)
                    return;

                zoom(root);                
            });

        zoomTo([root.x, root.y, root.r * 2 + margin]);

        function zoom(d) {
            displaySelectedNode(d);
            
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
    });
}