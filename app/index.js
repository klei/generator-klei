
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    $g = chalk.green,
    $y = chalk.yellow,
    $d = chalk.grey;


var KleiGenerator = module.exports = function KleiGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('modulename', { type: String, required: false });
  this.modulename = this.modulename || path.basename(process.cwd());
  this.modulename = this._.camelize(this._.slugify(this._.humanize(this.modulename)));

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = require('../package.json');

              // ' █ ▄▀ █ ▄▀▀▀▄ ▀ \n' +
              // ' █▀▄  █ █▀▀▀▀ █ \n' +
              // ' ▀  ▀ ▀  ▀▀▀  ▀ \n';
  this.klei = '\n' +
             // ' $$\\       $$\\           $$\\ \n' +
             // ' $$ |      $$ |          \\__|\n' +
             // ' $$ |  $$\\ $$ | $$$$$$\\  $$\\ \n' +
             // ' $$ | $$  |$$ |$$  __$$\\ $$ |\n' +
             // ' $$$$$$  / $$ |$$$$$$$$ |$$ |\n' +
             // ' $$  _$$<  $$ |$$   ____|$$ |\n' +
             // ' $$ | \\$$\\ $$ |\\$$$$$$$\\ $$ |\n' +
             // ' \\__|  \\__|\\__| \\_______|\\__|\n';

             // '  _    _      _ \n' +
             // ' | | _| | ___(_)\n' +
             // ' | |/ / |/ _ \\ |\n' +
             // ' |   <| |  __/ |\n' +
             // ' |_|\\_\\_|\\___|_|\n';


            // '  _   _     _ \n' +
            // ' | |_| |___|_|\n' +
            // ' | \'_| | -_| |\n' +
            // ' |_,_|_|___|_|\n';

            // ' 888      888          d8b \n' +
            // ' 888      888          Y8P \n' +
            // ' 888      888              \n' +
            // ' 888  888 888  .d88b.  888 \n' +
            // ' 888 .88P 888 d8P  Y8b 888 \n' +
            // ' 888888K  888 88888888 888 \n' +
            // ' 888 "88b 888 Y8b.     888 \n' +
            // ' 888  888 888  "Y8888  888 \n';

            $g('  _    _      ') + $y('_') + ' \n' +
            $g(' | |  | |    ') + $y('(_)\n') +
            $g(' | | _| | ___ _ \n') +
            $g(' | |/ / |/ _ \\ |\n') +
            $g(' |   <| |  __/ |\n') +
            $g(' |_|\\_\\_|\\___|_|') + $d(' v.' + this.pkg.version) + '\n';

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
    this.modulenameCamel = this.modulename[0].toLowerCase() + this.modulename.slice(1);
    this.modulenameDashed = this._.dasherize(this.modulenameCamel);

    cb();
  }.bind(this));
};

KleiGenerator.prototype.askForModuleType = function askForModuleType() {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'types',
    message: 'What pieces do you want to build your module with? (uncheck all for a pure Node.js module)',
    choices: [
      {
        value: 'angular',
        name: 'AngularJS',
        checked: true
      },
      {
        value: 'mongo',
        name: 'MongoDB (using Mongoose)',
        checked: true
      },
      {
        value: 'express',
        name: 'Express.js',
        checked: true
      },
      {
        value: 'stylus',
        name: 'Stylus (CSS)',
        checked: true
      }
    ]
  }];

  this.prompt(prompts, function (props) {
    var checked = function (val) { return props.types.indexOf(val) > -1; };
    this.angular = checked('angular');
    this.mongo = checked('mongo');
    this.express = checked('express');
    this.stylus = checked('stylus');
    this.choseType = !!props.types.length;

    cb();
  }.bind(this));
};

KleiGenerator.prototype.askForConfig = function askForConfig() {
  if (this.choseType) {
    this.addconfig = true;
    return;
  }
  var cb = this.async();

  var prompts = [{
    type: 'confirm',
    name: 'addconfig',
    message: 'Should a config dir be added to your module as well?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.addconfig = props.addconfig;

    cb();
  }.bind(this));
};

KleiGenerator.prototype.askForExample = function askForExample() {
  if (!this.angular && !this.express) {
    return;
  }

  var cb = this.async();

  var prompts = [{
    type: 'confirm',
    name: 'useexample',
    message: 'Should a simple Todo list example be generated as well?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.useexample = props.useexample;

    cb();
  }.bind(this));
};

KleiGenerator.prototype.basicFiles = function basicFiles() {
  this.template('_package.json', 'package.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');

  if (this.addconfig || this.express || this.mongo) {
    this.mkdir('config');
    this.copy('config/index.js', 'config/index.js');
    this.copy('config/env.js', 'config/env.js');
    this.template('config/_development.json', 'config/development.json');
  }
};

KleiGenerator.prototype.backendFiles = function backendFiles() {
  if (this.express) {
    this.template('_index.js', 'index.js');

    if (this.useexample) {
      this.mkdir('api');
      this.mkdir('api/todo');

      if (this.mongo) {
        this.copy('api/todo/todo.controller.js', 'api/todo/todo.controller.js');
        this.copy('api/todo/Todo.model.js', 'api/todo/Todo.model.js');
      } else {
        this.copy('api/todo-nomongo/todo.controller.js', 'api/todo/todo.controller.js');
      }
    }
  } else if (!this.choseType) {
    this.mkdir('src');
  }
};

KleiGenerator.prototype.frontendFiles = function frontendFiles() {
  if (this.angular || this.stylus) {
    this.template('_bower.json', 'bower.json');
  }
  if (this.stylus) {
    this.copy('csslintrc', '.csslintrc');
    this.mkdir('styles');
    this.copy('styles/module.styl', 'styles/' + this.modulename + '.styl');
  }
  if (this.angular) {
    this.mkdir('app');
    this.template('app/_module.js', 'app/' + this.modulename + '.js');
    this.template('app/_module.html', 'app/' + this.modulename + '.html');
    this.template('app/jshintrc', 'app/.jshintrc');

    if (this.useexample) {
      this.mkdir('app/todo');
      this.template('app/todo/_TodoCtrl.js', 'app/todo/TodoCtrl.js');
      this.copy('app/todo/todo.html', 'app/todo/todo.html');
      if (this.stylus) {
        this.copy('app/todo/todo.styl', 'app/todo/todo.styl');
      }
    }
  }
};

KleiGenerator.prototype.projectfiles = function projectfiles() {
  this.template('_gitignore', '.gitignore');
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
