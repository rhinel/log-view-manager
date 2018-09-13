'use strict';

const fs = require('fs');

const gitHEAD = fs.readFileSync('.git/HEAD', 'utf-8').trim();
const ref = gitHEAD.split(': ')[1];
const gitVersion;
if (!ref) {
  ref = 'travis';
  gitVersion = gitHEAD;
} else {
  gitVersion = fs.readFileSync(`.git/${ref}`, 'utf-8').trim();
}

module.exports = `${ref}: ${gitVersion}`;
