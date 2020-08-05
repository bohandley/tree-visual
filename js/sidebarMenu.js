var menu = (function (d3, $) {
	const LOCK_OPEN = '<i class="fas fa-lock-open"></i>';
	const LOCK_CLOSED = '<i class="fas fa-lock"></i>';

	var dummyConfig = {
		filename: '',
		filters: {},
		scaleLog: function() {},
		isLocked: {1: false, 2: false},
		accumulated: 'leaves',
	    nodeSize: 5,
	    proportionalSize: {1: false, 2: false},
	    dataType: '',
		dataInfoLeavesText: {
	    	author: "Number of Papers: ",
	    	government: "Number of Branches: ",
	    	trade: "Number of Import/Export Countries: ",
	    	treeoflife: "Number of Branches: "
	    },
	    dataInfoSizeText: {
	    	author: "Number of Citations: ",
	    	government: "Number of Employees: ",
	    	trade: "Volume of Import/Export ($1M): ",
	    	treeoflife: "Number of Tips: "
	    },
	    dataInfoTypes: {
	    	author: {size: 'Citations', leaves: 'Papers'},
	    	government: {size: 'Employees', leaves: 'Branches'},
	    	import: {size: 'Millions', leaves: 'Countries'},
	    	export: {size: 'Millions', leaves: 'Countries'},
	    	trade: {size: 'MIllions', leaves: 'Countries'},
	    	treeoflife: {size: '???', leaves: 'Species'}
	    }
	}

	var config = copy(dummyConfig);

	function resetMenuCfg(){
	    config =  copy(dummyConfig);
	}

	function updateNodeSize(position=null) {
		config.nodeSize = accessNodeSize();

        var ndSize = config.nodeSize;
        if (position) {
	        d3.select("#g"+position).selectAll("circle.node-size")
	            .attr("r", function(d) {
	            	return getNodeSize(d, ndSize, config.proportionalSize[position]);
	            });
        } else {
        	d3.select("#g1").selectAll("circle.node-size")
	            .attr("r", function(d) {
	            	return getNodeSize(d, ndSize, config.proportionalSize['1']);
	            });

	        d3.select("#g2").selectAll("circle.node-size")
	            .attr("r", function(d) {
	            	return getNodeSize(d, ndSize, config.proportionalSize['2']);
	            });
        }
	}

	function accessNodeSize() {
		return (+$("#nodesizeScalar").prop("value"));
	}

	function getNodeSize(d, ndSize, prpSize=null) {
		var amount = 1;

        if (prpSize == true) {
        	amount = config.scaleLog(d.value);

        	if (amount == -Infinity)
        		amount = .001;
            // if (d.children)
            //     amount = d.children.length;

            // if (d._children)
            //     amount = d._children.length;

            // if (d.data && d.data.children)
            //     amount = d.data.children.length;
        }
        
        var size = ndSize * amount;

        return size;
	}

	function updateProportionalSize(that, view) {
		// change the config for each view if one is checked
		var bool = $(that).prop("checked") == true;

		if (bool == true)
            config.proportionalSize[view] = true;
        else if (bool == false)
            config.proportionalSize[view] = false;
	}

	function setupCheckBoxes(dataset=null) {
	    let nodesizeScale = 4;
	    let slider = $("#nodesizeScalar");
	    let min_ = 2;
	    let max_ = 6;
	    slider.prop('min', min_);
	    slider.prop('max', max_);
	    slider.prop('step', 0.1);
	    $("#nodesizeScaleMin").text(min_);
	    $("#nodesizeScaleMax").text(max_);
	    slider.prop("value", nodesizeScale);

	    $("#checkBoxNodeSize1").on("click", function() {
	    	updateProportionalSize(this, '1');
	    	updateNodeSize('1');
	    });

	    $("#checkBoxNodeSize2").on("click", function() {
	    	updateProportionalSize(this, '2');
	    	updateNodeSize('2');
	    });

	    $("#nodesizeScalar").on('input', function(){
	    	updateNodeSize()
	    });
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

	function changeNum(filename){
        d3.json(filename, function(error, root) {
            if (error) throw error;

            document.getElementById("start_year").innerHTML = root.children[0].name;
            document.getElementById("end_year").innerHTML = root.children[root.children.length-1].name;

            root = d3.hierarchy(root);

            dataSourceLeaves = document.getElementById("data-info-leaves");
            dataSourceSize = document.getElementById("data-info-size");

            var dataType = config.dataType;

            var chldTxt = config.dataInfoLeavesText[dataType];
            var szTxt = config.dataInfoSizeText[dataType];

            root.sum(function(d){ return d.children? 0 : 1;});
            dataSourceLeaves.innerHTML = chldTxt+ root.value;

            root.sum(function(d) { return d.size; });
            dataSourceSize.innerHTML = szTxt  + root.value;
            
        });
    }

    function changeDataset(onload=0){
        // resetCfg();

        var objD = document.getElementById("dataDropdown");

        // change the data-info-children, data-info-sie text
        // dependent on the selected dataset data attribute
        var dataType = d3.select(objD.selectedOptions[0]).attr("data")

        config.dataType = dataType;

        treeLib.displayedNode(objD.value);

        var filename = "datasets/" + objD.value + ".txt";
        
        config.filename = filename;

        document.getElementById("enter_authorname").innerHTML = objD.options[objD.selectedIndex].text;
        
        changeNum(filename);        
    }

    function processAccumulated(root, type=null) {
    	var acc = config.accumulated;

    	if (type != null) {
    		if (acc == 'leaves') {
    			leavesAccZT(root);
    		} else if (acc == 'size') {

    		}
    	} else {
    		if (acc == 'leaves') {
    			root.each(el => {
    				if (el.children) {
    					el.value = el.leaves().length;
    				} else {
    					el.value = 1;
    				}
    			});
    		} else if (acc == 'size') {
    			// size has already been set by sum
    		}
    	}

    	return root;
    	// debugger;
    	// make the value either the accumulated size or the accumulated leaves

    }

    function leavesAccZT(d) {
        return (d._children = d.children)
            ? d.value = d.children.reduce(function(p, v) { return p + leavesAccZT(v); }, 0)
            : 1;
    }

    function dataFilterSubset() {
    	var filename = config.filename;

    	d3.json(filename, function(error, data) {
    		var root = d3.hierarchy(data);
    		var collection = {};
    		// get all the levels
    		root.each(function(d){
    			var obj = findLevels(d, 0, d.data.name);
    			var levels = obj.levels;
    			var name = obj.name;

    			if (levels == 0) return;

    			if (collection[levels]) {
    				if (!collection[levels].includes(name))
    					collection[levels] = collection[levels].concat([name]);
    			} else
    				collection[levels] = [name];
    		});	

    		function findLevels(d, levels, name) {
    			
    			if (d.parent == null || d.children == null)
    				return {levels: levels, name: name};
    			else {
    				d = d.parent;
    				levels += 1;
    				return findLevels(d, levels, name)
    			}
    		}
	        // debugger;
	    });
    }

	return {

		getNodeSize: function(d, position, type=null) {
			var mult = 1;

			if (type == "Radial_Tree")
				mult= 5/8;
			
			return getNodeSize(d, accessNodeSize(), config.proportionalSize[position]) * mult;
		},

		setupCheckBoxes: function(dataset=null) {
			setupCheckBoxes(dataset=null);
		},

		changeNum: function(FileName) {
			changeNum(FileName);
		},

		changeDataset: function(onload) {
			return changeDataset(onload);
		},

		dataInfoLeavesText: function() {
			return config.dataInfoLeavesText[config.dataType];
		},

		dataInfoSizeText: function() {
			return config.dataInfoSizeText[config.dataType];
		},

		updateAccumulated: function(acc) {
			config.accumulated = acc;
		},

		config: function() { return config; },

		processAccumulated: function(root, type=null) {
			return processAccumulated(root, type);
		},

		dataTypeSpanText: function() {
			var dataType = config.dataType;

			var spanText = config.dataInfoTypes[dataType];

			var l = spanText.leaves;
			var s = spanText.size;

			$(".data-info-types-span.leaves").text(l);
			$(".data-info-types-span.size").text(s);
		},

		resetProportionalSize: function(position) {
			config.proportionalSize[position] = false;

			$("#checkBoxNodeSize"+position).prop('checked', false);
		},

		changeLockPosition: function(position) {
			var lock = $("#checkBoxRememberLayout"+position);

			// change to the opposite of what the config started with
			config.isLocked[position] = !config.isLocked[position];

			var wasOpen = config.isLocked[position];

			if (wasOpen)
				lock.html(LOCK_CLOSED);
			else
				lock.html(LOCK_OPEN);

		},

		isLocked: function(position){
			return config.isLocked[position];
		},

		unlockPosition: function(position) {
			var lock = $("#checkBoxRememberLayout"+position);

			config.isLocked[position] = false;

			lock.html(LOCK_OPEN);
		},

		crtScaleLog: function(total, range) {
			var logScale = d3.scaleLog()
				.domain([1, total])
				.range([1, range])

			config.scaleLog = function(val) {
				return logScale(val);
			}
		},

		getLogScale: function(val) {
			return config.scaleLog(val)
		},

		dataFilterSubset: function() {
		    dataFilterSubset();
		},

		getFileName: function() {
			return config.filename;
		}

	}

})( d3, $ );
