const minify = require('minify')
const path = require('path')
const fs = require('fs')
const {
    execSync,
} = require('child_process');

const options = {
    html: {
        removeAttributeQuotes: false,
        caseSensitive: true,
    },
    css: {
        compatibility: '*',
    },
    js: {
        ecma: 5,
    },
    img: {
        maxSize: 4096,
    },
}

function getAllFiles(dir) {
    const filesList = [];
    if (fs.statSync(dir).isDirectory()) {
        fs.readdirSync(dir).forEach(p => {
            filesList.push(...getAllFiles(path.join(dir, p)));
        })
    } else {
        filesList.push(dir)
    }
    return filesList
}

const allFiles = getAllFiles(path.resolve('public')).filter(p => ['.js', '.css', '.html'].indexOf(path.extname(p)) >= 0)

async function main() {
    const ps = allFiles.map(file => {
        minify(file, options)
            .then(d => {
                fs.writeFileSync(file, d);
            })
    })
    await Promise.all(ps);
}
main();
// minify('./client.js', options)
//     .then(console.log)
//     .catch(console.error)