const fs = require('fs');
const d = require('./figma_tree.json');
const p = d.document.children[0].children.find(c => c.name === 'Guilherme Cunha - Home - Desktop');
function printNode(n, indent='') {
    let out = indent + n.name + ' (' + n.type + ')\n';
    if(n.characters) out += indent + '  "' + n.characters.replace(/\n/g, '\\n') + '"\n';
    fs.appendFileSync('home_structure.txt', out);
    if(n.children) n.children.forEach(c => printNode(c, indent+'  '));
}
fs.writeFileSync('home_structure.txt', '');
printNode(p);
