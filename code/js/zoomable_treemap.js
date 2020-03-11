function draw_zoomable_treemap(position){
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = getOtherGraphType(position2);

    var svg = d3v3.select(position);
    var width = 500;
    var height = 500;

    var margin = {top: 20, right: 0, bottom: 0, left: 0},
        formatNumber = d3v3.format(",d"),
        transitioning;
    
    height = 500 - margin.top - margin.bottom;

    var x = d3v3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var y = d3v3.scale.linear()
        .domain([0, height])
        .range([0, height]);

    var treemap = d3v3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d._children; })
        .sort(function(a, b) { return b.value - a.value; })
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

    var svg1 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");

    var grandparent = svg1.append("g")
        .attr("class", "grandparent");

    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top)
        .on("mouseover", function(){
            d3.select(this).style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
        })
        .on("mouseout", function(){
            d3.select(this).style("stroke", "white").style("stroke-width", 0.5);
        });

    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");

    d3v3.json(FileName, function(root) {
        // FILTER JSON
        root.children = root.children.filter(function(el, i){ if(i<10){ return el }})
        for(var i =0; i<root.children.length; i++){
            for(var j=0; j<root.children[i].children.length; j++){
                for(var k=0; k<root.children[i].children[j].children.length; k++){
                    for(var m=0; m<root.children[i].children[j].children[k].children.length; m++){
                        root.children[i].children[j].children[k].children[m].value = root.children[i].children[j].children[k].children[m].size;
                    }
                }
            }
        }
        
        initialize(root);
        accumulate(root);
        layout(root);
        display(root);

        function initialize(root) {
            root.x = root.y = 0;
            root.dx = width;
            root.dy = height;
            root.depth = 0;
        }

        // Aggregate the values for internal nodes. This is normally done by the
        // treemap layout, but not here because of our custom implementation.
        // We also take a snapshot of the original children (_children) to avoid
        // the children being overwritten when when layout is computed.
        function accumulate(d) {
            return (d._children = d.children)
                ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
                : d.size;
        }

        // Compute the treemap layout recursively such that each group of siblings
        // uses the same size (1×1) rather than the dimensions of the parent cell.
        // This optimizes the layout for the current zoom state. Note that a wrapper
        // object is created for the parent node for each group of siblings so that
        // the parent’s dimensions are not discarded as we recurse. Since each group
        // of sibling was laid out in 1×1, we must rescale to fit using absolute
        // coordinates. This lets us use a viewport to zoom.
        function layout(d) {
            if (d._children) {
            treemap.nodes({_children: d._children});
            d._children.forEach(function(c) {
                c.x = d.x + c.x * d.dx;
                c.y = d.y + c.y * d.dy;
                c.dx *= d.dx;
                c.dy *= d.dy;
                c.parent = d;
                layout(c);
            });
            }
        }

        //if I click something that is zoomable in circle,
        // but that thing is hidden in zoomable tree,
        // then I have to simulate a click on each level of zoomable tree
        // to get deeper into 
        function display(d) {
            grandparent
                .datum(d.parent)
                .attr("id", function(d){

                    return cleanNodeId(buildPositionId(d, position1));//[position1].concat(buildId(d).reverse()).join("-");
                })
                .on("click", transition)
                .on("drill", function(d){
                    drillTransition(d);
                })
            .select("text")
                .text(name(d));

            var g1 = svg1.insert("g", ".grandparent")
                .datum(d)
                .attr("class", "depth");

            var g = g1.selectAll("g")
                .data(d._children)

            .enter().append("g");

            g.filter(function(d) { return d._children; })
                .classed("children zoomable", true)
                .attr("id", function(d){
                    return cleanNodeId(buildPositionId(d, position1));
                })
                .on("drill", function(d){
                    drillTransition(d)
                })
                .on("click", function(d){
                    
                    transition(d)

                });

            g.selectAll(".child")
                .data(function(d) { return d._children || [d]; })
            .enter().append("rect")
                .attr("class", "child")
                .call(rect);

            g.append("rect")
                .attr("class", "parent")
                .on("mouseover", function(d){
                    var position2Id = cleanNodeId(buildPositionId(d, position2));
                    d3.select("#"+position2Id).style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
                    d3.select(this).style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
                })
                .on("mouseout", function(d){
                    var position2Id = cleanNodeId(buildPositionId(d, position2));
                    d3.select("#"+position2Id).style("stroke", "white").style("stroke-width", 0.5);
                    d3.select(this).style("stroke", "white").style("stroke-width", 0.5);
                })
                .call(rect)
            .append("title")
                .text(function(d) { return d.name + "\n" +formatNumber(d.value); });

            g.append("text")
                .attr("dy", ".75em")
                .text(function(d) { return d.name; })
                .call(text);

            function transition(d) {
                // get the id of the pack that needs to zoom
                // check which graph is displayed opposite of the zoomable tree
                // the opposite graph then tries to fire and then fires the zoomable tree in response
                // and that is where the cfg.change is reset
                if(cfg.change > 1){
                    cfg.change = 0;
                    return;    
                }

                var id = cleanNodeId(buildPositionId(d, position2));

                var zoomableElements = d3.selectAll(".zoomable")
                    .filter(function(el){ 
                        return d3.select(this).attr("id") == id 
                    });

                var extendedPathElements = d3.selectAll(".zoomable")
                    .filter(function(el){ 
                        return d3.select(this).attr("id").includes(id) && d3.select(this).attr("id") != id  
                    });
                if(zoomableElements.size() == 0 && otherGraphType == "Tree"){
                    cfg.zoomZooming = true;
                    // break up the id, 
                    // find the node that is visible
                    // click that, add one node, click that, until the built node == id
                    var targetIdArr = id.split("-");
                    var targetIdArrLength = targetIdArr.length;

                    var partialPaths = [];
                    // build up a collection of node paths starting with flare-<x>, build until the path == id
                    for(var i = 1; i < targetIdArrLength; i++){
                        var cpArr = copy(targetIdArr);
                        var partialPathArr = cpArr.splice(0,i+1);

                        var partialPath = partialPathArr.join("-");

                        partialPaths.push(partialPath);
                    }

                    // iterate through this group of paths
                    // click the path
                    // check if the next path is exposed
                    // click it if so, don't click it if not
                    // check the next path, click it if exposed, pass if not exposed
                    // We're going to need to update the cfg.zoomzooming in the final setTimeout function,
                    // Need to work on stopping click events for pack when this is going on
                    var transition = 0;

                    for (var i = partialPaths.length, p = Promise.resolve(); i >= 0 ; i--){
                        p = p.then(_ => new Promise(resolve =>{
                            var nextNode = partialPaths[i+1];
                            var nextNodeIsHidden = d3.selectAll(".zoomable")
                                .filter(function(el){ 
                                    return d3.select(this).attr("id") == nextNode; 
                                })
                                .size() == 0;

                            // d3.selectAll(".zoomable").filter(function(el){ return d3.select(this).attr("id") == partialPaths[i+1] }).size() == 0
                            // only click the node if the next one is hidden
                            if(nextNode != null && nextNodeIsHidden){
                                d3.select("#"+partialPaths[i]).dispatch("drill");
                                if(transition == 0)
                                    transition = 600;
                                else
                                    transition += 200;
                            } else if (nextNode == null){
                                // check that there is not an extra node, one more than
                                // the target that is open
                                // for example, we have g1-flare-1996-J
                                // is there an element that contains this id
                                // and has +1 node?
                                // if so, then click this
                                var extendedPathElement = d3.selectAll(".zoomable")
                                    .filter(function(el){ 
                                        var fartherInNode = d3.select(this).attr("id");

                                        return fartherInNode.includes(id) && 
                                            fartherInNode.split("-").length == id.split("-").length + 1; 
                                    });

                                // if this node that is one longer than the id and 
                                // has all the nodes in the id is not present,
                                // then drill into the CT one more time
                                if(extendedPathElement.size() == 0)
                                    d3.select("#"+partialPaths[i]).dispatch("drill");

                            } else {
                                // skip and check the next node
                            }                            
                            
                            return setTimeout(function(){
                                if (i == partialPaths.length-1){
                                    cfg.zoomZooming = false;
                                    cfg.change = 0;
                                }
                                
                                i++
                                // zTime++;
                                return resolve();   
                            }, transition);
                            
                        }));
                    }

                }

                // only click the CT node responsively if there is no path extended beyond,
                // no elements beyond the clicked node
                if(!cfg.zoomZooming && extendedPathElements.size() == 0){
                    d3.select('#'+ id).dispatch('click', function(){
                        cfg.change = cfg.change + 1;
                    });
                } else {
                    if(cfg.change == 1)
                        d3.select('#'+ id).dispatch('click', function(){
                            cfg.change += 1;
                        }); 

                    // cfg.change = 0;
                }    
                    
                displaySelectedNode(d);
                if (transitioning || !d) return;
                transitioning = true;

                var g2 = display(d),
                    t1 = g1.transition().duration(750),
                    t2 = g2.transition().duration(750);

                // Update the domain only after entering new elements.
                x.domain([d.x, d.x + d.dx]);
                y.domain([d.y, d.y + d.dy]);

                // Enable anti-aliasing during the transition.
                svg.style("shape-rendering", null);

                // Draw child nodes on top of parent nodes.
                svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);

                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);

                // Remove the old node when the transition is finished.
                t1.remove().each("end", function() {
                    svg.style("shape-rendering", "crispEdges");
                    transitioning = false;
                });
            }

            function drillTransition(d) {                    
            
                if (transitioning || !d) return;
                transitioning = true;

                var g2 = display(d),
                    t1 = g1.transition().duration(750),
                    t2 = g2.transition().duration(750);

                // Update the domain only after entering new elements.
                x.domain([d.x, d.x + d.dx]);
                y.domain([d.y, d.y + d.dy]);

                // Enable anti-aliasing during the transition.
                svg.style("shape-rendering", null);

                // Draw child nodes on top of parent nodes.
                svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);

                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);

                // Remove the old node when the transition is finished.
                t1.remove().each("end", function() {
                    svg.style("shape-rendering", "crispEdges");
                    transitioning = false;
                });
            }

            return g;
        }

        function text(text) {
            text.attr("x", function(d) { return x(d.x) + 6; })
                .attr("y", function(d) { return y(d.y) + 6; });
        }

        function rect(rect) {
            rect.attr("x", function(d) { return x(d.x); })
                .attr("y", function(d) { return y(d.y); })
                .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
                .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
                .attr("fill", function(d){
                    if(d.parent && d.parent.name == "flare"){
                        //console.log(d.data.name)
                        return color(parseInt(d.name));
                    }
                    else if(d.parent){
                        while(d.parent.name != "flare"){
                            d = d.parent;
                        }
                        return color(parseInt(d.name));
                    }
                    return color(d.name); 
                })
                .style("stroke", "white")
                .style("stroke-width", 1);
        }

        function name(d) {
            return d.parent
                ? name(d.parent) + "." + d.name
                : d.name;
        }
    });
}