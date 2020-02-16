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
