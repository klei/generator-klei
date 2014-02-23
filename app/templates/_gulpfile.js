
var gulp = require('gulp'),
    g = require('gulp-load-plugins')(),
    noop = g.util.noop<% if (angular || stylus) { %>,
    es = require('event-stream'),
    lazypipe = require('lazypipe')<% } %>,
    stylish = require('jshint-stylish'),
    klei = require('./klei'),
    doLiveReload = false;
<% if (angular) { %>
var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};
<% } %>

/**
 * JS Hint
 */
gulp.task('jshint<% if (angular) { %>-backend<% } %>', function () {
  return gulp.src([
    './gulpfile.js'<% if (!choseType) { %>,
    './src/*.js'<% } %><% if (addconfig) { %>,
    './src/config/*.js'<% } %><% if (express) { %>,
    './src/api/**/*.js'<% } %>
  ])
    .pipe(jshint('./.jshintrc'));
});<% if (angular) { %>

gulp.task('jshint-app', function () {
  return gulp.src('./src/app/**/*.js')
    .pipe(jshint('./src/app/.jshintrc'));
});

gulp.task('jshint', ['jshint-backend', 'jshint-app']);
<% } %>
<% if (express) { %>
gulp.task('nodemon', function () {
  g.nodemon({watch: ['src']<% if (angular || stylus) { %>, ignore: [<% if (angular) { %>'src/app'<% } %><% if (angular && stylus) { %>, <% } %><% if (stylus) { %>'src/styles'<% } %>]<% } %>});
});
<% } %><% if (stylus) { %>
/**
 * CSS
 */
gulp.task('clean-css', function () {
  return gulp.src('./.tmp/css').pipe(g.clean());
});

gulp.task('styles', ['clean-css'], function () {
  return gulp.src([
    './src/styles/**/*.styl',
    '!./src/styles/**/_*.styl'<% if (angular) { %>,
    './src/app/**/*.styl',
    '!./src/app/**/_*.styl'<% } %>
  ])
    .pipe(g.stylus({use: ['nib']}))
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function () {
  return cssFiles().pipe(dist('css', klei.name));
});

gulp.task('csslint', ['styles'], function () {
  return cssFiles()
    .pipe(g.csslint('./.csslintrc'))
    .pipe(g.csslint.reporter());
});
<% } %>
<% if (angular) { %>
/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
  return appFiles().pipe(dist('js', klei.name, true));
});

/**
 * Templates
 */
gulp.task('templates', function () {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
  return templateFiles({min: true}).pipe(buildTemplates());
});


/**
 * Vendors
 */
gulp.task('vendors', function () {
  var bowerStream = g.bowerFiles();
  return es.merge(
    bowerStream.pipe(g.filter('**/*.css')).pipe(dist('css', 'vendors')),
    bowerStream.pipe(g.filter('**/*.js')).pipe(dist('js', 'vendors'))
  );
});

/**
 * Inject
 */
gulp.task('inject', ['templates', 'styles'], function () {
  var opt = {read: false};
  return gulp.src('./src/app/' + klei.name + '.html')
    .pipe(g.inject(
      es.merge(g.bowerFiles(opt), appFiles(opt), cssFiles(opt)),
      {ignorePath: ['bower_components', '.tmp', 'src/app']}
    ))
    .pipe(gulp.dest('./src/app/'));
});

/**
 * Index
 */
gulp.task('index', ['inject'], function () {
  return gulp.src('./src/app/' + klei.name + '.html')
    .pipe(g.rename('index.html'))
    .pipe(g.embedlr())
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload());
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'styles-dist', 'scripts-dist'], function () {
  return gulp.src('./src/app/' + klei.name + '.html')
    .pipe(g.inject(gulp.src(['./dist/vendors.min.{js,css}', './dist/' + klei.name + '.min.{js,css}']), {ignorePath: 'dist'}))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(g.rename('index.html'))
    .pipe(gulp.dest('./dist/'));
});
<% } %>
/**
 * Watch
 */
gulp.task('watch', ['default'], function () {
  var lr = g.livereload();
  doLiveReload = true;
  gulp.watch(['./gulpfile.js'<% if (!choseType) { %>, './src/*.js'<% } %><% if (addconfig) { %>, './src/config/*.js'<% } %><% if (express) { %>, './src/api/{,*/}*.js'<% } %>], ['jshint<% if (angular) { %>-backend<% } %>']);<% if (angular) { %>
  gulp.watch('./src/app/**/*.js', function (evt) {
    gulp.src(evt.path).pipe(jshint('./src/app/.jshintrc'));
    lr.changed(evt.path);
  });
  gulp.watch('./src/app/' + klei.name + '.html', ['index']);
  gulp.watch(['./src/app/**/*.html', '!./src/app/' + klei.name + '.html'], ['templates']);<% } %><% if (stylus) { %>
  gulp.watch(['./src/styles/**/*.styl'<% if (angular) { %>, './src/app/**/*.styl'<% } %>], ['csslint']);<% } %>
});

/**
 * Default task
 */
gulp.task('default', ['lint'<% if (express) { %>, 'nodemon'<% } %><% if (angular) { %>, 'index'<% } %>]);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint'<% if (stylus) { %>, 'csslint'<% } %>]);

/**
 * File pipes
 */

function cssFiles (opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

function appFiles (opt) {
  return gulp.src(
    [
      './.tmp/' + klei.name + 'Templates.js',
      './src/app/*.js',
      './src/app/**/index.js',
      './src/app/**/*.js',
      '!./src/app/**/*.spec.js'
    ],
    opt
  );
}

function templateFiles (opt) {
  return gulp.src(['./src/app/**/*.html', '!./src/app/' + klei.name + '.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Reusable pipes
 */

function dist (type, name, ngmin) {
  return lazypipe()
    .pipe(g.concat, name + '.' + type)
    .pipe(gulp.dest, './dist')
    .pipe(ngmin ? g.ngmin : noop)
    .pipe(ngmin ? g.rename : noop, name + '.annotated.' + type)
    .pipe(ngmin ? gulp.dest : noop, './dist')
    .pipe(type === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + type)
    .pipe(gulp.dest, './dist')();
}

function buildTemplates () {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: klei.name + 'Templates',
      prefix: '/' + klei.name + '/',
      stripPrefix: '/src/app'
    })
    .pipe(g.concat, klei.name + 'Templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(livereload)();
}

function jshint (jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, stylish)();
}

function livereload () {
  return lazypipe()
    .pipe(doLiveReload ? g.livereload : noop)();
}

