const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

class Element {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.attributes = {};
    this.textContent = '';
  }
  append(...nodes) { this.children.push(...nodes); }
  setAttribute(name, value) { this.attributes[name] = value; }
  insertBefore(node) { this.children.push(node); }
}

function renderBasics(puzzle) {
  const guide = new Element('main');
  const script = {
    dataset: { puzzleGuide: puzzle },
  };
  const document = {
    querySelector: selector => selector === 'script[data-puzzle-guide]' ? script :
      selector === '.guide-content' ? guide : null,
    querySelectorAll: () => [],
    getElementById: () => null,
    createElement: tag => new Element(tag),
    createElementNS: (namespace, tag) => new Element(tag),
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'puzzle-guides.js'), 'utf8'), { document });
  return guide.children[0];
}

const pyraminx = renderBasics('pyraminx');
const terms = pyraminx.children[2].children[1].children;
assert.deepEqual(terms.map(item => item.children[1].children[0].textContent), ['Coins', 'Centres', 'Arêtes']);
assert.deepEqual(terms.map(item => item.children[0].attributes['data-pyraminx-term']), ['tips', 'vertices', 'face']);
const pieceTypes = ['tip', 'center', 'edge'];
const orientation = polygon => {
  const [a, b, c] = polygon.attributes.points.split(' ').map(point => point.split(',').map(Number));
  return Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
};
for (const [index, item] of terms.entries()) {
  const drawing = item.children[0];
  assert.equal(drawing.tagName, 'svg');
  assert.equal(drawing.attributes.role, 'img');
  assert.match(drawing.attributes['aria-label'], /en orange.*en gris/);
  assert.match(drawing.attributes.class, /notation-pyraminx/);
  assert.equal(drawing.children.length, 27);
  const highlighted = drawing.children.filter(tile => tile.attributes['data-highlighted'] === 'true');
  assert.equal(highlighted.length, 9);
  assert.ok(highlighted.every(tile => tile.attributes['data-piece'] === pieceTypes[index]));
  const pieceCount = new Set(highlighted.map(tile => tile.attributes['data-piece-id'])).size;
  assert.equal(pieceCount, index === 2 ? 6 : 4);
  for (const face of ['bottom', 'left', 'right']) {
    const tiles = drawing.children.filter(tile => tile.attributes['data-face'] === face);
    assert.equal(tiles.length, 9);
    assert.equal(tiles.filter(tile => tile.attributes['data-highlighted'] === 'true').length, 3);
    const tips = tiles.filter(tile => tile.attributes['data-piece'] === 'tip');
    const edges = tiles.filter(tile => tile.attributes['data-piece'] === 'edge');
    const centers = tiles.filter(tile => tile.attributes['data-piece'] === 'center');
    for (const center of centers) {
      assert.equal(orientation(center), -orientation(tips[0]));
      const tip = tips.find(tile => tile.attributes['data-piece-id'] === center.attributes['data-piece-id'].replace('center-', 'tip-'));
      const points = new Set(tip.attributes.points.split(' '));
      assert.equal(center.attributes.points.split(' ').filter(point => points.has(point)).length, 2);
    }
    assert.ok(edges.every(tile => orientation(tile) === orientation(tips[0])));
  }
  for (const tile of drawing.children) {
    assert.equal(tile.attributes.stroke, '#111318');
    assert.ok(orientation(tile));
    for (const point of tile.attributes.points.split(' ')) {
      const [x, y] = point.split(',').map(Number);
      assert.ok(x >= 0 && x <= 260 && y >= 0 && y <= 224);
    }
  }
}
const sourcePath = path.join(__dirname, 'assets/images/solution/pyraminx-termes-google-docs.png');
const source = fs.readFileSync(sourcePath);
assert.equal(source.subarray(1, 4).toString(), 'PNG');
assert.equal(source.readUInt32BE(16), 496);
assert.equal(source.readUInt32BE(20), 127);
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
assert.match(css, /\.notation-pyraminx\s*\{[^}]*filter: drop-shadow/);
assert.doesNotMatch(css, /pyraminx-term-photo/);

const faces = pyraminx.children[3].children[1].children;
assert.deepEqual(faces.map(item => item.children[1].children[0].textContent), ['F · Avant', 'L · Gauche', 'R · Droite', 'D · Dessous']);
assert.deepEqual(faces.map(item => item.children[0].attributes['data-pyraminx-face']), ['F', 'L', 'R', 'D']);
const faceColors = { F: '#f34b54', L: '#4d86e8', R: '#28c770' };
const polygons = node => node.tagName === 'polygon' ? [node] : node.children.flatMap(polygons);
for (const item of faces.slice(0, 3)) {
  const drawing = item.children[0];
  const face = drawing.attributes['data-pyraminx-face'];
  const tiles = polygons(drawing);
  assert.equal(tiles.length, 27);
  assert.equal(tiles.filter(tile => tile.attributes.fill === faceColors[face]).length, 9);
  assert.ok(tiles.every(tile => tile.attributes.stroke === '#111318'));
}
const underside = faces[3].children[0];
const hidden = underside.children.find(node => node.attributes['data-hidden-face'] === 'D');
assert.equal(hidden.children.length, 9);
assert.ok(hidden.children.every(tile => tile.attributes.fill === '#ffda30' && tile.attributes['data-face'] === 'D'));
assert.ok(hidden.attributes.opacity > 0 && hidden.attributes.opacity < 1);
assert.equal(hidden.attributes.filter, 'url(#pyraminx-bottom-blur)');
const blur = underside.children[0].children[0];
assert.equal(blur.attributes.id, 'pyraminx-bottom-blur');
assert.equal(blur.children[0].tagName, 'feGaussianBlur');
assert.ok(blur.children[0].attributes.stdDeviation > 0);
const transparentTiles = underside.children.filter(node => node.tagName === 'polygon');
assert.equal(transparentTiles.length, 27);
assert.ok(polygons(underside).every(tile => tile.attributes.stroke === '#9198a5'));
assert.ok(transparentTiles.every(tile => tile.attributes['fill-opacity'] < 0.2));
assert.ok(underside.children.indexOf(hidden) < underside.children.indexOf(transparentTiles[0]));
for (const item of faces.slice(0, 3)) {
  assert.deepEqual(polygons(item.children[0]).map(tile => tile.attributes.points), transparentTiles.map(tile => tile.attributes.points));
}

const megaminx = renderBasics('megaminx');
const megaTerms = megaminx.children[2].children[1].children;
assert.deepEqual(megaTerms.map(item => item.children[1].children[0].textContent), ['Centre', 'Arête', 'Coin', 'Face']);
assert.ok(megaTerms.every(item => item.children[0].tagName === 'svg'));
assert.deepEqual(megaminx.children[3].children[1].children.map(item => item.children[1].children[0].textContent), ['U · Dessus', 'F · Avant', 'R · Droite', 'D · Dessous']);
for (const article of [pyraminx, megaminx]) {
  assert.equal(article.children[3].children[1].children.length, 4);
  assert.equal(article.children[4].children[1].children.length, 8);
}
assert.equal(renderBasics('unknown'), undefined);
console.log('Pyraminx: vocabulary geometry, four face views, grey outlines and blurred transparent underside passed; Megaminx and move blocks unchanged.');
