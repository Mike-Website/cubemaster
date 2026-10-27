(() => {
  const targets = document.querySelectorAll('[data-cube4-moves]');
  const notation = document.querySelector('[data-cube4-notation]');
  if (!targets.length && !notation) return;

  const NS = 'http://www.w3.org/2000/svg';
  const accent = '#3656c6';
  const faces = {
    F: ['la face avant', 'depuis l’avant'],
    L: ['la face gauche', 'depuis la gauche'],
    R: ['la face droite', 'depuis la droite'],
    U: ['la face du haut', 'depuis le dessus'],
    D: ['la face du bas', 'depuis le dessous'],
    B: ['la face arrière', 'depuis l’arrière'],
    Rw: ['les deux couches de droite', 'depuis la droite'],
    Lw: ['les deux couches de gauche', 'depuis la gauche'],
    Uw: ['les deux couches du haut', 'depuis le dessus'],
    Fw: ['les deux couches de devant', 'depuis l’avant'],
    r: ['la couche intérieure droite', 'depuis la droite'],
    l: ['la couche intérieure gauche', 'depuis la gauche'],
    u: ['la couche intérieure du haut', 'depuis le dessus'],
    d: ['la couche intérieure du bas', 'depuis le dessous'],
    x: ['le cube entier', 'comme un mouvement R'],
    z: ['le cube entier', 'comme un mouvement F']
  };

  function html(name, className, content = '') {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  }

  function svgNode(name, attrs = {}) {
    const node = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  }

  function faceCells(face, numbers, selected, color) {
    for (const n of numbers) selected.add(`--cube4-${face}${n}:${color}`);
  }

  function column(indexes) {
    return indexes.flatMap(index => [index, index + 4, index + 8, index + 12]);
  }

  function layerStyle(base, color = accent) {
    const selected = new Set([
      '--cube4-muted:#d7dbe3', '--cube4-t:#ecedf2',
      '--cube4-f:#e8eaf0', '--cube4-r:#e2e5ee'
    ]);
    const all = Array.from({ length: 16 }, (_, i) => i + 1);
    const paint = (face, cells) => faceCells(face, cells, selected, color);
    if (base === 'F' || base === 'Fw') {
      paint('f', all);
      paint('t', base === 'Fw' ? [9, 10, 11, 12, 13, 14, 15, 16] : [13, 14, 15, 16]);
      paint('r', base === 'Fw' ? column([1, 2]) : column([1]));
    } else if (base === 'R' || base === 'Rw') {
      paint('r', all);
      paint('t', base === 'Rw' ? column([3, 4]) : column([4]));
      paint('f', base === 'Rw' ? column([3, 4]) : column([4]));
    } else if (base === 'L' || base === 'Lw') {
      paint('t', base === 'Lw' ? column([1, 2]) : column([1]));
      paint('f', base === 'Lw' ? column([1, 2]) : column([1]));
    } else if (base === 'B') {
      paint('t', [1, 2, 3, 4]);
      paint('r', column([4]));
    } else if (base === 'U' || base === 'Uw') {
      paint('t', all);
      paint('f', base === 'Uw' ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4]);
      paint('r', base === 'Uw' ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4]);
    } else if (base === 'D') {
      paint('f', [13, 14, 15, 16]);
      paint('r', [13, 14, 15, 16]);
    } else if (base === 'r' || base === 'l') {
      paint('t', column([base === 'r' ? 3 : 2]));
      paint('f', column([base === 'r' ? 3 : 2]));
    } else if (base === 'u' || base === 'd') {
      paint('f', base === 'u' ? [5, 6, 7, 8] : [9, 10, 11, 12]);
      paint('r', base === 'u' ? [5, 6, 7, 8] : [9, 10, 11, 12]);
    } else if (base === 'x' || base === 'z') {
      paint('t', all);
      paint('f', all);
      paint('r', all);
    }
    return [...selected].join(';');
  }

  function moveInfo(token) {
    const base = token.replace(/[2']/g, '');
    if (!faces[base]) return null;
    const half = token.endsWith('2');
    const reverse = token.endsWith("'");
    const [name, viewpoint] = faces[base];
    const direction = half ? '180°' : reverse ? 'antihoraire' : 'horaire';
    const action = base === 'x' || base === 'z' ?
      `Fais pivoter le cube entier ${viewpoint}${reverse ? ', dans le sens inverse' : ''}. Garde cette nouvelle prise pour la suite.` :
      half ? `Tourne ${name} de deux quarts de tour, soit 180°.` :
        `Tourne ${name} d’un quart de tour dans le sens ${direction}.`;
    return { base, name, viewpoint, direction, half, reverse, action };
  }

  function visual(token, info) {
    const svg = svgNode('svg', {
      class: 'cube4-move-cube', viewBox: '0 0 210 200', role: 'img',
      'aria-label': `${token} : ${info.name} en surbrillance`, style: layerStyle(info.base)
    });
    svg.append(svgNode('use', { href: '#cube4-guide-cube' }));
    if (info.base === 'L' || info.base === 'Lw') {
      svg.append(svgNode('path', {
        d: 'M 14 54 L 14 145 L 38 157', fill: 'none', stroke: accent,
        'stroke-width': info.base === 'Lw' ? 4 : 3,
        'stroke-dasharray': '6 4', 'stroke-linecap': 'round'
      }));
    }
    return svg;
  }

  if (notation) {
    notation.querySelectorAll('[data-cube4-layer]').forEach(svg => {
      svg.setAttribute('style', layerStyle(svg.dataset.cube4Layer, svg.dataset.layerColor || '#22bd4f'));
    });
    const grid = notation.querySelector('[data-cube4-turns]');
    const tokens = ['R', "R'", 'L', "L'", 'F', "F'", 'B', "B'", 'U', "U'", 'D', "D'", 'Rw', "Rw'", 'Uw', 'U2', 'l', 'r', 'u', 'd'];
    tokens.forEach(token => {
      const info = moveInfo(token);
      const item = html('div', 'notation-turn');
      const image = html('div', 'notation-turn-visual');
      const cube = visual(token, info);
      cube.setAttribute('class', 'notation-cube cube4-notation-cube');
      cube.setAttribute('style', layerStyle(info.base));
      image.append(cube, html('span', info.half ? 'notation-turn-arrow notation-turn-arrow-half' : 'notation-turn-arrow', info.half ? '180°' : info.reverse ? '↺' : '↻'));
      const copy = html('div', 'notation-turn-copy');
      copy.append(html('strong', 'notation-move-code', token), html('h4', '', info.name.replace(/^la |^les /, '')),
        html('p', '', info.half ? 'Deux quarts de tour' : info.reverse ? 'Sens antihoraire' : 'Sens horaire'));
      item.append(image, copy);
      grid.append(item);
    });
  }

  const endings = {
    corners: 'Après F2, vérifie les coins avant de passer aux arêtes.',
    edges: 'Après F2, ajuste U seulement si les couleurs latérales ne sont pas encore alignées.',
    oll: 'La paire retournée est corrigée. Reprends la croix jaune avec les couches extérieures.'
  };

  for (const algorithm of targets) {
    const type = algorithm.dataset.cube4Moves;
    const tokens = algorithm.textContent.trim().split(/\s+/);
    if (!tokens.every(token => moveInfo(token))) continue;
    const guide = html('div', 'cube4-move-guide');
    const legend = html('p', 'cube4-move-legend',
      'Le bleu montre les couches à tourner, pas les couleurs après chaque mouvement. Lis le sens depuis la face indiquée.');
    const list = html('ol', 'cube4-move-list');
    tokens.forEach((token, index) => {
      const info = moveInfo(token);
      const item = html('li', 'cube4-move');
      const heading = html('div', 'cube4-move-heading');
      heading.append(html('span', 'cube4-move-number', String(index + 1).padStart(2, '0')),
        html('strong', 'cube4-move-token', token));
      const image = html('div', 'cube4-move-visual');
      image.append(visual(token, info), html('span',
        info.half ? 'cube4-move-arrow cube4-move-arrow-half' : 'cube4-move-arrow',
        info.half ? '180°' : info.reverse ? '↺' : '↻'));
      const copy = html('div', 'cube4-move-copy');
      copy.append(html('strong', '', info.name), html('p', '', info.action));
      if (info.half) copy.append(html('small', 'cube4-move-half', `${info.base} puis ${info.base}`));
      copy.append(html('small', '', info.base === 'x' ? info.viewpoint : `Vu ${info.viewpoint}`));
      item.append(heading, image, copy);
      list.append(item);
    });
    guide.append(legend, list, html('p', 'cube4-move-end', endings[type] || 'Contrôle le résultat après la formule complète.'));
    algorithm.insertAdjacentElement('afterend', guide);
  }
})();
