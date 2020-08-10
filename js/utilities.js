function getComplement(rbg) {
    var vals = rbg.replace(/[^0-9,\.]+/g, "").split(",");

    var complVals = vals.map((v) => 255 - v);

    var complement = "rgb(" + complVals.join(", ") + ")";

    return complement;
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

function merge(oldObject, newObject, strict) {
    var obj = oldObject;
    for (var key in newObject) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
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
        chunks.push(arr.slice(i, (i += len)));
    }

    return chunks;
}
