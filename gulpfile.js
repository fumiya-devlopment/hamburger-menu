"use strict";

//require
const gulp = require('gulp');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");
const notify = require('gulp-notify');
const watch = require('gulp-watch');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const data = require('gulp-data');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const del = require('del');
const replace = require('gulp-replace');
const connectSSI = require('connect-ssi');
const sourcemaps = require('gulp-sourcemaps');
const sassGlob = require('gulp-sass-glob');
const jsdoc = require('gulp-jsdoc3');
const kss = require('kss');
// const kssConfig = require('./kssConfig.json');
const fs = require('fs');
const wait = require('gulp-wait');

//path
const SRC = './src';
const HTDOCS = './public';
const BASE_PATH = '/';
const DEST = `${HTDOCS}${BASE_PATH}`;

// 変更しなくていい（build コマンド時に true）
// 開発中:false
// リリース:true
let isProduction = false;

// css
gulp.task("sass", (done) => {
    return gulp.src(['src/assets/scss/**/*.scss', '!src/assets/scss/_**/**'])
        .pipe(wait(500))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(autoprefixer({
            grid: true
        }))
        // styleguideのコメントをcssに残したい場合はコメントアウトする
        .pipe(cleanCSS({
            format: 'beautify'
        }))
        .pipe(sourcemaps.write(`./`))
        .pipe(gulp.dest(`${DEST}assets/css/`))
        .pipe(browserSync.stream());

    done();

});

gulp.task('css', gulp.series('sass'));


//styleguide


// styleguide KSS
gulp.task('styleguide', () => {
    return kss(kssConfig);
});

// styleguide用 CSS
gulp.task('styleguide-css', () => {
    return gulp.src(`${SRC}/assets/scss/**/*.scss`)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(autoprefixer({
            grid: true
        }))
        .pipe(sourcemaps.write(`./`))
        .pipe(gulp.dest(`styleguide/assets/css/`))

});

// styleguide用  js
gulp.task('styleguide-webpack', () => {
    const webpackConfig = isProduction ? './webpack.prd' : './webpack.dev.js'
    return gulp.src(`${SRC}/assets/js/main.js`)
        .pipe(webpackStream(require(webpackConfig), webpack))
        .pipe(plumber())
        .pipe(gulp.dest(`styleguide/assets/js/`));
});


gulp.task('sg', gulp.series('styleguide-css', 'styleguide-webpack', 'styleguide'));



//js
gulp.task('webpack', () => {
    const webpackConfig = isProduction ? './webpack.prd' : './webpack.dev.js'
    return gulp.src(`${SRC}/assets/js/main.js`)
        .pipe(webpackStream(require(webpackConfig), webpack))
        .pipe(plumber())
        .pipe(gulp.dest(`${DEST}assets/js/`));
});

gulp.task('js', gulp.parallel('webpack'));

// jsdoc
gulp.task('doc', (cb) => {
    gulp.src(['README.md', `${SRC}/assets/js/**/*.js`], {
        read: false
    })
        .pipe(jsdoc(cb));
});

//html
gulp.task("ejs", () => {
    return gulp.src(
        ['src/**/*.ejs', '!src/**/_*.ejs', '!src/_**/**']
    )
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(data(function (file) {
            const confPath = `./src/${BASE_PATH}/json/config.json`;
            const pagesPath = `./src/${BASE_PATH}/json/pages.json`;

            const conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
            const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));

            const filePath = {};

            if (file.path.length !== 0) {
                let path = file.path.split('¥').join('/');
                path = path.split('\\').join('/');

                const filename = path.match(/^.+\/src\/(.+)\.ejs$/)[1];
                filePath.dir = path.match(/^.+\/src\//)[0];

                var meta = {};
                if (pages[filename]) {
                    meta = pages[filename];
                } else {
                    meta = pages.default;
                }
            }
            return {
                filePath: filePath,
                meta: meta,
                conf: conf
            };
        }))
        .pipe(ejs())
        .pipe(rename({
            extname: '.html'
        }))
        // 2行以上の空行は削除(win用にCR+LFを再変換する)
        .pipe(replace("\n", "\r\n"))
        .pipe(replace("\r\r", "\r"))
        .pipe(replace(/(\r\n){2,}/g, '\n\n'))
        .pipe(gulp.dest(`${HTDOCS}`))
});

gulp.task('html', gulp.series('ejs'));


// server
gulp.task('browser-sync', () => {
    browserSync({
        server: {
            proxy: "localhost:3000",
            baseDir: HTDOCS,
            middleware: [
                connectSSI({
                    baseDir: HTDOCS,
                    ext: '.html'
                })
            ]
        },
        startPath: `${BASE_PATH}`,
        ghostMode: false
    });
    watch([`${SRC}/assets/scss/**/*.scss`], gulp.series('sass'));
    watch([`${SRC}/assets/js/**/*.js`, `${SRC}/assets/js/**/*.vue`], gulp.series('webpack', 'doc', browserSync.reload));
    watch('./src/**/*.+(jpg|jpeg|png|gif|svg)', gulp.series('image'));
    watch([
        `${SRC}/**/*.ejs`,
    ], gulp.series('ejs', browserSync.reload));

});

gulp.task('server', gulp.series('browser-sync'));

//image min
gulp.task('imagemin', () => {
    return gulp
        .src('./src/**/*.+(jpg|jpeg|png|gif|svg)', {
            base: './src/'
        })
        .pipe(plumber())
        .pipe(
            imagemin([
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.jpegtran({
                    progressive: true
                }),
                imagemin.svgo({
                    optimizationLevel: 5
                }),
                pngquant({
                    speed: 1
                })
            ])
        )
        .pipe(gulp.dest(`${DEST}`))
})

//image
gulp.task('image', () => {
    return gulp
        .src('./src/**/*.+(jpg|jpeg|png|gif|svg)', {
            base: './src/'
        })
        .pipe(plumber())
        .pipe(gulp.dest(`${DEST}`))
        .pipe(browserSync.stream());
})


//clean
gulp.task('clean', () => del([`${DEST}**/*.+(jpg|jpeg|png|gif|svg)`, `${DEST}**/*.html`]))


// default
gulp.task('dev', gulp.parallel('css', 'js', 'html', 'image'));
gulp.task('build', (done) => {
    isProduction = true
    return gulp.series('clean', 'dev', 'imagemin')(done);
});
gulp.task('default', gulp.series('dev', 'server'));