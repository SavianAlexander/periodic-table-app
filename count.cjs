const fs = require('fs');
const elements = JSON.parse(fs.readFileSync('./src/data/elements.json', 'utf8'));
fs.writeFileSync('./count.txt', elements.length.toString());
