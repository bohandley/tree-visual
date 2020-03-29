function zoomableTreeResponse(d, position, position2, otherGraph, is_root=0) {
	if (d3.select(".grandparent").size() == 0)
		return;

	if (cfg.zoomZooming){
		console.log("Zooming in progress...")
		return 0;
	}
	
	if(cfg.change > 1 || (cfg.zoomableTransition > 0) ) {
		cfg.change = 0;
		return 0;
	}
	
	// build the id for the zoomable graph from the node clicked in pack
	// var zoomableTargetId = [position2].concat(buildId(d).reverse()).join("-");
	var zoomableTargetId = cleanNodeId(buildPositionId(d, position2));
	
	// build this with either the pack or the responsive radial tree
	var clickedId = cleanNodeId(buildPositionId(d, position));
		
	var prevClickedId = cfg.prvClk.pack;

	var isTheSamePackEl = (clickedId == cfg.prvClk.pack);

	cfg.prvClk.pack = clickedId;
	
	// get the grandparent of the zoomable tree
	var grandParent = d3.select(".grandparent").attr("id");
	
	// search through the zoomable elements and if there is an element that
	// is part of the target, that meeans it's a zoom in,
	// but if no elements are part of the targetId, then it's a zoom out
	// basically, the target path which may be closer to the root will be smaller
	// than any thing closer to the leaves. So exposed elements that are longer than the 
	// target  means we're deeper in the graph and need to zoom out
	var partialPathId = "";
	var zoomableElements = d3.selectAll(".zoomable")
		.filter(function(el){ 
			return zoomableTargetId.includes(d3.select(this).attr("id"))
		}).each(function(el){
			partialPathId = d3.select(this).attr("id");
		});


	// how to tell that it's a zoom-out and zoom-in vs a straight zoomout?
			// iterate with index over the clicked pack and the prev clicked pack
				// compare each element if not equal and the curr is not null

	var isZoomOutAndZoomIn = false;

	// Path. In a tree data structure, the sequence of 
	// Nodes and Edges from one node to another node is called a PATH 
	// between those two Nodes. Length of a Path is total 
	// number of nodes in that path.

	var prevPath = prevClickedId.split("-");
	var currPath = clickedId.split("-");

	var zoomOutPathArr = [];
	var zoomInPathArr = [];
	
	// the prev path is longer so we want to iterate over that to get the full length
	// build the shortened zoom out path here
	// but also make a collection of the leftovers

	// which ever is the longer path, do that one
	if(prevPath.length > currPath.length){
		prevPath.forEach(function(prevNode, i){
			var currNode = currPath[i];

			if((((prevNode != currNode) && currNode != null) || isZoomOutAndZoomIn) && prevPath != ''){
				isZoomOutAndZoomIn = true;
				zoomInPathArr.push(currNode);
			} else {
				if(i==0){
						zoomOutPathArr.push(position2);
						zoomInPathArr.push(position2);
				} else {
						zoomOutPathArr.push(currNode);
						zoomInPathArr.push(currNode);
				}
			}
		});
	} else {
		currPath.forEach(function(currNode, i){
			var prevNode = prevPath[i];

			if((((prevNode != currNode) && prevNode != null) || isZoomOutAndZoomIn) && prevPath != ''){
				isZoomOutAndZoomIn = true;
				zoomInPathArr.push(currNode);
			} else {
				if(i==0){
					zoomOutPathArr.push(position2);
					zoomInPathArr.push(position2);
				} else {
					zoomOutPathArr.push(currNode);
					zoomInPathArr.push(currNode);
				}
			}
		});
	}
	// if there are no zoomable elements, it is the root
	// and should go up as many as it takes to get to the same node

	// what about if we click the great grand parent of Pack?
	// what if we click the same element we're in in pack?

	// check if the zoom is going deeper
	// check where the zoom is and which direction, up or down
		// is it at the root?
		
		// if zooming in, down, 
		// the partialZoomArrLength is less than the pack idArrLegth
		
		// if zooming out, up, 
		// the partialZoomArrLength is greater than the pack selected zoomableTargetPathLength
	if (isTheSamePackEl && otherGraph == "Pack") {
	 	//zoom all the way out
	} else if (grandParent == zoomableTargetId){
		// do not close the nodes of the CT graph if it is the tree
		// and the ZT's grandparent has been clicked
		d3.select("#"+zoomableTargetId).dispatch('click', function(){
			cfg.change = cfg.change + 1;
			cfg.zoomZooming = false;
		});
		
		if(otherGraph == "Collapsible_Tree"){
			// if cfg.change = 0, 
			// this is when the ZT has completed it's work,
			// started the second round in zoomableTreeResponse,
			// exited out and reset the cfg.change
			// THE FIRST FIRING IS STILL GOING ON
			// FROM LN 124 WHERE IT DISPATCHES A CLICK IN THE TREE,
			// RETURNS TO THE TREE LN 93 AND GETS BACK INTO THE
			// SECOND zoomableTreeResponse, WHICH IT EXITS FIRST!
			// THE SECOND FIRING ENDS FIRST, WHERE IT EXITS IN LN 11
			// WHERE cfg.change > 1 AND ONLY AFTER THAT DO WE 
			// GET TO THIS PART OF THE CODE
			// (there is some leftover behavior of cfg.prvclk where it falsely
			// thinks the same node has been)
			if(cfg.change == 0)
				return 1;
			else
				return 0;	
		} else if(otherGraph == "Pack") // the pack will zoom out when the grandparent is clicked
			return 1;
	}else if ( (partialPathId == "" && grandParent != zoomableTargetId) || isZoomOutAndZoomIn || is_root){
		// either go up so many times
			// prevClickedId = "pack-flare-1996-empty-Other"
			// clickedId = "pack-flare-1996"
		
		// or go up all the way
			// prevClickedId = "pack-flare-1996-empty-Other"
			// clickedId = "pack-flare"
		
		// OR GO UP SO MANY TIMES THEN GO DOWN
			// when going up so many times, 
			// how will we compare the previous click
			// to where we need to go?
				// prevClickedId = "pack-flare-1996-empty-Other"
				// clickedId = "pack-flare-1988-empty"
				// zoomableTargetId = "zoomable-flare-1988-empty"

					// compare, start from the root
					// get the greatest common root
					// zoom up to that
							// replace the zoomableTarget with this?

		// reassign the zoomableTargetId here
		if(isZoomOutAndZoomIn){
			// remove null values from the zoom in path and the zoomout path
			zoomableTargetId = zoomOutPathArr.filter(Boolean).join('-');
			zoomableTargetIdFULL = zoomInPathArr.filter(Boolean).join('-');
			// zoomOutDrill fun with a nested zoomIn function
			zoomOutDrill(grandParent, zoomableTargetId, zoomableTargetIdFULL, 0);
		} else
			zoomOutDrill(grandParent, zoomableTargetId, '', 1);
 
	} else {
		zoomInDrill(zoomableTargetId);
	}

	return 1;
}

function zoomOutDrill(grandParent, zoomableTargetId, zoomableTargetIdFULL, stopZooming=0){
	// var zoomableTargetPathArr = zoomableTargetIdFULL.split('-');
	// var zoomableTargetPathLength = zoomableTargetPathArr.length;

	cfg.zoomZooming = true;
	// go up so many times
	var transition = 600;
	
	// var rGrPar = grandParent;// + "-root";

	// Need to work on stopping click events for pack when this is going on
	// var zoomTimeOver = rGrPar.split("-").length - zoomableTargetId.split("-").length;
	

	cfg.zoomableTransition = grandParent.split("-").length - zoomableTargetId.split("-").length;//zoomableTargetPathLength - partialZoomArrLength;
	
	var zoomTimeOver = cfg.zoomableTransition;

	var zTime = 0;
	// var partialPathId = newId; 

	// var transition = 600;
	// We're going to need to update the cfg.zoomzooming in the final setTimeout function,
	// Need to work on stopping click events for pack when this is going on
	var zoomTimeOver = cfg.zoomableTransition;

	// handle CT and ZT interaction bug
	// bug includes when grandParent includes this-is-beyond-flare
	// if(zoomTimeOver<zTime || grandParent.includes("this-is-beyond-flare")){
	if(zoomTimeOver < zTime){
		if(zoomableTargetIdFULL == ""){
			cfg.zoomZooming = false;
			cfg.zoomableTransition = 0;
		} else
			d3.select("#"+ zoomableTargetIdFULL).dispatch("drill", function(){
				cfg.zoomZooming = false;
				cfg.zoomableTransition = 0;
			});
		
		return;
	}

	
	for (zTime, p = Promise.resolve(); cfg.zoomableTransition >= 0; cfg.zoomableTransition--){
		p = p.then(_ => new Promise(resolve =>{

			d3.select(".grandparent").dispatch("drill");
			transition += 200;

			return setTimeout(function(){
				if (zTime == zoomTimeOver){
					if(stopZooming)
						cfg.zoomZooming = false;
					else
						zoomInDrill(zoomableTargetIdFULL)    
				}
							
				zTime++;
				return resolve();   
			}, transition);
		}));

	}
	cfg.change = 0;
	cfg.zoomableTransition = 0;
}

function zoomInDrill(zoomableTargetId){

	var zoomableTargetPathArr = zoomableTargetId.split('-');

	var zoomableTargetPathLength = zoomableTargetPathArr.length;
	
	// zoomable tree drill in
	// can we just search for the one that is closest to the targetId?
	// var zoomableElements = d3.selectAll(".zoomable").filter(function(el){ return d3.select(this).attr("id").includes(position)});
	var partialPathId = "";
	var zoomableElements = d3.selectAll(".zoomable")
		.filter(function(el){ 
			return zoomableTargetId.includes(d3.select(this).attr("id"))
		}).each(function(el){
			partialPathId = d3.select(this).attr("id");
		});

	// build a collection of exposed zoomable elements
		// we'll search through this later, partialZoomIds
		// and currently we'll reassign the partialZoomArrLength
		// how many nodes are in the path?
		// if it's the same amount as what the built up id/path is
				// simple one level
		// if it's level, then we have to zoom multiple levels
	var partialZoomArrLength = partialPathId.split("-").length;

	// zoom in one level
	// handle the zoomout of CT and ZT when the ZT grandparent is clicked
	if(partialZoomArrLength == zoomableTargetPathLength){
		d3.select("#"+zoomableTargetId).dispatch('click', function(){
			cfg.change = cfg.change + 1;
			cfg.zoomZooming = false;
		});

		return;
	} else if (partialZoomArrLength > zoomableTargetPathLength)
		debugger;

	cfg.zoomZooming = true;
	
	var extra = []; 

	zoomableTargetPathArr.forEach(function(node){
		// if (newId.split("-").indexOf(node) == -1)
		if (partialPathId.split("-").indexOf(node) == -1)
			extra.push(node);
	});

	cfg.zoomableTransition = zoomableTargetPathLength - partialZoomArrLength;
	
	// var partialPathId = newId; 

	var transition = 600;
	// We're going to need to update the cfg.zoomzooming in the final setTimeout function,
	// Need to work on stopping click events for pack when this is going on
	var zoomTimeOver = cfg.zoomableTransition;
	var zTime = 0;

	if(zoomTimeOver<zTime){
		cfg.zoomZooming = false;
		return;
	}

	for (zTime, cfg.zoomableTransition, p = Promise.resolve(); cfg.zoomableTransition >= 0; cfg.zoomableTransition--){
		p = p.then(_ => new Promise(resolve =>{
			
			d3.select("#"+partialPathId).dispatch('drill')
			partialPathId += '-' + extra.shift();
			transition += 200;
			
			return setTimeout(function(){
				if (zTime == zoomTimeOver){
					cfg.zoomZooming = false;
					cfg.change = 0;
				}
					
				zTime++;
				return resolve();   
			}, transition);
			
		}));
	}  
	
	cfg.zoomableTransition = 0;

}

function treeResponse(d, position, position2, is_root=0) {
	if (cfg.zoomZooming){
		console.log("Zooming in progress...")
		return 0;
	}

	// WILL NEED TO SEARCH FOR CLICKABLE NODES,
	// IF THOSE ARE NOT AVAILABLE, CLICK THE ONE IN THE PATH AVAILABLE
	
	// build the id for the tree graph from the node clicked in pack
	// var targetId = [position2].concat(buildId(d).reverse()).join("-");
	var id = cleanNodeId(buildPositionId(d, position2));

	var targetNode = d3.select("#"+id)

	if(targetNode.size() > 0 && targetNode.attr("class").includes("exposed"))
		return 1;
	// PACK COULD ALSO BE RESPONSIVE RADIAL TREE, SO GIVE THIS ANOTHER NAME, clickedId
	// build this with eith er the pack or the responsive radial tree
	// var clickedId = [position].concat(buildId(d).reverse()).join("-");
	var clickedId = cleanNodeId(buildPositionId(d, position));

		// this could be the responsive radial tree, so how can we tell that we're storing the 
		// prvClk.pack or the prvClk.respTree? 
	var prevClickedId = cfg.prvClk.pack;

	var isTheSamePackEl = (clickedId == cfg.prvClk.pack);

	cfg.prvClk.pack = clickedId;

	// if there are no zoomable elements, it is the root
	// and should go up as many as it takes to get to the same node

	// what about if we click the great grand parent of Pack?
	// what if we click the same element we're in in pack?

	// check if the zoom is going deeper
	// check where the zoom is and which direction, up or down
		// is it at the root?
		
		// if zooming in, down, 
		// the partialZoomArrLength is less than the pack idArrLegth
		
		// if zooming out, up, 
		// the partialZoomArrLength is greater than the pack selected zoomableTargetPathLength
	if (isTheSamePackEl){
	
 
	} else {
		// zoom in on the tree and expose parts
		var targetPathArr = id.split('-');
		var targetPathLength = targetPathArr.length;
		
		var zoomableElements = d3.selectAll(".zoomable").filter(function(el){ return d3.select(this).attr("id").includes(position2)});

		// var grandParent = d3.select(".grandparent").attr("id");
		// if there are no zoomable elements, it is the root
		// and should go up as many as it takes to get to the same node
			// what does going up mean?

		// build a collection of exposed zoomable elements
			// we'll search through this later, partialZoomIds
			// and currently we'll reassign the partialZoomArrLength
			// how many nodes are in the path?
			// if it's the same amount as what the built up id/path is
					// simple one level
			// if it's level, then we have to zoom multiple levels
		var partialZoomArrLength = targetPathLength;
		var partialZoomIds = [];

		var extendedPaths = []

		zoomableElements.each(function(d, i){ 
			// get the id of the shown nodes
			var zPId = d3.select(this).attr("id");

			// split id to get the path of the nodes
			var zPArr = zPId.split("-");
			
			// if the shown node id is small enough and matches, is included in the clicked
			// assign the length and save in collection
			if(id.includes(zPId)){
				partialZoomArrLength = zPArr.length;
				partialZoomIds.push(zPArr);
			} else if (zPId.includes(id)){
				// if the target is part of the displayed nodes,
				// then these are the paths we do not need to expand 
				// in the tree graph as a response to the other graph
				// being clicked
				extendedPaths.push(zPArr);
			}
			
			
		});

		// zoom in one level, BUT DON'T ZOOM IN IF THE PATH EXTENDS!
		if(partialZoomArrLength >= targetPathLength){
			// REMEMBER TO HIGHLIGHT THE NODE EVEN IF WE DON"T INTERACT WITH IT
			// check if the path to the leafs is exposed
			// or that the node does not have a class that indicates it is exposed
			

			if(extendedPaths.length == 0){
				// give the node a class to indicate that it is exposed after being clicked
				d3.select("#"+id).attr("class", targetNode.attr("class") + " exposed");
				
				d3.select("#"+id).dispatch('drill', function(){
					// cfg.change = cfg.change + 1;
					cfg.zoomZooming = false;
				});
			}

			return 1;
		}

		// zoom in multiple levels
		var newId = '';
		var gDiff = 0;

		cfg.zoomZooming = true;

		partialZoomIds.forEach(function(zoomArr){ 
			// if the pathid is not present in any of the exposed zoomable elements...
			// get the one that most closely matches it 
			
			var partiallyZoomedId = [];                            
			
			for(var i in zoomArr) {   
				if(targetPathArr.indexOf(zoomArr[i]) > -1){
					partiallyZoomedId.push(zoomArr[i]);
				}
			}

			if (partiallyZoomedId.length > gDiff) {
				newId = partiallyZoomedId.join("-");
				gDiff = partiallyZoomedId.length;
			}
		});
		
		var extra = []; 

		targetPathArr.forEach(function(node){
			if (newId.split("-").indexOf(node) == -1)
				extra.push(node);
		});

		cfg.zoomableTransition = targetPathLength - partialZoomArrLength;
		
		var partialPathId = newId; 

		var transition = 600;
		// We're going to need to update the cfg.zoomzooming in the final setTimeout function,
		// Need to work on stopping click events for pack when this is going on
		var zoomTimeOver = cfg.zoomableTransition;
		var zTime = 0;

		var zoomableElements = d3.selectAll(".zoomable")
        .filter(function(el){ 
            return d3.select(this).attr("id") == id;
        });

    var extendedPathElements = d3.selectAll(".zoomable")
        .filter(function(el){ 
            return d3.select(this).attr("id").includes(id) && d3.select(this).attr("id") != id;
        });

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
		// for (zTime, cfg.zoomableTransition, p = Promise.resolve(); cfg.zoomableTransition >= 0; cfg.zoomableTransition--){
		// 	p = p.then(_ => new Promise(resolve =>{
		// 		var partialTargetNode = d3.select("#"+partialPathId);
		// 		var partTarClass = partialTargetNode.attr("class");

		// 		partialTargetNode.attr("class", partTarClass + " exposed").dispatch('drill')

		// 		partialPathId += '-' + extra.shift();
		// 		transition += 200;
				
		// 		return setTimeout(function(){
		// 			if (zTime == zoomTimeOver)
		// 				cfg.zoomZooming = false;
						
		// 			zTime++;
		// 			return resolve();   
		// 		}, transition);
				
		// 	}));
		// }  
		
		cfg.zoomableTransition = 0;
		cfg.change = 0;
	} 
	return 1;
}

function packResponse(d, position, position2){

	// WILL NEED TO ZOOM OUT FOR RADIAL TREE GRAPH RESPONSE
	// SEARCH FOR NODES ON PAGE ZOOM OUT UNTIL FOUND
	// debugger
	if (cfg.zoomZooming){
		console.log("Zooming in progress...")
		return 0;
	}
	// ZOOM IN ON ZOOMABLE GRAPH FUNCTION
	if(cfg.change > 1 || (cfg.zoomableTransition > 0) ) {
		cfg.change = 0;
		return 0;
	}

	cfg.zoomZooming = true;

	// build the id for the zoomable graph from the node clicked in pack
	// var targetId = [position2].concat(buildId(d).reverse()).join("-");
	var targetId = cleanNodeId(buildPositionId(d, position2));

	// // PACK COULD ALSO BE RESPONSIVE RADIAL TREE, SO GIVE THIS ANOTHER NAME, clickedId
	// // build this with eith er the pack or the responsive radial tree
	// var clickedId = [position].concat(buildId(d).reverse()).join("-");
	var clickedId = cleanNodeId(buildPositionId(d, position2)); 

	// we want to check the last clicked pack noe because
	// if it's the same, we have to treat it as the root
	// and zoom out all the way
	var prevClickedId = cfg.prvClk.pack;

	var isTheSamePackEl = (targetId == prevClickedId);

	cfg.prvClk.pack = targetId;

	// if it's the same, build the root id
	if(isTheSamePackEl){
		cfg.zoomZooming = false;
		return 1; //targetId = targetId.split("-").splice(0,2).join("-");
	}
	

	d3.select("#"+targetId).dispatch('click', function(){
		// cfg.change = cfg.change + 1;
		cfg.zoomZooming = false;
	});
}

function treeExtendedPath(){

}