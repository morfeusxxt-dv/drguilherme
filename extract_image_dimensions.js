const fs = require('fs');
const path = require('path');

const assetsDir = 'c:\\Users\\lyanm\\OneDrive\\Área de Trabalho\\unavitta\\assets';
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

function getPngDimensions(filePath) {
    const buffer = Buffer.alloc(24);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 24, 0);
    fs.closeSync(fd);
    
    // Check if it is a valid PNG
    if (buffer.toString('ascii', 1, 4) !== 'PNG') {
        return null;
    }
    
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
}

console.log('--- PNG DIMENSIONS IN ASSETS ---');
files.forEach(f => {
    const fullPath = path.join(assetsDir, f);
    try {
        const dim = getPngDimensions(fullPath);
        if (dim) {
            console.log(`${f}: ${dim.width}x${dim.height} (size: ${fs.statSync(fullPath).size} bytes)`);
        } else {
            console.log(`${f}: Not a valid PNG`);
        }
    } catch (err) {
        console.log(`${f}: Error reading dimensions - ${err.message}`);
    }
});
