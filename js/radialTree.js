function draw_radial_tree(position) {
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = treeLib.getOtherGraphType(position2);

    var svg = d3.select(position);
    var radius = 250;
    var width = 500;
    var height = 500;

    function autoBox() {
        const { x, y, width, height } = this.getBBox();
        // fix strange non square issue
        return [x, y, width, width];
    }

    var formatNumber = d3.format(",d");

    var filename = menu.getFileName();

    d3.json(filename, function (error, data) {
        var originalData = copy(data);

        // FILTER JSON
        var data = menu.filterJson(data);

        var filteredData = copy(data);

        menu.changeNum(originalData, filteredData);

        var tree = d3.cluster().size([2 * Math.PI, radius - 100]);

        var root = tree(d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))).sum(function (d) {
            return d.size;
        });

        // preserve the accSize for citations
        root = treeLib.preserveAccSize(root);

        // process the value as either leaves or acc size depending on control panel
        root = menu.processAccumulated(root);

        menu.crtScaleLog(root.value, 5);

        var link = svg
            .append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1)
            .selectAll("path")
            .data(root.links())
            .enter()
            .append("path")
            .attr(
                "d",
                d3
                    .linkRadial()
                    .angle((d) => d.x)
                    .radius((d) => d.y)
            );

        var node = svg
            .append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(root.descendants().reverse())
            .enter()
            .append("g")
            .attr("id", function (d) {
                return treeLib.pathId(d, position1);
            })
            .attr(
                "transform",
                (d) => `
                rotate(${(d.x * 180) / Math.PI - 90})
                translate(${d.y},0)
            `
            )
            .attr("class", (d) => {
                return treeLib.isLeaf(d) ? "leaf" : "";
            });

        node.append("circle")
            .attr("fill", function (d) {
                if (!d.parent) return "#e6e6e6";
                else return treeLib.getColor(d, color);
            })
            .attr("r", (d) => {
                return menu.getNodeSize(d, position1[1], menu.config().proportionalSize[position1[1]], "Radial_Tree");
            })
            .style("stroke", "steelblue")
            .style("stroke-width", 1)
            .attr("class", "node-size")
            .on("click", function (d) {
                treeLib.displaySelectedNode(d);
            })
            .on("mouseover", function (d) {
                // does highlighting and title text
                treeLib.mouseoverLinking(position1, position2, d);
            })
            .on("mouseout", function (d) {
                treeLib.mouseoutLinking(position1, position2, d);
            });

        node.append("text")
            .attr("class", "label")
            .style("font-size", "8px")
            .attr("dy", "0.31em")
            .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
            .attr("text-anchor", (d) => (d.x < Math.PI === !d.children ? "start" : "end"))
            .attr("transform", (d) => (d.x >= Math.PI ? "rotate(180)" : null))
            .text((d) => treeLib.getNodeDisplayName(d.data.name, menu.config().removeText))
            .clone(true)
            .lower()
            .attr("stroke", "white");

        //yield svg.node();

        svg.attr("viewBox", autoBox);

        d3.select("svg#" + position1).dispatch("doneDrawing");
    });
}
