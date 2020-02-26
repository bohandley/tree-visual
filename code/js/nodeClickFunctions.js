// WHAT ABOUT ZOOMING TO ANOTHER NODE/BRANCH OUTSIDE THE ONE YOU"RE ON???
// THIS IS ABLE TO BE FIGURED OUT BY COMPARING THE 
// SEARCHED FOR NODE WITH THE cfg.prvClk.pack
// we'll zoom out and then zoom in.
function zoomableTreeResponse(d, is_root=0) {
		
	if (d3.select(".grandparent").size() == 0)
		return;

	if (cfg.zoomZooming){
		console.log("Zooming in progress...")
		return 0;
	}
	// ZOOM IN ON ZOOMABLE GRAPH FUNCTION
	if(cfg.change > 1 || (cfg.zoomableTransition > 0) ) {
		cfg.change = 0;
		return 0;
	}
	
	
	// build the id for the zoomable graph from the node clicked in pack
	var zoomableTargetId = ["zoomable"].concat(buildId(d).reverse()).join("-");

	// PACK COULD ALSO BE RESPONSIVE RADIAL TREE, SO GIVE THIS ANOTHER NAME, clickedId
	// build this with eith er the pack or the responsive radial tree
	var clickedId = ["pack"].concat(buildId(d).reverse()).join("-");

		// this could be the responsive radial tree, so how can we tell that we're storing the 
		// prvClk.pack or the prvClk.respTree? 
	var prevClickedId = cfg.prvClk.pack;

	var isTheSamePackEl = (clickedId == cfg.prvClk.pack);

	cfg.prvClk.pack = clickedId;



	
	

	
	// get the grandparent of the zoomable tree
	var grandParent = d3.select(".grandparent").attr("id");
	

	// build a collection of exposed zoomable elements
	var zoomableElements = d3.selectAll(".zoomable");
		// we'll search through this later, partialZoomIds
		// and currently we'll reassign the partialZoomArrLength
		// how many nodes are in the path?
		// if it's the same amount as what the built up id/path is
				// simple one level
		// if it's level, then we have to zoom multiple levels

		// get the pathid of the zoomable tree that needs to zoom
	// what zoomable elements are exposed?
	// select the exposed element that most closely resembles the
	// pack view node
	// var id;
	var zoomableTargetPathArr = zoomableTargetId.split("-");

	var zoomableTargetPathLength = zoomableTargetPathArr.length;
	
	var partialZoomArrLength = zoomableTargetPathLength;
	
	var partialZoomIds = [];

	zoomableElements.each(function(d){ 
		var zPId = d3.select(this).attr("id");

		var zPArr = zPId.split("-");
		partialZoomArrLength = zPArr.length;
		
		partialZoomIds.push(zPArr);
	});


	// how to tell that it's a zoom-out and zoom-in vs a straight zoomout?
			// iterate with index over the clicked pack and the prev clicked pack
				// compare each element if not equal and the curr is not null

	var isZoomOutAndZoomIn = false;

	// Path. In a tree data structure, the sequence of 
	// Nodes and Edges from one node to another node is called as PATH 
	// between that two Nodes. Length of a Path is total 
	// number of nodes in that path.

	var prevPath = prevClickedId.split("-");
	var currPath = clickedId.split("-");

	var zoomOutPathArr = [];
	var zoomInPathArr = [];
	// the prev path is longer so we want to iterate over that to get the full length
	// build the shortened zoom out path here
	// but also make a collection of the leftovers
	prevPath.forEach(function(prevNode, i){
		var currNode = currPath[i];

		if((((prevNode != currNode) && currNode != null) || isZoomOutAndZoomIn) && prevPath != ''){
			isZoomOutAndZoomIn = true;
			zoomInPathArr.push(currNode);
		} else {
			if(i==0){
					zoomOutPathArr.push('zoomable');
					zoomInPathArr.push('zoomable');
			} else {
					zoomOutPathArr.push(currNode);
					zoomInPathArr.push(currNode);
			}
		}
	});
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
			//zoom all the way out
	} else if ( (zoomableElements.size() == 0 && grandParent != zoomableTargetId) || is_root || isZoomOutAndZoomIn){
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
	var zoomableTargetPathArr = zoomableTargetIdFULL.split('-');
	var zoomableTargetPathLength = zoomableTargetPathArr.length;

	cfg.zoomZooming = true;
	// go up so many times
	var transition = 600;
	
	var rGrPar = grandParent + "-root";

	// Need to work on stopping click events for pack when this is going on
	var zoomTimeOver = rGrPar.split("-").length - zoomableTargetId.split("-").length;
	var zTime = 1;

	for ( zTime, rGrPar, p = Promise.resolve(); rGrPar != zoomableTargetId; ){
		p = p.then(_ => new Promise(resolve =>{
			// if (zTime == zoomTimeOver)
			//     cfg.zoomZooming = false;

			d3.select(".grandparent").dispatch("drill");
			transition += 200;
			// zTime++
			return setTimeout(function(){
				if (zTime == zoomTimeOver){
					if(stopZooming)
						cfg.zoomZooming = false;
					else
						zoomInDrill(zoomableTargetIdFULL, 1)    
				}
								
							
				zTime++;
				return resolve();   
			}, transition);
		}));
			
		var gArr = rGrPar.split("-");
		gArr.pop();
		rGrPar = gArr.join("-");
	} 
}

function zoomInDrill(zoomableTargetId, outAndIn=0){

	var zoomableTargetPathArr = zoomableTargetId.split('-');
	var zoomableTargetPathLength = zoomableTargetPathArr.length;
	
	var zoomableElements = d3.selectAll(".zoomable");

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
	var partialZoomArrLength = zoomableTargetPathLength;
	var partialZoomIds = [];

	zoomableElements.each(function(d){ 
		var zPId = d3.select(this).attr("id");

		var zPArr = zPId.split("-");
		partialZoomArrLength = zPArr.length;
		
		partialZoomIds.push(zPArr);
	});

	// zoom in one level
	if(partialZoomArrLength == zoomableTargetPathLength){
		d3.select("#"+zoomableTargetId).dispatch('click', function(){
			cfg.change = cfg.change + 1;
			cfg.zoomZooming = false;
		});

		return;
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
			if(zoomableTargetPathArr.indexOf(zoomArr[i]) > -1){
				partiallyZoomedId.push(zoomArr[i]);
			}
		}

		if (partiallyZoomedId.length > gDiff) {
			newId = partiallyZoomedId.join("-");
			gDiff = partiallyZoomedId.length;
		}
	});
	
	var extra = []; 

	zoomableTargetPathArr.forEach(function(node){
		if (newId.split("-").indexOf(node) == -1)
			extra.push(node);
	});

	cfg.zoomableTransition = zoomableTargetPathLength - partialZoomArrLength;
	
	var partialPathId = newId; 

	var transition = 600;
	// We're going to need to update the cfg.zoomzooming in the final setTimeout function,
	// Need to work on stopping click events for pack when this is going on
	var zoomTimeOver = cfg.zoomableTransition;
	var zTime = 0;

	for (zTime, cfg.zoomableTransition, p = Promise.resolve(); cfg.zoomableTransition >= 0; cfg.zoomableTransition--){
		p = p.then(_ => new Promise(resolve =>{
			
			d3.select("#"+partialPathId).dispatch('drill')
			partialPathId += '-' + extra.shift();
			transition += 200;
			
			return setTimeout(function(){
				if (zTime == zoomTimeOver)
					cfg.zoomZooming = false;
					
				zTime++;
				return resolve();   
			}, transition);
			
		}));
	}  
	
	cfg.zoomableTransition = 0;

}
