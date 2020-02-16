var color;

function draw_pack(position){
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
        if (error) throw error;
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
                return ["pack"].concat(buildId(d).reverse()).join("-");
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
                // WHAT ABOUT ZOOMING TO ANOTHER NODE/BRANCH OUTSIDE THE ONE YOU"RE ON???
                // THIS IS ABLE TO BE FIGURED OUT BY COMPARING THE 
                // SEARCHED FOR NODE WITH THE prvClk.pack
                // we'll zoom out and then zoom in.

                // WHAT IS GOING ON WITH ZOOMING IN THE ZOOMABLE TREE
                // AFTER LOADING A NEW GRAPH IN EACH WINDOW?
                // IT'S RUNNING THE CODE TO DISPATCH A CLICK EVENT 
                // FOR THE PACK GRAPH, BUT NOT FIRING IT??

                if (zoomZooming){
                    console.log("Zooming in progress...")
                    return;
                }
                // ZOOM IN ON ZOOMABLE GRAPH FUNCTION
                if(c > 1 || (isTransitioning.zoomable > 0) ) {
                    c = 0;
                    return;
                }
                
                // build the id for the zoomable graph from the node clicked in pack
                var originalId = ["zoomable"].concat(buildId(d).reverse()).join("-");

                var clickedPackId = ["pack"].concat(buildId(d).reverse()).join("-");

                var isTheSamePackEl = (clickedPackId == prvClk.pack);

                prvClk.pack = clickedPackId;
                // get the id of the zoomable tree that needs to zoom
                // what zoomable elements are exposed?
                // select the exposed element that most closely resembles the
                // pack view node
                var id;
                var idArr = originalId.split("-");
                var idArrLength = idArr.length;
                var newId = "";
                var gDiff = 0;
                var partialZoomIds = [];
                var partialZoomArrLength = idArrLength;

                var zoomableElements = d3.selectAll(".zoomable");

                var grandParent = d3.select(".grandparent").attr("id");
                // if there are no zoomable elements, it is the root
                // and should go up as many as it takes to get to the same node
                  // what does going up mean?


                d3.selectAll(".zoomable").each(function(d){ 
                    var zPId = d3.select(this).attr("id");

                    var zPArr = zPId.split("-");
                    partialZoomArrLength = zPArr.length;
                    
                    partialZoomIds.push(zPArr);
                });


                // what about if we click the great grand parent of Pack?
                // what if we click the same element we're in in pack?

                // check if the zoom is going deeper
                // check where the zoom is and which direction, up or down
                    // is it at the root?
                    
                    // if zooming in, down, 
                    // the partialZoomArrLength is less than the pack idArrLegth
                    
                    // if zooming out, up, 
                    // the partialZoomArrLength is greater than the pack selected idArrLength
                if (isTheSamePackEl){
                    //zoom all the way out
                } else if ( zoomableElements.size() == 0 && grandParent != originalId ){
                    zoomZooming = true;
                    // go up so many times
                    var transition = 600;
                    rGrPar = grandParent + "-root";

                    // Need to work on stopping click events for pack when this is going on
                    var zoomTimeOver = rGrPar.split("-").length - originalId.split("-").length;
                    var zTime = 1;

                    for ( zTime, rGrPar, p = Promise.resolve(); rGrPar != originalId; ){
                        p = p.then(_ => new Promise(resolve =>{
                            if (zTime == zoomTimeOver)
                                zoomZooming = false;

                            d3.select(".grandparent").dispatch("drill");
                            transition += 200;
                            zTime++
                            return setTimeout(resolve, transition);
                        }));
                        
                        var gArr = rGrPar.split("-");
                        gArr.pop();
                        rGrPar = gArr.join("-");
                    } 

                } else if (partialZoomArrLength < idArrLength) {
                    zoomZooming = true;

                    partialZoomIds.forEach(function(zoomArr){ 
                        // if the id is not present in any of the exposed zoomable elements...
                        // get the one that most closely matches it 
                        
                        var partiallyZoomedId = [];                            
                        
                        for(var i in zoomArr) {   
                            if(idArr.indexOf(zoomArr[i]) > -1){
                                partiallyZoomedId.push(zoomArr[i]);
                            }
                        }

                        if (partiallyZoomedId.length > gDiff) {
                            newId = partiallyZoomedId.join("-");
                            gDiff = partiallyZoomedId.length;
                        }
                    });
                    
                    var extra = []; 

                    idArr.forEach(function(id){
                        if (newId.split("-").indexOf(id) == -1)
                            extra.push(id);
                    });

                    isTransitioning.zoomable = idArrLength - partialZoomArrLength + 1;
                    
                    id = newId; 

                    var transition = 600;
                    // We're going to need to update the zoomzooming in the final setTimeout function,
                    // Need to work on stopping click events for pack when this is going on
                    var zoomTimeOver = isTransitioning.zoomable;
                    var zTime = 0;

                    for (zTime, isTransitioning.zoomable, p = Promise.resolve(); isTransitioning.zoomable >= 0; isTransitioning.zoomable--){
                        p = p.then(_ => new Promise(resolve =>{
                            
                            d3.select("#"+id).dispatch('drill')
                            id += '-' + extra.shift();
                            transition += 200;
                            
                            return setTimeout(function(){
                                if (zTime == zoomTimeOver)
                                    zoomZooming = false;
                                
                                zTime++;
                                return resolve();   
                            }, transition);
                            
                        }));
                    }  
                    
                    isTransitioning.zoomable = 0;
                 
                } else {
                    id = originalId;
                    d3.select("#"+id).dispatch('click', function(){
                        c += 1;
                    });
                }

                if (focus !== d) zoom(d), d3.event.stopPropagation(); 
            })
            .on("mouseover", function(d){
                var zoomId = ["zoomable"].concat(buildId(d).reverse()).join("-");
                
                d3.select("#"+zoomId).select(".parent").style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
                d3.select(this).style("stroke", "black").style("stroke-width", 1.5).style("cursor", "pointer");
                d3.select(this).append("title").text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })

            })
            .on("mouseout", function(d){
                var zoomId = ["zoomable"].concat(buildId(d).reverse()).join("-");
                d3.select("#"+zoomId).select(".parent").style("stroke", "white").style("stroke-width", 1);

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
            .on("click", null)
            .on("click", function() {
                if(zoomZooming){
                    console.log("Zooming in progress...")
                    return
                }

                if(c > 1){
                    c = 0;
                    return;
                }

                zoom(root); 

                // if we're more than one zoom away from the pack grand parent,
                // we'll have to zoom drill out the zoomable tree
                var packGrParId = ["pack"].concat(buildId(root).reverse()).join("-");
                var isTheSamePackEl = ( packGrParId == prvClk.pack );

                prvClk.pack = packGrParId;

                var packLevels = packGrParId.split("-").length;
                var prevPackLevels = prvClk.pack.split("-").length;

                var zoomRootId = ["zoomable"].concat(buildId(root).reverse()).join("-");

                if (isTheSamePackEl){
                    // do nothing
                } else if ( (prevPackLevels - packLevels) == 1 ){
                    // get the id of the zoomable tree that needs to zoom
                    
                    
                    d3.select("#"+zoomRootId).dispatch('click', function(){
                        c += 1;
                    });

                } else {
                    zoomZooming = true;
                    
                    var grandParent = d3.select(".grandparent").attr("id");

                    var transition = 600;
                    rGrPar = grandParent + "-root";

                    // must make the last one reset zoomZooming to false
                    // how to tell the last one?
                    var zoomTimeOver = rGrPar.split("-").length - zoomRootId.split("-").length;
                    var zTime = 1;
                    for ( zTime, rGrPar, p = Promise.resolve(); rGrPar != zoomRootId; ){
                        p = p.then(_ => new Promise(resolve =>{
                            if (zTime == zoomTimeOver)
                                zoomZooming = false;                                

                            d3.select(".grandparent").dispatch("drill");
                            transition += 200;
                            zTime++;
                            return setTimeout(resolve, transition);
                        }));

                        var gArr = rGrPar.split("-");
                        gArr.pop();
                        rGrPar = gArr.join("-");
                    } 
                }
                
            });

        zoomTo([root.x, root.y, root.r * 2 + margin]);

        function zoom(d) {
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