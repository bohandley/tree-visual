var treeLib = (function (d3) {

	// if sunburst is passed in, calculate the restriction
	// dummy config for setup
	var dummyContainer = {
		type: '', // name of visualization
		id: '', // id of container
		pathRestr: null, // amount of layers of nodes shown in visualization
		exposedNodes: [], // collection of all nodes exposed, or clickable
		highlightedNode: '', // the current highlighted node
		callback: function() {}, // the callback for when the other visualization is clicked
		lastClickedNode: ''
	};

	// dummy config for now, load this on load of the page
	var dummyConfig = {
		containers: [],
		zoomableTransition: 0, // used to figure out how deep to zoom
	    transitioning: 0, //zoomZooming: null,
	    currentSelectedNode: ''
	};

	var config;

	// var config = {
	// 	containers: [],
		// 	{
		// 		type: '',
		// 		container: '',
		// 		pathRestr: null,
		// 		exposedNodes: [],
		// 		//highlightedNode: '',
				// callback: transition callback,
				// last clicked node: '',

		// 	},
		// 	{
		// 		type:'',
		// 		container: '',
		// 		pathRestr: null,
		// 		exposedNodes: [],
		// 		// highlightedNode: '',
				// callback: transition callback,
				// last clicked node: ''
		// 	},

		// ],
		// DON'T DO CHANGE, ONLY DO TRANSITIONING: BOOLEAN
		// // "change" describes when a graph has been clicked,
	 //    // and a second graph may also be clicked as a result of the first click,
	 //    // we cap this at two so the second graph does trigger the first graph again but
	 //    // the first graph reads "change" and returns out of the click function.
	 //    change: 0,

	//     zoomableTransition: 0, // used to figure out how deep to zom
	//     transitioning: 0, //zoomZooming: null,
	//     // prvClk: {
	//     //     pack: '',
	//     //     zoomable:'',
	//     //     tree: '',
	//     //     treemap: '',
	//     //     sunburst: ''
	//     // },
	//     currentSelectedNode: '',
	//     // fileData: null
	// };
	
	// takes an array of svg ids that contain the visualizations
	// build the config on opening the app
	// update the config whenever a new graph is chosen
	function buildConfig(ids) {
		var containers = ids.map(id => {
			var container = copy(dummyContainer);

			container.id = id;

			return container;
		});

		config = copy(dummyConfig);

		config.containers = containers;
	}

	function updateConfig(type, id) {
		container = config.containers.find(el => {
			return el.id == id;
		});

		// type: '', // name of visualization
		// id: '', // id of container
		// pathRestr: null, // amount of layers of nodes shown in visualization
		// exposedNodes: [], // collection of all nodes exposed, or clickable
		// highlightedNode: '', // the current highlighted node
		// callback: function() {}, // the callback for when the other visualization is clicked
		// lastClickedNode: ''
		container.type = type;

		// find all the exposed nodes
		// collection of ids
		var idsForRestr = []

		var exposedNodes = d3.select('#' + id).selectAll('.' + id).filter(function(el) {
		    var el = d3.select(this).attr('id');
		    if (el != null){
		    	idsForRestr.push(el);
		        return el.includes(id);
		    }
		});

		container.exposedNodes = exposedNodes;
		
		container.pathRestr = idsForRestr.map(el => el.split('-').length).filter(onlyUnique).length;
		// set the callback

	}

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

	function linkedClick(node, otherContainerId) {
		var pathId = createPathId(node, otherContainerId);
		// debugger
		d3.select('#' + pathId).dispatch('linkedClick');
		// close if collapsible tree
		// always display the same mount of nodes?
		// stop the close if the more restricted graph is navigating to the root
		// don't close if displaying all ten children
		//
	}

	function linkHighlight() {}

	function copy(o) {
		var _out, v, _key;
		_out = Array.isArray(o) ? [] : {};
		for (_key in o) {
			v = o[_key];
			_out[_key] = (typeof v === 'object' && v !== null) ? copy(v) : v;
		}
		return _out;
	}

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

	return {
		buildConfig: function(ids) {
			buildConfig(ids);
		},

		updateConfig: function(type, id) {
			updateConfig(type, id);
		},

		config() {
			return config;
		},

		pathId: function(node, container) {
			return createPathId(node, container);
		},

		isLeaf: function(node) {
			return isLeaf(node);
		},

		linkedClick: function(node, otherContainerId) {
			linkedClick(node, otherContainerId);
		},

		linkHighlight() {
			debugger;
		}
	}

// pull in d3
})( d3 );