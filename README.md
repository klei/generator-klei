# Klei Generator [![Build Status](https://secure.travis-ci.org/klei-dev/generator-klei.png?branch=master)](https://travis-ci.org/klei-dev/generator-klei)

> A Yeoman generator for generating awesome module or app boilerplates! MEAN-stack (all parts optional) with Grunt and Bower sweetness..

## Getting Started

### Install Yeoman

```
$ npm install -g yo
```

### Install the Klei Generator

```
$ npm install -g generator-klei
```

Do the magic:

```
$ yo klei
```

## What can the Klei Generator do?

The Klei Generator asks you what type of module you want to build, then you pick the parts you want from:

* REST API's - using [Express.js](http://expressjs.com)
* MongoDB - using [Mongoose](http://mongoosejs.com)
* Client - using [AngularJS](http://angularjs.org)
* Stylesheets - using [Stylus](http://learnboost.github.io/stylus/)

### What you'll get:

* A scalable directory structure (Todo list example included)
* A fully configured Gruntfile with livereload, linting, concatenation, minification etc.
* Automounting of API routes using [exctrl](https://npmjs.org/package/exctrl)
* No more editing of your html layout when adding scripts and stylesheets to your project, thanks to [grunt-injector](https://npmjs.org/package/grunt-injector)
* Frontend unit testing with [Karma](http://karma-runner.github.io/), [Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/)
* and more.. This is just the first version, there's more to come!

**Try it out!**

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
