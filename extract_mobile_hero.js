const fs = require('fs');
const d = require('./figma_tree.json');

const mobilePage = d.document.children[0].children.find(c => c.name === 'Guilherme Cunha - Home - Mobile');
const heroMobile = mobilePage.children[0]; // first top-level child of Mobile page is the Hero frame

function dumpNode(n, depth = 0) {
    const indent = '  '.repeat(depth);
    let str = `${indent}- "${n.name}" (${n.type})`;
    if (n.absoluteBoundingBox) {
        const { x, y, width, height } = n.absoluteBoundingBox;
        str += ` | Box: x:${Math.round(x)} y:${Math.round(y)} w:${Math.round(width)} h:${Math.round(height)}`;
    }
    if (n.layoutMode) {
        str += ` | Layout: ${n.layoutMode} (spacing: ${n.itemSpacing || 0}, padding: T:${n.paddingTop || 0} R:${n.paddingRight || 0} B:${n.paddingBottom || 0} L:${n.paddingLeft || 0})`;
    }
    if (n.fills) {
        str += ` | Fills: ${JSON.stringify(n.fills.map(f => f.type))}`;
    }
    console.log(str);
    if (n.children) {
        n.children.forEach(c => dumpNode(c, depth + 1));
    }
}

if (heroMobile) {
    dumpNode(heroMobile);
} else {
    console.log('Mobile Hero frame not found');
}
