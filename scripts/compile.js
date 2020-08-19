
const fs = require('fs');
const { minify } = require("terser");
const CONFIG = require('../config.json');

const DIST_PATH = CONFIG.dist_path;
const LINE_BREAK = "\n\r";

    
CONFIG.compile.forEach(compile => {
    let finalCode = LINE_BREAK;

    compile.files.forEach(file => {
        let contents = fs.readFileSync(file, 'utf8');
        finalCode = finalCode + LINE_BREAK + contents;
        console.log("File " + file + "readed and added to memory.");
    });

    
    // Main File
    let mainFile = DIST_PATH + compile.dist.main;
    fs.writeFileSync(mainFile, finalCode, {flag: "w"}); 
    console.log(mainFile + ": File updated");

    // Minified File
    (async() => {
        let minifiedFile = DIST_PATH + compile.dist.minified;
        var minifiedCode = await minify(finalCode, { sourceMap: true });
        fs.writeFileSync(minifiedFile, minifiedCode.code, {flag: "w"}); 
        console.log(minifiedFile + ": File updated");
    })();

})


