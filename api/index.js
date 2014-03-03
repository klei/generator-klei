'use strict';
var util = require('util'),
    yeoman = require('yeoman-generator'),
    c = require('../lib/common');

var ApiGenerator = module.exports = function ApiGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });

  console.log(c.klei);
};

util.inherits(ApiGenerator, yeoman.generators.Base);

ApiGenerator.prototype.ask = function ask() {
  var cb = this.async();

  var givenName = this.name;

  if (givenName) {
    console.log('Generating new api with the name: ' + c.$notice(givenName));
  }

  var prompts = [
    {
      name: 'name',
      message: 'Give your new API a name ' + c.$comment('(the api will get the url: ' + c.$info('/api/<name>') +')'),
      when: function () {
        return !givenName;
      },
      validate: function (val) {
        if (!val || !val.length) {
          return 'Provide a name!';
        }
        return true;
      }
    },
    {
      name: 'model',
      type: 'confirm',
      message: 'Do you want to create a new model as well? ' + c.$comment('(in same dir as the controller)'),
      default: true
    },
    {
      name: 'modelName',
      message: 'What to you want to name your new model?',
      default: function (answers) {
        return answers.name;
      },
      when: function (answers) {
        return answers.model;
      },
      validate: function (val) {
        if (!val || !val.length) {
          return 'Provide a name!';
        }
        return true;
      }
    }
  ];

  this.prompt(prompts, function (props) {
    this.name = this._.dasherize(this._.slugify(this._.humanize(props.name || this.name)));
    var nameCamel = this._.camelize(this.name);
    this.camelName = nameCamel[0].toLowerCase() + nameCamel.slice(1);
    this.titleName = this._.classify(nameCamel);
    this.model = props.model;
    if (this.model) {
      this.modelName = this._.dasherize(this._.slugify(this._.humanize(props.modelName)));
      var modelCamel = this._.camelize(this.modelName);
      this.camelModelName = modelCamel[0].toLowerCase() + modelCamel.slice(1);
      this.titleModelName = this._.classify(modelCamel);
    }
    this.mongo = usesMongo();

    cb();
  }.bind(this));
};

ApiGenerator.prototype.files = function files() {
  if (this.model) {
    this.template('_name-api.js', 'src/api/' + this.name + '/' + this.name + '-api.js');
    this.template('_name-model.js', 'src/api/' + this.name + '/' + this.modelName + '-model.js');
  } else {
    this.template('_name-no-model-api.js', 'src/api/' + this.name + '/' + this.name + '-api.js');
  }
  this.template('_name-api_test.js', 'src/api/' + this.name + '/' + this.name + '-api_test.js');
};

function usesMongo () {
  try {
    return require(require('path').join(process.cwd(), 'klei.json')).parts.indexOf('mongo') >= 0;
  } catch (e) {
  }
  return false;
}
