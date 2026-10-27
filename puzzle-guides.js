(() => {
  const script = document.querySelector('script[data-puzzle-guide]');
  const puzzle = script?.dataset.puzzleGuide;
  if (!['pyraminx', 'megaminx'].includes(puzzle)) return;

  const NS = 'http://www.w3.org/2000/svg';
  const colors = {
    muted: '#dce2eb', white: '#ffffff', yellow: '#ffda30', red: '#f34b54',
    green: '#28c770', blue: '#4d86e8', orange: '#ff9b33', ink: '#242833', accent: '#3152bd'
  };

  function el(name, attrs = {}, text = '') {
    const node = document.createElement(name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text) node.textContent = text;
    return node;
  }

  function svgEl(name, attrs = {}) {
    const node = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  }

  function polygon(svg, points, fill, extra = {}) {
    const node = svgEl('polygon', {
      points: points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '),
      fill, stroke: colors.ink, 'stroke-width': 1.8, 'stroke-linejoin': 'round', ...extra
    });
    svg.append(node);
    return node;
  }

  function label(svg, x, y, text, size = 12, fill = colors.ink) {
    const node = svgEl('text', {
      x, y, fill, 'font-size': size, 'font-family': 'Inter, sans-serif',
      'font-weight': 700, 'text-anchor': 'middle', 'dominant-baseline': 'middle'
    });
    node.textContent = text;
    svg.append(node);
  }

  function makeSvg(title, viewBox = '0 0 260 224') {
    const svg = svgEl('svg', { viewBox, role: 'img', 'aria-label': title, class: 'puzzle-diagram' });
    return svg;
  }

  function mix(a, b, ratio) {
    return [a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio];
  }

  function pyraminxTiles(corners, vertices) {
    const [top, left, right] = corners.map(id => vertices[id]);
    const point = (row, col) => [
      top[0] + row * (left[0] - top[0]) / 3 + col * (right[0] - left[0]) / 3,
      top[1] + row * (left[1] - top[1]) / 3 + col * (right[1] - left[1]) / 3
    ];
    const tiles = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col <= row; col++) {
        const tip = row === 0 ? 0 : row === 2 && col === 0 ? 1 : row === 2 && col === 2 ? 2 : -1;
        const edge = row === 1 ? [0, col === 0 ? 1 : 2] : [1, 2];
        tiles.push({
          points: [point(row, col), point(row + 1, col), point(row + 1, col + 1)],
          piece: tip >= 0 ? 'tip' : 'edge',
          id: tip >= 0 ? corners[tip] : edge.map(index => corners[index]).sort().join('')
        });
      }
      // The three inverted triangles are centres, not edges (Google Docs reference).
      for (let col = 0; col < row; col++) {
        tiles.push({
          points: [point(row, col), point(row, col + 1), point(row + 1, col + 1)],
          piece: 'center', id: corners[row === 1 ? 0 : col + 1]
        });
      }
    }
    return tiles;
  }

  function pyraminxTermDiagram(state, title) {
    const svg = makeSvg(title);
    svg.setAttribute('class', 'puzzle-diagram notation-pyraminx');
    svg.setAttribute('data-pyraminx-term', state);
    const vertices = { A: [130, 24], B: [28, 204], C: [232, 204], D: [118, 170] };
    const selected = { tips: 'tip', vertices: 'center', face: 'edge' }[state];
    const faces = [
      { id: 'bottom', corners: ['D', 'B', 'C'], muted: '#edf0f5', active: '#ffab58' },
      { id: 'left', corners: ['A', 'B', 'D'], muted: '#dce0e7', active: '#f48a34' },
      { id: 'right', corners: ['A', 'D', 'C'], muted: '#c9cfd9', active: '#e27c2c' }
    ];
    for (const face of faces) {
      for (const { points, piece, id } of pyraminxTiles(face.corners, vertices)) {
        polygon(svg, points, piece === selected ? face.active : face.muted, {
          stroke: '#111318', 'stroke-width': 2.6,
          'data-face': face.id, 'data-piece': piece,
          'data-piece-id': `${piece}-${id}`,
          'data-highlighted': String(piece === selected)
        });
      }
    }
    return svg;
  }

  function pyraminxFaceDiagram(face, title) {
    const svg = makeSvg(title);
    const underside = face === 'D';
    svg.setAttribute('class', `puzzle-diagram notation-pyraminx${underside ? ' notation-pyraminx-bottom' : ''}`);
    svg.setAttribute('data-pyraminx-face', face);
    const vertices = { A: [130, 24], B: [28, 204], C: [232, 204], D: [126, 125] };
    if (underside) {
      const defs = svgEl('defs');
      const filter = svgEl('filter', {
        id: 'pyraminx-bottom-blur', x: '-12%', y: '-12%', width: '124%', height: '124%',
        'color-interpolation-filters': 'sRGB'
      });
      filter.append(svgEl('feGaussianBlur', { stdDeviation: 1.3 }));
      defs.append(filter);
      svg.append(defs);
      const hiddenFace = svgEl('g', {
        'data-hidden-face': 'D', opacity: 0.62, filter: 'url(#pyraminx-bottom-blur)'
      });
      for (const { points } of pyraminxTiles(['A', 'B', 'C'], vertices)) {
        polygon(hiddenFace, points, colors.yellow, {
          stroke: '#9198a5', 'stroke-width': 2.2, 'data-face': 'D'
        });
      }
      svg.append(hiddenFace);
    }
    const faces = [
      { id: 'F', corners: ['D', 'B', 'C'], muted: '#edf0f5', active: colors.red },
      { id: 'L', corners: ['A', 'B', 'D'], muted: '#dce0e7', active: colors.blue },
      { id: 'R', corners: ['A', 'D', 'C'], muted: '#c9cfd9', active: colors.green }
    ];
    for (const side of faces) {
      for (const { points } of pyraminxTiles(side.corners, vertices)) {
        polygon(svg, points, side.id === face ? side.active : side.muted, {
          stroke: underside ? '#9198a5' : '#111318', 'stroke-width': 2.6,
          'fill-opacity': underside ? 0.12 : 1, 'stroke-opacity': underside ? 0.65 : 1,
          'data-face': side.id
        });
      }
    }
    return svg;
  }

  function pyraminxDiagram(state, title, { focusFace = '', move = '' } = {}) {
    const svg = makeSvg(title);
    const a = [130, 22], b = [38, 201], c = [222, 201];
    const sideFace = (vertices, fill) => {
      const [top, left, right] = vertices;
      const point = (row, col) => [
        top[0] + row * (left[0] - top[0]) / 3 + col * (right[0] - left[0]) / 3,
        top[1] + row * (left[1] - top[1]) / 3 + col * (right[1] - left[1]) / 3
      ];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col <= row; col++) {
          polygon(svg, [point(row, col), point(row + 1, col), point(row + 1, col + 1)], fill);
        }
        if (row > 0) for (let col = 0; col < row; col++) {
          polygon(svg, [point(row, col), point(row, col + 1), point(row + 1, col + 1)], fill);
        }
      }
    };
    sideFace([[130, 22], [222, 201], [240, 127]],
      focusFace === 'R' ? colors.green : state === 'solved' ? colors.blue : '#b9c4d7');
    sideFace([[130, 22], [38, 201], [20, 127]],
      focusFace === 'L' ? colors.blue : state === 'solved' ? colors.red : '#c5cedd');

    const grid = (row, col) => [
      a[0] + row * (b[0] - a[0]) / 3 + col * (c[0] - b[0]) / 3,
      a[1] + row * (b[1] - a[1]) / 3 + col * (c[1] - b[1]) / 3
    ];
    let corner = 0;
    let edge = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col <= row; col++) {
        const index = corner++;
        let fill = focusFace === 'U' ? colors.yellow : focusFace === 'F' ? colors.red : colors.muted;
        if (state === 'tips' && [0, 3, 5].includes(index)) fill = colors.yellow;
        if (state === 'vertices' && [0, 1, 2, 3, 4, 5].includes(index)) fill = colors.yellow;
        if (['face', 'last', 'solved'].includes(state)) fill = colors.yellow;
        const piece = polygon(svg, [grid(row, col), grid(row + 1, col), grid(row + 1, col + 1)], fill);
        if ((state === 'tips' && index === 0) || (state === 'vertices' && index === 1)) {
          piece.setAttribute('stroke', colors.accent);
          piece.setAttribute('stroke-width', '4');
        }
      }
      if (row > 0) {
        for (let col = 0; col < row; col++) {
          let fill = focusFace === 'U' ? colors.yellow : focusFace === 'F' ? colors.red : colors.muted;
          if (state === 'face' || state === 'last' || state === 'solved') fill = colors.yellow;
          const piece = polygon(svg, [grid(row, col), grid(row, col + 1), grid(row + 1, col + 1)], fill);
          if (state === 'face' && edge === 0) {
            piece.setAttribute('stroke', colors.accent);
            piece.setAttribute('stroke-width', '4');
          }
          edge++;
        }
      }
    }
    if (state === 'tips') {
      svg.append(svgEl('circle', {
        cx: 237, cy: 126, r: 14, fill: 'none', stroke: colors.accent,
        'stroke-width': 3, 'stroke-dasharray': '4 3'
      }));
    }
    if (state === 'last') {
      const tracked = svgEl('path', {
        d: 'M 170 112 L 222 201 L 240 127', fill: 'none',
        stroke: colors.accent, 'stroke-width': 4, 'stroke-linejoin': 'round'
      });
      svg.append(tracked);
    }
    if (move) {
      const positions = { L: [38, 197], R: [222, 197], D: [130, 25], B: [238, 126] };
      const point = positions[move];
      svg.append(svgEl('circle', {
        cx: point[0], cy: point[1], r: 15, fill: 'none',
        stroke: colors.accent, 'stroke-width': 4
      }));
    }
    if (focusFace) {
      const positions = { U: [130, 132], F: [130, 132], L: [34, 130], R: [227, 130] };
      const point = positions[focusFace];
      if (point) label(svg, point[0], point[1], focusFace, 16,
        focusFace === 'L' || focusFace === 'R' ? colors.white : colors.ink);
    }
    return svg;
  }

  function pentagon(radius, center = [130, 112]) {
    return Array.from({ length: 5 }, (_, i) => {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / 5;
      return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
    });
  }

  function megaminxDiagram(state, title, {
    face = 'U', mini = false, focusFace = '', wrongEdges = ['DR', 'DF'], wrongCorners = ['DFR', 'DBL']
  } = {}) {
    const svg = makeSvg(title, mini ? '0 0 260 240' : '0 0 260 224');
    const outer = pentagon(78), inner = pentagon(33);
    for (const index of [1, 2, 3]) {
      const p = outer[index], q = outer[(index + 1) % 5];
      const middle = mix(p, q, 0.5);
      const away = [(middle[0] - 130) * 0.58, (middle[1] - 112) * 0.58];
      const side = [p, q, [q[0] + away[0], q[1] + away[1]],
        [middle[0] + away[0] * 1.25, middle[1] + away[1] * 1.25],
        [p[0] + away[0], p[1] + away[1]]];
      const focusedSide = { R: 1, D: 2, F: 3 }[focusFace];
      const sideFill = focusedSide === index ?
        { R: colors.green, D: colors.yellow, F: colors.red }[focusFace] :
        state === 'solved' ? [colors.green, colors.red, colors.blue][index - 1] :
        state === 'rings' && index < 3 ? [colors.green, colors.red][index - 1] : '#bcc7d8';
      polygon(svg, side, sideFill);
    }
    polygon(svg, outer, '#2c3039', { 'stroke-width': 2.4 });
    const final = ['orient-edges', 'place-edges', 'place-corners', 'orient-corners', 'solved-last'].includes(state);
    const main = focusFace && focusFace !== 'U' ? colors.muted : final ? colors.yellow : colors.white;
    const centerFill = state === 'blank' ? colors.muted : main;
    polygon(svg, inner, centerFill);
    const edgeColors = Array(5).fill(colors.muted);
    const cornerColors = Array(5).fill(colors.muted);
    if (state === 'edge') edgeColors[0] = main;
    if (['star', 'corner', 'rings', 'solved', 'face'].includes(state)) edgeColors.fill(main);
    if (['corner', 'rings', 'solved', 'face'].includes(state)) cornerColors.fill(main);
    if (final) {
      edgeColors.fill(main);
      if (state === 'orient-edges') {
        const names = ['DR', 'Db', 'DB', 'DL', 'DF'];
        for (const code of wrongEdges) edgeColors[names.indexOf(code)] = colors.blue;
      }
      if (state === 'orient-corners') {
        const names = ['DFR', 'DRb', 'DbB', 'DBL', 'DLF'];
        for (const code of wrongCorners) cornerColors[names.indexOf(code)] = colors.blue;
      }
      if (state === 'solved-last') cornerColors.fill(main);
    }
    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5;
      const previous = (i + 4) % 5;
      const edgePiece = polygon(svg, [mix(outer[i], outer[next], 0.25), mix(outer[i], outer[next], 0.75),
        mix(inner[i], inner[next], 0.75), mix(inner[i], inner[next], 0.25)], edgeColors[i]);
      const cornerPiece = polygon(svg, [outer[i], mix(outer[i], outer[next], 0.25), inner[i],
        mix(outer[previous], outer[i], 0.75)], cornerColors[i]);
      if (i === 0 && state === 'edge') {
        edgePiece.setAttribute('stroke', colors.accent);
        edgePiece.setAttribute('stroke-width', '4');
      }
      if (i === 0 && state === 'corner') {
        cornerPiece.setAttribute('stroke', colors.accent);
        cornerPiece.setAttribute('stroke-width', '4');
      }
    }
    label(svg, 130, 112, face, 23, colors.ink);
    return svg;
  }

  let arrowId = 0;

  function drawCycle(svg, points) {
    if (points.length < 3) return;
    const markerId = `puzzle-guide-arrow-${++arrowId}`;
    const defs = svgEl('defs');
    const marker = svgEl('marker', {
      id: markerId, viewBox: '0 0 6 6', refX: 5, refY: 3,
      markerWidth: 6, markerHeight: 6, orient: 'auto'
    });
    marker.append(svgEl('path', { d: 'M 0 0 L 6 3 L 0 6 Z', fill: colors.accent }));
    defs.append(marker);
    svg.append(defs);
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i + 1) % points.length];
      const from = mix(a, b, 0.25), to = mix(a, b, 0.74);
      svg.append(svgEl('path', {
        d: `M ${from[0].toFixed(1)} ${from[1].toFixed(1)} L ${to[0].toFixed(1)} ${to[1].toFixed(1)}`,
        fill: 'none', stroke: colors.accent, 'stroke-width': 2.5,
        'marker-end': `url(#${markerId})`
      }));
    }
  }

  function drawSwaps(svg, points) {
    if (points.length !== 4) return;
    const markerId = `puzzle-guide-swap-${++arrowId}`;
    const defs = svgEl('defs');
    const marker = svgEl('marker', {
      id: markerId, viewBox: '0 0 6 6', refX: 5, refY: 3,
      markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse'
    });
    marker.append(svgEl('path', { d: 'M 0 0 L 6 3 L 0 6 Z', fill: colors.accent }));
    defs.append(marker);
    svg.append(defs);
    for (const [a, b] of [[points[0], points[1]], [points[2], points[3]]]) {
      const from = mix(a, b, 0.24), to = mix(a, b, 0.76);
      svg.append(svgEl('path', {
        d: `M ${from[0].toFixed(1)} ${from[1].toFixed(1)} L ${to[0].toFixed(1)} ${to[1].toFixed(1)}`,
        fill: 'none', stroke: colors.accent, 'stroke-width': 2.4,
        'marker-start': `url(#${markerId})`, 'marker-end': `url(#${markerId})`
      }));
    }
  }

  function caseDiagram(caseData, title, caseType = '') {
    const [positions, cycle] = caseData;
    if (puzzle === 'pyraminx') {
      const svg = makeSvg(title, '0 0 260 224');
      polygon(svg, [[130, 20], [35, 202], [225, 202]], '#f4f6fa', { 'stroke-width': 2.6 });
      const map = { FR: [174, 136], FL: [86, 136], LR: [130, 186] };
      const slot = code => ({ RF: 'FR', LF: 'FL', RL: 'LR' }[code] || code);
      const points = positions.map(code => map[slot(code)]);
      if (cycle) drawCycle(svg, points);
      for (const [code, point] of Object.entries(map)) {
        const selected = positions.find(position => slot(position) === code);
        svg.append(svgEl('circle', {
          cx: point[0], cy: point[1], r: 16,
          fill: selected ? colors.yellow : colors.muted,
          stroke: selected ? colors.accent : colors.ink,
          'stroke-width': selected ? 3.2 : 1.8
        }));
        label(svg, point[0], point[1], selected || code, 10);
      }
      return svg;
    }
    const isCorner = positions[0].length > 2;
    const state = caseType === 'orientation-aretes' ? 'orient-edges' :
      caseType === 'orientation-coins' ? 'orient-corners' :
      isCorner ? 'place-corners' : 'place-edges';
    const svg = megaminxDiagram(state, title, {
      face: 'D', mini: true, wrongEdges: positions, wrongCorners: positions
    });
    const outer = pentagon(78);
    const edgeNames = ['DR', 'Db', 'DB', 'DL', 'DF'];
    const cornerNames = ['DFR', 'DRb', 'DbB', 'DBL', 'DLF'];
    const names = isCorner ? cornerNames : edgeNames;
    const points = names.map((_, i) => isCorner ? outer[i] : mix(outer[i], outer[(i + 1) % 5], 0.5));
    const selected = positions.map(code => points[names.indexOf(code)]);
    if (cycle) drawCycle(svg, selected);
    else if (selected.length === 4) drawSwaps(svg, selected);
    names.forEach((name, i) => {
      const point = points[i];
      const selectedPiece = positions.includes(name);
      svg.append(svgEl('circle', {
        cx: point[0], cy: point[1], r: isCorner ? 13 : 12,
        fill: selectedPiece ? '#f5f8ff' : '#ffffff',
        stroke: selectedPiece ? colors.accent : '#afb8c9',
        'stroke-width': selectedPiece ? 3 : 1.5
      }));
      label(svg, point[0], point[1], name, isCorner ? 8 : 10,
        selectedPiece ? colors.accent : '#777e8c');
    });
    return svg;
  }

  const config = puzzle === 'pyraminx' ? {
    title: 'Pyraminx',
    terms: [
      ['Coins', 'Les quatre petites pointes. Tourne chacune pour aligner ses couleurs avec les centres voisins.', 'tips'],
      ['Centres', 'Les triangles juste derrière les pointes. Rassemble les trois centres de même couleur sur une face.', 'vertices'],
      ['Arêtes', 'Les six pièces à deux couleurs, situées entre les centres. Leurs couleurs doivent correspondre aux deux faces voisines.', 'face']
    ],
    faces: [
      ['F', 'Avant', 'Le côté devant toi lorsque tu tiens le puzzle.', 'blank'],
      ['L', 'Gauche', 'Le côté visible à gauche de la face avant.', 'blank'],
      ['R', 'Droite', 'Le côté visible à droite de la face avant.', 'blank'],
      ['D', 'Dessous', 'La face tournée vers le sol, jaune dans cet exemple.', 'blank']
    ],
    moves: ['L', "L'", 'R', "R'", 'D', "D'", 'B', "B'"],
    moveName: { L: 'sommet gauche', R: 'sommet droit', D: 'sommet du bas', B: 'sommet arrière' },
    unit: '120°',
    note: 'L, R, D et B nomment les sommets à tourner, pas les faces colorées. Regarde le sommet concerné pour décider du sens. Les petites pointes se règlent indépendamment.',
    stages: [
      ['pointes', 'tips', 'Trois pointes visibles ; la quatrième, entourée en pointillé, est derrière.', ['Observe chaque pointe et les trois couleurs de la pièce juste derrière.', 'Tourne seulement la petite pointe jusqu’à prolonger ces couleurs.', 'Contrôle les quatre pointes avant de déplacer un grand sommet.']],
      ['sommets', 'vertices', 'Trois grands sommets montrent le jaune ; les arêtes restent libres.', ['Repère la couleur absente du grand sommet du bas : ce sera la première face.', 'Tourne les trois autres grands sommets pour présenter cette couleur sur U.', 'Ne cherche pas encore à assortir les trois arêtes jaunes.']],
      ['aretes', 'face', 'Une arête jaune est entourée en bleu après son insertion sur U.', ['Place l’arête à insérer près du sommet D et vérifie ses deux couleurs.', 'Amène-la devant : FR pour la formule L D’ L’, FL pour R’ D R.', 'Après chaque insertion, vérifie la couleur de la face U et celle du côté.']],
      ['derniere', 'last', 'Dernières arêtes sur la face opposée : repère les positions avant la formule.', ['Tourne D pour aligner la couleur du sommet du bas avec les faces voisines.', 'Compare les trois dernières arêtes et choisis uniquement le cas qui correspond.', 'Exécute toute la formule, puis vérifie les trois faces concernées.']]
    ]
  } : {
    title: 'Mégaminx',
    terms: [
      ['Centre', 'La pièce fixe qui donne la couleur de la face.', 'center'],
      ['Arête', 'Une pièce à deux couleurs entre deux centres.', 'edge'],
      ['Coin', 'Une pièce à trois couleurs qui relie trois faces.', 'corner'],
      ['Face', 'Un pentagone composé d’un centre, cinq arêtes et cinq coins.', 'solved']
    ],
    faces: [
      ['U', 'Dessus', 'La face tenue en haut, blanche au départ.', 'face'],
      ['F', 'Avant', 'La face qui regarde vers toi.', 'blank'],
      ['R', 'Droite', 'La face voisine à droite de F.', 'blank'],
      ['D', 'Dessous', 'La face encore libre lors des derniers algorithmes.', 'blank']
    ],
    moves: ['U', "U'", 'R', "R'", 'F', "F'", 'D', "D'"],
    moveName: { U: 'face du haut', R: 'face de droite', F: 'face avant', D: 'face du bas', L: 'face de gauche', B: 'face arrière', b: 'face entre R et B' },
    unit: '72°',
    note: 'Chaque lettre tourne une face d’un cran, soit 72°. L’apostrophe inverse le sens ; D D représente deux crans successifs. Pour la dernière face, L, F, R, b et B sont les cinq voisines de D : DF est une arête entre D et F, DFR un coin entre D, F et R.',
    stages: [
      ['etoile', 'star', 'Centre blanc et cinq arêtes blanches : les coins attendent encore.', ['Choisis le centre blanc comme face U et repère une arête blanche.', 'Lis sa deuxième couleur, puis amène-la entre les deux centres correspondants.', 'Répète cinq fois et vérifie les couleurs des côtés, pas seulement l’étoile.']],
      ['coins', 'corner', 'Coin blanc suivi entre U, R et F.', ['Repère le coin par ses trois couleurs et mets son emplacement libre en URF.', 'Amène le coin en RDF, sous cet emplacement, sans casser l’étoile.', 'Choisis la formule selon l’orientation du blanc et vérifie les trois côtés.']],
      ['couronnes', 'rings', 'Une couronne se construit en gardant les faces déjà résolues.', ['Place l’arête à insérer en DR ou FD selon son orientation.', 'Choisis la formule correspondante pour l’envoyer en FR.', 'Replace les coins de la couronne, puis tourne le puzzle vers la face voisine.']],
      ['orientation-aretes', 'orient-edges', 'Deux arêtes de D à retourner sont repérées en bleu.', ['Garde la dernière face en bas et place une arête retournée en DR.', 'Place l’autre en DF ou DL et utilise la formule correspondante.', 'Réévalue les cinq arêtes : une seule arête retournée est impossible.']],
      ['permutation-aretes', 'place-edges', 'Les arêtes sont orientées ; leurs emplacements sont à corriger.', ['Tourne D pour placer autant d’arêtes que possible.', 'Repère les positions à cycler en lisant leurs deux couleurs.', 'Choisis le cycle exact, exécute-le entièrement et contrôle les cinq arêtes.']],
      ['coins-finaux', 'place-corners', 'Repère les coins à placer avant de chercher leur orientation.', ['Compare les trois couleurs de chaque coin aux centres voisins.', 'Repère les coins mal placés sur la face D sans regarder leur orientation.', 'Choisis le cycle correspondant ; la rotation des coins viendra ensuite.']],
      ['orientation-coins', 'orient-corners', 'Dernière vérification : les coins sont placés, il reste à les tourner.', ['Mets en DFR un coin qui doit être tourné dans le sens antihoraire.', 'Repère le second coin à tourner dans le sens opposé et choisis la bonne formule.', 'Après la paire, tourne seulement D pour préparer la suivante.']]
    ]
  };

  function diagram(state, title, options = {}) {
    return puzzle === 'pyraminx' ? pyraminxDiagram(state, title, options) : megaminxDiagram(state, title, options);
  }

  function figure(state, caption, options = {}) {
    const fig = el('figure', { class: 'puzzle-figure' });
    fig.append(diagram(state, caption, options), el('figcaption', {}, caption));
    return fig;
  }

  function basics() {
    const article = el('article', { class: 'guide-card notation-guide puzzle-basics', id: 'bases' });
    article.append(el('h2', {}, 'Avant de commencer'));
    const intro = puzzle === 'pyraminx' ?
      'Repère les coins (petites pointes), les centres et les arêtes avant de suivre les quatre étapes. Une face est composée de neuf triangles.' :
      'Repère les pièces et le sens des tours avant de suivre les sept étapes. Le Mégaminx possède 12 faces, 30 arêtes et 20 coins.';
    article.append(el('p', { class: 'notation-intro' }, intro));
    const blocks = [
      ['Les termes utilisés', 'Le vocabulaire', 'Repère les pièces que tu vas suivre tout au long de la résolution.', config.terms],
      ['Les faces du puzzle', 'La position', puzzle === 'pyraminx' ?
        'Repère les trois faces latérales et la face du dessous ; pendant une formule, conserve ta prise.' :
        'La face désignée est mise en couleur ; pendant une formule, conserve ta prise.', config.faces]
    ];
    for (const [title, kicker, intro, items] of blocks) {
      const section = el('section', { class: 'notation-block' });
      const heading = el('div', { class: 'notation-block-heading' });
      const left = el('div');
      left.append(el('p', { class: 'notation-kicker' }, kicker), el('h3', {}, title));
      heading.append(left, el('p', {}, intro));
      section.append(heading);
      const grid = el('div', { class: title === 'Les termes utilisés' ? 'puzzle-basics-grid' : 'puzzle-faces-grid' });
      for (const item of items) {
        const [name, description, state] = item.length === 3 ? item : [item[0], item[2], item[3]];
        const card = el('div', { class: 'puzzle-basics-item' });
        if (puzzle === 'pyraminx' && title === 'Les termes utilisés') {
          card.append(pyraminxTermDiagram(state,
            `${name} du Pyraminx : les pièces concernées sont en orange, les autres en gris.`));
        } else if (puzzle === 'pyraminx' && title === 'Les faces du puzzle') {
          card.append(pyraminxFaceDiagram(name, name === 'D' ?
            'Face du dessous : neuf triangles jaunes visibles en transparence sous les faces latérales du Pyraminx.' :
            `${item[1]} : ${description}`));
        } else {
          card.append(diagram(state, `${name} : ${description}`,
            item.length === 4 ? { face: name, focusFace: name } : {}));
        }
        const copy = el('div');
        const nameNode = el('h4', {}, item.length === 4 ? `${item[0]} · ${item[1]}` : name);
        copy.append(nameNode, el('p', {}, description));
        card.append(copy);
        grid.append(card);
      }
      section.append(grid);
      article.append(section);
    }
    const rotation = el('section', { class: 'notation-block puzzle-rotation' });
    const heading = el('div', { class: 'notation-block-heading' });
    const left = el('div');
    left.append(el('p', { class: 'notation-kicker' }, 'La rotation'), el('h3', {}, 'Lire un mouvement'));
    heading.append(left, el('p', {}, `Regarde directement la ${puzzle === 'pyraminx' ? 'pointe du sommet' : 'face'} que tu tournes. Une lettre sans apostrophe signifie sens horaire ; avec apostrophe, sens antihoraire.`));
    rotation.append(heading);
    const grid = el('div', { class: 'puzzle-turn-grid' });
    for (const move of config.moves) {
      const base = move.replace("'", '');
      const reverse = move.endsWith("'");
      const card = el('div', { class: 'puzzle-turn' });
      const visual = el('div', { class: 'puzzle-turn-visual' });
      visual.append(diagram(puzzle === 'pyraminx' ? 'blank' : base === 'U' ? 'face' : 'blank',
        `${move} : ${config.moveName[base]}`, { move: base, face: base, focusFace: base }));
      visual.append(el('span', { class: 'puzzle-turn-arrow', 'aria-hidden': 'true' }, reverse ? '↺' : '↻'));
      const copy = el('div', { class: 'puzzle-turn-copy' });
      copy.append(el('strong', {}, move), el('span', {}, config.moveName[base]),
        el('small', {}, `${config.unit} · ${reverse ? 'antihoraire' : 'horaire'}`));
      card.append(visual, copy);
      grid.append(card);
    }
    rotation.append(grid, el('p', { class: 'tip-box' }, config.note));
    article.append(rotation);
    const guide = document.querySelector('.guide-content');
    guide?.insertBefore(article, document.querySelector('#avant'));
    const toc = document.querySelector('.guide-toc');
    toc?.insertBefore(el('a', { href: '#bases' }, 'Les repères'), toc.querySelector('a[href="#avant"]'));
    const original = document.querySelector('#avant > h2');
    if (original) {
      original.textContent = 'La méthode';
      original.insertAdjacentElement('afterend', el('p', {}, puzzle === 'pyraminx' ?
        'Les trois vues résument la progression de la première face, avant le choix du cas final.' :
        'Les trois vues résument la progression : première arête, étoile, puis dernière face.'));
      const overview = el('div', { class: 'puzzle-overview' });
      const views = puzzle === 'pyraminx' ? [
        ['tips', 'Pointes alignées'], ['vertices', 'Sommets orientés'], ['face', 'Première face complète']
      ] : [
        ['edge', 'Une arête repérée'], ['star', 'Étoile blanche'], ['orient-edges', 'Dernière face à orienter']
      ];
      for (const [state, caption] of views) {
        overview.append(figure(state, caption, { face: state === 'orient-edges' ? 'D' : 'U' }));
      }
      original.parentElement.querySelector('.guide-process')?.replaceWith(overview);
      for (const paragraph of original.parentElement.querySelectorAll(':scope > p:not(.tip-box)')) {
        if (paragraph.previousElementSibling !== original) paragraph.remove();
      }
    }
    const originalLink = toc?.querySelector('a[href="#avant"]');
    if (originalLink) originalLink.textContent = 'La méthode';
  }

  function addStages() {
    for (const [id, state, caption, tasks] of config.stages) {
      const article = document.getElementById(id);
      if (!article) continue;
      const visual = el('div', { class: 'puzzle-stage-visual' });
      const lastFace = ['orientation-aretes', 'permutation-aretes', 'coins-finaux', 'orientation-coins'].includes(id);
      visual.append(figure(state, caption, { face: lastFace ? 'D' : 'U' }));
      const actions = el('ol', { class: 'puzzle-stage-actions' });
      for (const task of tasks) actions.append(el('li', {}, task));
      visual.append(actions);
      article.querySelector('h2')?.insertAdjacentElement('afterend', visual);
    }
  }

  function addCaseDiagrams() {
    const articleIds = puzzle === 'pyraminx' ? ['derniere'] :
      ['orientation-aretes', 'permutation-aretes', 'coins-finaux', 'orientation-coins'];
    const cases = puzzle === 'pyraminx' ? {
      derniere: [
        [['FR', 'LF', 'RL'], true], [['FR', 'RL', 'LF'], true],
        [['FR', 'FL'], false], [['FR', 'FL', 'LR'], true], [['FR', 'LR', 'FL'], true]
      ]
    } : {
      'orientation-aretes': [[['DF', 'DR'], false], [['DL', 'DR'], false]],
      'permutation-aretes': [
        [['DR', 'DF', 'DL'], true], [['DR', 'DL', 'DF'], true],
        [['DR', 'DF', 'DB'], true], [['DR', 'DB', 'DF'], true],
        [['DR', 'DB', 'DF', 'DL'], false]
      ],
      'coins-finaux': [
        [['DFR', 'DLF', 'DBL'], true], [['DFR', 'DBL', 'DLF'], true],
        [['DFR', 'DLF', 'DbB'], true], [['DFR', 'DbB', 'DLF'], true],
        [['DFR', 'DbB', 'DLF', 'DBL'], false]
      ],
      'orientation-coins': [
        [['DFR', 'DLF'], false], [['DFR', 'DBL'], false],
        [['DFR', 'DbB'], false], [['DFR', 'DRb'], false]
      ]
    };
    for (const id of articleIds) {
      const list = document.querySelector(`#${id} > ul`);
      if (!list) continue;
      list.classList.add('puzzle-cases');
      [...list.children].forEach((item, index) => {
        const [positions, cycle] = cases[id][index];
        const title = `Cas ${index + 1} : ${positions.join(cycle ? ' vers ' : ' et ')}`;
        const drawing = caseDiagram([positions, cycle], title, id);
        drawing.classList.add('puzzle-case-diagram');
        item.insertBefore(drawing, item.firstChild);
      });
    }
    if (puzzle === 'pyraminx') {
      const list = document.querySelector('#derniere > ul');
      list?.insertAdjacentElement('afterend', el('p', { class: 'puzzle-case-note' },
        'Dans les repères, FR et RF désignent la même arête, mais pas la même orientation : la première lettre indique la couleur visible sur la première face. Même principe pour FL/LF et LR/RL.'));
    }
  }

  function decomposeMoves() {
    let first = true;
    for (const algorithm of document.querySelectorAll('.guide-content .algorithm')) {
      const tokens = algorithm.textContent.trim().split(/\s+/).filter(Boolean);
      if (!tokens.length || !tokens.every(token => /^[A-Za-z]'?$/.test(token))) continue;
      const details = el('details', { class: 'puzzle-move-details' });
      if (first) { details.open = true; first = false; }
      details.append(el('summary', {}, `Mouvements · ${tokens.length} étape${tokens.length > 1 ? 's' : ''}`));
      const list = el('ol', { class: 'puzzle-move-list' });
      for (const token of tokens) {
        const base = token.replace("'", '');
        const reverse = token.endsWith("'");
        const name = config.moveName[base] || `face ${base}`;
        const item = el('li');
        item.append(el('strong', {}, token), el('span', {}, name),
          el('small', {}, `${reverse ? '↺ Antihoraire' : '↻ Horaire'} · ${config.unit}`));
        list.append(item);
      }
      details.append(list);
      if (algorithm.tagName === 'P') algorithm.insertAdjacentElement('afterend', details);
      else algorithm.parentElement.append(details);
    }
  }

  basics();
  addStages();
  addCaseDiagrams();
  decomposeMoves();
})();
