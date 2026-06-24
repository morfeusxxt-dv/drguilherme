const fs = require('fs');
const d = require('./figma_tree.json');

// Check if figma_tree.json has an outer object with metadata or if it's just the document tree
console.log('Keys of figma_tree:', Object.keys(d));
if (d.meta) {
    console.log('Meta keys:', Object.keys(d.meta));
    if (d.meta.images) {
        console.log('Images mapping count:', Object.keys(d.meta.images).length);
        // Print first 5 images mapping
        const keys = Object.keys(d.meta.images);
        for(let i=0; i<Math.min(5, keys.length); i++) {
            console.log(`${keys[i]} -> ${d.meta.images[keys[i]]}`);
        }
    }
}
