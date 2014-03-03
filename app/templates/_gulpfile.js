
var gulp = require('gulp'),
    g = require('gulp-load-plugins')(),
    noop = g.util.noop<% if (angular || stylus) { %>,
    dirname = require('path').dirname,
    es = require('event-stream'),
    sort = require('sort-stream'),
    queue = require('streamqueue'),
    lazypipe = require('lazypipe')<% } %>,
    stylish = require('jshint-stylish'),
    klei = require('./klei'),
    isWatching = false;
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
  g.nodemon({script: './src/index.js', watch: ['src']<% if (angular || stylus) { %>, ignore: [<% if (angular) { %>'src/app'<% } %><% if (angular && stylus) { %>, <% } %><% if (stylus) { %>'src/styles'<% } %>]<% } %>});
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
  return appFiles().pipe(dist('js', klei.name, {ngmin: true}));
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
gulp.task('inject', function () {
  var opt = {read: false};
  return gulp.src('./src/app/index.html')
    .pipe(g.inject(g.bowerFiles(opt), {ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(es.merge(appFiles(opt), cssFiles(opt)), {ignorePath: ['.tmp', 'src/app']}))
    .pipe(gulp.dest('./src/app/'));
});

/**
 * Index
 */
gulp.task('index', ['inject'], function () {
  return gulp.src('./src/app/index.html')
    .pipe(g.embedlr())
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload());
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'styles-dist', 'scripts-dist'], function () {
  return gulp.src('./src/app/index.html')
    .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), {ignorePath: 'dist', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(gulp.src('./dist/' + klei.name + '.min.{js,css}'), {ignorePath: 'dist'}))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'));
});
<% } %>
/**
 * Watch
 */
gulp.task('watch', ['default'], function () {
  isWatching = true;
  gulp.watch(['./gulpfile.js'<% if (!choseType) { %>, './src/*.js'<% } %><% if (addconfig) { %>, './src/config/*.js'<% } %><% if (express) { %>, './src/api/{,*/}*.js'<% } %>], ['jshint<% if (angular) { %>-backend<% } %>']);<% if (angular) { %>
  gulp.watch('./src/app/**/*.js', ['jshint-app']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });
  gulp.watch('./src/app/index.html', ['index']);
  gulp.watch(['./src/app/**/*.html', '!./src/app/index.html'], ['templates']);<% } %><% if (stylus) { %>
  gulp.watch(['./src/styles/**/*.styl'<% if (angular) { %>, './src/app/**/*.styl'<% } %>], ['csslint']<% if (angular) { %>).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  }<% } %>);<% } %>
});

/**
 * Default task
 */
gulp.task('default', ['lint'<% if (express) { %>, 'nodemon'<% } %><% if (angular) { %>, 'templates', 'index'<% } %>]);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint'<% if (stylus) { %>, 'csslint'<% } %>]);

/**
 * Test
 */
gulp.task('karma', ['templates'], function () {
  return new queue({objectMode: true})
    .queue(g.bowerFiles().pipe(g.filter('**/*.js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles({includeTests: true}))
    .done()
    .pipe(g.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});
<% if (angular || stylus) { %>
<% if (stylus) { %>
/**
 * All CSS files as a stream
 */
function cssFiles (opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}
<% } %><% if (angular) { %>
/**
 * All AngularJS application files as a stream
 */
function appFiles (opt) {
  var files = [
    './.tmp/' + klei.name + 'Templates.js',
    './src/app/**/*.js',
    '!./src/app/**/*_test.js'
  ];
  if (opt.includeTests) {
    files.pop();
    delete opt.includeTests;
  }
  return gulp.src(files, opt)
    .pipe(sort(function (a, b) {
      if (dirname(a.path) === dirname(b.path)) {
        // Reverse sort if in same dir, to be able to load module definitions before their use
        // for Google AngularJS naming recommendations. (e.g. todo.js must come before todo-controller.js)
        return b.path.localeCompare(a.path);
      } else {
        // Otherwise, leave as is
        return 0;
      }
    }));
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles (opt) {
  return gulp.src(['./src/app/**/*.html', '!./src/app/index.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}
<% } %>
/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngmin ? g.ngmin : noop)
    .pipe(opt.ngmin ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngmin ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')();
}

/**
 * Build AngularJS templates/partials
 */
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

/**
 * Livereload (or noop if not run by watch)
 */
function livereload () {
  return lazypipe()
    .pipe(isWatching ? g.livereload : noop)();
}
<% } %>
/**
 * Jshint with stylish reporter
 */
function jshint (jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, stylish)();
}
