var menu = (function (d3, $) {

	var dummyConfig = {
		accumulated: 'leaves',
	    nodeSize: 5,
	    proportionalSize: false,
	    dataType: '',
	    dataInfoLeavesText: {
	    	author: "Number of Papers: ",
	    	government: "Number of Offices: ",
	    	import: "Countries imported to: ",
	    	export: "Countries exported to: ",
	    	trade: "Countries exported to: ",
	    	treeoflife: "Countries exported to: "
	    },
	    dataInfoSizeText: {
	    	author: "Number of Citations: ",
	    	government: "Number of employees",
	    	import: "Value of imports: ",
	    	export: "Value of exports: ",
	    	trade: "Countries exported to: ",
	    	treeoflife: "Countries exported to: "
	    }
	}

	var config = copy(dummyConfig);

	function resetMenuCfg(){
	    config =  copy(dummyConfig);
	}

	function updateNodeSize() {
		config.nodeSize = accessNodeSize();

        var ndSize = config.nodeSize;

        d3.selectAll("circle.node-size")
            .attr("r", function(d) {
            	return getNodeSize(ndSize, config.proportionalSize, d);
            });
	}

	function accessNodeSize() {
		return (+$("#nodesizeScalar").prop("value"));
	}

	function getNodeSize(ndSize, prpSize, d) {
		var amount = 1;

        if (prpSize == true) {
            if (d.children)
                amount = d.children.length;

            if (d._children)
                amount = d._children.length;

            if (d.data && d.data.children)
                amount = d.data.children.length;
        }
        
        var size = ndSize * amount;
        
        return size;
	}

	function updateProportionalSize(that) {
		var bool = $(that).prop("checked") == true;

		if (bool == true)
            config.proportionalSize = true;
        else if (bool == false)
            config.proportionalSize = false;
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

	    $("#checkBoxNodeDegree").on("click", function() {
	    	updateProportionalSize(this);
	    	updateNodeSize();
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

	function changeNum(FileName){
        d3.json(FileName, function(error, root) {
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
            
        })
    }

    function changeDataset(FileName, onload=0){
        // resetCfg();

        var objD = document.getElementById("dataDropdown");

        // change the data-info-children, data-info-sie text
        // dependent on the selected dataset data attribute
        var dataType = d3.select(objD.selectedOptions[0]).attr("data")

        config.dataType = dataType;

        treeLib.displayedNode(objD.value);

        FileName = "datasets/" + objD.value + ".txt";
        
        document.getElementById("enter_authorname").innerHTML = objD.options[objD.selectedIndex].text;
        
        changeNum(FileName);        

        return FileName;
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

	return {

		getNodeSize: function(d, type=null) {
			var mult = 1;

			if (type == "Radial_Tree")
				mult= 5/8;

			return getNodeSize(accessNodeSize(), config.proportionalSize, d) * mult;
		},

		setupCheckBoxes: function(dataset=null) {
			setupCheckBoxes(dataset=null);
		},

		changeNum: function(FileName) {
			changeNum(FileName);
		},

		changeDataset: function(FileName, onload) {
			return changeDataset(FileName, onload);
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
		}
	}

})( d3, $ );
