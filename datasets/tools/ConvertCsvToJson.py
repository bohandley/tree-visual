import sys
import json
import csv


def FindOrCreateNode(children, name):
    for child in children:
        if child["name"] == name:
            return child

    newChild = {"name": name}
    children.append(newChild)
    return newChild


def AppendCsvRowToNode(node, row):
    if not "name" in node:
        node["name"] = row[0]

    rows = len(row)
    size = None
    try:
        size = float(row[rows - 1])
        rows = rows - 1
    except:
        size = None

    for i in range(1, rows):
        if row[i] == "":
            break

        if not "children" in node:
            node["children"] = []

        node = FindOrCreateNode(node["children"], row[i])

    if size:
        node["size"] = size


CsvPaths = sys.argv
CsvPaths.pop(0)

for csvPath in CsvPaths:
    jsonPath = csvPath + ".json"

    with open(csvPath, 'r') as csvFile:
        with open(jsonPath, 'w') as jsonFile:
            print("Converting from {} to {}...".format(csvPath, jsonPath))

            root = {}
            csvReader = csv.reader(csvFile)
            for row in csvReader:
                AppendCsvRowToNode(root, row)

            jsonText = json.dumps(root)
            jsonFile.write(jsonText)
