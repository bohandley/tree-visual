function draw_collapsible_tree(position){
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = treeLib.getOtherGraphType(position2);

    // var svg = d3.select(position);
    var radius = 250;
    var width = 500;
    var height = 500;

    function autoBox() {
        const {x, y, width, height} = this.getBBox();
        return [x, y, width, height];
    }

    var formatNumber = d3.format(",d");

    d3.json(FileName, function(error, final_tree) {
        if (error) throw error;

        // filter the FileName outside of this builder
        // FILTER JSON
        final_tree.children = final_tree.children.filter(function(el, i){ if(i<10){ return el }})

        /////////////Tree graph start///////////////
        var difficulty_color = d3.scaleOrdinal()
            .domain([0,1,2,3])
            .range([ "#fff","#b4d4ff", "#1871ec", "#002e6f"])

        var chapter_color = d3.scaleOrdinal()
            .domain([0,1,2,3,4,5,6,7])
            .range([ "#fff", "#cea2ff", "#b6fea5", "#87b2ff", "#feaf7b", "#a3fff1", "#fffe99", "#fe8686"])



        var color_by_difficulty = true
        var color_by_chapter = false

        var i = 0,
            duration = 350,
            root = final_tree;
        
        var tree = d3v3.layout.tree()
            .size([360, 300])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 10) / a.depth; });
        
        var diagonal = d3v3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
        
        var treesvg = d3v3.select(position).append("svg")
            .attr("width", 650 )
            .attr("height", 710 )
            .append("g")
                .attr("transform", "translate(" + 250 + "," + 250 + ")");

        // var currentTree = "Final"

        function drawTreeGraph(treeData){
          root = treeData;
          root.x0 = 400;
          root.y0 = 0;
          root.children.forEach(collapse); 
          // collapse(root);
          update(root);
        }

        drawTreeGraph(final_tree)

        function update(source){
            // Compute the new tree layout.
            var nodes = tree.nodes(root),
                links = tree.links(nodes);
            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 50; });
            // Update the nodes…
            var node = treesvg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });
            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node zoomable " + position1)
                .attr("id", function(d){
                    return treeLib.pathId(d, position1);
                })
                .attr("data", d => {
                    return treeLib.getCurrentClicked(position1);
                })
                //.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
                .on("linkedClick", click)
                .on("drill", click)
                .on("click", function(d){
                    treeLib.displaySelectedNode(d);

                    // prevent events when
                    // 1. zoomable treemap is other and trying to collapse to root
                    // 2. zoomable treemap is transitioning
                    var response = treeLib.linkedClick(d, position2);

                    if (response == 'prevent')
                        return;

                    click(d);
                });
            
            nodeEnter.append("circle")
                .attr("class", "node-size")
                .attr("r", 1e-6)
                .style("fill", d => { 
                    if (!d.parent) {
                        return "#e6e6e6";
                    } else {
                        return treeLib.getColor(d, color);    
                    }  
                })
                .on("mouseover", d => treeLib.mouseoverLinking(position1, position2, d))
                .on("mouseleave", d => treeLib.mouseoutLinking(position1, position2, d));

            nodeEnter.append("text")
                .attr("x", 10)
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                //.attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length * 8.5)  + ")"; })
                .text(function(d) { 
                    if (treeLib.isLeaf(d))
                        return d.name.split(' ')[0] + '...';
                    else
                        return d.name; 
                })
                .style("fill-opacity", 1e-6);


            nodeEnter.append("title")
                .text(function(d) {
                    return d.name;
                });


                
            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { 
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; 
                })
          
            nodeUpdate.select("circle")
                .attr("class", function(d) {
                    var pathId = treeLib.pathId(d, position1);

                    cls = "node-size";
                    // add the class if it was already there from the treeLib code

                    cls = treeLib.addSunburstBackButtonClass(pathId, cls);

                    return cls;
                })
                .attr("r", function(d) {
                    return appearance.nodeSize;
                    // if(d._children != null){
                    //     if(d._children.length >= 13){
                    //         return 8
                    //     }else if(d._children.length < 13 && d._children.length >= 7) {
                    //         return 6
                    //     }else if (d._children.length < 7  && d._children.length >= 3){
                    //         return 4
                    //     }else{
                    //         return 3
                    //     }
                    // }
                    // if(d.children != null){
                    //   return 5;
                    // }
                    // return 2.5; 
                })
                .style("fill", function(d) {
                    if (!d.parent) {
                        return "#e6e6e6";
                    } else {
                        return treeLib.getColor(d, color);    
                    }      
                })
            
            nodeUpdate.select("text")
                .style("fill-opacity", 1)
                .attr("transform", function(d) { 
                    if (treeLib.isLeaf(d))
                        var amt = (d.name.split(' ')[0] + '...').length + 10;
                    else
                        var amt = d.name.length;
                    return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (amt + 50)  + ")"; 
                });
            
            var nodeExit = node.exit().transition()
                .duration(duration)
                //.attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
                .remove();
            nodeExit.select("circle")
                .attr("r", 1e-6);
            nodeExit.select("text")
                .style("fill-opacity", 1e-6);
            // Update the links…
            var link = treesvg.selectAll("path.link-t")
                .data(links, function(d) { return d.target.id; });
            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link-t")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-width", "1.5px")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });
            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);
            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();
            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        
        // Toggle children on click.
        function click(d) {
            // this is where the nodes are closed
            // if d.children, it closes the nodes
            if (d.children) {
                collapse(d);
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
        // Collapse nodes
        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        d3.select("svg#"+position1).dispatch('doneDrawing');
    });
}