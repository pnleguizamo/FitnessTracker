import json
from collections import defaultdict
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime
from scipy.stats import linregress



def findMax(exercise):
    oneRepMax = 0
    averageOneRepMax = 0

    for set in exercise["sets"]:
        oneRepMax = float(set["weight"]) / (1.0278 - 0.0278 * float(set["reps"]))
        averageOneRepMax += oneRepMax
    
    return averageOneRepMax / len(exercise["sets"])

# Open and read the JSON file
with open('data.json', 'r') as file:
    data = json.load(file)

dateList = []
ORMList = []
exerciseDict = defaultdict(int)
chosenExercise = "Incline DB Press"

for day in data:
    for exercise in day["exercises"]:
        exerciseDict[exercise["name"]] += 1

        if exercise["name"] == chosenExercise and len(exercise["sets"]) > 0:
            formatted_date = day["date"]
            try:
                date_str = day["date"].split('(')[0].strip()
                date_obj = datetime.strptime(date_str, "%B %d, %Y")
                formatted_date = date_obj.strftime("%m/%d/%y")
            except:
                var = 0
            finally:
                dateList.append(formatted_date)

            ORMList.append(findMax(exercise))

# print(dateList)
# print(ORMList)

data = {
    'Date': dateList,
    '1RM': ORMList,
    'weight' : np.cos(ORMList)
}

# Convert the data to a DataFrame
df = pd.DataFrame(data)

df['Date'] = pd.to_datetime(df['Date'])

plt.figure(figsize=(10, 5))

ax1 = plt.subplot()
# ax1.set_ylabel('1RM', color='red')
ax1.plot(df['Date'].values, df['1RM'].values, marker='o', linestyle='-', color='b')
# ax1.tick_params(axis='y', labelcolor='red')


# ax2 = ax1.twinx()
# ax2.plot(df['Date'].values, df['weight'].values, 'b-', label='Body Weight')
# ax2.set_ylabel('Body Weight', color='b')
# ax2.tick_params('y', colors='b')

plt.xticks(rotation=90)

ax = plt.gca()
ax.axvspan(pd.Timestamp('2022-02-01'), pd.Timestamp('2023-01-01'), color='green', alpha=0.3, label='Bulk 1')
ax.axvspan(pd.Timestamp('2023-01-01'), pd.Timestamp('2023-09-01'), color='red', alpha=0.3, label='Cut 1')
ax.axvspan(pd.Timestamp('2023-09-01'), pd.Timestamp('2024-05-01'), color='blue', alpha=0.3, label='Bulk 2')
ax.axvspan(pd.Timestamp('2024-05-01'), pd.Timestamp('2024-09-01'), color='orange', alpha=0.3, label='Cut 2')

z = np.polyfit(df.index, df['1RM'], 1)  # Fit a linear trend
p = np.poly1d(z)
plt.plot(df['Date'].values, p(df.index), linestyle='--', color='r', label='Trend Line')

ax.legend(loc='upper left')

# Add labels and title
plt.xlabel('Date')
plt.ylabel('1RM')
title = 'Strength Progress Over Time (' + chosenExercise + ')'
plt.title(title)



# Convert dates to numerical format (e.g., ordinal numbers)
# df['Date_ordinal'] = df['Date'].map(pd.Timestamp.toordinal)
# def line_of_best_fit(x):
#     return slope * x + intercept
# # Perform linear regression
# slope, intercept, r_value, p_value, std_err = linregress(df['Date_ordinal'], df['1RM'])
# ax.plot(df['Date'].values, line_of_best_fit(df['Date_ordinal'].values), linestyle='-', color='r', label='Line of Best Fit')



plt.grid(True)

plt.tight_layout()

# Show the plot
plt.show()

sorted_dict = dict(sorted(exerciseDict.items(), key=lambda item: item[1], reverse=True))

# for key, value in sorted_dict.items():
#     print(f"{key}: {value}")