const fs = require('fs');
const filePath = 'test.txt';


data = readfile(filePath);
list = [data];
console.log(list)
// console.log(removeOneBreakPerSection(data));

function removeOneBreakPerSection(text) {
    return text.replace(/(\r\n)+/g, match => match.slice(2));
}
function removeOneNewlinePerSection(text) {
    return text.replace(/\n+/g, match => match.slice(1));
}

function findAllNewlineSections(text) {
    return text.match(/\n+/g);
}


function readfile(filePath){
    try {
        data = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error('Error reading the file:', err);
    }
    return data;
}