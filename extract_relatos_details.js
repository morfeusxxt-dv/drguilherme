const fs = require('fs');
const d = require('./figma_tree.json');

const desktopPage = d.document.children[0].children.find(c => c.name === 'Guilherme Cunha - Home - Desktop');
const relatosSec = desktopPage.children.find(c => c.name === 'Sec4');

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
    if (n.fills && n.fills.length > 0) {
        const fillsStr = n.fills.map(f => f.type).join(', ');
        str += ` | Fills: [${fillsStr}]`;
        if (n.fills[0].color) {
            const r = Math.round(n.fills[0].color.r * 255);
            const g = Math.round(n.fills[0].color.g * 255);
            const b = Math.round(n.fills[0].color.b * 255);
            str += ` rgba(${r}, ${g}, ${b}, ${n.fills[0].opacity || 1})`;
        }
    }
    if (n.strokes && n.strokes.length > 0) {
        str += ` | Strokes: [${n.strokes.map(s => s.type).join(', ')}] (weight: ${n.strokeWeight})`;
    }
    console.log(str);
    if (n.children) {
        n.children.forEach(c => dumpNode(c, depth + 1));
    }
}

if (relatosSec) {
    dumpNode(relatosSec);
} else {
    console.log('Relatos section frame not found');
}
