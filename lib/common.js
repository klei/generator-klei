var chalk = require('chalk'),
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
