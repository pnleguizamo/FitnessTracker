// Needs to be able to handle exceptions like 10ish or 10 of then 2
// Needs to be able to handle different names for the same lift

// Process: Define a list, parse the .txt lift by lift, assign variables to a list and iterate through to print the bar graph

// Import the 'fs' module to work with the file system
const { match } = require('assert');
const { log } = require('console');
const fs = require('fs');
const { start } = require('repl');
const prompt = require("prompt-sync")();

// Specify the path to the text file you want to read
const filePath = 'WorkoutLog.txt';

var startIndex;
var endIndex;
var liftString;
var splitLines;
var data;
const graphWidth = 80;

const liftList = [];
const oneRepProgress = [];
const trimmedLiftList = [];

var completeNameDict = {};

data = readfile(filePath)
// Loop through the text file until there are no exercises left
// The string manipulation in this loop is specific to my text file / workout log
while(true){
    startIndex = data.match(/.*202[0-9]/);
    startIndex = startIndex.index;

    // Cut the string down to start where the date starts
    data = data.substring(startIndex);

    // Cut the date line from the individual lift string to find the next date line
    endIndex = data.indexOf("\n");
    liftString = data.substring(endIndex);
    
    // Find the next date
    endIndex = liftString.match(/202[0-9]/);
    if(endIndex == null)
        break;
    splitLines = liftString.split("\n");
    lastLine = splitLines.find(line => line.includes(endIndex[0]));
    endIndex = data.indexOf(lastLine);
    

    // Retrieve the full lift string, starting from the start date and ending where the end date starts
    liftString = data.substring(0, endIndex);
    startIndex = data.indexOf(lastLine);
    data = data.substring(startIndex);
    

    // Assign values in the string to a lift object
    liftList.push(buildLiftObject(liftString));
}


console.log("This is my strength training tracker");
console.log("The attached text file contains data for all of the lifting sessions that I have tracked since February 2022");
console.log("This program will show how my strength has progressed on an exercise of choice by outputting a bar graph depicting my one rep max");
if(Number(prompt("Type 1 to see a list of valid exercises and how many times they appear on my log or type 0 to skip "))){
    console.log("");
    printExerciseCount(liftList);
    console.log("\nChoose an exercise from the above list. Exercises that I have completed more times will have the best results (with some exceptions)\n");
}

var liftName = prompt("Choose any exercise: ");

// Populate the relevant lists with any instance of the chosen exercise
for (i = 0; i<liftList.length; i++){
    for (var j = 0; j<liftList[i].exercises.length; j++){
        if(liftList[i].exercises[j].name.match(`^${liftName}\r`)){
            oneRepProgress.push(findMax(liftList[i].exercises[j]));
            trimmedLiftList.push(liftList[i]);
        }
    }
}

drawBarGraph(oneRepProgress, trimmedLiftList, liftName);


function buildLiftObject(liftString){
    // Split string into blocks
    liftString = liftString.split("\r\n\r\n");

    // Pull liftType and Date
    liftType = liftString[0].substring(liftString[0].indexOf("("), liftString[0].length);
    liftString[0] = liftString[0].substring(0, liftString[0].indexOf("("));

    const lift =  {
        date: liftString[0],
        liftType: liftType,
        exercises: [
            
        ]
    }

    // Iterate through each exercise
    for (var i = 1; i<liftString.length; i++){
        // Pull Exercise info
        exerciseString = liftString[i].split("\n");
        exerciseName = exerciseString[0];

        // Initialize exercise object
        const exercise = {
            name: exerciseName,
            sets: [
                
            ]
        }
        // Iterate through each set per exercise
        for (var j = 1; j<exerciseString.length; j++){
            // Pull Set info
            setString = exerciseString[j];
            let matches = setString.match(/\d+(\.\d+)?/g);
            if(matches.length==3){
                const set = {
                    set: matches[0], 
                    reps: matches[1], 
                    weight:  matches[2]
                }                    
                exercise.sets.push(set);    
            }
            else if(setString.includes("+")&& matches.length==4){
                const set = {
                    set: matches[0], 
                    reps: matches[1], 
                    weight:  matches[3]
                }                    
                exercise.sets.push(set);  
            }
            
            
        }
        if(exercise.name){
            lift.exercises.push(exercise);
        }
    }
    return lift;
}

function findMax(exercise){
    var oneRepMax = 0;
    var averageOneRepMax = 0;
    for (var i = 0; i<exercise.sets.length; i++){
        // One rep max formula
        oneRepMax = exercise.sets[i].weight / (1.0278 - 0.0278 * exercise.sets[i].reps);
        averageOneRepMax += oneRepMax;
    }
    return averageOneRepMax / exercise.sets.length;
}

function readfile(filePath){
    // Read the text file
    try {
        // Synchronously read the file
        data = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error('Error reading the file:', err);
    }
    return data;
}

// Make a dictionary object and assign each unique exercise an index/key
// Assign each key an integer value that counts how many separate times the unique exercise appears in the workout log
function printExerciseCount(liftList){
    for (i = 0; i<liftList.length; i++){
        for (var j = 0; j<liftList[i].exercises.length; j++){
            if(completeNameDict[liftList[i].exercises[j].name]){
                (completeNameDict[liftList[i].exercises[j].name])++;
            }   
            else{
                completeNameDict[liftList[i].exercises[j].name] = 1;
            }
        }
    }
    
    // Convert the dictionary to an array
    const keyValueArray = Object.entries(completeNameDict).map(([key, value]) => ({ key, value }));
    
    // Sort the exercises by number of times they appear
    keyValueArray.sort((a, b) => b.value - a.value);
    
    // Print each exercise with how many times they appear in the log, in sorted order
    keyValueArray.forEach(({ key, value }) => {
        key = key.toString();
        key = key.replace(/(\r\n|\n|\r)/gm,"");
        if(value > 5){
            console.log(key + ": " + value);
        }
    });
}

function drawBarGraph(oneRepProgress, trimmedLiftList, liftName){
    // Find the maximum value in the list to scale the bar graph
    max = 0;
    oneRepProgress.forEach(oneRep=>{if(oneRep){max = Math.max(oneRep, max)}});

    // Draw the bar graph
    console.log("\nBar Graph:" + liftName);

    for (i = 0; i<oneRepProgress.length; i++){
        if(oneRepProgress[i]){
            value = Math.trunc(oneRepProgress[i]);
            date = trimmedLiftList[i].date;
            const barLength = Math.round((value / max) * graphWidth);
            const bar = "#".repeat(barLength);
            console.log(`${bar}  ${date}: ${value} `);
        }
    }
}