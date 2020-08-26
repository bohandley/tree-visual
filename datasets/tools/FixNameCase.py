import sys
import json

def FixCase(tree):
    if "name" in tree:
        name = ""
        for word in tree["name"].split():
            if not name:
                name = name + word.capitalize()
            else:
                name = name + " " + word.capitalize()
        tree["name"] = name

    if "children" not in tree:
        return

    for subtree in tree["children"]:
        FixCase(subtree)

JsonPaths = sys.argv
JsonPaths.pop(0)

for jsonPath in JsonPaths:
    with open(jsonPath, 'r') as jsonFile:
        print("Fix case json file {}...".format(jsonPath))

        root = json.loads(jsonFile.read())
        FixCase(root)

    with open(jsonPath, 'w') as jsonFile:
        jsonText = json.dumps(root)
        jsonFile.write(jsonText)
