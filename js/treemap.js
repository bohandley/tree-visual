function draw_treemap(position, selectindex) {
    var position2 = position == "#g1" ? "g2" : "g1";
    var position1 = position == "#g1" ? "g1" : "g2";

    var otherGraphType = treeLib.getOtherGraphType(position2);

    var svg = d3.select(position);
    var width = 500;
    var height = 500;

    var format = d3.format(",d");

    var tilings = [d3.treemapBinary, d3.treemapDice, d3.treemapSlice, d3.treemapSliceDice];//, d3.treemapResquarify];

    var treemap = d3.treemap().tile(tilings[selectindex]).size([width, height]).round(true).paddingInner(1);

    var filename = menu.getFileName();

    d3.json(filename, function (error, data) {
        var originalData = copy(data);

        // FILTER JSON
        var data = menu.filterJson(data);

        var filteredData = copy(data);

        menu.changeNum(originalData, filteredData);

        var root = d3
            .hierarchy(data)
            .eachBefore((d) => (d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name))
            .sum((d) => d.size)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        // preserve the accSize for citations
        root = treeLib.preserveAccSize(root);

        // process the value as either leaves or acc size depending on control panel
        root = menu.processAccumulated(root);

        treeLib.displaySelectedNode(root);

        treemap(root);

        var cell = svg
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")");

        cell.append("rect")
            .attr("id", (d) => treeLib.pathId(d, position1))
            .attr("class", (d) => {
                return treeLib.isLeaf(d) ? "leaf" : "";
            })
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("fill", (d) => {
                if (!d.parent) return "#e6e6e6";
                else return treeLib.getColor(d, color);
            })
            .on("mouseover", (d) => treeLib.mouseoverLinking(position1, position2, d))
            .on("mouseout", (d) => treeLib.mouseoutLinking(position1, position2, d))
            .on("click", function (d) {
                treeLib.displaySelectedNode(d);
            });

        cell.append("clipPath")
            .attr("id", (d) => "clip-" + d.data.id)
            .append("use")
            .attr("xlink:href", (d) => "#" + d.data.id);

        // create the custom tooltip to display the whole text
        d3.select('body')
            .append('div')
            .attr('id', 'treemap-tooltip')
            .attr('style', 'position: absolute; opacity: 0;');

        let tooltipTimer;

        cell.on('mouseover', function(d) {
            let treemapTooltip = d3.select('#treemap-tooltip')

            treemapTooltip
                .style('left', (d3.event.pageX+10) + 'px')
                .style('top', (d3.event.pageY+10) + 'px')

            let text1 = newline(d.data.id);
            let text2 = menu.dataNodeSizeText(d.accSize);

            treemapTooltip
                .append("p")
                .text(text1);

            treemapTooltip
                .append("p")
                .text(text2)
            
            tooltipTimer = setTimeout(function(){
                treemapTooltip
                .transition()
                .duration(200)
                .style('opacity', 1) 
            }, 1000)
            

        })
        .on('mouseout', function() {
            clearTimeout(tooltipTimer);

            d3.select('#treemap-tooltip')
                .style('opacity', 0)
                .html("");
        })
        .on('mousemove', function() {
            // d3.select('#treemap-tooltip')
            //     .style('left', (d3.event.pageX+10) + 'px')
            //     .style('top', (d3.event.pageY+10) + 'px')
        })

        // cell.append("svg:title").text((d) => {
        //      return newline(d.data.id) + "\n" + menu.dataNodeSizeText(d.accSize)
        //     })
        //     .style("width", "1000px");

          // create a tooltip
    //       var div = d3.select("body").append("div") 
    // .attr("class", "tooltip")               
    // .style("opacity", 0);
    //     let tooltip = cell.append("g")
    //         .attr("class", "treemap-title")
    //         .attr("transform", "translate(20,20)")
    //         .attr("opacity", .9)

    //     let rect = tooltip.append("rect")
            
    //         rect.attr("rx", 100)
    //         .attr("width", 100)
    //         .attr("height", 100)


        // let treemapText = tooltip.append("text")

        // treemapText.text((d) => {
        //      return newline(d.data.id) + "\n" + menu.dataNodeSizeText(d.accSize)
        //     })
        
        function newline(id) {
            var storedId = id;
            var idLen = id.split(".").length;
            var pathEls = id.split(".");

            var newId = pathEls.map(function(el,idx){
                // check the end, some leaves end with '.'
                let fullLength = storedId.split(".").length;

                // don't add the => for the last element
                if (idx == fullLength - 1 || pathEls[idx + 1] == '')
                    return el;
                else
                    return el + " => ";
                // var dashLength = idLen - idx;
                // var dash = "--".repeat(dashLength);

                // if (idx == storedId.split(".").length - 1){
                //     return dash + " " + el + "\n";
                // } else {
                //     return dash + " " + el + "\n | \n";
                // }

            }).join("");

            return newId;
        }

        d3.select("svg#" + position1).dispatch("doneDrawing");
    });
}
