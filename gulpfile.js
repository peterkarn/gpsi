const gulp = require('gulp');
const less = require('gulp-less');
const gcmq = require('gulp-group-css-media-queries');
const critical = require('critical');
const webp = require('gulp-webp');

let pages = ['index', 'gallery']; 
let optional = {
	'.btn': ['padding', 'border', 'text-align', 'display']
};
// https://github.com/addyosmani/critical
// https://github.com/filamentgroup/loadCSS/
function criticalCss(done){
	pages.forEach(async page => {
		await critical.generate({
			base: './dist/',
			src: `${page}.html`,
			css: [ 'css/main.css' ],
			target: {
				css: `css/${page}-critical.css`
			},
			width: 1300,
			height: 900,
			ignore: {
				atrule: ['@font-face'],
				rule: [/hljs-/, /code/],
				decl: (node, value) => {
					let { selector } = node.parent;
		
					if(!(selector in optional)){
						return false;
					}
		
					return !optional[selector].includes(node.prop);
				},
			}
		})
	});

	done();
}
 
function html(){
	return gulp.src('./src/*.html')
				.pipe(gulp.dest('./dist'));
}

function css(){
	return gulp.src('./src/css/main.less')
				.pipe(less())
				.pipe(gcmq())
				.pipe(gulp.dest('./dist/css'));
}

function images(){
	return gulp.src('./src/img/*')
				.pipe(gulp.dest('./dist/img'));
}

function images2webp(){
	return gulp.src('./src/img/*')
				.pipe(webp())
				.pipe(gulp.dest('./dist/img'));
}

function fonts(){
	return gulp.src('./src/fonts/*')
				.pipe(gulp.dest('./dist/fonts'));
}

gulp.task('html', html);
gulp.task('css', css);
gulp.task('images', gulp.parallel(images, images2webp));
gulp.task('critical', criticalCss);

gulp.task('build', 
	gulp.series(
		gulp.parallel(html, css, fonts),
		criticalCss
	)
);