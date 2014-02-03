/* jshint camelcase:false */
module.exports = function (grunt) {
  // Loading all tasks:
  require('load-grunt-tasks')(grunt);

  var pkg = require('./package'),
      klei = require('./klei')<% if (angular) { %>,
      path = require('path')<% } %>,
      modulename = klei.name || pkg.title || pkg.name;
  <% if (angular) { %>
  /**
   * HTML Minify Options
   */
  var htmlMinOptions = {
    removeComments: true,
    // removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    removeEmptyAttributes: false,
    collapseBooleanAttributes: true,
    // removeAttributeQuotes: true,
    removeRedundantAttributes: true
    // useShortDoctype: true,
    // removeOptionalTags: true
  };<% } %>

  grunt.initConfig({
    pkg: pkg,
    modulename: modulename,
    <% if (angular) { %>
    /**
     * Manually added vendor files
     *
     * Put paths for libraries not installed via Bower,
     * or those without a `main` section in their bower.json here.
     * E.g. angular-i18n files.
     *
     * (Add both stylesheets and javascripts)
     */
    vendorFiles: [
      // e.g. "bower_components/angular-i18n/angular-locale_sv-se.js"
    ],
    <% } %>
    /**
     * Source dirs
     */
    dirs: {
      src: 'src'<% if (addconfig) { %>,
      config: 'src/config'<% } %><% if (angular) { %>,
      app: 'src/app'<% } %><% if (express) { %>,
      api: 'src/api'<% } %><% if (stylus) { %>,
      styles: 'src/styles'<% } %><% if (angular || stylus) { %>,
      dist: 'dist',
      temp: '.tmp'<% } %>
    },

    <% if (angular || stylus) { %>
    /**
     * Banner for top of concatenated CSS and Javascript
     */
    meta: {
      banner: '/**\n' +
        ' * <%%= modulename %> - v<%%= pkg.version %> - <%%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' *\n' +
        ' * Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author %>\n' +
        ' */\n'
    },

    /**
     * Clean up
     */
    clean: {
      all: ['<%%= dirs.dist %>', '<%%= dirs.temp %>'],
      dist: '<%%= dirs.dist %>',
      temp: '<%%= dirs.temp %>'<% if (stylus) { %>,
      temp_css: '<%%= dirs.temp %>/css'<% } %>
    },<% } %>

    /**
     * Server
     */
    <% if (express) { %>express: {
      options: {
        port: 1337,
        script: '<%%= dirs.src %>/index.js'
      },
      dev: {
        options: {
          node_env: 'development'
        }
      }
    },<% } else if (angular || stylus) { %>connect: {
      options: {
        port: 1337,
        hostname: '*'
      },
      livereload: {
        options: {
          livereload: true,
          open: true,
          base: [
            'bower_components',
            '<%%= dirs.temp %>',
            '<%%= dirs.app %>',
            '<%%= dirs.dist %>'
          ]
        }
      },
      dist: {
        options: {
          keepalive: true,
          base: [
            '<%%= dirs.dist %>'
          ]
        }
      }
    },<% } %>

    /**
     * Watch files and do stuff
     */
    watch: {<% if (addconfig || express || !choseType) { %>
      base: {
        files: [
          <% if (express) { %>'<%%= dirs.api %>/**/*.js'<% } %><% if (!choseType) { %>,
          '<%%= dirs.src %>/**/*.js'<% } %><% if (addconfig) { %>,
          '<%%= dirs.config %>/*.{js,json}'<% } %>
        ],
        tasks: ['newer:jshint:base'<% if (express) { %>, 'newer:jshint:api'<% } %>]
      },<% } %><% if (express) { %>
      backend: {
        options: {
          spawn: false
        },
        files: ['<%%= dirs.src %>/index.js', '<%%= dirs.api %>/**/*.js', '<%%= dirs.config %>/*.{js,json}'],
        tasks: ['express:dev']
      },<% } %><% if (stylus) { %>
      styles: {
        options: {
          event: ['added', 'changed']
        },
        files: ['<%%= dirs.styles %>/**/*.styl'<% if (angular) { %>, '<%%= dirs.app %>/**/*.styl'<% } %>],
        tasks: ['newer:stylus', 'newer:csslint', <% if (angular) { %>'injector:app', <% } %>'injector:styleguide']
      },
      deleted_styles: {
        options: {
          event: 'deleted'
        },
        files: ['<%%= dirs.styles %>/**/*.styl'<% if (angular) { %>, '<%%= dirs.app %>/**/*.styl'<% } %>],
        tasks: ['clean:temp_css', 'stylus', 'csslint', <% if (angular) { %>'injector:app', <% } %>'injector:styleguide']
      },
      styleguide: {
        files: ['<%%= dirs.styles %>/styleguide.html'],
        tasks: ['copy:styleguide']
      },<% } %><% if (angular) { %>
      templates: {
        files: ['<%%= dirs.app %>/*/{,*/}*.html'],
        tasks: ['html2js:app', 'injector:app']
      },
      index: {
        files: ['<%%= dirs.app %>/<%%= modulename %>.html'],
        tasks: ['injector:app', 'copy:index']
      },
      app: {
        files: ['<%%= dirs.app %>/**/*.js', '!<%%= dirs.app %>/**/*.spec.js'],
        tasks: ['injector:app', 'newer:jshint:app']
      },<% } %><% if (angular || stylus) { %>
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%%= dirs.temp %>/index.html'<% if (angular) { %>,
          '<%%= dirs.app %>/**/*.js',
          '<%%= dirs.temp %>/*.js'<% } %><% if (angular && stylus) { %>,
          '<%%= dirs.temp %>/styleguide.html'<% } %><% if (stylus) { %>,
          '<%%= dirs.temp %>/css/**/*.css'<% } %><% if (angular) { %>,
          '!<%%= dirs.app %>/**/*.spec.js'<% } %>
        ]
      }<% } %>
    },

    <% if (stylus) { %>
    /**
     * Compile Stylus to CSS
     */
    stylus: {
      options: {
        compress: false
      },
      base: {
        files: [{
          expand: true,
          cwd: '<%%= dirs.styles %>',
          src: ['{,*/}*.styl', '!{,*/}_*.styl'],
          dest: '<%%= dirs.temp %>/css',
          ext: '.css'
        }]
      }<% if (angular) { %>,
      app: {
        files: [{
          expand: true,
          cwd: '<%%= dirs.app %>',
          src: ['**/*.styl', '!**/_*.styl'],
          dest: '<%%= dirs.temp %>/css',
          ext: '.css'
        }]
      }<% } %>
    },

    /**
     * Lint CSS
     */
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        files: [{
          expand: true,
          cwd: '<%%= dirs.temp %>/css',
          src: ['**/*.css'],
          ext: '.css'
        }]
      }
    },

    /**
     * Minify CSS
     */
    cssmin: {
      dist: {
        options: {
          banner: '<%%= meta.banner %>'
        },
        files: {
          '<%%= dirs.dist %>/<%%= modulename %>.min.css': [ '<%%= dirs.dist %>/<%%= modulename %>.css' ]
        }
      },
      vendors: {
        files: {
          '<%%= dirs.dist %>/vendors.min.css': [ '<%%= dirs.dist %>/vendors.css' ]
        }
      }
    },<% } %>

    <% if (angular) { %>/**
     * Minify HTML templates for dist
     */
    htmlmin: {
      dist: {
        options: htmlMinOptions,
        files: {
          '<%%= dirs.dist %>/index.html': '<%%= dirs.temp %>/index.html'
        }
      }
    },

    /**
     * Compile AngularJS html templates to Javascript and inject into $templateCache
     */
    html2js: {
      options: {
        module: '<%%= modulename %>Templates',
        base: '<%%= dirs.app %>',
        rename: function (template) {
          return '/' + modulename + '/' + template;
        }
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%%= dirs.app %>',
          src: ['**/*.html', '!<%%= modulename %>.html'],
          dest: '<%%= dirs.temp %>',
          rename: function () {
            return '<%%= dirs.temp %>/<%%= modulename %>Templates.js';
          }
        }]
      },
      dist: {
        options: {
          htmlmin: htmlMinOptions
        },
        files: [{
          expand: true,
          cwd: '<%%= dirs.app %>',
          src: ['**/*.html', '!<%%= modulename %>.html'],
          dest: '<%%= dirs.temp %>',
          rename: function () {
            return '<%%= dirs.temp %>/<%%= modulename %>Templates.js';
          }
        }]
      }
    },

    /**
     * Dependency injection annotation for AngularJS modules
     */
    ngmin: {
      dist: {
        src: [ '<%%= dirs.dist %>/<%%= modulename %>.js' ],
        dest: '<%%= dirs.dist %>/<%%= modulename %>.annotated.js'
      }
    },

    /**
     * Minify Javascripts
     */
    uglify: {
      dist: {
        options: {
          banner: '<%%= meta.banner %>'
        },
        files: {
          '<%%= dirs.dist %>/<%%= modulename %>.min.js': [ '<%%= dirs.dist %>/<%%= modulename %>.annotated.js' ]
        }
      },
      vendors: {
        files: {
          '<%%= dirs.dist %>/vendors.min.js': [ '<%%= dirs.dist %>/vendors.js' ]
        }
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        background: true
      },
      continuous: {
        singleRun: true
      }
    },<% } %>
    <% if (express || !choseType) { %>
    /**
     * Mocha Cli configuration
     */
    mochacli: {
      options: {
        reporter: 'spec',
        ui: 'bdd'
      }<% if (express) { %>,
      api_unit: ['<%%= dirs.api %>/**/*.spec.js'],
      api_continuous: {
        options: {
          bail: true,
        },
        src: ['<%%= dirs.api %>/**/*.spec.js']
      }<% } %>
    },<% } %>

    <% if (angular || stylus) { %>/**
     * The `injector` task injects all scripts/stylesheets into the `index.html` file
     */
    injector: {
      options: {
        destFile: '<%%= dirs.app %>/<%%= modulename %>.html'
      },<% if (stylus) { %>
      styleguide: {
        options: {
          ignorePath: ['bower_components', '<%%= dirs.app %>', '<%%= dirs.temp %>'],
          destFile: '<%%= dirs.styles %>/styleguide.html'
        },
        files: [
          {src: ['bower.json']},
          {
            expand: true,
            cwd: '<%%= dirs.temp %>',
            src: ['**/*.css']
          }
        ]
      },<% } %>

      <% if (angular) { %>/**
       * Inject application files and specs into karma config
       */
      karmaconf: {
        options: {
          destFile: 'karma.conf.js',
          starttag: '/** injector:{{ext}} **/',
          endtag: '/** endinjector **/',
          transform: function (file) { return '\'' + file.slice(1) + '\','; }
        },
        files: [
          {
            src: [
              'bower.json',
              'bower_components/angular-mocks/angular-mocks.js'
            ]
          },
          {
            src: '<%%= vendorFiles %>'
          },
          {
            expand: true,
            cwd: '<%%= dirs.app %>',
            src: ['<%%= modulename %>.js', '**/index.js', '**/*.js', '!**/*.spec.js']
          },
          {
            expand: true,
            cwd: '<%%= dirs.temp %>',
            src: ['*.js']
          },
          {
            expand: true,
            cwd: '<%%= dirs.app %>',
            src: ['**/*.spec.js']
          }
        ]
      },

      /**
       * Inject all needed files during development to not
       * have to wait for minification, concatination, etc.
       */
      app: {
        options: {
          ignorePath: ['bower_components', '<%%= dirs.app %>', '<%%= dirs.temp %>']
        },
        files: [
          {src: ['bower.json']},
          {src: '<%%= vendorFiles %>'},
          {
            expand: true,
            cwd: '<%%= dirs.app %>',
            src: ['<%%= modulename %>.js', '**/index.js', '**/*.js', '!**/*.spec.js']
          },
          {
            expand: true,
            cwd: '<%%= dirs.temp %>',
            src: ['*.js', '**/*.css']
          }
        ]
      },

      /**
       * Collect all vendor files (to build a single vendors.js and vendors.css respectively)
       */
      vendors: {
        options: {
          destFile: '<%%= dirs.temp %>/vendors.json',
          starttag: '"{{ext}}": [',
          endtag: ']',
          templateString: '{\n  "js": [],\n  "css": []\n}',
          transform: function (file, i, length) {
            return '  "' + file.slice(1) + '"' + (i + 1 < length ? ',' : '');
          }
        },
        files: [
          {src: ['bower.json']},
          {src: '<%%= vendorFiles %>'}
        ]
      },

      /**
       * Use concatenated and minified sources for dist mode
       */
      dist: {
        options: {
          min: true,
          ignorePath: 'dist'
        },
        src: [
          '<%%= dirs.dist %>/vendors.js',
          '<%%= dirs.dist %>/vendors.css',
          '<%%= dirs.dist %>/<%%= modulename %>.js',
          '<%%= dirs.dist %>/<%%= modulename %>.css'
        ]
      }<% } %>
    },

    copy: {<% if (angular) { %>
      index: {
        src: '<%%= dirs.app %>/<%%= modulename %>.html',
        dest: '<%%= dirs.temp %>/index.html'
      },<% } %><% if (stylus) { %>
      styleguide: {
        src: '<%%= dirs.styles %>/styleguide.html',
        dest: '<%%= dirs.temp %>/<% if (!angular) { %>index<% } else { %>styleguide<% } %>.html'
      }<% } %>
    },

    /**
     * Concat all source files
     */
    concat: {
      options: {
        banner: '<%%= meta.banner %>'
      }<% if (angular) { %>,
      app: {
        src: [
          '<%%= dirs.app %>/<%%= modulename %>.js',
          '<%%= dirs.app %>/**/index.js',
          '<%%= dirs.app %>/**/*.js',
          '<%%= dirs.temp %>/*.js',
          '!<%%= dirs.app %>/**/*.spec.js'
        ],
        dest: '<%%= dirs.dist %>/<%%= modulename %>.js'
      },
      vendors: {
        options: {
          banner: ''
        },
        files: {
          '<%%= dirs.dist %>/vendors.js': ['<%%= dirs.temp %>/vendors/*.js'],
          '<%%= dirs.dist %>/vendors.css': ['<%%= dirs.temp %>/vendors/*.css']
        }
      }<% } %><% if (stylus) { %>,
      styles: {
        src: [
          '<%%= dirs.temp %>/css/**/*.css'
        ],
        dest: '<%%= dirs.dist %>/<%%= modulename %>.css'
      }<% } %>
    },
    <% } %>

    /**
     * Lint Javascript
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      base: [
        'Gruntfile.js'<% if (!choseType) { %>,
        '<%%= dirs.src %>/*.js'<% } %><% if (addconfig) { %>,
        '<%%= dirs.config %>/*.js'<% } %>
      ]<% if (angular) { %>,
      app: {
        options: {
          jshintrc: '<%%= dirs.app %>/.jshintrc'
        },
        files: [{
          expand: true,
          cwd: '<%%= dirs.app %>',
          src: ['<%%= modulename %>.js', '**/index.js', '**/*.js'],
          dest: '<%%= dirs.app %>'
        }]
      }<% } %><% if (express) { %>,
      api: [
        '<%%= dirs.api %>/**/*.js'
      ]<% } %>
    }
  });

  <% if (angular || stylus) { %>
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      <% if (express) { %>grunt.fatal('`grunt serve:dist` is deprecated! Run server manually with `npm start` or preferably with Forever or a similar tool and point them to `src/index.js`.');
      return false;<% } else { %>return grunt.task.run(['dist', 'connect:dist']);<% } %>
    }
    grunt.task.run([
      'build',
      <% if (express) { %>'express:dev'<% } else { %>'connect:livereload'<% } %>,
      'watch'
    ]);
  });<% } %>

  <% if (angular || express) { %>grunt.registerTask('test', [<% if (angular) { %>
    'jshint:app',
    'html2js:app',
    'injector:karmaconf',
    'karma:continuous'<% } %><% if (angular && express) { %>,<% } %><% if (express) { %>
    'jshint:api',
    'mochacli:api_continuous'<% } %>
  ]);<% } %>

  <% if (angular || stylus) { %>grunt.registerTask('build', [
    'clean:temp'<% if (angular) { %>,
    'html2js:app'<% } %><% if (stylus) { %>,
    'stylus:base'<% if (angular) { %>,
    'stylus:app'<% } %>,
    'csslint',
    'injector:styleguide',
    'copy:styleguide'<% } %><% if (angular) { %>,
    'jshint:app',
    'injector:app',
    'copy:index'<% } %>
  ]);

  grunt.registerTask('dist', [
    'clean:all'<% if (angular) { %>,
    'build_vendors',
    'html2js:dist',
    'concat:app'<% } %><% if (stylus) { %>,
    'stylus:base'<% if (angular) { %>,
    'stylus:app'<% } %>,
    'csslint',
    'concat:styles',
    'cssmin'<% } %><% if (angular) { %>,
    'jshint:app',
    'ngmin',
    'uglify',
    'injector:dist',
    'copy:index',
    'htmlmin:dist'<% } %>
  ]);<% } %>

  grunt.registerTask('default', [
    'jshint'<% if (angular || stylus) { %>,
    'build'<% } %>
  ]);<% if (angular) { %>

  /**
   * Vendor related tasks
   */
  grunt.registerTask('build_vendors', ['injector:vendors', 'copy_vendors', 'concat:vendors']);

  grunt.registerTask('copy_vendors', function () {
    grunt.task.requires('injector:vendors');

    var vendors = grunt.file.readJSON(grunt.config('dirs.temp') + '/vendors.json');

    if (!vendors) {
      grunt.log.warn('No vendors found, nothing to do');
      return false;
    }

    [].concat(vendors.js  || [])
      .concat(vendors.css || [])
      .forEach(function (file, i) {
        grunt.file.copy(file, grunt.config('dirs.temp') + '/vendors/' + ('000000' + i).slice(-7) + '_' + path.basename(file));
      });

    return true;
  });<% } %>
};
