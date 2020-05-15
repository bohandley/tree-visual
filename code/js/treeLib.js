var treeLib = (function (d3) {

	// if sunburst is passed in, calculate the restriction
	var config = [
		{
			type: '',
			container: '',
			pathRestr: null,
			exposedNodes: [],
			//highlightedNode: ''
		},
		{
			type:'',
			container: '',
			pathRestr: null,
			exposedNodes: [],
			// highlightedNode: ''
		}
	];
	
	// create a path to use as a class
	// clean the names?
	function createPathId(node, container) {
		var pathArr = crtPathArray(node).reverse();

		var pathClass = [container].concat(pathArr).join('-');

		return pathClass;
	}

	// takes a d3 data object that has the node and its path, nested
	// return an array of the path(must reverse this)
	// recursive function to travel up the path
	function crtPathArray(node) {
		if(node){
			var nd = node.name || node.name == "" ? node.name : node.data.name;
			
			// do not allow nodes without names(fixed in the data)
			if (nd == "")
				nd = "empty";

			// clean the string to prepare it to be a class
			nd = cleanNodeStr(nd);

			return node.parent != null ? [nd, ...crtPathArray(node.parent)] : [nd];
		} else {
			return [];// this is beyond the root
		}
	}

	// remove characters that don't work with classes
	function cleanNodeStr(node) {
		return node.replace(/ /g, "_")
			.replace(/:/g, "_")
			.replace("[", "")
			.replace("]", "")
			.replace("?","_")
			.replace("&","_")
			.replace(".","_")
			.replace("/","_")
			.replace(/,/g,"_");
	}

	function isLeaf(node) {
		// radial tree has a different data stucture, requires d.data.name
		if(node && node.children == null && node._children == null)
		    return true;
		else
		    return false;

	}

	function getExposedNodes() {}

	// figure out the length of the paths for each node
	// for example, the sunburst has varying lengths
	// this requires that it may adjust to different visualizations
	// i.e. the zoomable tree is fixed at two so the sunburst is fixed at two
	// but if the sunburst and 
	function getPathRestriction() {}

	function linkEvent() {}

	function linkHighlight() {}

	return {
		pathId: function(node, container) {
			return createPathId(node, container);
		},

		isLeaf: function(node) {
			return isLeaf(node);
		},

		linkEvent: function(node) {
			debugger;
		},

		linkHighlight() {
			debugger;
		}
	}

// pull in d3
})( d3 );