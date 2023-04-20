const {
    execSync,
} = require('child_process');
const path = require('path')

const c = `cp ${path.resolve('source', 'home', '*')} ${path.resolve('public')}`;
console.log('c: ', c);
execSync(c)
