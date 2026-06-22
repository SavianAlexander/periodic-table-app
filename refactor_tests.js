const fs = require('fs');
const path = require('path');

const e2eDir = path.join(__dirname, 'tests/e2e');
const files = fs.readdirSync(e2eDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(e2eDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace data-testids
  content = content.replace(/element-modal/g, 'right-panel');
  content = content.replace(/modal-close/g, 'right-panel-close');
  content = content.replace(/modal-overlay/g, 'right-panel-overlay');
  content = content.replace(/modal-element-name/g, 'right-panel-element-name');
  content = content.replace(/modal-everyday-uses/g, 'right-panel-everyday-uses');
  content = content.replace(/modal-intermediate-details/g, 'right-panel-intermediate-details');
  content = content.replace(/modal-advanced-data/g, 'right-panel-advanced-data');
  content = content.replace(/modal-content/g, 'right-panel-content');

  // Replace descriptions and variable names
  content = content.replace(/Modal Open/g, 'Panel Open');
  content = content.replace(/Modal Content/g, 'Panel Content');
  content = content.replace(/Modal Boundaries/g, 'Panel Boundaries');
  content = content.replace(/modal/g, 'panel');
  content = content.replace(/Modal/g, 'Panel');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Done replacing modal to right-panel in tests.');
