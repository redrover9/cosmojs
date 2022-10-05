import { createClient } from 'pexels';
import * as fs from 'fs';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

function getWord(path) {
    return fs.readFileSync(path).toString().split("\n");
}
function getCaption() {
    let verbLines = getWord("sexVerbs.txt");
    let partLines = getWord("bodyParts.txt");
    let objectLines = getWord("householdObjects.txt");

    let verb = verbLines[Math.floor(Math.random()*verbLines.length)];
    let part = partLines[Math.floor(Math.random()*partLines.length)];
    let object = objectLines[Math.floor(Math.random()*objectLines.length)];

    let caption = `${verb} his ${part} with a ${object}`;
    return caption;
}
function getPhotoURL() {
    const CLIENT = createClient(PEXELS_API_KEY);
    let photos = CLIENT.photos.search({ query: "men", per_page: 80, page: 1});
    let sourceID = photos[Math.floor(Math.random()*photos.length)];
    let sourceURL = "https://api.pexels.com/v1/photos/" + String(sourceID);
    return sourceURL;
}

console.log(getCaption());
console.log(getPhotoURL());