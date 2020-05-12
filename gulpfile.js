let gulp = require("gulp"),
    sass = require("gulp-sass"),
    browserSync = require("browser-sync"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    del = require("del"),
    autoprefixer = require('gulp-autoprefixer');


// Синхронизация с браузером
gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "src/",
    },
    notify: false,
  });
});


// конвертация SСSS в CSS
gulp.task("sass", function () {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer({
      cascade: false }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({ stream: true }));
});

// объединение CSS всех установленных плагинов
gulp.task("css", function () {
  return gulp
    .src([
      "node_modules/normalize.css/normalize.css",
      "node_modules/slick-carousel/slick/slick.css",
      "node_modules/magnific-popup/dist/magnific-popup.css",
    ])
    .pipe(concat("_libs.scss"))
    .pipe(gulp.dest("src/scss"))
    .pipe(browserSync.reload({ stream: true }));
});


// обновление HTML
gulp.task("html", function () {
  return gulp.src("src/*.html").pipe(browserSync.reload({ stream: true }));
});


// обновление JS
gulp.task("script", function () {
  return gulp.src("src/js/*.js").pipe(browserSync.reload({ stream: true }));
});


// объединение файлов JS
gulp.task("js", function () {
  return gulp
    .src([
      "node_modules/slick-carousel/slick/slick.js",
      "node_modules/magnific-popup/dist/jquery.magnific-popup.js",
      "node_modules/jquery.maskedinput/src/jquery.maskedinput.js",
      "node_modules/parallax-js/dist/parallax.js",
    ])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.reload({ stream: true }));
});


// Слежение за изменениями в файлах
gulp.task("watch", function () {
  gulp.watch("src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("src/*.html", gulp.parallel("html"));
  gulp.watch("src/js/*.js", gulp.parallel("script"));
});



// Сборка dist
gulp.task('export',  function(){
  let buildHtml = gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
  let buildCss = gulp.src('src/css/**/*.css') 
    .pipe(gulp.dest('dist/css'));
  let buildJs = gulp.src('src/js/**/*.js') 
    .pipe(gulp.dest('dist/js'));
  let buildFonts = gulp.src('src/fonts/**/*.*') 
    .pipe(gulp.dest('dist/fonts'));
  let buildImg = gulp.src('src/img/**/*.*') 
    .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', async function(){
  del.sync('dist');
});

gulp.task('build', gulp.series('clean', 'export'));


gulp.task("default", gulp.parallel("css", "sass", "js", "browser-sync", "watch"));

