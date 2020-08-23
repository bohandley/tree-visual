import sys
import json


def TrimTree(tree, maxDepth):
    if "children" not in tree:
        return

    if maxDepth <= 0:
        del tree["children"]
    else:
        for subtree in tree["children"]:
            TrimTree(subtree, maxDepth - 1)


JsonPaths = sys.argv
JsonPaths.pop(0)

for jsonPath in JsonPaths:
    with open(jsonPath, 'r') as jsonFile:
        print("Trimming json file {}...".format(jsonPath))

        root = json.loads(jsonFile.read())
        TrimTree(root, 4)

    with open(jsonPath, 'w') as jsonFile:
        jsonText = json.dumps(root)
        jsonFile.write(jsonText)
