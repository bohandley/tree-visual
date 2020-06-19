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
		currentClickedNode: '',
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
		var container = config.containers.find(el => {
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
		container.currentClickedNode = '';
		// order is important, pathRestr depends on exposed Ids
		computeExposedNodesAndIds(container);
		computePathRestr(container);
		// set the callback
		// debugger;
	}

	// random weird things that need to be done to reconcile differences
	// between visualizations that can't be handled in the d3 building for each vis
		// i.e., the root/back button in sunburst needs a single color
			// the d3 code to build it assigns a color to every 
	

	function updateTransitioning(val) {
		config.transitioning = val;
	}

	function setLastClickedAndCurrentNode(node, container) {
		var newCurrentClickedNode = createPathId(node, container.id);

		container.lastClickedNode = container.currentClickedNode;

		container.currentClickedNode = newCurrentClickedNode;
	}

	function computePathRestr(container) {
		container.pathRestr = container.exposedIds.map(el => {
			return el.split('-').length;
		})
		.filter(onlyUnique).length;
	}

	function computeExposedNodesAndIds(container) {
		// find all the exposed nodes
		// collection of ids
		var id = container.id;

		var idsForRestr = []

		var exposedNodes = d3.select('#' + id).selectAll('.' + id).filter(function(el) {
		    var el = d3.select(this).attr('id');
			if (el != null){

				if (container.type == 'Sunburst') {
					// the el must include the current clicked node to know it is displayed
					//	otherwise treat it as hidden and cannot be clicked
					// the problem is that all nodes are present in html
					
					var lastClickedNode = container.currentClickedNode;
					// debugger
					if (el.includes(lastClickedNode)){
						idsForRestr.push(el);
						return true
					} else 
						return false;
					
				} else {
					idsForRestr.push(el);
				    return el.includes(id);
		       }
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
	// or are ambiguous with the '-' used to join each node
	function cleanNodeStr(node) {
		return node.replace(/ /g, "_")
			.replace(/:/g, "_")
			.replace("[", "")
			.replace("]", "")
			.replace("?","_")
			.replace("&","_")
			.replace(".","_")
			.replace("/","_")
			.replace(/-/g,"_")
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
			setLastClickedAndCurrentNode(node, container);
			computeExposedNodesAndIds(container);
			computePathRestr(container);
			// setLastClickedAndCurrentNode(node, container);

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
		} else if (originalType == 'Zoomable_Treemap' && otherType == 'Pack') {
			clickActionZTPack(node, pathId, containersObj)
		} else if (originalType == 'Zoomable_Treemap' && otherType == 'Sunburst') {
			clickActionZTSunburst(node, pathId, containersObj)
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		} else if (originalType == 'Zoomable_Treemap' && otherType == '') {
			
		}
		
		if(originalType == 'Collapsible_Tree' && otherType == 'Zoomable_Treemap'){
			clickActionCTZT(node, pathId, containersObj)
		} else if (originalType == 'Collapsible_Tree' && otherType == '') {

		} else if (originalType == 'Collapsible_Tree' && otherType == 'Sunburst') {
			clickActionCTSunburst(node, pathId, containersObj)
		} else if (originalType == 'Collapsible_Tree' && otherType == '') {
			
		} else if (originalType == 'Collapsible_Tree' && otherType == '') {
			
		}

		if(originalType == 'Pack' && otherType == 'Zoomable_Treemap'){
			clickActionPackZT(node, pathId, containersObj)
		} else if (originalType == 'Pack' && otherType == '') {

		} else if (originalType == 'Pack' && otherType == '') {
			
		} else if (originalType == 'Pack' && otherType == '') {
			
		} else if (originalType == 'Pack' && otherType == '') {
			
		}

		if(originalType == 'Sunburst' && otherType == 'Zoomable_Treemap'){
			clickActionSunburstZT(node, pathId, containersObj)
		} else if (originalType == 'Sunburst' && otherType == 'Collapsible_Tree') {
			clickActionSunburstCT(node, pathId, containersObj)
		} else if (originalType == 'Sunburst' && otherType == '') {
			
		} else if (originalType == 'Sunburst' && otherType == '') {
			
		} else if (originalType == 'Sunburst' && otherType == '') {
			
		}
	}

	function clickActionZTCT(node, pathId, containersObj) {		
		var originalPathId = containersObj.original.currentClickedNode;

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

	function clickActionZTPack(node, pathId, containersObj) {
		// 1. normal click on child, also zooms out to the correct node when grandparent clicked
		d3.select('#' + pathId).dispatch('linkedClick');
	}

	function clickActionZTSunburst(node, pathId, containersObj) {
		// debugger;
		colorSunburstBackButton(node, containersObj.other, 'sunburst-back-button')
		d3.select('#' + pathId).dispatch('linkedClick');
	}

	function clickActionCTZT(node, pathId, containersObj) {	
		// var originalPathId = containersObj.original.currentClickedNode;

		var rootClicked = isRoot(node);

		var willClose = node.children;
		
		// if the path id is contained within the longest exposed node id, it is in the same path
		var notInExposedPath = !partialPathIsExposed(pathId, containersObj);

		// if (rootClicked) // do not close the nodes that match the zoomable treemap
		// 	return;
		// else 
		if (notInExposedPath || rootClicked) {
			// find the common parent path between the current node and the last clicked node
			var commonParent = findCommonParent(containersObj.other);

			// we need to find the exposed element in the collection that's path is +1 of the common parent
			// and this element is included in the last clicked node
			var pathLengthOfClosedOriginalNode = commonParent.split('-').length + 1;
			
			var lastClickedOriginalNode = containersObj.original.lastClickedNode;

			var exposedArrayToClose = containersObj.original.exposedNodes._groups[0].filter(el => {
				return (
					el.id.split("-").length == pathLengthOfClosedOriginalNode && 
					lastClickedOriginalNode.includes(el.id)
				);
			});

			var exposedPathIdToClose = exposedArrayToClose[0].id;

			d3.select('#' + exposedPathIdToClose).dispatch('linkedClick');			

			linkedEventPromiseZoomOut(commonParent, pathId, 1);
		} else if (willClose) { // when closing collapsible tree, find the target grandparent - 1 node and hit the grandparent until we get there
			linkedEventPromiseZoomOut(pathId);
		} else {
			d3.select('#' + pathId).dispatch('linkedClick');	
		}	
	}

	function clickActionCTSunburst(node, pathId, containersObj) {
		// // add the back button class and the grandparent to the sunburst
		colorSunburstBackButton(node, containersObj.other, 'grandparent');

		var originalPathId = containersObj.original.currentClickedNode;

		var rootClicked = isRoot(node);

		var willClose = node.children;
		
		// if the path id is contained within the longest exposed node id, it is in the same path
		// var notInExposedPath = !partialPathIsExposed(pathId, containersObj);
		var id = containersObj.other.id;

		var exposedArray = d3.select('#' + id).selectAll('.' + id).filter(function(node) {
		    var el = d3.select(this).attr('id');
			if (el != null){					
				var lastClickedNode = containersObj.other.lastClickedNode;

				if (el.includes(lastClickedNode) && pathId.includes(el))
					return true;
				else 
					return false;
		    }
		});

		var notInExposedPath = exposedArray.empty() ? true : false;

		if (isLeaf(node)) {
			// stop the event for sunburst
		} else if (rootClicked || notInExposedPath){ // do not close the nodes that match the zoomable treemap
			// Close all paths that are not in the pathID
			// find the common parent path between the current node and the last clicked node
			var commonParent = findCommonParent(containersObj.other);
			// debugger;
			// we need to find the exposed element in the collection that's path is +1 of the common parent
			// and this element is included in the last clicked node
			var pathLengthOfClosedOriginalNode = commonParent.split('-').length + 1;
			
			var lastClickedOriginalNode = containersObj.original.lastClickedNode;

			var exposedArrayToClose = containersObj.original.exposedNodes._groups[0].filter(el => {
				return (
					el.id.split("-").length == pathLengthOfClosedOriginalNode && 
					lastClickedOriginalNode.includes(el.id)
				);
			});
			// debugger
			if (exposedArrayToClose.length != 0) {
				var exposedPathIdToClose = exposedArrayToClose[0].id;
				
				var originalNodeToClose = d3.select('#' + exposedPathIdToClose);
				// if the original node was recently closed, the children will be null
				// (stored in _children in the data)
				var originalNodeHasExposedChildren = originalNodeToClose.data()[0].children;
				
				if (originalNodeHasExposedChildren)
					d3.select('#' + exposedPathIdToClose).dispatch('linkedClick');

				// linkedEventPromiseZoomOut(pathId);
				if (pathId.split('-').length > 3) {
					var restrictedLevelNode = pathId.split('-').slice(0, 3).join('-');

					d3.select('#' + restrictedLevelNode).dispatch('linkedClick');
				} else {
					d3.select('#' + pathId).dispatch('linkedClick');
				}
			}
		} else if (pathId.split('-').length > 3) {
			// debugger
			var restrictedLevelNode = pathId.split('-').slice(0, 3).join('-');

			d3.select('#' + restrictedLevelNode).dispatch('linkedClick');
		} else {
			// debugger
			d3.select('#' + pathId).dispatch('linkedClick');
		}
	}

	function clickActionPackZT(node, pathId, containersObj) {
		// debugger
		var originalPathId = containersObj.original.currentClickedNode;

		var rootClicked = isRoot(node);

		var notInExposedPath = !partialPathIsExposed(pathId, containersObj);

		// do not need to zoom back to root, but zoom to a certain level in a branch then zoom out
		// this means that there is a partial branch path is exposed
		// 1. find that there is a common parent that is not the root
		var lastClickedOtherNode = containersObj.other.lastClickedNode;

		var zoomOutSamePath = (lastClickedOtherNode.split('-').length - pathId.split('-').length) > 1

		if (rootClicked) {
			linkedEventPromiseZoomOut(pathId)
		} else if (notInExposedPath) {
			// find the common parent path between the current node and the last clicked node
			var commonParent = findCommonParent(containersObj.other);

			// we need to find the exposed element in the collection that's path is +1 of the common parent
			// and this element is included in the last clicked node
			var pathLengthOfClosedOriginalNode = commonParent.split('-').length + 1;
			
			var lastClickedOriginalNode = containersObj.original.lastClickedNode;


			// need to zoom in
			// what is the first
			// is part of the pathId exposed and if so, what is the first exposed one?
			var pathsForZoomingIn = getZoominCollection(originalPathId, containersObj);

			var pathIdToStartZooming = getPathToStartZoomingIn(pathsForZoomingIn);
			
			// if the pathIdToStartZooming is null, then we will have to zoom out and then zoom includes
			if (pathIdToStartZooming) {
				var zoomingCollection = pathsForZoomingIn.filter(el => {
					return el.includes(pathIdToStartZooming);
				});

				linkedEventPromiseZoomIn(zoomingCollection);
				//zoom in
			} else {
				linkedEventPromiseZoomOut(commonParent, pathId, 1);
			}
		} else if (zoomOutSamePath) {
			// add one node to the pathId
			var justOne = false;

			var addOneNode = lastClickedOtherNode.split('-').filter((el, idx) => {
				if (el == pathId.split('-')[idx])
					return true;
				else if (justOne) {
					return false;
				} else {
					//add the one
					justOne = true;
					return true;
				}
			}).join('-');

			linkedEventPromiseZoomOut(pathId, 'Pack');
		} else {
			d3.select('#' + pathId).dispatch('linkedClick');	
		}
	}

	function clickActionSunburstZT(node, pathId, containersObj) {
		// debugger
		colorSunburstBackButton(node, containersObj.original, 'sunburst-back-button');
		// 1. normal one path level click in and out
		// 2. zoom in based off exposed nodes and the original id clicked
		//

		var originalPathId = containersObj.original.currentClickedNode;

		var notInExposedPath = !partialPathIsExposed(pathId, containersObj);

		if (notInExposedPath) {	
			// get the exposed nodes that are in the path of the original container id clicked
			var id = containersObj.original.id;

			var exposedArrayToClick = d3.select('#' + id).selectAll('.' + id).filter(function(el) {
			    var el = d3.select(this).attr('id');
				if (el != null){					
					var lastClickedNode = containersObj.original.lastClickedNode;

					if (el.includes(lastClickedNode) && originalPathId.includes(el))
						return true;
					else 
						return false;
			    }
			});

			// build a collection of ids for the other container based of the previous collection
			var pathsForZoomingIn = exposedArrayToClick._groups[0].map(el => {
				return createPathId(d3.select(el).data()[0], containersObj.other.id)
			});

			// search the collection for the first path exposed in the other container
			var pathIdToStartZooming = getPathToStartZoomingIn(pathsForZoomingIn);
			
			// create a new group of ids that start with this path
			var zoomingCollection = pathsForZoomingIn.filter(el => {
				return el.includes(pathIdToStartZooming);
			});

			// zoom in with the created collection of ids
			linkedEventPromiseZoomIn(zoomingCollection);
		} else {
			d3.select('#' + pathId).dispatch('linkedClick');
		}
	}

	function clickActionSunburstCT(node, pathId, containersObj) {
		// debugger
		var originalPathId = containersObj.original.currentClickedNode;

		var rootClicked = isRoot(node);

		var notInExposedPath = !partialPathIsExposed(pathId, containersObj);

		var ccn = createPathId(node, containersObj.original.id);

		// do not need to zoom back to root, but zoom to a certain level in a branch then zoom out
		// this means that there is a partial branch path is exposed
		// 1. find that there is a common parent that is not the root
		var lastClickedOtherNode = containersObj.other.lastClickedNode;

		var zoomOutSamePath = (lastClickedOtherNode.split('-').length - pathId.split('-').length) > 1

		if (rootClicked) {

			// close all the nodes that have children
			containersObj.other.exposedIds.forEach(id => {
				var data = d3.select('#' + id).data()[0];

				if (data.children && id.split('-').length == 3)
					d3.select('#' + id).dispatch('linkedClick');
			});

		} else if (ccn.split('-').length > 3){
			// this clicks the correct node in sunburst and pairs with the function,
			// to show levels in Sunburst associated with exposed levels in other vis
			// restrictOnReturn() *should be renamed
			// restrictOnReturn restricts the concentric arcs in the sunburst to 
			// only show the path levels of the previous click exposed in the other vis
			var restrictedLevelNode = ccn.split('-').slice(0, 3).join('-');
			// debugger
			d3.select('#' + restrictedLevelNode).dispatch('linkedClick');


			var commonParent = findCommonParent(containersObj.other);
			// debugger;
			// we need to find the exposed element in the collection that's path is +1 of the common parent
			// and this element is included in the last clicked node
			var pathLengthOfClosedOtherNode = commonParent.split('-').length + 1;
			
			var lastClickedOtherNode = containersObj.other.lastClickedNode;

			var exposedArrayToClose = containersObj.other.exposedNodes._groups[0].filter(el => {
				return (
					el.id.split("-").length == pathLengthOfClosedOtherNode && 
					lastClickedOtherNode.includes(el.id)
				);
			});
			// debugger
			if (exposedArrayToClose.length != 0) {
				// debugger
				var exposedPathIdToClose = exposedArrayToClose[0].id;
				
				var originalNodeToClose = d3.select('#' + exposedPathIdToClose);
				// if the original node was recently closed, the children will be null
				// (stored in _children in the data)
				var originalNodeHasExposedChildren = originalNodeToClose.data()[0].children;
				
				if (originalNodeHasExposedChildren)
					d3.select('#' + exposedPathIdToClose).dispatch('linkedClick');
			}

			d3.select('#' + pathId).dispatch('linkedClick');

		} else {
			d3.select('#' + pathId).dispatch('linkedClick');
		}
		
	}

	function linkedEventPromiseZoomIn(zoomingCollection) {
		var clickIndex = zoomingCollection.length; // for the index

		var timeLength = 800;

		for (var i = clickIndex, p = Promise.resolve(); i > 0; i--){
			p = p.then(_ => new Promise(resolve =>{
				if (zoomingCollection[i].split('-').length == 2)
					d3.select('.grandparent').dispatch('linkedClick');
				else
					d3.select('#' + zoomingCollection[i]).dispatch('linkedClick');
				
				return setTimeout(function(){						
					i++;
					return resolve();   
				}, timeLength);
				
			}));
		}
	}

	function linkedEventPromiseZoomOut(pathId, actualPathId, clickNewNode=0) {
		// need to get the exposed grandparent id which is one node less than the pathId

		// the path id here could be longer, root or otherwise,
		// it is the path we need to zoom back too 
		var targetGrandparentArray = pathId.split('-');

		var beginZoomOut = targetGrandparentArray.length;
		
		targetGrandparentArray.pop();

		var exposedGrandparentLength = d3.select('.grandparent').attr('id').split('-').length+1;

		if (actualPathId == 'Pack')
			exposedGrandparentLength -= 1;

		// clicking a new node means moving to a new path, so we add 1 to the exposed gr length
		// we also need to know when to zoom in, so find the amount of clicks that need to happen before we click the new path
		if (clickNewNode) {
			var promiseClicks = 0;
			// exposedGrandparentLength += 1;
			var neededClicksForNewPath = exposedGrandparentLength - beginZoomOut
		}

		var timeLength = 800;
		
		for (var i = exposedGrandparentLength, p = Promise.resolve(); i >= beginZoomOut; i--){
            p = p.then(_ => new Promise(resolve =>{
            	// if we've reached the root, we are ready to zoom up
            	var readyToZoomIntoNewPath = (clickNewNode && promiseClicks == neededClicksForNewPath);

            	if (readyToZoomIntoNewPath) {
            		var otherContainerId = pathId.split('-')[0];

            		var containersObj = getContainersObj(otherContainerId);

            		var originalPathId = containersObj.original.currentClickedNode;
            		
            		var pathsForZoomingIn = getZoominCollection(originalPathId, containersObj);

					var pathIdToStartZooming = getPathToStartZoomingIn(pathsForZoomingIn);
					
					// if the pathIdToStartZooming is null, then we will have to zoom out and then zoom includes
					if (pathIdToStartZooming) {			
						var zoomingCollection = pathsForZoomingIn.filter(el => {
							return el.includes(pathIdToStartZooming);
						});

						linkedEventPromiseZoomIn(zoomingCollection);
					} else {
						// remove the root node path
						// pathsForZoomingIn.shift();
						linkedEventPromiseZoomIn(pathsForZoomingIn)
					}

            		// we need to figure out how many clicks we zoom in by the path
            		// d3.select('#' + actualPathId).dispatch('linkedClick');
            	} else
					d3.select('.grandparent').dispatch('linkedClick');

				// timeLength += 200;

				return setTimeout(function(){
					promiseClicks++
					
                    return resolve();   
                }, timeLength);
			}));
		}
	}

	function getZoominCollection(originalPathId, containersObj) {
		var exposedArrayToClick = containersObj.original.exposedNodes._groups[0].filter(el => {
			return originalPathId.includes(el.id);
		}).sort();
		
		var pathsForZoomingIn = exposedArrayToClick.map(el => {
			return createPathId(d3.select(el).data()[0], containersObj.other.id)
		});

		// return a collection of paths to zoom in based on the original id path
		return pathsForZoomingIn;
	}

	function getPathToStartZoomingIn(pathsForZoomingIn) {
		return pathsForZoomingIn.filter(el => {
			var element = d3.select('#' + el);
			return (
				!element.empty() &&
				!element.classed('grandparent')
			)
		})[0];
	}

	function findCommonParent(container) {
		var last = container.lastClickedNode.split('-');

		var current = container.currentClickedNode.split('-');

		var longer, shorter;

		if (last.length >= current.length) {
			longer = last;
			shorter = current;
		} else {
			longer = current;
			shorter = last;
		}

		var commonParentArr = [],
			brokenPath = false;

		// iterate through the paths, stop when there is not a match
		longer.forEach((el, idx) => {
			if (el == shorter[idx] && !brokenPath)
				commonParentArr.push(el);
			else {
				brokenPath = true;
			}
		});

		var cPar = commonParentArr.join('-');

		return cPar;
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

	function intersect(a, b) {
		var setA = new Set(a);
		var setB = new Set(b);
		var intersection = new Set([...setA].filter(x => setB.has(x)));
		return Array.from(intersection);
	}

	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

	function getCurrentClicked(containerId) {
		return config.containers.find(cont => cont.id == containerId).currentClickedNode;
	}

	function getLastClicked(containerId) {
		return config.containers.find(cont => cont.id == containerId).lastClickedNode;
	}

	function isTransitioning() {
		var transitioningCheck = config.transitioning;

		if (transitioningCheck == true)
			console.log('Transitioning...');
		
		return transitioningCheck;
	}

	function getConfigContainer(containerId) {
		return config.containers.find(el => el.id == containerId);
	}

	function isRoot(node) {
		// the data object associated with the zoomable treemap root display is null
		// the actual root object is only attached to an element, grandparent one level into the treemap
		if (!node) 
			return true;
		else if (node.parent == null) // root of everything else
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

    function preventEvent(node, otherContainerId) {
    	var containersObj = getContainersObj(otherContainerId),
    		otherType = containersObj.other.type,
    		originalType = containersObj.original.type,
			isRoot = treeLib.isRoot(node)
			currentClicked = createPathId(node, containersObj.original.id);
			
		// prevent clicks
		if (originalType == 'Collapsible_Tree' && otherType == 'Zoomable_Treemap' && isRoot){
			linkedClick(node, otherContainerId);
			return true; //stop event
		} else if (originalType == 'Collapsible_Tree' && otherType == 'Sunburst' && isRoot){
			// fire off the sunburst but prevent the collapsible tree event
			linkedClick(node, otherContainerId);
			return true; 
		} else if (originalType == 'Sunburst' && otherType == 'Collapsible_Tree' && currentClicked.split('-').length > 3) {
			// debugger;
			// if CT, show the levels that the CT is showing
			// do the normal reaction for CT
			linkedClick(node, otherContainerId);

			
			return true;
		}

		if (isTransitioning())
			return true; // stop event

        return false;
    }

    function colorSunburstBackButton(node, container, extraClass=null) {
    	var shortestPathLength = container.exposedIds.map(el => {
			return el.split('-').length;
		})
		.filter(onlyUnique)
		.sort()[0];

		var backButtonNodeLength = shortestPathLength - 1;

    	var containerId = container.id;
    	// remove all orange classes
    	d3.select('#' + containerId).selectAll('.' + containerId)._groups[0].forEach(function(el) {
    		// d3.select(el).classed('sunburst-back-button', false);

    		// if (d3.select(el).attr('id').split('-').length == backButtonNodeLength)
    		// 	d3.select(el).classed('sunburst-back-button', true);

    		// add the grandparent class for the collapsible tree
    		if (extraClass) {
    			d3.select(el).classed(extraClass, false);

	    		if (d3.select(el).attr('id').split('-').length == backButtonNodeLength)
	    			d3.select(el).classed(extraClass, true);
    		}

    	});
    }

    function colorOriginalNodeLikeSunburstBackButton(container, svgType) {
    	var containerId = container.id;

    	d3.select('#' + containerId).selectAll('.' + containerId)._groups[0].forEach(function(el) {
    		d3.select(el).select(svgType).classed('sunburst-back-button', false);
    	});

    	var currentClicked = container.currentClickedNode;

    	var ccArr = currentClicked.split('-');

    	ccArr.pop();

    	var nodeLikeSunburstBackButton = ccArr.join('-');

    	d3.select('#' + nodeLikeSunburstBackButton).select(svgType).classed('sunburst-back-button', true);
    }

    function addSunburstBackButtonClass(pathId, cls) {
    	if (d3.select("#" + pathId).select("circle").attr("class").includes('sunburst-back-button')){
            cls += ' sunburst-back-button';
        }

        return cls;
    }

    function shortenLeafName(node, name) {
    	if (isLeaf(node)) {
    		name = name.split(' ')[0] + '...';
    	}

    	return name;
    }

    function showLevels(d, levels) {
    	if (levels == 2)
    		return d.parent && d.parent.parent;
    	else if (levels == 3)
    		return d.parent && d.parent.parent && d.parent.parent.parent;
    	else if (levels == 4)
    		return d.parent && d.parent.parent && d.parent.parent.parent && d.parent.parent.parent.parent;
    	else if (levels == 5)
    		return d.parent && d.parent.parent && d.parent.parent.parent && d.parent.parent.parent.parent && d.parent.parent.parent.parent.parent;
    }

    function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
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
			var prevent = preventEvent(node, otherContainerId);

			if (prevent)
				return 'prevent';

			linkedClick(node, otherContainerId);
		},

		linkHighlight: function() {
			debugger;
		},

		getLastClicked: function(containerId) {
			return getLastClicked(containerId);
		},

		getCurrentClicked: function(containerId) {
			return getCurrentClicked(containerId);
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
		},

		addSunburstBackButtonClass: function(pathId, cls) {
			return addSunburstBackButtonClass(pathId, cls);
		},

		// sunburst
		restrictLevels: function(node, levels, container2Id) {
			var type2 = getConfigContainer(container2Id).type;
			
			if ((type2 == 'Collapsible_Tree')
				|| (type2 == 'Zoomable_Treemap')
			)
				return showLevels(node, levels);
		},

		// sunburst
		restrictOnReturn: function(node, container1Id, container2Id, arc) {
			var ccn = getConfigContainer(container1Id).currentClickedNode
				type2 = getConfigContainer(container2Id).type;

 	
 			var levels = ccn.split('-').length;
            if (
            	// levels == 2 
            	// && 
            	(
            		type2 == 'Collapsible_Tree' 
            		|| type2 == 'Zoomable_Treemap' )
            	
            ) {
                if(showLevels(node, levels))
                    return arc(0);
                else
                    return arc(node);    
            } else {
                return arc(node); 
            }
		},

		// sunburst prevent leaf click event for ZT and CT
		preventLeaf: function(d, containerId) {
			return d3.select('#' + createPathId(d, containerId))
				.attr('class').includes('leaf');
		},

		hideArcs: function(containerId, d) {
			// give visibility to arcs that are in the clicked path
			// when clicking greater than or equal to 4 node path length
			// only show nodes that are part of the path 
            var ccn = config.containers.filter(function(el) {
                return el.id == containerId;
            })[0].currentClickedNode;
            var ccnLen = ccn.split('-').length;

            var pathId = createPathId(d, containerId);
            var pIdLen = pathId.split('-').length;

            var pIncludesCcn = pathId.includes(ccn);

            // REFACTOR THIS FOR DATA WITH LEVELS > 6
            if (ccnLen >= 4) {
            	if (pIdLen == 5 && pIncludesCcn) {
            		// show the next level that includes the ccn
            		return 'visible';
            	} else if (pIdLen <= 4) {
            		return 'visible';
            	} 


            	if (pIdLen == 6 && pIncludesCcn) {
        			return 'visible';
        		} else if (pIdLen == 5 && pathId.includes(ccn.split('-').slice(0,4).join('-'))) {
        			// show nodes that the part of ccn is part of
        			return 'visible';
        		} 

            	return 'hidden';
            }
            return 'visible';
		},

		shuffleArray: function(array) {
			return shuffleArray(array);
		}

	}

// pull in d3
})( d3 );