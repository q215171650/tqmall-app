var gulp = require('gulp');
//- 多个文件合并为一个
var concat = require('gulp-concat');
//- 压缩CSS为一行					 
var minifyCss = require('gulp-minify-css');
//- 对文件名加MD5后缀			 
var rev = require('gulp-rev');
//- 路径替换							 
var revCollector = require('gulp-rev-collector');
//- js压缩			
var uglify = require('gulp-uglify');
//- 图片优化						 
var imagemin = require('gulp-imagemin');
//- 文件夹删除工具					 
var del = require('del');
//- 生成雪碧图                                  
var spriter = require('gulp-css-spriter');
//- 队列执行工具
var sequence = require('gulp-sequence');
//- html页面js合并和css合并
var useref = require('gulp-useref');
//- html页面压缩
var htmlmin = require('gulp-htmlmin');

//源文件目录
var inPath = {
		'css': 'css/**/*.css', 
		'js': 'js/**/*.js', 
		'img': 'img/*.{png,jpg,gif,ico}'
	};
//输出文件目录	
var outPath	= {
		'css': 'dist/css', 
		'js': 'dist/js', 
		'img': 'dist/img'
	};			 

//优化css
gulp.task('css', function() {	
	console.log('优化css start...');							 
    gulp.src(inPath.css)							
        .pipe(minifyCss())									 
        .pipe(rev())								
        .pipe(gulp.dest(outPath.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'));
    console.log('优化css end...');	
});

//优化js
gulp.task('js', function(){
	console.log('优化js start...');
	gulp.src(inPath.js)
    	.pipe(uglify()).on('error',function(er){
    		console.log(er);
    	})
    	.pipe(rev())
    	.pipe(gulp.dest(outPath.js))
    	.pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/js'));
    console.log('优化js end...');
});

//优化图片
gulp.task('img', function(){
	console.log('优化图片 start...');
	gulp.src(inPath.img)
		.pipe(imagemin({
			//类型：Number  默认：3  取值范围：0-7（优化等级）
            optimizationLevel: 5,
            //类型：Boolean 默认：false 无损压缩jpg图片			
            progressive: true,
            //类型：Boolean 默认：false 隔行扫描gif进行渲染				
            interlaced: true,
            //类型：Boolean 默认：false 多次优化svg直到完全优化 					
            multipass: true 					
        }))
        .pipe(rev())
        .pipe(gulp.dest(outPath.img))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/img'));
    console.log('优化图片 end...');
});


//替换文件路径
gulp.task('rev', function() {
	console.log('替换文件路径并压缩html start...');
	//- 读取 rev-manifest.json
    gulp.src(['dist/rev/**/*.json', '*.html'])   
        .pipe(revCollector())
        .pipe(htmlmin({
        	//压缩html
        	collapseWhitespace: true,
        	//删除<script>的type="text/javascript"
        	removeScriptTypeAttributes: true,
        	//删除<style>和<link>的type="text/css"
	        removeStyleLinkTypeAttributes: true,
	        //压缩页面JS
	        minifyJS: true,
	        //压缩页面CSS
	        minifyCSS: true
        }))
        .pipe(gulp.dest('dist'));
    console.log('替换文件路径并压缩html end...');			
});

//生成图片雪碧图,现还有bug
gulp.task('spriter', function(){
	gulp.src('**/*.html')
		.pipe(spriter({
			'spriteSheet': 'dist/img/sprite.png', 
            'pathToSpriteSheetFromCSS': 'img/sprite.png' 
		}))
		.pipe(gulp.dest())
});

gulp.task('test', function(){
	gulp.src('index.html')
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('del', function(){
	del(['dist']);
});

//默认任务
gulp.task('default', ['css', 'js', 'img']);