// build a unique id from the data name and all the parents
// each graph has a slightly different structure, extra wrappers
// handle each level, root, parent, child
// handle invalid id characters
// handle node names that are empty
function buildId(d, id) {
	if(d){
		var cleanId = d.name || d.name == "" ? clean(d.name) : clean(d.data.name);
		
		if (cleanId == "")
			cleanId = "empty"

		return d.parent != null ? [cleanId, ...buildId(d.parent)] : [cleanId];
	} else {
		return ["this-is-beyond-flare"];
	}
}

// build this to clean all the characters that don't work in an id
function clean(str) {
	return str.replace("[", "").replace("]", "")
}

function displaySelectedNode(d){
	var node = buildId(d).reverse().join("-");
	d3.select("#selected-node").html("")
	d3.select("#selected-node").html("Selected node: " + node);
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
