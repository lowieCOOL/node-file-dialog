const {exec} = require('child_process');
const path = require('path');
const pjson = require('./package.json');
const root = __dirname;

function askdialog(config) {
  var cmd = path.join('python', 'dist')
  var action = '';
  if (process.platform === 'linux') {
    var filename = 'node-file-dialog'
    if (process.arch === 'x86') filename += '-xi686.AppImage'
    else filename += '-x86_64.AppImage'
    cmd = path.join(cmd, 'linux', filename)
  }
  if (process.platform === 'win32') {
    var filename = 'dialog'
    if (process.arch === 'x86') filename += '-x86'
    cmd = path.join(cmd, 'windows', filename + '.exe')
  }
  if (config.type === 'directory')
    action += ' -d';
  else if (config.type === 'save-file')
    action += ' -s';
  else if (config.type === 'open-file')
    action += ' -o';
  else if (config.type === 'open-files')
    action += ' -f';
  var promise = new Promise((resolve, reject) => {
    exec(`"${path.join(root, cmd)}"${action}`, (error, stdout, stderr) => {
      if (stdout) {
        if (stdout.trim() === 'None')
          reject(new Error('Nothing selected'));
        else
          resolve(stdout.trim().split('\n'))
      } else if (error) {
        reject(new Error(error));
      } else if (stderr) {
        reject(new Error(stderr));
      }
    });
  })
  return promise;
}

module.exports = askdialog;
