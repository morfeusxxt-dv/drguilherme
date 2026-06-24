const fs = require('fs');
const d = require('./figma_tree.json');

const laurienneCanvas = d.document.children.find(c => c.name === 'Laurienne');
if (!laurienneCanvas) {
    console.error('Canvas "Laurienne" not found!');
    process.exit(1);
}

const images = [];

function traverse(n, parentName = '') {
    if (n.fills) {
        n.fills.forEach((f, idx) => {
            if (f.type === 'IMAGE') {
                images.push({
                    nodeId: n.id,
                    nodeName: n.name,
                    nodeType: n.type,
                    parentName: parentName,
                    imageRef: f.imageRef,
                    box: n.absoluteBoundingBox ? `${Math.round(n.absoluteBoundingBox.width)}x${Math.round(n.absoluteBoundingBox.height)}` : 'N/A'
                });
            }
        });
    }
    const children = n.children;
    if (children) {
        children.forEach(c => traverse(c, n.name || parentName));
    }
}

traverse(laurienneCanvas);

console.log('--- IMAGES IN LAURIENNE CANVAS ---');
images.forEach((img, index) => {
    console.log(`${index}: Node "${img.nodeName}" (ID: ${img.nodeId}) | Parent "${img.parentName}" | Box: ${img.box} | imageRef: "${img.imageRef}"`);
});
