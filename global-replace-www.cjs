const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory && !f.startsWith('.') && f !== 'node_modules' ? walk(dirPath, callback) : callback(path.join(dir, f), isDirectory);
    });
};

walk(rootDir, (file, isDir) => {
    if (isDir) return;
    if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.cjs') || file.endsWith('.mjs') || file.endsWith('.xml')) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('yourwonclaim.com')) {
            console.log(`Updating ${file}`);
            let newContent = content.replace(/www\.yourwonclaim\.com/g, 'yourwonclaim.com');
            fs.writeFileSync(file, newContent, 'utf8');
        }
    }
});
