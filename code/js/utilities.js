// build a unique id from the data name and all the parents
function buildId(d, id) {
	if(d){
		var cleanId = d.name || d.name == "" ? clean(d.name) : clean(d.data.name);
		
		if (cleanId == "")
			cleanId = "empty"

		// id += "-" + cleanId;

		return d.parent != null ? [cleanId, ...buildId(d.parent)] : [cleanId];
	} else {
		return ["this-is-beyond-flare"];
	}
}

function clean(str) {
	return str.replace("[", "").replace("]", "")
}

// which graph has been clicked?
// turn all off, then set which has been clicked
// fire when a graph is clicked
function clicked(clicks, graph=null){
	if( graph != null )
		clicks[graph] += 1;
	else { 
			Object.keys(clicks).forEach(function(key){
				clicks[key] = 0;
			});
	}
}




