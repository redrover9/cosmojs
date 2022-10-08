import { createClient } from 'pexels';
import * as fs from 'fs';
import * as https from 'https';
//import * as download from 'image-downloader';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const CLIENT = createClient(PEXELS_API_KEY);

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

    return `${verb} his ${part} with a ${object}`;
}
function getPhotos() {
    function getPhotoURL(photo) {
        return photo["photos"][Math.floor(Math.random()*81)]["src"]["portrait"];
    }
    return CLIENT.photos.search({ query: "men", per_page: 80, page: 1 }).then(function(value) {return getPhotoURL(value);}); 
}
function getPhoto() {
    const options = {
        headers: {Authorization: '563492ad6f917000010000013b1a79b311cd4c21b192e0ca707a8a4b'}
    }
    getPhotos().then(function(value) {https.get(value, options, (res) => {
        res.pipe(fs.createWriteStream("dude.jpg"));
    })});
}
getCaption();
getPhoto();