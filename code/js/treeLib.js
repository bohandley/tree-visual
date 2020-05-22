var treeLib = (function (d3) {

	// if sunburst is passed in, calculate the restriction
	// dummy config for setup
	var dummyContainer = {
		type: '', // name of visualization
		id: '', // id of container
		pathRestr: null, // amount of layers of nodes shown in visualization
		exposedNodes: [], // collection of all nodes exposed, or clickable
		exposedIds: [],
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

		// order is important, pathRestr depends on exposed Ids
		computeExposedNodesAndIds(container);
		computePathRestr(container);
		// set the callback

	}

	function updateTransitioning(val) {
		config.transitioning = val;
	}

	function setLastClickedNode(node, container) {
		container.lastClickedNode = createPathId(node, container.id);
	}

	function computePathRestr(container) {
		container.pathRestr = container.exposedIds.map(el => el.split('-').length).filter(onlyUnique).length;
	}

	function computeExposedNodesAndIds(container) {
		// find all the exposed nodes
		// collection of ids
		var id = container.id;

		var idsForRestr = []

		var exposedNodes = d3.select('#' + id).selectAll('.' + id).filter(function(el) {
		    var el = d3.select(this).attr('id');
		    if (el != null){
		    	idsForRestr.push(el);
		        return el.includes(id);
		    }
		});

		container.exposedNodes = exposedNodes;
		container.exposedIds = idsForRestr;
		
	}

	// create a path to use as a class
	// clean the names?
	function createPathId(node, containerId) {
		var pathArr = crtPathArray(node).reverse();

		var pathId = [containerId].concat(pathArr).join('-');

		return pathId;
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

	// update the exposed nodes, ids, pathRestr, and last clicked node
	function updateConfigContainers(node) {
		config.containers.forEach(container => {
			computeExposedNodesAndIds(container);
			computePathRestr(container);
			setLastClickedNode(node, container);
		});
	}

	function linkedClick(node, otherContainerId) {
		// check if transitioning
		if (isTransitioning())
			return;
		
		// update the exposed nodes, ids and path restr for each container
		updateConfigContainers(node);
		
		// build the pathId for the container that should respond
		var pathId = createPathId(node, otherContainerId);

		// build an object that makes it easier to access the containers
		// with keys original(first clicked) and other(the container that responds)
		var containersObj = getContainersObj(otherContainerId);

		// function that determines how the other container responds to the original container's click
		clickLogic(node, pathId, containersObj)
		
	}

	function clickLogic(node, pathId, containersObj) {
		var otherType = containersObj.other.type;

		var originalType = containersObj.original.type;

		if(originalType == 'Zoomable_Treemap' && otherType == 'Collapsible_Tree'){
			clickActionZTCT(node, pathId, containersObj)
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {

		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		}
		
		if(originalType == 'Collapsible_Tree' && otherType == 'Zoomable_Treemap'){
			clickActionCTZT(node, pathId, containersObj)
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {

		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		}
	}

	function clickActionZTCT(node, pathId, containersObj) {		
		var originalPathId = containersObj.original.lastClickedNode;

		var grandparentClicked = d3.select('#' + originalPathId + '.grandparent').empty() == false;

		var rootClicked = grandparentClicked ? (d3.select('#' + originalPathId).attr('data') == null) : false;
		
		if (rootClicked)
			return
		else if (grandparentClicked){
			var grandparentData = d3.select('#' + originalPathId).attr('data');
			var gDLength = grandparentData.split('-').length;
			var nodeToClose = grandparentData.split('-')[gDLength - 1];
			var actualPathId = pathId + '-' + nodeToClose;
			
			d3.select('#' + actualPathId).dispatch('linkedClick');			
		} else
			d3.select('#' + pathId).dispatch('linkedClick');
	}

	function clickActionCTZT(node, pathId, containersObj) {	
		var originalPathId = containersObj.original.lastClickedNode;

		var rootClicked = isRoot(node);

		var willClose = node.children;
		
		// if the path id is contained within the longest exposed node id, it is in the same path
		var notInExposedPath = !partialPathIsExposed(pathId, containersObj);

		if (rootClicked) // do not close the nodes that match the zoomable treemap
			return;
		else if (notInExposedPath) {
			// find the target array we want to close and zoom out of
			var exposedArrayToClose = containersObj.original.exposedNodes._groups[0].filter(el => el.id.split("-").length > 3)
			var exposedPathArrayToClose = exposedArrayToClose[0].id.split('-');
			exposedPathArrayToClose.pop();
			var exposedPathIdToClose = exposedPathArrayToClose.join('-');

			// this takes care of collapsing all children of exposed node to close
			d3.select('#' + exposedPathIdToClose).dispatch('linkedClick');

			linkedEventPromise(exposedPathIdToClose, pathId, 1);
		} else if (willClose) { // when closing collapsible tree, find the target grandparent - 1 node and hit the grandparent until we get there
			linkedEventPromise(pathId);
		} else {
			d3.select('#' + pathId).dispatch('linkedClick');	
		}

		function linkedEventPromise(pathId, actualPathId, clickNewNode=0) {
			// need to get the exposed grandparent id which is one node less than the pathId
			var targetGrandparentArray = pathId.split('-');
			
			targetGrandparentArray.pop();

			var exposedGrandparentLength = d3.select('.grandparent').attr('id').split('-').length+1;

			// clicking a new node means moving to a new path, so we add 1 to the exposed gr length
			// we also need to know when to zoom in, so find the amount of clicks that need to happen before we click the new path
			if (clickNewNode) {
				var promiseClicks = 0;
				exposedGrandparentLength + 1;
				var neededClicksForNewPath = exposedGrandparentLength - targetGrandparentArray.length
			}

			var timeLength = 800;

			for (var i = exposedGrandparentLength, p = Promise.resolve(); i >= targetGrandparentArray.length; i--){
                p = p.then(_ => new Promise(resolve =>{
                	// if we've reached the root, we are ready to zoom up
                	var readyToZoomIntoNewPath = (clickNewNode && promiseClicks == neededClicksForNewPath);

                	if (readyToZoomIntoNewPath)
                		d3.select('#' + actualPathId).dispatch('linkedClick');
                	else
						d3.select('.grandparent').dispatch('linkedClick');

					return setTimeout(function(){
						promiseClicks++
						
	                    return resolve();   
	                }, timeLength);
				}));
			}

		}	
	}

	function pathIsExposed(pathId, containersObj) {
		return containersObj.other.exposedIds.includes(pathId);
	}

	function partialPathIsExposed(pathId, containersObj) {
		return containersObj.other.exposedIds.some(el => {
			return el.includes(pathId);
		});
	}

	function getContainersObj(otherContainerId) {
		var otherContainer = config.containers.find(con => con.id == otherContainerId);

		var originalContainer = config.containers.find(con => con.id != otherContainerId);

		return {other: otherContainer, original: originalContainer};
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

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

	function getLastClicked(containerId) {
		return config.containers.find(cont => cont.id == containerId).lastClickedNode;
	}

	function isTransitioning() {
		return config.transitioning;
	}

	function getConfigContainer(containerId) {
		return config.containers.find(el => el.id == containerId);
	}

	function isRoot(node) {
		if (node.parent == null)
			return true;
		else
			return false;
	}

	function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

	return {
		buildConfig: function(ids) {
			buildConfig(ids);
		},

		updateConfig: function(type, id) {
			updateConfig(type, id);
		},

		config: function() {
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

		linkHighlight: function() {
			debugger;
		},

		getLastClicked: function(containerId) {
			return getLastClicked(containerId);
		},

		transitioning: function(val) {
			updateTransitioning(val);
		},

		isTransitioning: function() {
			var check = isTransitioning();

			// if transitioning, let the use
			if (check)
				console.log('Transitioning...');

			return check;
		},

		getConfigContainer: function(containerId) {
			return getConfigContainer(containerId);
		},

		isRoot: function(d) {
			return isRoot(d);
		}


	}

// pull in d3
})( d3 );