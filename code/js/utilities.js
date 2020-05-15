
function getColor(d, color){
	// graphs with d.data.name
		// treemap, radial tree, pack, sunburst
	// graphs with d.name
		// zoomable tree, collapsible tree
	if(d.data){
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
   } else {

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
	}
}

function getComplement(rbg){
	var vals = rbg.replace(/[^0-9,\.]+/g, "").split(",")

	var complVals = vals.map(v=> 255 - v);

	var complement = "rgb(" + complVals.join(", ") + ")";

	return complement;
}

// build a unique id from the data name and all the parents
// each graph has a slightly different structure, extra wrappers
// handle each level, root, parent, child
// handle invalid id characters
// handle node names that are empty
function buildId(d) {
	if(d){
		var id = d.name || d.name == "" ? d.name : d.data.name;
		
		if (id == "")
			id = "empty"

		return d.parent != null ? [id, ...buildId(d.parent)] : [id];
	} else {
		return [];// this is beyond the root
	}
}

function buildPositionId(d, position){
	return [position].concat(buildId(d).reverse()).join("-");
}

function cleanNodeId(str){
	return str.replace(/ /g, "_")
		.replace(/:/g, "_")
		.replace("[", "")
		.replace("]", "")
		.replace("?","_")
		.replace("&","_")
		.replace(".","_")
		.replace("/","_")
		.replace(/,/g,"_");
}

function buildNodeOrLeafId(d, position){
	var id = cleanNodeId(buildPositionId(d, position));

	// radial tree has a different data stucture, requires d.data.name
	if(d && d.children == null && d._children == null){		
		var leafName = d.name ? d.name : d.data.name;
	    return position + "-leaf-" + cleanNodeId(leafName);
	} else
	    return id;
}

// get the node that was clicked and display it to the interface
function displaySelectedNode(d){
	// take off class
	d3.selectAll(".selected-node").classed("selected-node", false);

	var idG1 = cleanNodeId(buildPositionId(d, "g1"));
	var idG2 = cleanNodeId(buildPositionId(d, "g2"));
	var node1 = d3.selectAll("#"+idG1);
	var node2 = d3.selectAll("#"+idG2);

	node1.classed("selected-node", true);
	node2.classed("selected-node", true);

	var node = buildId(d).reverse().join("-");
	d3.select("#selected-node").html("")
	d3.select("#selected-node").html("Clicked node: " + node);
}

function getOtherGraphType(position2){
	var otherGraphSelectTag = document.getElementById("dropdown" + position2[1]);
	var otherGraphType = otherGraphSelectTag.options[otherGraphSelectTag.selectedIndex].text;
	return otherGraphType;
}

function copy(o) {
	var _out, v, _key;
	_out = Array.isArray(o) ? [] : {};
	for (_key in o) {
		v = o[_key];
		_out[_key] = (typeof v === 'object' && v !== null) ? copy(v) : v;
	}
	return _out;
}

function merge(oldObject, newObject, strict) {
	var obj = oldObject;
	for (var key in newObject) {
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			merge(obj[key], newObject[key]);
		} else {
			if (strict) {
				if (obj.hasOwnProperty(key)) {
					obj[key] = newObject[key];
				}
			} else {
				obj[key] = newObject[key];
			}
		}
	}
	return obj;
}

function chunk(arr, len) {

	var chunks = [],
		i = 0,
		n = arr.length;

	while (i < n) {
		chunks.push(arr.slice(i, i += len));
	}

	return chunks;
}
