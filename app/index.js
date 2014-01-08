
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    c = require('../lib/common');

var KleiGenerator = module.exports = function KleiGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('modulename', { type: String, required: false });
  try {
    this.modulename = require(path.join(process.cwd(), 'klei.json')).name;
  } catch (e) {
    this.modulename = this.modulename || path.basename(process.cwd());
  }
  this.modulename = this._.camelize(this._.slugify(this._.humanize(this.modulename)));

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = require('../package.json');

  console.log(c.klei);

};

util.inherits(KleiGenerator, yeoman.generators.Base);

KleiGenerator.prototype.askForModulename = function askForModulename() {
  var cb = this.async();

  var prompts = [{
    name: 'modulename',
    message: 'What do you want to name your module?',
    default: this.modulename,
    validate: function (val) {
      if (!val || !val.length) {
        return 'Provide a name!'
      }
      return true;
    }
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
      message: 'What pieces do you want to build your module with? ' + c.$comment('(uncheck all for a pure Node.js module)'),
      choices: [
        {
          value: 'express',
          name: 'REST API ' + c.$comment('(using ' + c.$info('express.js') + ')'),
          checked: true
        },
        {
          value: 'mongo',
          name: 'MongoDB ' + c.$comment('(using ' + c.$info('Mongoose') + ')'),
          checked: true
        },
        {
          value: 'angular',
          name: 'Client APP ' + c.$comment('(using ' + c.$info('AngularJS') + ')'),
          checked: true
        },
        {
          value: 'stylus',
          name: 'Stylesheets ' + c.$comment('(using ' + c.$info('Stylus') + ')'),
          checked: true
        }
      ]
    },
    {
      type: 'confirm',
      name: 'addconfig',
      message: 'Should a config dir be added to your module as well? ' + c.$comment('(for environment specific settings and such)'),
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
    this.types = props.types;
    this.angular = checked('angular');
    this.mongo = checked('mongo');
    this.express = checked('express');
    this.stylus = checked('stylus');
    this.choseType = !!props.types.length;
    if (typeof props.addconfig === 'undefined') {
      this.addconfig = checked('mongo') || checked('express');
    } else {
      this.addconfig = props.addconfig;
    }
    if (typeof props.useexample === 'undefined') {
      this.useexample = checked('angular') || checked('express');
    } else {
      this.useexample = props.useexample;
    }

    cb();
  }.bind(this));
};

KleiGenerator.prototype.basicFiles = function basicFiles() {
  this.template('_package.json', 'package.json');
  this.template('_klei.json', 'klei.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');

  this.mkdir('src');

  if (this.addconfig) {
    this.mkdir('src/config');
    this.copy('config/index.js', 'src/config/index.js');
    this.copy('config/env.js', 'src/config/env.js');
    this.template('config/_development.json', 'src/config/development.json');
    this.template('config/_development.json', 'src/config/production.json');
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
  }
};

KleiGenerator.prototype.frontendFiles = function frontendFiles() {
  if (this.angular || this.stylus) {
    this.template('_bower.json', 'bower.json');
  }
  if (this.stylus) {
    this.copy('csslintrc', '.csslintrc');
    this.mkdir('src/styles');
    this.template('styles/_styleguide.html', 'src/styles/styleguide.html');
    this.copy('styles/module.styl', 'src/styles/' + this.modulename + '.styl');
  }
  if (this.angular) {
    this.mkdir('src/app');
    this.template('app/_module.js', 'src/app/' + this.modulename + '.js');
    this.template('app/_module.html', 'src/app/' + this.modulename + '.html');
    this.template('app/jshintrc', 'src/app/.jshintrc');

    this.copy('karma.conf.js', 'karma.conf.js');

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
