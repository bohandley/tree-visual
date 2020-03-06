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
		return ["this-is-beyond-flare"];
	}
}

function buildPositionId(d, position){
	return [position].concat(buildId(d).reverse()).join("-");
}

// build this to clean all the characters that don't work in an id
// function clean(str) {
// 	return str
// }
// cleanNodeId(buildPositionId(d, position2)));
function cleanNodeId(str){
	return str.replace(/ /g, "_").replace(/:/g, "_").replace("[", "").replace("]", "").replace("?","_").replace("&","_").replace(".","_").replace("/","_");
}

function displaySelectedNode(d){
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
