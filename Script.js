const fs = require('fs');
const filePath = 'test.txt';


data = readfile(filePath);
list = [data];
console.log(list)
// console.log(removeOneBreakPerSection(data));

function removeOneBreakPerSection(text) {
    // Replace each segment of consecutive \r\n with one less \r\n
    return text.replace(/(\r\n)+/g, match => match.slice(2));
}
function removeOneNewlinePerSection(text) {
    // Replace each section of consecutive newlines with one less newline
    return text.replace(/\n+/g, match => match.slice(1));
}

function findAllNewlineSections(text) {
    // Find all instances of consecutive newlines
    return text.match(/\n+/g);
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