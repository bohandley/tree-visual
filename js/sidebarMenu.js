var menu = (function (d3, $) {
    const LOCK_OPEN = '<i class="fas fa-lock-open"></i>';
    const LOCK_CLOSED = '<i class="fas fa-lock"></i>';

    var dummyConfig = {
        scaleLog: function () {},
        isLocked: { 1: false, 2: false },
        accumulated: "leaves",
        nodeSize: 5,
        proportionalSize: { 1: false, 2: false },
        dataType: "",
        dataInfoLeavesText: {
            author: (value) => `Number of Papers: ${value}`,
            government: (value) => `Number of Branches: ${value}`,
            trade: (value) => `Number of Import/Export Countries: ${value}`,
            treeoflife: (value) => `Number of Species: ${value}`,
        },
        dataInfoSizeText: {
            author: (value) => `Number of Citations: ${value}`,
            government: (value) => "" /*`Number of Employees: ${value}`*/, // no employee data available
            trade: (value) =>
                `Volume of Import/Export ($ Thousand): ${Math.floor(value)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
            treeoflife: (value) => `Number of Tips: ${value}`, // Tips: the actual leafs in this branch (Since the tree is trimmed, actual leafs are a lot more than current leafs)
        },
        dataInfoTypes: {
            author: { size: "Citations", leaves: "Papers" },
            government: { size: "Employees", leaves: "Branches" },
            trade: { size: "Thousands", leaves: "Countries" },
            treeoflife: { size: "Tips", leaves: "Species" },
        },
        dataDescription: {
            author: {
                name: "Publications",
                desc: (dsName, root) => `The visualization is showing ${dsName}\'s publications from ${root.children[0].name} to ${root.children[root.children.length - 1].name}.`,
                hierarchy: "-------Publish Year <br/>| <br/>-----Publish Type <br/>| <br/>---Publisher CCF Rank <br/>| <br/>-Individual Paper",
                source: "Microsoft Academic Graph & Google_scholar",
            },
            government: {
                name: "Government Structure",
                desc: (dsName, root) => `The visualization is showing the government structure of ${dsName}.`,
                hierarchy: "-------First Level <br/>| <br/>-----Second Level <br/>| <br/>---Third Level <br/>| <br/>-Fourth Level",
                source: "Government Official Websites",
            },
            trade: {
                name: "Trade",
                desc: (dsName, root) => `The visualization is showing ${dsName}\'s trade data.`,
                hierarchy: "-----In/Export <br/>| <br/>---Product <br/>| <br/>-Partner Country",
                source: "World Integrated Trade Solution - World Bank",
            },
            treeoflife: {
                name: "Tree of Life",
                desc: (dsName, root) => `The visualization is showing ${dsName}\'s tree taxonomy.`,
                hierarchy: "-------Cellular <br/>| <br/>-----Level 1 <br/>| <br/>---Level 2 <br/>| <br/>-Level ...",
                source: "Open Tree of Life",
            },
        },
        filterPreset: {
            author: (level, set) => (level == 1 ? set.slice(0, 12) : set), // first 12 for level 1
            trade: (level, set) => (level == 2 ? set.slice(0, 5) : set), // first 5 for level 2
            treeoflife: (level, set) => set.slice(0, 10), // first 10 for all levels
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
            d3.select("#g" + position)
                .selectAll("circle.node-size")
                .attr("r", function (d) {
                    return getNodeSize(d, ndSize, config.proportionalSize[position]);
                });
        } else {
            d3.select("#g1")
                .selectAll("circle.node-size")
                .attr("r", function (d) {
                    // TODO: pass "Radial_Tree" in
                    return getNodeSize(d, ndSize, config.proportionalSize["1"]);
                });

            d3.select("#g2")
                .selectAll("circle.node-size")
                .attr("r", function (d) {
                    // TODO: pass "Radial_Tree" in
                    return getNodeSize(d, ndSize, config.proportionalSize["2"]);
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

        if (type == "Radial_Tree") amount = (amount * 5) / 8;

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

    function changeNum(FileName, datasetName) {
        d3.json(FileName, function (error, root) {
            if (error) throw error;

            var dataType = config.dataType;

            document.getElementById("treeName").innerHTML = config.dataDescription[dataType].name;
            document.getElementById("treeDescription").innerHTML = config.dataDescription[dataType].desc(datasetName, root);
            document.getElementById("treeHierarchy").innerHTML = config.dataDescription[dataType].hierarchy;
            document.getElementById("treeSource").innerHTML = config.dataDescription[dataType].source;

            root = d3.hierarchy(root);

            dataSourceLeaves = document.getElementById("data-info-leaves");
            dataSourceSize = document.getElementById("data-info-size");

            root.sum(function (d) {
                return d.children ? 0 : 1;
            });
            dataSourceLeaves.innerHTML = config.dataInfoLeavesText[dataType](root.value);

            root.sum(function (d) {
                return d.size;
            });
            dataSourceSize.innerHTML = config.dataInfoSizeText[dataType](root.value);
        });
    }

    function changeDataset(onload = 0) {
        // resetCfg();

        var objD = document.getElementById("dataDropdown");

        // change the data-info-children, data-info-sie text
        // dependent on the selected dataset data attribute
        var dataType = d3.select(objD.selectedOptions[0]).attr("data");

        config.dataType = dataType;

        treeLib.displayedNode(objD.value);

        var filename = "datasets/" + objD.value + ".txt";

        config.filename = filename;

        // document.getElementById("enter_authorname").innerHTML = objD.options[objD.selectedIndex].text;

        changeNum(filename, objD.options[objD.selectedIndex].text);
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
        // debugger;
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
            var root = d3.hierarchy(data);
            var collection = {};
            // get all the levels
            root.each(function (d) {
                var obj = findLevels(d, 0, d.data.name);
                var levels = obj.levels;
                var name = obj.name;

                if (levels == 0) return;

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

            // clear all previous selects
            $("#filterDiv").empty();

            // set the levelFilters to the original collection, no presets yet
            config.levelFilters = collection;

            createSelectPickers(collection);

            // create the filter button
            $("#filterDiv").append("<button type='button' class='btn btn-primary filter-levels-button' id='filter-levels'>Apply Filters</button>");

            $(".bs-actionsbox").addClass("actionbox-centering");

            $("#filterDiv").find("button").addClass("filter-levels-class");

            // trigger the spc event to add the listener in main.js to #filterDiv
            // which has access to updateDataset(), which is also in main.js
            $("body").trigger("spc");
        });
    }

    function createSelectPickers(collection) {
        Object.keys(collection).forEach(function (level) {
            var selectPicker =
                `<div id="selectpicker-filter-level-` +
                level +
                `" class="form-group mt-3 mb-1">
				<span>Level ` +
                level +
                `</span>
					<div class="container">
						<div class="row">
							<div class="col-3">
								<select id="filter-level-` +
                level +
                `" class="selectpicker" multiple data-actions-box="true">
								</select>
							</div>
						</div>
					</div>
				</div>`;

            $("#filterDiv").append(selectPicker);

            var select = d3.select("#filter-level-" + level);

            var filterOptions = select.selectAll("option").data(collection[level]).enter().append("option");

            filterOptions
                .text((d) => d)
                .attr("value", (d) => d)
                .attr("title", (d) => d);

            var curFilter = $("#filter-level-" + level);

            curFilter.selectpicker("refresh");

            curFilter.on("change", function () {
                var selections = $(this).val();
                // updat the filter in the config
                config.levelFilters[level] = selections;
                // debugger;
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
                if (el.children && filters.includes(el.name)) return 1;
                else if (!el.children)
                    // don't filter the leaves
                    return 1;
                else return 0;
            });

            node.children.forEach(function (el) {
                filterData(el, filters);
            });
        }
    }

    return {
        getNodeSize: function (d, position, type = null) {
            return getNodeSize(d, accessNodeSize(), config.proportionalSize[position], type);
        },

        setupCheckBoxes: function (dataset = null) {
            setupCheckBoxes((dataset = null));
        },

        changeNum: function (FileName, datasetName) {
            changeNum(FileName, datasetName);
        },

        changeDataset: function (onload) {
            return changeDataset(onload);
        },

        dataInfoLeavesText: function (value) {
            return config.dataInfoLeavesText[config.dataType](value);
        },

        dataInfoSizeText: function (value) {
            return config.dataInfoSizeText[config.dataType](value);
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
            config.proportionalSize[position] = false;

            $("#checkBoxNodeSize" + position).prop("checked", false);
        },

        changeLockPosition: function (position) {
            var lock = $("#checkBoxRememberLayout" + position);

            // change to the opposite of what the config started with
            config.isLocked[position] = !config.isLocked[position];

            var wasOpen = config.isLocked[position];

            if (wasOpen) lock.html(LOCK_CLOSED);
            else lock.html(LOCK_OPEN);
        },

        isLocked: function (position) {
            return config.isLocked[position];
        },

        unlockPosition: function (position) {
            var lock = $("#checkBoxRememberLayout" + position);

            config.isLocked[position] = false;

            lock.html(LOCK_OPEN);
        },

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
    };
})(d3, $);
