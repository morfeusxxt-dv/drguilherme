const fs = require('fs');
const d = require('./figma_tree.json');

const desktopPage = d.document.children[0].children.find(c => c.name === 'Guilherme Cunha - Home - Desktop');
const sec01 = desktopPage.children.find(c => c.name === 'Sec01');
const koi1 = sec01.children.find(c => c.name === 'koi 1');

if (koi1) {
    console.log('koi 1 fills:', JSON.stringify(koi1.fills, null, 2));
} else {
    console.log('koi 1 not found');
}
