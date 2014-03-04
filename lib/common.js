var chalk = require('chalk'),
    path = require('path'),
    $ok = chalk.green,
    $info = chalk.yellow,
    $notice = chalk.cyan,
    $comment = chalk.grey,
    pkg = require('../package'),
    isTest = process.env.NODE_ENV === 'test';

exports.$ok = $ok;
exports.$info = $info;
exports.$notice = $notice;
exports.$comment = $comment;

if (isTest) {
  exports.klei = '';
} else {
  exports.klei = '\n' +
    $ok('  _    _      ') + $info('_') + ' \n' +
    $ok(' | |  | |    ') + $info('(_)\n') +
    $ok(' | | _| | ___ _ \n') +
    $ok(' | |/ / |/ _ \\ |\n') +
    $ok(' |   <| |  __/ |\n') +
    $ok(' |_|\\_\\_|\\___|_|') + $comment(' v.' + pkg.version) + '\n';
}

exports.isFirstRun = function () {
  return !exports.getKleiJson();
};

exports.hasPart = function (part) {
  var klei = exports.getKleiJson();
  return klei && klei.parts && klei.parts.indexOf(part) >= 0;
};

exports.getKleiJson = function () {
  try {
    return require(path.join(process.cwd(), 'klei.json'));
  } catch (e) {
    return null;
  }
};
