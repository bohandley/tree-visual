// brushing and linking, mostly linking
// all combinations of graphs
// the moused and the linked
function mouseoverLinking(position1, position2, d, isgr=0){
	let first = getOtherGraphType(position1);
		second = getOtherGraphType(position2),
		position1Id = buildNodeOrLeafId(d, position1),
		position2Id = buildNodeOrLeafId(d, position2);

	mouseoverCT(first, second, position1Id, position2Id);

	mouseoverZT(first, second, position1Id, position2Id, d, isgr);

	mouseoverRT(first, second, position1Id, position2Id);

	mouseoverPack(first, second, position1Id, position2Id);

	mouseoverTreemap(first, second, position1Id, position2Id);

	mouseoverSunburst(first, second, position1Id, position2Id);
}

function mouseoutLinking(position1, position2, d, isgr=0){
	let first = getOtherGraphType(position1),
		second = getOtherGraphType(position2),
		position1Id = buildNodeOrLeafId(d, position1),
		position2Id = buildNodeOrLeafId(d, position2);

	mouseoutCT(first, second, position1Id, position2Id);

	mouseoutZT(first, second, position1Id, position2Id, d, isgr);

	mouseoutRT(first, second, position1Id, position2Id);

	mouseoutPack(first, second, position1Id, position2Id);

	mouseoutTreemap(first, second, position1Id, position2Id);

	mouseoutSunburst(first, second, position1Id, position2Id);
}

function mouseoverCT(first, second, position1Id, position2Id){
	if( first == "Collapsible_Tree" ){   
  		collapsibleTreeResponseMOver(position1Id);
  		otherMouseoverResponse(second, position2Id);	
	}
}

function mouseoutCT(first, second, position1Id, position2Id){
	if( first == "Collapsible_Tree" ){
        collapsibleTreeResponseMOut(position1Id);
        otherMouseoutResponse(second, position2Id);	
	}
}

function mouseoverRT(first, second, position1Id, position2Id){
	if( first == "Radial_Tree" ){   
  		radialTreeResponseMOver(position1Id);
  		otherMouseoverResponse(second, position2Id);	
	}
}

function mouseoutRT(first, second, position1Id, position2Id){
	if( first == "Radial_Tree" ){
        radialTreeResponseMOut(position1Id);
        otherMouseoutResponse(second, position2Id);	
	}
}

function mouseoverPack(first, second, position1Id, position2Id){
	if( first == "Pack" ){   
  		packResponseMOver(position1Id);
  		otherMouseoverResponse(second, position2Id);	
	}
}

function mouseoutPack(first, second, position1Id, position2Id){
	if( first == "Pack" ){
        packResponseMOut(position1Id);
        otherMouseoutResponse(second, position2Id);	
	}
}

function mouseoverTreemap(first, second, position1Id, position2Id){
	if( first == "Treemap" ){   
  		treemapResponseMOver(position1Id);
  		otherMouseoverResponse(second, position2Id);	
	}
}

function mouseoutTreemap(first, second, position1Id, position2Id){
	if( first == "Treemap" ){
        treemapResponseMOut(position1Id);
        otherMouseoutResponse(second, position2Id);	
	}
}

function mouseoverZT(first, second, position1Id, position2Id, d, isgr){
	if( first == "Zoomable_Treemap" ){
		
        if (d == null || isgr ){//( el1 == ".grandparent" )
        	var p1IdMod = "#"+position1Id+".grandparent";
			
			if(d==null)
				p1IdMod = "#"+position1Id.split("-")[0]+".grandparent";

	    	var path = d3.select(p1IdMod).text().split(".");
			var lastNode = cleanNodeId(path[path.length-1]);
			position2Id += "-" + lastNode;

	    	d3.select(p1IdMod)
	    		.style("stroke", "black")
	    		.style("stroke-width", 1.5)
	    		.style("cursor", "pointer");
	    } else {
	        d3.select("#"+position1Id)
	        	.select(".parent")
	        	.style("stroke", d => {
	        		// return getComplement(getColor(d, color));
	        		return "black";
	        	})
	        	.style("stroke-width", 1.5)
	        	.style("cursor", "pointer");

	    }

	    otherMouseoverResponse(second, position2Id);	
	}
}

function mouseoutZT(first, second, position1Id, position2Id, d, isgr){
	if( first == "Zoomable_Treemap" ){
	    if (d == null || isgr){//(el1 == ".grandparent"){
	    	var p1IdMod = "#"+position1Id+".grandparent";
			
			if(d==null)
				p1IdMod = "#"+position1Id.split("-")[0]+".grandparent"

	    	// add the last node to the ZT grandparent d because it is missing this
			var path = d3.select(p1IdMod).text().split(".");
			var lastNode = cleanNodeId(path[path.length-1]);
			position2Id += "-" + lastNode;
			
	    	d3.select(p1IdMod)
	    		.style("stroke", "")
	    		.style("stroke-width", 0.5);

	    } else {
			d3.select("#"+position1Id)
	        	.select(".parent")
	        	.style("stroke", "white")
	        	.style("stroke-width", 0.5);
		}

		otherMouseoutResponse(second, position2Id);	
	}
}

function mouseoverSunburst(first, second, position1Id, position2Id){
	if( first == "Sunburst" ){   
  		sunburstResponseMOver(position1Id);
  		otherMouseoverResponse(second, position2Id);	
	}
}

function mouseoutSunburst(first, second, position1Id, position2Id){
	if( first == "Sunburst" ){
        sunburstResponseMOut(position1Id);
        otherMouseoutResponse(second, position2Id);
	}
}

function otherMouseoverResponse(second, position2Id){
	if(second == "Collapsible_Tree")
		collapsibleTreeResponseMOver(position2Id);
	else if( second == "Radial_Tree" )
		radialTreeResponseMOver(position2Id);
	else if( second == "Pack" )
		packResponseMOver(position2Id);
	else if( second == "Treemap" )
		treemapResponseMOver(position2Id);
	else if( second == "Zoomable_Treemap" )
		zoomableTreeResponseMOver(position2Id, 1);
	else if( second == "Sunburst" )
		sunburstResponseMOver(position2Id);
}

function otherMouseoutResponse(second, position2Id){
	if(second == "Collapsible_Tree")
		collapsibleTreeResponseMOut(position2Id);
	else if( second == "Radial_Tree" )
		radialTreeResponseMOut(position2Id);
	else if( second == "Pack" ) 
		packResponseMOut(position2Id);
	else if( second == "Treemap" )
		treemapResponseMOut(position2Id);
	else if( second == "Zoomable_Treemap" )
        zoomableTreeResponseMOut(position2Id, 1)
	else if( second == "Sunburst" )
		sunburstResponseMOut(position2Id);
}

function packResponseMOver(position2Id){
	var formatNumber = d3.format(",d");

	d3.select("#"+position2Id)
		.style("stroke", "black")
		.style("stroke-width", 1.5)
		.style("cursor", "pointer");
        
    d3.select("#"+position2Id)
    	.append("title")
    	.text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
}

function packResponseMOut(position2Id){
	d3.select("#"+position2Id)
		.style("stroke", "white")
		.style("stroke-width", 1);
}

function sunburstResponseMOver(position2Id){
	d3.select("#"+position2Id)
		.style("stroke", "black")
		.style("stroke-width", 1.5)
		.style("cursor", "pointer");
}

function sunburstResponseMOut(position2Id){
	d3.select("#"+position2Id)
		.style("stroke", "white")
		.style("stroke-width", 0.5);
}

function treemapResponseMOver(position2Id){
	d3.select("#"+position2Id)
		.style("stroke", "black")
		.style("stroke-width", 1.5)
		.style("cursor", "pointer");
}

function treemapResponseMOut(position2Id){
	d3.select("#"+position2Id)
		.style("stroke", "white")
		.style("stroke-width", 0.1);
}

function radialTreeResponseMOver(position2Id){
	var formatNumber = d3.format(",d");

	d3.select("#" + position2Id)
		.select("circle")
		.style("cursor", "pointer")
		.attr("r", 5);
    
    d3.select("#" + position2Id)
    	.select("circle")
    	.append("title")
    	.text(function(d) { return d.data.name + "\n" + formatNumber(d.value); })
}

function radialTreeResponseMOut(position2Id){
	d3.select("#"+position2Id)
		.select("circle")
		.attr("r", 1);
}

function collapsibleTreeResponseMOver(position2Id){
	d3.select("#"+position2Id)
    	.select("circle")
    	.style("stroke", d => {
    		// return getComplement(getColor(d, color));
    		return "black";
    	})
    	.style("stroke-width", 1.5)
    	.style("cursor", "pointer");
}

function collapsibleTreeResponseMOut(position2Id){
	d3.select("#"+position2Id)
    	.select("circle")
    	.style("stroke", "steelblue")
    	.style("stroke-width", 1.5)
    	.style("cursor", "pointer");
}

function zoomableTreeResponseMOver(position2Id, removeNodeForZT=0){
	
	var otherNode = d3.selectAll("#"+position2Id)
    	.select(".parent");

    if(otherNode.size() == 1){
    	otherNode.style("stroke", d => {
        		// return getComplement(getColor(d, color));
        		return "black";
        	})
        	.style("stroke-width", 1.5)
        	.style("cursor", "pointer");
    } else {
    	// assume it's the grandparent that requires one less node
    	// if there is none, that's ok, nothing will fire
    	if(removeNodeForZT){
	    	position2NodeArr = position2Id.split("-");
	    	position2NodeArr.pop();
	    	position2Id = position2NodeArr.join("-");
	    }
    	
    	var grandparentNode = d3.select("#"+position2Id+".grandparent")

        grandparentNode.style("stroke", d => {
        		// return getComplement(getColor(d, color));
        		return "black";
        	})
        	.style("stroke-width", 1.5)
        	.style("cursor", "pointer");
    }
}

function zoomableTreeResponseMOut(position2Id, removeNodeForZT=0){
	var otherNode = d3.select("#"+position2Id)
    	.select(".parent");
	// assume it's the grandparent that requires one less node
	// if there is none, that's ok, nothing will fire
    if(otherNode.size() == 1){

        d3.select("#"+position2Id)
        	.select(".parent")
        	.style("stroke", "white")
        	.style("stroke-width", 0.5);
    } else {

    	if(removeNodeForZT){
	    	position2NodeArr = position2Id.split("-");
	    	position2NodeArr.pop();
	    	position2Id = position2NodeArr.join("-");
	    }

    	var grandparentNode = d3.select("#"+position2Id+".grandparent")

        grandparentNode.style("stroke", "")
        	.style("stroke-width", 0.5);
    }
}
