const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'dist/index.d.ts');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    throw new Error('Error reading file');
  }

  const cleaned = data.replace(/(\w+)\$1\b/g, '$1');

  fs.writeFile(filePath, cleaned, 'utf8', (err) => {
    if (err) {
      throw new Error('Error writing file');
    }

    console.log('Removed all "$1" from:', filePath);
  });
});
