const { src, dest, parallel, watch, series } = require("gulp"),
  concat = require("gulp-concat"),
  sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  browserSync = require("browser-sync").create();

const FilesPath = {
  sassFiles: "sass/*.scss",
  htmlFiles: "pages/*.pug",
  jsFiles: "js/*.js",
};

//SASS compiler
function sassTask() {
  return src(FilesPath.sassFiles)
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

//PUG compiler
function htmlTask() {
  return src(FilesPath.htmlFiles)
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

//JAVASCRIPT compiler
function jsTask() {
  return src(FilesPath.jsFiles).pipe(concat("script.js")).pipe(dest("dist/js"));
}

//ASSETS compiler
function assetsTask() {
  return src("assets/**").pipe(dest("dist/assets"));
}

//WATCH live server
function serve() {
  browserSync.init({ server: { baseDir: "./dist" } });
  watch(FilesPath.sassFiles, sassTask);
  watch(FilesPath.jsFiles, jsTask);
  watch(FilesPath.htmlFiles, htmlTask);
}

//All compiler
exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, jsTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, jsTask, assetsTask));
