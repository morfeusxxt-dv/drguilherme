const fs = require('fs');

async function download() {
  console.log('Downloading updated Figma document tree...');
  const res = await fetch('https://api.figma.com/v1/files/AWCaEXHDfc2cabKIdcnAAs', {
    headers: {
      'X-Figma-Token': 'figd_Qa5isn1k0gGKqdYYKHP2RojYNZ1AFaduKTfzquL_'
    }
  });
  if (!res.ok) {
    throw new Error('Figma API request failed: ' + res.status + ' ' + res.statusText);
  }
  const data = await res.json();
  fs.writeFileSync('figma_tree.json', JSON.stringify(data, null, 2));
  console.log('Figma tree updated successfully!');
}

download().catch(console.error);
