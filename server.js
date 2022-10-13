import * as fs from 'fs';
//importing http and https because I don't want to run the server on https yet
import * as http from 'http';
import * as https from 'https';
//required for photo api
import { createClient } from 'pexels';

//api key is in .zshrc as env variable
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const CLIENT = createClient(PEXELS_API_KEY);

//getCaption calls this to get a random word from a specified text file
function getWord(path) {
    return fs.readFileSync(path).toString().split("\n");
}
//picks random word from each text file and strings them together to create the photo caption
function getCaption() {
    let verbLines = getWord("sexVerbs.txt");
    let partLines = getWord("bodyParts.txt");
    let objectLines = getWord("householdObjects.txt");

    let verb = verbLines[Math.floor(Math.random()*verbLines.length)];
    let part = partLines[Math.floor(Math.random()*partLines.length)];
    let object = objectLines[Math.floor(Math.random()*objectLines.length)];
//used template literals because it looks cleaner
    return `${verb} his ${part} with a ${object}`;
}
/*and now for the tricky bit
getPhotos searches the api for photos and returns the result of this search in json. it waits for the api promise to be resolved 
with .then before executing getPhotoURL with photo (PhotosWithTotalResults (json on all the photos)) as an argument.
this gets the url of a random photo. finally this url is returned in the form of a promise as it is needed by downloadPhoto.
*/
function getPhotos() {
    //photo will either be PhotosWithTotalResults in case of 200 or ErrorResponse for any other status code - should probably add error handling
    function getPhotoURL(photo) {
        //src contains the url of different sizes of photo. 81 because there are 80 photos per page. portrait because it seems to be similar to the photos cosmo uses
        return photo["photos"][Math.floor(Math.random()*81)]["src"]["portrait"];
    }
    //80 per page is maximum
    return CLIENT.photos.search({ query: "men", per_page: 80, page: 1 }).then(function(value) {return getPhotoURL(value);}); 
}
/*actually downloads and saves the photo as dude.jpg. auth headers must be set to prevent 403. wait until promise from getPhotos is resolved with .then and https.get 
finally actually downloads the photo. don't need a return value because this function is only called to download the file which is then modified directly.
*/
function downloadPhoto() {
    const options = {
        headers: {Authorization: PEXELS_API_KEY}
    }
    //don't understand what this does really just copied from stack and made it not an arrow function
    getPhotos().then(function(value) {https.get(value, options, function(res) {
        return res.pipe(fs.createWriteStream("dude.jpg"));
    })});
}
//randomly select a font from my four and return it, probably should add more fonts
function getFont() {
    let fonts = ["Herr_Von_Muellerhoff/HerrVonMuellerhoff-Regular.ttf", "Homemade_Apple/HomemadeApple-Regular.ttf", "Inspiration/Inspiration-Regular.ttf", "Pacifico/Pacifico-regular.ttf"];
    let font = Math.floor(Math.random()*fonts.length);
    return font;
}
//function captionPhoto() {
    //this function will use css to style text on the photo
//}
/*
serves the actual html page on the node server
copied from stack, don't think I understand it
*/
function serveHTML() {
    fs.readFile('./index.html', function (err, html) {
    if (err) throw err;
    //have to pass request even if not used to prevent 'response.writeHeader is not a function' error
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        //image doesn't display due to security reasons I think probably need an ajax query
        response.write(html);  
        response.end();  
    }).listen(8080);
});
}
downloadPhoto();
//serveHTML();
