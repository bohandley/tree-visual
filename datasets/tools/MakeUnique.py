import sys
import json

def FindReplaceTree(tree, set):
    if "name" in tree:
        if tree["name"] in set:
            i = 2
            while tree["name"] + str(i) in set:
                i = i+1
            tree["name"] = tree["name"] + str(i)
        set.add(tree["name"])

    if "children" not in tree:
        return

    for subtree in tree["children"]:
        FindReplaceTree(subtree, set)

JsonPaths = sys.argv
JsonPaths.pop(0)

for jsonPath in JsonPaths:
    with open(jsonPath, 'r') as jsonFile:
        print("Uniquify json file {}...".format(jsonPath))

        root = json.loads(jsonFile.read())
        FindReplaceTree(root, set())

    with open(jsonPath, 'w') as jsonFile:
        jsonText = json.dumps(root)
        jsonFile.write(jsonText)
