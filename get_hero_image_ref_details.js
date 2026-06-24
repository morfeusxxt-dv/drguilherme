const fs = require('fs');
const d = require('./figma_tree.json');

const desktopPage = d.document.children[0].children.find(c => c.name === 'Guilherme Cunha - Home - Desktop');
const images = [];

function traverse(n, parentName = '') {
    if (n.fills) {
        n.fills.forEach(f => {
            if (f.type === 'IMAGE') {
                images.push({
                    nodeName: n.name,
                    nodeType: n.type,
                    parentName: parentName,
                    imageRef: f.imageRef,
                    box: n.absoluteBoundingBox ? `${Math.round(n.absoluteBoundingBox.width)}x${Math.round(n.absoluteBoundingBox.height)}` : 'N/A'
                });
            }
        });
    }
    if (n.children) {
        n.children.forEach(c => traverse(c, n.name || parentName));
    }
}

if (desktopPage) {
    traverse(desktopPage);
}

console.log('--- IMAGES IN DESKTOP HOME PAGE ---');
images.forEach((img, idx) => {
    console.log(`${idx}: Node "${img.nodeName}" (parent: "${img.parentName}") | Box: ${img.box} | hash: ${img.imageRef}`);
});
