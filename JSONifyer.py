import re
import json

text_file = open('output.txt', 'r')

full_text = text_file.read()

lines = re.split("\n", full_text)

year_pattern = r"\b20[2-9][0-9]\b"
currDay = None
currExercise = None

liftObjectList = []
liftObject = {}
exercises = []

for line in lines:
    if re.search(year_pattern, line):
        if currDay:
            liftObject["exercises"] = exercises
            exercises = []
            liftObjectList.append(liftObject)

        liftObject = {
            "date" : line,
            "split_day" : re.search(r'\(([^)]+)\)', line).group(1) if re.search(r'\(([^)]+)\)', line) else line
        }
        currDay = line
    elif currDay and line and not re.search(r'\d+', line):
        exercises.append({
            "name" : line,
            "sets" : []
        })

    elif re.search(r'\d+', line):
        matches = re.findall(r'\d+(?:\.\d+)?', line)

        if len(matches) == 3:
            exercises[-1]["sets"].append({
                "reps" : matches[1],
                "weight" :  matches[2]
            })

if currDay:
    liftObject["exercises"] = exercises
    exercises = []
    liftObjectList.append(liftObject)

json_data = json.dumps(liftObjectList, indent=1)

with open('strength_data.json', 'w') as json_file:
    json_file.write(json_data)
        