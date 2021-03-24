var menu = (function (d3, $) {
    const LOCK_OPEN = '<i class="fas fa-lock-open"></i>';
    const LOCK_CLOSED = '<i class="fas fa-lock"></i>';

    var dummyConfig = {
        root: null,
    	rootName: '',
        scaleLog: function () {},
        // isLocked: { 1: true, 2: true },
        palettes: [
            (function () {
                var colors = d3.schemeCategory10.map((c) => d3.interpolateRgb(c, "#fff")(0.2));
                // remove grey color
                colors = colors.filter(c=> c != "rgb(153, 153, 153)");
                treeLib.shuffleArray(colors);
                return d3.scaleOrdinal(colors);
            })(),
            (function () {
                var colors = [//Array.from({ length: 10 }, (x, i) => i / 9).map((t) => d3.interpolateRgb("#202020", "#e0e0e0")(t));
                    d3.rgb(0,0,0),
                    d3.rgb(0,73,73),
                    d3.rgb(0,146,146),
                    d3.rgb(255,109,182),
                    d3.rgb(255,182,119),
                    d3.rgb(73,0,146),
                    d3.rgb(0,109,219),
                    d3.rgb(182,109,255),
                    d3.rgb(109,182,255),
                    d3.rgb(182,219,255),
                    d3.rgb(146,0,0),
                    d3.rgb(146,73,0),
                    d3.rgb(219,209,0),
                    d3.rgb(36,255,36),
                    d3.rgb(255,255,109),
                ];
                treeLib.shuffleArray(colors);
                return d3.scaleOrdinal(colors);
            })(),
        ],
        curPaletteIndex: 0,
        accumulated: "leaves",
        nodeSize: 5,
        proportionalSize: { 1: true, 2: true },
        removeText: false,
        dataType: "",
        leafSelection: [],
        dataInfoLeavesText: {
            author: (filtered, total) => `Number of papers (displayed / total): ${addCommas(filtered)} / ${addCommas(total)}`,
            government: (filtered, total) => `Number of branches (displayed / total): ${addCommas(filtered)} / ${addCommas(total)}`,
            trade: (filtered, total) => `Number of countries (displayed / total): ${addCommas(filtered)} / ${addCommas(total)}`,
            treeoflife: (filtered, total) => `Number of species taxonomy (displayed / total): ${addCommas(filtered)} / ${addCommas(total)}`,
        },
        dataInfoSizeText: {
            author: (filtered, total) => `Number of citations (displayed / total): ${addCommas(filtered)} / ${addCommas(total)}`,
            government: (filtered, total) => `Number of employees (displayed / total) ${addCommas(filtered)} / ${addCommas(total)}`, // no employee data available
            trade: (filtered, total) => `Number of USD (Million) (displayed / total): ${divideByThous(filtered)} / ${divideByThous(total)}`,
            treeoflife: (filtered, total) => `Number of subspecies in taxonomy (displayed / total): ${addCommas(filtered)} / ${addCommas(total)}`, // Tips: the actual leafs in this branch (Since the tree is trimmed, actual leafs are a lot more than current leafs)
        },
        dataNodeSizeText: {
            author: (filtered) => `Number of citations: ${addCommas(filtered)}`,
            government: (filtered) => `Number of employees ${addCommas(filtered)}`, // no employee data available
            trade: (filtered) => `Number of USD (Million): ${divideByThous(filtered)}`,
            treeoflife: (filtered) => `Number of subspecies in taxonomy: ${addCommas(filtered)}`, // Tips: the actual leafs in this branch (Since the tree is trimmed, actual leafs are a lot more than current leafs)
        },
        dataInfoTypes: {
            author: { size: "# Citations", leaves: "# Papers" },
            government: { size: "# Employees", leaves: "# Branches" },
            trade: { size: "# USD (Million)", leaves: "# Countries" },
            treeoflife: { size: "# Subspecies in Taxonomy", leaves: "# Species in Taxonomy" },
        },
        dataDescription: {
            author: {
                name: "Publications",
                desc: (dsName, root) => `The tree shows ${dsName}\'s publications from ${root.children[0].name} to ${root.children[root.children.length - 1].name}.`,
                hierarchy: "--------Publish Year <br/>| <br/>------Publish Type <br/>| <br/>----Publisher CCF Rank <br/>| <br/>--Individual Paper",
                source: "Microsoft Academic Graph & Google Scholar",
            },
            government: {
                name: "Government Structure",
                desc: (dsName, root) => `The tree shows the government structure of ${dsName}.`,
                hierarchy: "--------First Level <br/>| <br/>------Second Level <br/>| <br/>----Third Level <br/>| <br/>--Fourth Level",
                source: "Government Official Websites",
            },
            trade: {
                name: "Trade",
                desc: (dsName, root) => `The tree shows ${dsName}\'s trade data.`,
                hierarchy: "------In/Export <br/>| <br/>----Product <br/>| <br/>--Partner Country",
                source: "World Integrated Trade Solution - World Bank",
            },
            treeoflife: {
                name: "Tree of Life",
                desc: (dsName, root) => `The tree shows ${dsName}\'s tree taxonomy.`,
                hierarchy: "--------Order <br/>| <br/>------Family <br/>| <br/>----Genus <br/>| <br/>--Species - Common Name",
                source: "Open Tree of Life",
            },
        },
        filterPreset: {
            author: (level, set) => (level == 1 ? set.slice(0, 10) : set), // first 10 for level 1
            trade: (level, set) => (level == 2 ? set.slice(0, 5) : set), // first 5 for level 2
            treeoflife: (level, set) => (set),//(level == 1 ? set.slice(0, 10) : set), // first 10 for all levels
            government: (level, set) => (set.length > 20 ? set.filter((e, i) => i % 2 == 0) : set), // intervene select for large set
        },
    };

    var config = copy(dummyConfig);

    function resetMenuCfg() {
        config = copy(dummyConfig);
    }

    function updateNodeSize(position = null) {
        config.nodeSize = accessNodeSize();

        var ndSize = config.nodeSize;
        
        if (position) {
            var type = treeLib.getOtherGraphType("g"+position);

            d3.select("#g" + position)
                .selectAll("circle.node-size")
                .attr("r", function (d) {
                    return getNodeSize(d, ndSize, config.proportionalSize[position], type);
                });
        } else {
            var type1 = treeLib.getOtherGraphType("g1");
            var type2 = treeLib.getOtherGraphType("g2");
        	// for updating the slider node size
            d3.select("#g1")
                .selectAll("circle.node-size")
                .attr("r", function (d) {
                    return getNodeSize(d, ndSize, config.proportionalSize["1"], type1);
                });

            d3.select("#g2")
                .selectAll("circle.node-size")
                .attr("r", function (d) {
                    return getNodeSize(d, ndSize, config.proportionalSize["2"], type2);
                });
        }
    }

    function accessNodeSize() {
        return +$("#nodesizeScalar").prop("value");
    }

    function getNodeSize(d, ndSize, prpSize = null, type = null) {
        var amount = 1;

        if (prpSize == true) {
            amount = config.scaleLog(d.value);

            if (amount == -Infinity) amount = 0.001;
            // if (d.children)
            //     amount = d.children.length;

            // if (d._children)
            //     amount = d._children.length;

            // if (d.data && d.data.children)
            //     amount = d.data.children.length;
        }

        if (type == "Radial_Tree") amount = amount * 3/4;

        return ndSize * amount;
    }

    function updateProportionalSize(that, view) {
        // change the config for each view if one is checked
        var bool = $(that).prop("checked") == true;

        if (bool == true) config.proportionalSize[view] = true;
        else if (bool == false) config.proportionalSize[view] = false;
    }

    function setupCheckBoxes(dataset = null) {
        let nodesizeScale = 4;
        let min_ = 2;
        let max_ = 6;
        let slider = $("#nodesizeScalar");
        slider.prop("min", min_);
        slider.prop("max", max_);
        slider.prop("step", 0.1);
        $("#nodesizeScaleMin").text(min_);
        $("#nodesizeScaleMax").text(max_);
        slider.prop("value", nodesizeScale);

        $("#checkBoxNodeSize1").on("click", function () {
            updateProportionalSize(this, "1");
            updateNodeSize("1");
        });

        $("#checkBoxNodeSize2").on("click", function () {
            updateProportionalSize(this, "2");
            updateNodeSize("2");
        });

        $("#nodesizeScalar").on("input", function () {
            updateNodeSize();
        });

        // initial acc is leaves, see menu.config.accumulated
        $("#checkBoxAccumulated").prop("checked", true);
        $(".data-info-types-span.leaves").css("opacity", 1);
        $(".data-info-types-span.size").css("opacity", 0.25);

        $("#checkBoxAccumulated").on("click", function () {
            var isChecked = $(this).prop("checked");

            if (isChecked) {
                menu.updateAccumulated("leaves");
                $(".data-info-types-span.leaves").css("opacity", 1);
                $(".data-info-types-span.size").css("opacity", 0.25);
            } else {
                menu.updateAccumulated("size");
                $(".data-info-types-span.leaves").css("opacity", 0.25);
                $(".data-info-types-span.size").css("opacity", 1);
            }

            refreshVisualizations();
            $("#leaf-selection").selectpicker('deselectAll');
        });

        // $("#checkBoxRememberLayout1").on("click", function () {
        //     menu.changeLockPosition("1");
        // });

        // $("#checkBoxRememberLayout2").on("click", function () {
        //     menu.changeLockPosition("2");
        // });

        $("#checkBoxColorBlind").on("click", function () {
            var isChecked = $(this).prop("checked");
            config.curPaletteIndex = isChecked ? 1 : 0;

            refreshVisualizations();
            $("#leaf-selection").selectpicker('deselectAll');
        });

        $("#checkBoxRemoveText").on("click", function () {
            // menu.changeLockPosition("2");
            config.removeText = config.removeText ? false : true;

            var remove = config.removeText;

        	d3.selectAll("text")
        		.text((d) => {
        			
        			var name;

        			if (!d) // get the root name for zoomable tree
        				name = config.rootName;
        			else
        				name = d.name ? d.name : d.data.name;

        			return treeLib.getNodeDisplayName(name, remove)
        		});
        });
    }

    function copy(o) {
        var _out, v, _key;
        _out = Array.isArray(o) ? [] : {};
        for (_key in o) {
            v = o[_key];
            _out[_key] = typeof v === "object" && v !== null ? copy(v) : v;
        }
        return _out;
    }

    function changeDataSummary(FileName, datasetName) {
        var dataType = config.dataType;

        var root = config.root;

        document.getElementById("treeName").innerHTML = config.dataDescription[dataType].name;
        document.getElementById("treeDescription").innerHTML = config.dataDescription[dataType].desc(datasetName, root);
        document.getElementById("treeHierarchy").innerHTML = config.dataDescription[dataType].hierarchy;
        document.getElementById("treeSource").innerHTML = config.dataDescription[dataType].source;
    }

    function processAccumulated(root, type = null) {
        var acc = config.accumulated;

        if (type != null) {
            if (acc == "leaves") {
                leavesAccZT(root);
            } else if (acc == "size") {
            }
        } else {
            if (acc == "leaves") {
                root.each((el) => {
                    if (el.children) {
                        el.value = el.leaves().length;
                    } else {
                        el.value = 1;
                    }
                });
            } else if (acc == "size") {
                // size has already been set by sum
            }
        }

        return root;
        // make the value either the accumulated size or the accumulated leaves
    }

    function leavesAccZT(d) {
        if (d._children) {
            d.value = d.lvs.length;
            d._children.forEach(leavesAccZT);
        } else {
            d.value = 1;
        }
        // return (d._children = d.children)
        //     ? d.value = d.children.reduce(function(p, v) { return p + leavesAccZT(v); }, 0)
        //     : 1;
    }

    function dataFilterSubset() {
        var filename = config.filename;

        d3.json(filename, function (error, data) {
            config.root = data;

            config.rootName = data.name;

            var root = d3.hierarchy(data);
            var collection = {};
            // get all the levels
            root.each(function (d) {
                var obj = findLevels(d, 0, d.data.name);
                var levels = obj.levels;
                var name = obj.name;

                if (levels == 0) return;
                // get distinct ids for nodes in each level
                if (collection[levels]) {
                    if (!collection[levels].includes(name)) collection[levels] = collection[levels].concat([name]);
                } else collection[levels] = [name];
            });

            function findLevels(d, levels, name) {
                if (d.parent == null || d.children == null) return { levels: levels, name: name };
                else {
                    d = d.parent;
                    levels += 1;
                    return findLevels(d, levels, name);
                }
            }

            dataFilterSubsetGlobal = collection;
            // clear all previous selects
            $("#filterDiv").empty();
            $("#selectionDiv").empty();
            // set the levelFilters to the original collection, no presets yet
            config.levelFilters = collection;

            createFilterSelectPickers(collection);

            createSelectionSelectPicker(root.leaves())
            // create the filter button
            $("#filterDiv").append("<button type='button' class='btn btn-primary filter-levels-button' id='filter-levels'>Apply Filters</button>");

            // trigger the spc event to add the listener in main.js to #filterDiv
            // which has access to updateDataset(), which is also in main.js
            $("body").trigger("spc");
        });
    }

    function createSelectionSelectPicker(leaves) {
        // create a unique set of leaves
        var leafNames = [...new Set(leaves.map(leaf => leaf.data.name))];

        var leafOptions = leafNames.map(function(leaf){

            var option = {};

            option.text = leaf;

            option.value = leaf;

            return option;
        });

        leavesGlobals = leafOptions;

        var select = multiselectHtml("#selectionDiv", "leaf-selection", "Leaves")

        var filterOptions = select.selectAll("option").data(leafOptions).enter().append("option");

        filterOptions
            .text((d) => {
                if(d.text.length > 12) // tree taxomony is too long
                    return d.text.slice(0,12) + "...";
                else
                    return d.text
            })
            .attr("value", (d) => d.value)
            .attr("title", (d) => d.text);

        var leafSelect = $("#leaf-selection");

        leafSelect.selectpicker("refresh");

        leafSelect.selectpicker({"width": "auto"})
        leafSelect.on("change", function () {
            var vals = $(this).val();

            config.leafSelection = vals;

            leafSelectEvent(vals);
        });

    }

    function leafSelectEvent(vals) {      
        // highlight all the selected leaves and normalize all no selected
        // iterate through
        // selected node act as if moused over
        // non selected nodes lower opacity
        // if none selected revert to normal opacity
        collectLeaves("g1", vals);
        collectLeaves("g2", vals);
    }

    function collectLeaves(position, vals) {
        // get the type of 
        var nodeType = d3.select("#"+position).selectAll(".leaf")._groups[0][0];
        
        if (nodeType) {
            d3.selectAll(nodeType.nodeName)._groups[0].forEach(function(node){
                highlightLeavesSelection(vals, node)                
            });
        } else {
            var graphType = treeLib.getOtherGraphType(position);

            // could be the zoomable tree map or collapsible tree that don;t have exposed leaves
            if (graphType == "Zoomable_Treemap") {
                d3.selectAll("g")._groups[0].forEach(function(node){
                    highlightLeavesSelection(vals, node)                
                });
            } else if (graphType == "Collapsible_Tree") {
                d3.selectAll("circle")._groups[0].forEach(function(node){
                    highlightLeavesSelection(vals, node)                
                });
            }
        }
    }

    function highlightLeavesSelection(vals, node) {
        if (node.__data__ == undefined)
            return

        var nodeName;
        
        if (!node.__data__.hasOwnProperty("data"))
            nodeName = node.__data__.name;
        else
            nodeName = node.__data__.data.name;

        var id = "#"+node.id;
        if (id == "#")
            return

        var d = d3.select(id).data()[0];

        if (vals.length == 0){
            // if no leaves are selected everything is normal
            treeLib.mouseoutLinking("g1", "g2", d);
            d3.select(id).style("opacity", 1);
        } else if (!vals.includes(nodeName)) {
            // if the node is not in the collection lower opacity
            treeLib.mouseoutLinking("g1", "g2", d);
            d3.select(id).style("opacity", .5);
        } else if (vals.includes(nodeName) || vals.length == 0) { 
            // if leaves are selected
            // we act as if they are moused over, on auto
            // and just in case we give them 1 opacity
            treeLib.mouseoverLinking("g1", "g2", d);
            d3.select(id).style("opacity", 1);
        }
    }

    function createFilterSelectPickers(collection) {
        Object.keys(collection).forEach(function (level) {

            var id = "filter-level-" + level;
            
            var title = "Level " + level;

            var select = multiselectHtml("#filterDiv", id, title)

            var filterOptions = select.selectAll("option").data(collection[level]).enter().append("option");

            filterOptions
                .text((d) => {
                    if(d.length > 12) // tree taxomony is too long
                        return d.slice(0,12) + "...";
                    else
                        return d
                })
                .attr("value", (d) => d)
                .attr("title", (d) => d);

            var curFilter = $("#filter-level-" + level);

            curFilter.selectpicker("refresh");

            curFilter.on("change", function () {
                var selections = $(this).val();
                // updat the filter in the config
                config.levelFilters[level] = selections;
            });

            // use preset from config if available
            var preset = config.filterPreset[config.dataType];
            
            if (preset) {
                curFilter.selectpicker("val", preset(level, collection[level]));
            } else {
                // select all
                // https://developer.snapappointments.com/bootstrap-select/methods/
                // $(".selectpicker").selectpicker("selectAll");
                curFilter.selectpicker("selectAll");
            }
        });
    }

    function multiselectHtml(appendTo, id, title) {

        var selectPicker = `<div id="selectpicker-` + id + `" class="form-group mt-3 mb-1"> 
            <span>` + title + `</span>
                <div class="container">
                    <div class="row">
                        <div class="col-3">
                            <select 
                                id="` + id + `" 
                                class="selectpicker" 
                                data-live-search="true" 
                                multiple 
                                data-actions-box="true" 
                                data-width="175px"
                                data-height="100px"
                            >
                            </select>
                        </div>
                    </div>
                </div>
            </div>`;

        $(appendTo).append(selectPicker);

        // return the multiselect
        return d3.select("#" + id);
    }

    function filterJson(json) {
        var levelFilters = config.levelFilters;

        var filters = Object.keys(config.levelFilters).reduce(function (acc, el) {
            return acc.concat(levelFilters[el]);
        }, []);

        filterData(json, filters);

        return json;
    }

    function filterData(node, filters) {
        if (node.children) {
            node.children = node.children.filter((el) => {
                if (el.children && filters.includes(el.name)) 
                    return 1;
                else if (!el.children)// don't filter the leaves
                    return 1;
                else 
                    return 0;
            });

            node.children.forEach(function (el) {
                filterData(el, filters);
            });
        }
    }

    function refreshVisualizations() {
        // var locked1 = menu.isLocked("1");
        // var locked2 = menu.isLocked("2");

        loadVisualization("1")//, locked1);
        loadVisualization("2")//, locked2);
    }

    function addCommas(value) {
    	return Math.floor(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function divideByThous(value) {
        var val1 = value/1000;
        val2 = addCommas(val1);
        
        return val2;
    }

    function disableFilteredLeavesSelection(originalRoot, filteredRoot) {
        var disabledleaves = originalRoot.leaves().reduce((acc, leaf) => {
            var isFiltered = !filteredRoot.leaves().find(l=>{
                return l.data.name == leaf.data.name;
            });

            if(isFiltered)
                return acc.concat([leaf.data.name]);
            else
                return acc;
        }, []);

       
        d3.selectAll("#leaf-selection")
            .selectAll("option")
            .property("disabled", d => {
                if (disabledleaves.includes(d.value)){
                    return true;
                } else {
                    return false;
                }
            }).sort(function(a,b){
                var aval = disabledleaves.includes(a.value) ? 1 : 0,
                    bval = disabledleaves.includes(b.value) ? 1 : 0;

                return d3.ascending(aval, bval)
            });;
                
                
        $("#leaf-selection").selectpicker("refresh");
    }

    return {
        getNodeSize: function (d, position, type = null) {
            return getNodeSize(d, accessNodeSize(), config.proportionalSize[position], type);
        },

        setupCheckBoxes: function (dataset = null) {
            setupCheckBoxes((dataset = null));
        },

        changeNum: function (originalRoot, filteredRoot) {
            // Refactor this function
            var dataType = config.dataType;

            originalRoot = d3.hierarchy(originalRoot);
            filteredRoot = d3.hierarchy(filteredRoot);

            // disable the leaves selection options that are filtered
            disableFilteredLeavesSelection(originalRoot, filteredRoot);

            var dataSourceLeaves = document.getElementById("data-info-leaves");
            var dataSourceSize = document.getElementById("data-info-size");

            var ogRoot = {};
            originalRoot.sum(function (d) {
                var num = 0
                if (d.children){
                    // return 0;
                } else {
                    // debugger
                    if(ogRoot[d.name]) {
                        // return 0;
                    } else {
                        ogRoot[d.name] = true;
                        num = 1;
                    }
                }
                
                return num;
            });

            var filtRoot = {};
            filteredRoot.sum(function (d) {
                var num = 0
                if (d.children){
                    // return 0;
                } else {
                    // debugger
                    if(filtRoot[d.name]) {
                        // return 0;
                    } else {
                        filtRoot[d.name] = true;
                        num = 1;
                    }
                }
                
                return num;
            });

            dataSourceLeaves.innerHTML = config.dataInfoLeavesText[dataType](filteredRoot.value, originalRoot.value);

            originalRoot.sum(function (d) {
                return d.size;
            });

            filteredRoot.sum(function (d) {
                return d.size;
            });

            dataSourceSize.innerHTML = config.dataInfoSizeText[dataType](filteredRoot.value, originalRoot.value);
        },

        changeDataset: function () {
            var objD = document.getElementById("dataDropdown");

            changeDataSummary(config.filename, objD.options[objD.selectedIndex].text);
        },

        dataInfoLeavesText: function (value) {
            return config.dataInfoLeavesText[config.dataType](value);
        },

        dataNodeSizeText: function (value) {
            return config.dataNodeSizeText[config.dataType](value);
        },

        updateAccumulated: function (acc) {
            config.accumulated = acc;
        },

        config: function () {
            return config;
        },

        processAccumulated: function (root, type = null) {
            return processAccumulated(root, type);
        },

        dataTypeSpanText: function () {
            var dataType = config.dataType;

            var spanText = config.dataInfoTypes[dataType];

            var l = spanText.leaves;
            var s = spanText.size;

            $(".data-info-types-span.leaves").text(l);
            $(".data-info-types-span.size").text(s);
        },

        resetProportionalSize: function (position) {
            // config.proportionalSize[position] = false;

            // $("#checkBoxNodeSize" + position).prop("checked", false);
        },

        // changeLockPosition: function (position) {
        //     var lock = $("#checkBoxRememberLayout" + position);

        //     // change to the opposite of what the config started with
        //     config.isLocked[position] = !config.isLocked[position];

        //     var wasOpen = config.isLocked[position];

        //     if (wasOpen) lock.html(LOCK_CLOSED);
        //     else lock.html(LOCK_OPEN);
        // },

        // isLocked: function (position) {
        //     return config.isLocked[position];
        // },

        // unlockPosition: function (position) {
        //     var lock = $("#checkBoxRememberLayout" + position);

        //     config.isLocked[position] = false;

        //     lock.html(LOCK_OPEN);
        // },

        crtScaleLog: function (total, range) {
            var logScale = d3.scaleLog().domain([1, total]).range([1, range]);

            config.scaleLog = function (val) {
                return logScale(val);
            };
        },

        getLogScale: function (val) {
            return config.scaleLog(val);
        },

        dataFilterSubset: function () {
            dataFilterSubset();
        },

        getFileName: function () {
            return config.filename;
        },

        filterJson: function (json) {
            return filterJson(json);
        },

        color: function (val) {
            return config.palettes[config.curPaletteIndex](val);
        },

        checkLeafSelection() {
            var vals = $('#leaf-selection').val();
            leafSelectEvent(vals);
        },

        resetLeafSelection() {
            $('#leaf-selection').selectpicker('deselectAll');
            config.leafSelection = [];
        },

        updateConfig(key, value) {
            config[key] = value;
        }


    };
})(d3, $);
