
const fs = require('fs');
const { minify } = require("terser");
const mustache = require('mustache');

const CONFIG = require('../config.json');

const DIST_PATH = CONFIG.dist_path;
const LINE_BREAK = "\n\r";

function createTemplateFile(previewFile, filesToLoad, template) {
    var view = {
        title: CONFIG.preview.title,
        modules: CONFIG.preview.modules,
        files: filesToLoad,
        file_name: previewFile
    };

    var output = mustache.render(template, view);
    var filePath = CONFIG.preview.path + previewFile;
    fs.writeFileSync(filePath, output, {flag: "w"}); 
    console.log(filePath + ": File updated");
}


let allFilesList = [];
let singleFiles = [];
let minifiedSingleFiles = [];
    
CONFIG.compile.forEach(compile => {
    let finalCode = LINE_BREAK;

    compile.files.forEach(file => {
        allFilesList.push(file)
        let contents = fs.readFileSync(file, 'utf8');
        finalCode = finalCode + LINE_BREAK + contents;
        console.log("File " + file + "readed and added to memory.");
    });

    
    // Main File
    let mainFile = DIST_PATH + compile.dist.main;
    fs.writeFileSync(mainFile, finalCode, {flag: "w"}); 
    singleFiles.push(mainFile);
    console.log(mainFile + ": File updated");

    // Minified File
    minifiedSingleFiles.push(DIST_PATH + compile.dist.minified);
    (async() => {
        let minifiedFile = DIST_PATH + compile.dist.minified;
        var minifiedCode = await minify(finalCode, { sourceMap: true });
        fs.writeFileSync(minifiedFile, minifiedCode.code, {flag: "w"}); 
        console.log(minifiedFile + ": File updated");
    })();

})

let template = fs.readFileSync(CONFIG.preview.template, 'utf8');

createTemplateFile("devel.html", allFilesList, template);
createTemplateFile("dist.html", singleFiles, template);
createTemplateFile("dist.min.html", minifiedSingleFiles, template);