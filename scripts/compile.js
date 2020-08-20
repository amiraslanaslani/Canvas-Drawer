
const fs = require('fs');
const { minify } = require("terser");
const mustache = require('mustache');
const chalk = require('chalk');

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
    fileLog(filePath, "File updated");
}

function getHeadComment(){
    let template = fs.readFileSync(CONFIG.preview.comment, 'utf8');
    let now = new Date();

    var view = {
        title: CONFIG.preview.title,
        version: CONFIG.version,
        homepage: CONFIG.homepage,
        date: now.toISOString() + " (" + now.toUTCString() + ")"
    };

    var output = mustache.render(template, view);
    return output;
}

function fileLog(file, log){
    console.log(chalk.cyan(
        chalk.italic.underline(file) +
        ": " +
        chalk(log)
    ));
}

let totalLines = 0;
let allFilesList = [];
let singleFiles = [];
let minifiedSingleFiles = [];
let headComment = getHeadComment();

CONFIG.compile.forEach(compile => {
    let finalCode = headComment;
    let lines = 0;

    compile.files.forEach(async (file) => {
        allFilesList.push(file)
        let contents = fs.readFileSync(file, 'utf8');
        finalCode = finalCode + LINE_BREAK + contents;
        // console.log("%s: readed and added to memory.", file);
        fileLog(file, "readed and added to memory");
    });

    lines = finalCode.split(/\r\n|\r|\n/).length;
    totalLines += lines;

    // Main File
    let mainFile = DIST_PATH + compile.dist.main;
    fs.writeFileSync(mainFile, finalCode, {flag: "w"}); 
    singleFiles.push(mainFile);
    // console.log(chalk.yellow(mainFile + ": File updated (" + totalLines + " Lines of code)"));
    fileLog(mainFile, "File updated (" + totalLines + " Lines of code)");

    // Minified File
    minifiedSingleFiles.push(DIST_PATH + compile.dist.minified);
    (async () => {
        let minifiedFile = DIST_PATH + compile.dist.minified;
        var minifiedCode = await minify(finalCode, { sourceMap: true });
        fs.writeFileSync(minifiedFile, minifiedCode.code, {flag: "w"}); 
        fileLog(minifiedFile, "File updated");
    })();

})

let template = fs.readFileSync(CONFIG.preview.template, 'utf8');

createTemplateFile("devel.html", allFilesList, template);
createTemplateFile("dist.html", singleFiles, template);
createTemplateFile("dist.min.html", minifiedSingleFiles, template);

console.log(chalk.bold.green(totalLines + " Lines of code readed. Good job!"));