function draw_zoomable_treemap(position) {
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = treeLib.getOtherGraphType(position2);

    var svg = d3v3.select(position);
    var width = 500;
    var height = 500;

    var margin = { top: 20, right: 0, bottom: 0, left: 0 },
        formatNumber = d3v3.format(",d"),
        transitioning;

    height = 500 - margin.top - margin.bottom;

    var x = d3v3.scale.linear().domain([0, width]).range([0, width]);

    var y = d3v3.scale.linear().domain([0, height]).range([0, height]);

    var treemap = d3v3.layout
        .treemap()
        .children(function (d, depth) {
            return depth ? null : d._children;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        })
        .ratio((height / width) * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

    var svg1 = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");

    var grandparent = svg1.append("g").attr("class", "grandparent");

    grandparent.append("rect").attr("y", -margin.top).attr("width", width).attr("height", margin.top);

    grandparent
        .append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");

    var filename = menu.getFileName();

    d3v3.json(filename, function (data) {
        var originalData = copy(data);

        // FILTER JSON
        var data = menu.filterJson(data);

        var filteredData = copy(data);

        menu.changeNum(originalData, filteredData);

        // assign value of leaf node from size (if there is no size, value is set to 1)
        function sizeToValue(node) {
            if (node.children) node.children.forEach(sizeToValue);
            else node.value = node.size ? node.size : 1;
        }

        var root = data;

        sizeToValue(root);
        initialize(root);
        accumulate(root);
        leafAcc(root);
        sizeAcc(root);

        // change value attribute for each node based on control panel area seletion
        root = menu.processAccumulated(root, "zoomableTreemap");
        layout(root);

        display(root);

        // process the value as either leaves or acc size depending on control panel

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
                ? (d.value = d.children.reduce(function (p, v) {
                      return p + accumulate(v);
                  }, 0))
                : d.size;
        }

        // preserve the accumulated size
        function sizeAcc(d) {
            return (d._children = d.children)
                ? (d.accSize = d.children.reduce(function (p, v) {
                      return p + sizeAcc(v);
                  }, 0))
                : (d.accSize = d.size);
        }

        // aggregate the number of leaves within each node
        function leafAcc(d) {
            return (d._children = d.children)
                ? (d.lvs = d.children.reduce(function (p, v) {
                      return p.concat(leafAcc(v));
                  }, []))
                : [d];
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
                treemap.nodes({ _children: d._children });
                d._children.forEach(function (c) {
                    c.x = d.x + c.x * d.dx;
                    c.y = d.y + c.y * d.dy;
                    c.dx *= d.dx;
                    c.dy *= d.dy;
                    c.parent = d;
                    layout(c);
                });
            }
        }

        // if I click something that is zoomable in circle,
        // but that thing is hidden in zoomable tree,
        // then I have to simulate a click on each level of zoomable tree
        // to get deeper into
        function display(d) {
            grandparent
                .datum(d.parent)
                .attr("id", (d) => {
                    return treeLib.pathId(d, position1);
                })
                .attr("data", (d) => {
                    return treeLib.getCurrentClicked(position1);
                })
                .classed(position1, true)
                .on("mouseover", (d) => treeLib.mouseoverLinking(position1, position2, d, 1))
                .on("mouseout", (d) => treeLib.mouseoutLinking(position1, position2, d, 1))
                .on("linkedClick", linkedClickTransition)
                .on("click", transition)
                .on("drill", (d) => drillTransition(d))
                .select("text")
                .text((d) => {
                    var remove = menu.config().removeText;

                    if (remove)
                        return '';
                    else if (!d)
                        return root.name;
                    else
                        return parentName(d)
                });

            var g1 = svg1.insert("g", ".grandparent").datum(d).attr("class", "depth");

            var g = g1.selectAll("g").data(d._children).enter().append("g");

            g.attr("id", (d) => {
                return treeLib.pathId(d, position1);
            }).attr("class", (d) => {
                return treeLib.isLeaf(d) ? "leaf" : "";
            });

            // only add the class and event listeners to nodes with children
            g.filter(function (d) {
                return d._children;
            })
                .classed("children zoomable " + position1, true)
                .on("linkedClick", (d) => linkedClickTransition(d))
                .on("click", (d) => transition(d));

            g.selectAll(".child")
                .data(function (d) {
                    return d._children || [d];
                })
                .enter()
                .append("rect")
                .attr("class", "child")
                .call(rect);

            g.append("rect")
                .attr("class", "parent")
                .on("mouseover", (d) => treeLib.mouseoverLinking(position1, position2, d))
                .on("mouseout", (d) => treeLib.mouseoutLinking(position1, position2, d))
                .call(rect)
                .append("title")
                .text((d) => d.name + "\n" + menu.dataInfoSizeText(d.value));

            g.append("text")
                .attr("dy", ".75em")
                .text(function (d) {
                    var remove = menu.config().removeText;

                    if (remove)
                        return '';

                    var n = d.name;

                    if (treeLib.isLeaf(d)) n = n.split(" ")[0] + "...";

                    return n;
                })
                .call(text);

            function transition(d) {
                treeLib.linkedClick(d, position2);

                if (transitioning || !d) return;

                transitioning = true;

                treeLib.transitioning(true);

                treeLib.displaySelectedNode(d);

                var g2 = display(d),
                    t1 = g1.transition().duration(750),
                    t2 = g2.transition().duration(750);

                // Update the domain only after entering new elements.
                x.domain([d.x, d.x + d.dx]);
                y.domain([d.y, d.y + d.dy]);

                // Enable anti-aliasing during the transition.
                svg.style("shape-rendering", null);

                // Draw child nodes on top of parent nodes.
                svg.selectAll(".depth").sort(function (a, b) {
                    return a.depth - b.depth;
                });

                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);

                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);

                // Remove the old node when the transition is finished.
                t1.remove().each("end", function () {
                    svg.style("shape-rendering", "crispEdges");
                    transitioning = false;
                    treeLib.transitioning(false);
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
                svg.selectAll(".depth").sort(function (a, b) {
                    return a.depth - b.depth;
                });

                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);

                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);

                // Remove the old node when the transition is finished.
                t1.remove().each("end", function () {
                    svg.style("shape-rendering", "crispEdges");
                    transitioning = false;
                });
            }

            function linkedClickTransition(d) {
                if (transitioning || !d) return;
                transitioning = true;

                // prevent events in other containers when ZT is transitioning
                treeLib.transitioning(true);

                var g2 = display(d),
                    t1 = g1.transition().duration(750),
                    t2 = g2.transition().duration(750);

                // Update the domain only after entering new elements.
                x.domain([d.x, d.x + d.dx]);
                y.domain([d.y, d.y + d.dy]);

                // Enable anti-aliasing during the transition.
                svg.style("shape-rendering", null);

                // Draw child nodes on top of parent nodes.
                svg.selectAll(".depth").sort(function (a, b) {
                    return a.depth - b.depth;
                });

                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);

                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);

                // Remove the old node when the transition is finished.
                t1.remove().each("end", function () {
                    svg.style("shape-rendering", "crispEdges");
                    transitioning = false;
                    treeLib.transitioning(false);
                });
            }
            return g;
        }

        function text(text) {
            text.attr("x", function (d) {
                return x(d.x) + 6;
            }).attr("y", function (d) {
                return y(d.y) + 6;
            });
        }

        function rect(rect) {
            rect.attr("x", function (d) {
                return x(d.x);
            })
                .attr("y", function (d) {
                    return y(d.y);
                })
                .attr("width", function (d) {
                    return x(d.x + d.dx) - x(d.x);
                })
                .attr("height", function (d) {
                    return y(d.y + d.dy) - y(d.y);
                })
                .attr("fill", function (d) {
                    return treeLib.getColor(d, color);
                })
                .style("stroke", "white")
                .style("stroke-width", 1);
        }

        function name(d) {
            return d.parent ? name(d.parent) + "." + d.name : d.name;
        }

        function parentName(d) {
            var n = name(d);

            var nameArr = name(d).split(".");

            return n;
        }

        d3.select("svg#" + position1).dispatch("doneDrawing");
    });
}
