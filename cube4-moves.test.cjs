const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  constructor(tag = 'div') {
    this.tagName = tag;
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.textContent = '';
  }
  append(...nodes) { this.children.push(...nodes); }
  setAttribute(name, value) { this.attributes[name] = value; }
  insertAdjacentElement(position, node) { this.guide = node; }
}

const grid = new Element();
const layers = ['R', 'L', 'F', 'B', 'U', 'D'].map(layer => {
  const node = new Element('svg');
  node.dataset.cube4Layer = layer;
  return node;
});
const notation = {
  querySelectorAll: () => layers,
  querySelector: () => grid,
};
const algorithms = [
  ['oll', "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'"],
  ['pll', 'r2 U2 r2 Uw2 r2 Uw2 U2'],
].map(([type, text]) => {
  const node = new Element('p');
  node.dataset.cube4Moves = type;
  node.textContent = text;
  return node;
});
const document = {
  querySelectorAll: () => algorithms,
  querySelector: () => notation,
  createElement: tag => new Element(tag),
  createElementNS: (ns, tag) => new Element(tag),
};
vm.runInNewContext(fs.readFileSync(`${__dirname}/cube4-moves.js`, 'utf8'), { document });
assert.equal(grid.children.length, 20);
const counts = { R: 24, L: 8, F: 24, B: 8, U: 24, D: 8 };
for (const layer of layers) {
  assert.equal((layer.attributes.style.match(/:#22bd4f/g) || []).length, counts[layer.dataset.cube4Layer]);
}
for (const node of algorithms) assert.equal(node.guide.children[1].children.length, node.textContent.split(' ').length);
const find = token => grid.children.find(item => item.children[1].children[0].textContent === token);
for (const [token, count] of [['r', 8], ['l', 8], ['u', 8], ['d', 8], ['Rw', 32], ['Uw', 32]]) {
  const cube = find(token).children[0].children[0];
  assert.equal((cube.attributes.style.match(/:#3656c6/g) || []).length, count);
}
assert.equal(find("R'").children[0].children[1].textContent, '↺');
assert.equal(find('R').children[0].children[1].textContent, '↻');
assert.equal(find('U2').children[0].children[1].textContent, '180°');
console.log('4x4 notation: 20 movements, six layers, inner/wide highlighting, primes and parity breakdowns passed.');
