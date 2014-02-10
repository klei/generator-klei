generator-klei changelog
=========================

## v.0.4

### Hotfix v.0.4.3

* Using `NODE_ENV=test` for mocha tests

### Hotfix v.0.4.2

* Remove node engine `v.0.8` because `yeoman-generator` doesn't support it

### Hotfix v.0.4.1

* Fix to make `grunt jshint:base` happy

### Release v.0.4.0

* Switching to [grunt-express-server](https://github.com/ericclemmons/grunt-express-server) from [grunt-express](https://github.com/blai/grunt-express), because the latter was buggy and `src/index.js` can now be run without `grunt` (Fixes [#4](https://github.com/klei-dev/generator-klei/issues/4))
* Concats and minifies 3rd party libraries as well, to `dist/vendor.min.js` and `dist/vendor.min.css` respectively
* `dist` folder is not used (and cleared) in development mode anymore
* Assures that prompt defaults are really set (Hopefully fixes [#5](https://github.com/klei-dev/generator-klei/issues/5))
* Minimizing build time before running Karma tests
* Making sure built stylus files are removed when their sources are removed
* Making Jshint happy with the Gruntfile
* Making sure the watch task is triggered when adding new html templates
* Making sure any css-files from Bower components are not injected into karma.conf.js
* Plus other small fixes...

## v.0.3

### Release v.0.3.0

* Adding klei:api subgenerator for generating new API's

## v.0.2

### Release v.0.2.0

* Updating all dependencies for generated apps/modules and adding Mocha + Chai with grunt-mocha-cli for backend testing

## v.0.1

### Release v.0.1.0

* First release. A full MEAN-stack app/module generator, the generator asks what parts you want.
