
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    $ok = chalk.green,
    $info = chalk.yellow,
    $comment = chalk.grey;


var KleiGenerator = module.exports = function KleiGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('modulename', { type: String, required: false });
  this.modulename = this.modulename || path.basename(process.cwd());
  this.modulename = this._.camelize(this._.slugify(this._.humanize(this.modulename)));

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = require('../package.json');

  this.klei = '\n' +
            $ok('  _    _      ') + $info('_') + ' \n' +
            $ok(' | |  | |    ') + $info('(_)\n') +
            $ok(' | | _| | ___ _ \n') +
            $ok(' | |/ / |/ _ \\ |\n') +
            $ok(' |   <| |  __/ |\n') +
            $ok(' |_|\\_\\_|\\___|_|') + $comment(' v.' + this.pkg.version) + '\n';

};

util.inherits(KleiGenerator, yeoman.generators.Base);

KleiGenerator.prototype.askForModulename = function askForModulename() {
  var cb = this.async();

  console.log(this.klei);

  var prompts = [{
    name: 'modulename',
    message: 'What do you want to name your module?',
    default: this.modulename
  }];

  this.prompt(prompts, function (props) {
    this.modulename = this._.camelize(this._.slugify(this._.humanize(props.modulename)));
    this.modulenameCamel = this.modulename ? this.modulename[0].toLowerCase() + this.modulename.slice(1) : '';
    this.modulenameDashed = this._.dasherize(this.modulenameCamel);

    cb();
  }.bind(this));
};

KleiGenerator.prototype.ask = function ask() {
  var cb = this.async();

  var prompts = [
    {
      type: 'checkbox',
      name: 'types',
      message: 'What pieces do you want to build your module with? ' + $comment('(uncheck all for a pure Node.js module)'),
      choices: [
        {
          value: 'express',
          name: 'REST API ' + $comment('(using ' + $info('express.js') + ')'),
          checked: true
        },
        {
          value: 'mongo',
          name: 'MongoDB ' + $comment('(using ' + $info('Mongoose') + ')'),
          checked: true
        },
        {
          value: 'angular',
          name: 'Client APP ' + $comment('(using ' + $info('AngularJS') + ')'),
          checked: true
        },
        {
          value: 'stylus',
          name: 'Stylesheets ' + $comment('(using ' + $info('Stylus') + ')'),
          checked: true
        }
      ]
    },
    {
      type: 'confirm',
      name: 'addconfig',
      message: 'Should a config dir be added to your module as well? ' + $comment('(for environment specific settings and such)'),
      default: true,
      when: function (props) {
        return !props.types.length;
      }
    },
    {
      type: 'confirm',
      name: 'useexample',
      message: 'Should a simple Todo list example be generated as well?',
      default: true,
      when: function (props) {
        return props.types.indexOf('angular') > -1 || props.types.indexOf('express') > -1;
      }
    }
  ];

  this.prompt(prompts, function (props) {
    var checked = function (val) { return props.types.indexOf(val) > -1; };
    this.angular = checked('angular');
    this.mongo = checked('mongo');
    this.express = checked('express');
    this.stylus = checked('stylus');
    this.choseType = !!props.types.length;
    this.addconfig = props.addconfig;
    this.useexample = props.useexample;

    cb();
  }.bind(this));
};

KleiGenerator.prototype.basicFiles = function basicFiles() {
  this.template('_package.json', 'package.json');
  try {
    this.template('_Gruntfile.js', 'Gruntfile.js');
  } catch (e) {
    require('fs').writeFileSync('grunt-error.js', e.source, 'utf8');
  }

  this.mkdir('src');

  if (this.addconfig || this.express || this.mongo) {
    this.mkdir('src/config');
    this.copy('config/index.js', 'src/config/index.js');
    this.copy('config/env.js', 'src/config/env.js');
    this.template('config/_development.json', 'src/config/development.json');
  }
};

KleiGenerator.prototype.backendFiles = function backendFiles() {
  if (this.express || this.mongo) {
    this.template('_index.js', 'src/index.js');
  }
  if (this.express) {
    this.mkdir('src/api');

    if (this.useexample) {
      this.mkdir('src/api/todo');

      if (this.mongo) {
        this.copy('api/todo/todo.controller.js', 'src/api/todo/todo.controller.js');
        this.copy('api/todo/Todo.model.js', 'src/api/todo/Todo.model.js');
      } else {
        this.copy('api/todo-nomongo/todo.controller.js', 'src/api/todo/todo.controller.js');
      }
    }
  } else if (this.mongo) {
    this.mkdir('src/models');
    if (this.useexample) {
      this.copy('models/Todo.js', 'src/models/Todo.js');
    }
  } else if (!this.choseType) {

  }
};

KleiGenerator.prototype.frontendFiles = function frontendFiles() {
  if (this.angular || this.stylus) {
    this.template('_bower.json', 'bower.json');
  }
  if (this.stylus) {
    this.copy('csslintrc', '.csslintrc');
    this.mkdir('src/styles');
    this.copy('styles/module.styl', 'src/styles/' + this.modulename + '.styl');
  }
  if (this.angular) {
    this.mkdir('src/app');
    this.template('app/_module.js', 'src/app/' + this.modulename + '.js');
    this.template('app/_module.html', 'src/app/' + this.modulename + '.html');
    this.template('app/jshintrc', 'src/app/.jshintrc');

    this.mkdir('karma');
    this.copy('karma/karma.conf.js', 'karma/karma.conf.js');

    if (this.useexample) {
      this.mkdir('src/app/todo');
      this.template('app/todo/_index.js', 'src/app/todo/index.js');
      this.template('app/todo/_TodoCtrl.js', 'src/app/todo/TodoCtrl.js');
      this.template('app/todo/_TodoCtrl.spec.js', 'src/app/todo/TodoCtrl.spec.js');
      this.copy('app/todo/todo.html', 'src/app/todo/todo.html');
      if (this.stylus) {
        this.copy('app/todo/todo.styl', 'src/app/todo/todo.styl');
      }
    }
  }
};

KleiGenerator.prototype.projectfiles = function projectfiles() {
  this.template('_gitignore', '.gitignore');
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
