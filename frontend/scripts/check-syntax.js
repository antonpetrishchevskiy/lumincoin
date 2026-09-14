const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const root = path.resolve(__dirname, '..', 'src');
const extensions = new Set(['.js']);
const ignoredDirectories = new Set(['node_modules', 'dist']);

function collectJavaScriptFiles(directory) {
    const files = [];

    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
        if (ignoredDirectories.has(entry.name)) {
            continue;
        }

        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectJavaScriptFiles(entryPath));
        } else if (extensions.has(path.extname(entry.name))) {
            files.push(entryPath);
        }
    }

    return files;
}

const files = collectJavaScriptFiles(root);
let hasErrors = false;

for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], {
        encoding: 'utf8',
        stdio: 'pipe',
    });

    if (result.status !== 0) {
        hasErrors = true;
        process.stderr.write(`\nSyntax error: ${file}\n${result.stderr}`);
    }
}

if (hasErrors) {
    process.exit(1);
}

console.log(`Syntax check passed: ${files.length} JavaScript files.`);
