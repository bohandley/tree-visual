function draw_tree(position, selectedIndex){
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    if(selectedIndex == 0){
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
              update(root);
            }

            drawTreeGraph(final_tree)

            function update(source) {
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
                  .attr("class", "node zoomable")
                  .attr("id", function(d){
                    var id = [position1].concat(buildId(d).reverse()).join("-");

                    if(d.children == null && d._children == null)
                        return "leaf-" + d.id;
                    else
                        return id;
                  })
                  //.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
                  .on("drill", click)
                  .on("click", function(d){
                    var otherGraphSelectTag = document.getElementById("dropdown" + position2[1]);
                    var otherGraphType = otherGraphSelectTag.options[otherGraphSelectTag.selectedIndex].text;
                    
                    var response;

                    // how can we tell the RRT is at a leaf when
                    // the data removes children of the clicked node?
                    // see collapse in line 61
                    // do we compare the node to the entire root?
                    // if(d._children != null){
                    
                        if(otherGraphType == "Zoomable_Treemap")
                            response = zoomableTreeResponse(d, position1, position2);
                        else if(otherGraphType == "Pack") 
                            response = packResponse(d, position1, position2);

                        if(response == 0)
                            return;
                    // }

                    click(d);
                  });
              nodeEnter.append("circle")
                  .attr("r", 1e-6)
                  .style("fill", function(d) {
                   // if(color_by_difficulty == true){
                   //      return difficulty_color(3)
                   // }else{
                   //      return chapter_color(3) 
                   // }})
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
                  .on("mouseover", function(d) {
                      if (color_by_difficulty){
                        var tobold = ".difficulty" + d.difficulty
                        // legend.selectAll(tobold).classed("highlight", true)
                      }else{
                        var tobold = ".chapter" + d.chapter
                        // legend.selectAll(tobold).classed("highlight", true)
                      }})
                    .on("mouseleave", function(d) {
                      d3.selectAll(".highlight").classed("highlight", false)
                    })

              nodeEnter.append("text")
                  .attr("x", 10)
                  .attr("dy", ".35em")
                  .attr("text-anchor", "start")
                  //.attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length * 8.5)  + ")"; })
                  .text(function(d) { return d.name; })
                  .style("fill-opacity", 1e-6);


              nodeEnter.append("title")
                .text(function(d) {
                  if(d.name.slice(0, 2) == "HW"){
                    return "Correlation: " + d.correlation  + "\n" + "Difficulty Index: " + d.dindex + "\n" + "Item ID: " + d.itemID 
                  }else{
                    return "Correlation: " + d.correlation  + "\n" + "Difficulty Index: " + d.dindex
                  }

                });


                    
              // Transition nodes to their new position.
              var nodeUpdate = node.transition()
                  .duration(duration)
                  .attr("transform", function(d) { 
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; 
                })
              
              nodeUpdate.select("circle")
                  .attr("r", function(d) {
                    if(d._children != null){
                        if(d._children.length >= 13){
                            return 8
                        }else if(d._children.length < 13 && d._children.length >= 7) {
                            return 6
                        }else if (d._children.length < 7  && d._children.length >= 3){
                            return 4
                        }else{
                            return 3
                        }
                    }
                    if(d.children != null){
                      return 5;
                    }
                   return 2.5; 
                   })
                  .style("fill", function(d) {       
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
              nodeUpdate.select("text")
                  .style("fill-opacity", 1)
                  .attr("transform", function(d) { 
                    return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length + 50)  + ")"; 
                  });
              // TODO: appropriate transform
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
              displaySelectedNode(d);
              if (d.children) {
                d._children = d.children;
                d.children = null;
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

            // var tree = d3.cluster().size([2 * Math.PI, radius - 100])
            // var root = tree(d3.hierarchy(data)
            //     .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

            // root.sum(function(d) { return d.size; });
            
            // var link = svg.append("g")
            //     .attr("fill", "none")
            //     .attr("stroke", "#555")
            //     .attr("stroke-opacity", 0.4)
            //     .attr("stroke-width", 1)
            //     .selectAll("path")
            //     .data(root.links())
            //     .enter().append("path")
            //     .attr("d", d3.linkRadial()
            //         .angle(d => d.x)
            //         .radius(d => d.y));
            
            // var node = svg.append("g")
            //     .attr("stroke-linejoin", "round")
            //     .attr("stroke-width", 3)
            //     .selectAll("g")
            //     .data(root.descendants().reverse())
            //     .enter().append("g")
            //     .attr("transform", d => `
            //         rotate(${d.x * 180 / Math.PI - 90})
            //         translate(${d.y},0)
            //     `);
            
            // node.append("circle")
            //     //.attr("fill", d => d.children ? "#555" : "#999")
            //     .attr("fill", function(d){
            //         if(d.parent && d.parent.data.name == "flare"){
            //             //console.log(d.data.name)
            //             return color(parseInt(d.data.name));
            //         }
            //         else if(d.parent){
            //             while(d.parent.data.name != "flare"){
            //                 d = d.parent;
            //             }
            //             return color(parseInt(d.data.name));
            //         }
            //         return color(d.data.name); 
            //     })
            //     .attr("r", 1)
            //     .on("mouseover", function(d){
            //         d3.select(this).style("cursor", "pointer").attr("r", 5);
            //         d3.select(this).append("title").text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
            //     })
            //     .on("mouseout", function(d){
            //         d3.select(this).attr("r", 1);
            //     });
            
            // node.append("text")
            //     .attr("class", "label")
            //     .style("font-size", 5)
            //     .attr("dy", "0.31em")
            //     .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            //     .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            //     .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
            //     .filter(d => d.children)
            //     .text(d => d.data.name)
            //     .clone(true).lower()
            //     .attr("stroke", "white")
            //     .on("mouseover", function(d){
            //         d3.select(this).style("cursor", "pointer");
            //         d3.select(this).append("title").text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
            //     });;

            // //yield svg.node();

            // svg.attr("viewBox", autoBox);

        });
    
    } else if (selectedIndex ==  1){
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
                .attr("transform", d => `
                    rotate(${d.x * 180 / Math.PI - 90})
                    translate(${d.y},0)
                `);

            node.append("circle")
                //.attr("fill", d => d.children ? "#555" : "#999")
                .attr("fill", function(d){
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
                .attr("r", 1)
                .on("mouseover", function(d){
                    d3.select(this).style("cursor", "pointer").attr("r", 5);
                    d3.select(this).append("title").text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
                })
                .on("mouseout", function(d){
                    d3.select(this).attr("r", 1);
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
}