const fs = require('fs');
const d = require('./figma_tree.json');

const images = [];

function traverse(n, parentName = '') {
    if (n.fills) {
        n.fills.forEach((f, idx) => {
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
    const children = n.children || (n.document && n.document.children);
    if (children) {
        children.forEach(c => traverse(c, n.name || parentName));
    }
}

traverse(d);

console.log('--- ALL IMAGE NODES IN FIGMA TREE ---');
images.forEach((img, index) => {
    console.log(`${index}: Node "${img.nodeName}" | Parent "${img.parentName}" | Box: ${img.box} | imageRef: "${img.imageRef}"`);
});
