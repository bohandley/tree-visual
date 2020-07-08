var menu = (function (d3, $) {

	var dummyConfig = {
	    nodeSize: 5,
	    proportionalSize: false
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
                // var amount = 1;

                // if (config.proportionalSize == true) {
                //     if (d.children)
                //         amount = d.children.length;

                //     if (d._children)
                //         amount = d._children.length;

                //     if (d.data && d.data.children)
                //         amount = d.data.children.length;
                // }
                
                // var size = proportion * amount;
                
                // return size;
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

	function setupNodesizeScalar(dataset=null) {
	    // switch(dataset.graphSize) 
	    // {
	    //   case "Small":
	    //       nodesizeScale = 1.3;
	    //     break;
	    //   case "Medium":
	    //       nodesizeScale = 1.0;
	    //     break;
	    //   case "Large":
	    //       nodesizeScale = 0.9;
	    //     break;
	    // }
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
	        // if ($(this).prop("checked") == true)
	        //     appearance.proportionalSize = true;
	        // else if ($(this).prop("checked") == false)
	        //     appearance.proportionalSize = false;

	        // appearance.nodeSize = (+$("#nodesizeScalar").prop("value"));

	        // var proportion = appearance.nodeSize;

	        // d3.selectAll("circle.node-size")
	        //     .attr("r", function(d) {
	        //         var amount = 1;

	        //         if (appearance.proportionalSize == true) {
	        //             if (d.children)
	        //                 amount = d.children.length;

	        //             if (d._children)
	        //                 amount = d._children.length;

	        //             if (d.data && d.data.children)
	        //                 amount = d.data.children.length;
	        //         }
	                
	        //         var size = proportion * amount;
	                
	        //         return size;
	        //     });
	    });

	    $("#nodesizeScalar").on('input', function(){
	    	updateNodeSize()
	        // appearance.nodeSize = (+$("#nodesizeScalar").prop("value"));

	        // var proportion = appearance.nodeSize;

	        // d3.selectAll("circle.node-size")
	        //     .attr("r", function(d) {
	        //         var amount = 1;

	        //         if (appearance.proportionalSize == true) {
	        //             if (d.children)
	        //                 amount = d.children.length;

	        //             if (d._children)
	        //                 amount = d._children.length;

	        //             if (d.data && d.data.children)
	        //                 amount = d.data.children.length;
	        //         }
	                
	        //         var size = proportion * amount;
	                
	        //         return size;
	        //     });
	        // simulations.forEach(x => x.force('collision', d3.forceCollide(NODE_RADIUS * nodesizeScale)));
	        // svgs.forEach(x => updateDrawing(x, currentNeighbors));
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

	return {


		getNodeSize: function(d, type=null) {
			var mult = 1;

			if (type == "Radial_Tree")
				mult= 5/8;

			return getNodeSize(accessNodeSize(), config.proportionalSize, d) * mult;
		},

		setupNodesizeScalar: function(dataset=null) {
			setupNodesizeScalar(dataset=null);
		}
	}

})( d3, $ );
