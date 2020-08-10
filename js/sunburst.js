function draw_sunburst(position) {
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = treeLib.getOtherGraphType(position2);

    var width = 500,
        height = 500,
        radius = Math.min(width, height) / 2 - 10;

    var formatNumber = d3.format(",d");

    var x = d3.scaleLinear().range([0, 2 * Math.PI]);

    var y = d3.scaleSqrt().range([0, radius]);

    var partition = d3.partition();

    var arc = d3
        .arc()
        .startAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
        })
        .endAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
        })
        .innerRadius(function (d) {
            return Math.max(0, y(d.y0));
        })
        .outerRadius(function (d) {
            return Math.max(0, y(d.y1));
        });

    var svg = d3
        .select(position)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var filename = menu.getFileName();

    d3.json(filename, function (error, data) {
        if (error) throw error;
        // FILTER JSON
        data = menu.filterJson(data);

        var root = d3
            .hierarchy(data)
            .sum(function (d) {
                return d.size;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            });

        // preserve the accSize for citations
        root = treeLib.preserveAccSize(root);

        // process the value as either leaves or acc size depending on control panel
        root = menu.processAccumulated(root);

        svg.selectAll("path")
            .data(partition(root).descendants())
            .enter()
            .append("path")
            .attr("d", function (d) {
                // if collapsible tree comparison or zoomable tree map!!!
                // only show the root and first level to match these
                if (treeLib.restrictLevels(d, 2, position2)) return;

                return arc(d);
            })
            .style("fill", function (d) {
                if (!d.parent) return "#e6e6e6";
                else return treeLib.getColor(d, color);
            })
            .style("stroke", "white")
            .style("stroke-width", 0.5)
            .attr("id", (d) => {
                return treeLib.pathId(d, position1);
            })
            .attr("class", (d) => {
                var cls = treeLib.isLeaf(d) ? "leaf cursor-default" : "";

                return cls;
            })
            .classed(position1, true)
            .on("mouseover", (d) => treeLib.mouseoverLinking(position1, position2, d))
            .on("mouseout", (d) => treeLib.mouseoutLinking(position1, position2, d))
            .on("linkedClick", (d) => linkedClickClick(d))
            .on("click", (d) => {
                treeLib.displaySelectedNode(d);

                var prevent = treeLib.preventLeaf(d, position1);

                if (prevent) return;

                click(d);
            })
            .append("title")
            .text((d) => {
                var dataName = d.data.name;

                return dataName + "\n" + menu.dataInfoSizeText() + formatNumber(d.accSize);
            });

        d3.select("svg#" + position1).dispatch("doneDrawing");
    });

    function click(d) {
        var response = treeLib.linkedClick(d, position2);

        if (response == "prevent") return;

        svg.transition()
            .duration(750)
            .tween("scale", function () {
                var ccn = treeLib.config().containers[1].currentClickedNode;
                var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);

                return function (t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                };
            })
            .selectAll("path")
            .attrTween("d", function (d) {
                return function () {
                    // returns the arc(d) for acceptable things
                    // to show the only first level on return to root CT & ZT
                    return treeLib.restrictOnReturn(d, position1, position2, arc);
                };
            });
    }

    function linkedClickClick(d) {
        svg.transition()
            .duration(750)
            .tween("scale", function () {
                var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                return function (t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                };
            })
            .selectAll("path")
            .attrTween("d", function (d) {
                return function () {
                    // return arc(d);
                    return treeLib.restrictOnReturn(d, position1, position2, arc);
                };
            })
            .style("visibility", "visible")
            .style("visibility", function (d) {
                return treeLib.hideArcs(position1, d);
            });
    }

    d3.select(self.frameElement).style("height", height + "px");
}
