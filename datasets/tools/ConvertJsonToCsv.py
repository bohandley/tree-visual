import sys
import json


def IteratePaths(data, pathVisitor, path=[]):
    path.append(data["name"])
    if "children" in data:
        for child in data["children"]:
            IteratePaths(child, pathVisitor, path.copy())
    else:
        if "size" in data:
            path.append(data["size"])
        pathVisitor(path)


def PathToCsvLine(path):
    line = ""
    for value in path:
        if line != "":
            line = line + ","

        line = line + '"' + str(value) + '"'
    return line + "\n"


def MakePathVisitor(csvFile):
    def visitor(path):
        csvFile.write(PathToCsvLine(path))

    return visitor


JsonPaths = sys.argv
JsonPaths.pop(0)

for jsonPath in JsonPaths:
    csvPath = jsonPath.replace(".json", ".csv")

    with open(jsonPath, 'r') as jsonFile:
        with open(csvPath, 'w') as csvFile:
            print("Converting from {} to {}...".format(jsonPath, csvPath))

            data = json.loads(jsonFile.read())
            IteratePaths(data, MakePathVisitor(csvFile))
