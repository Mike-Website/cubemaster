(function () {
  "use strict";

  const moves = (algorithm) => algorithm.split(/\s+/);
  const centre = (axis, side) => [-1, 1].flatMap(first => [-1, 1].map(second =>
    axis === 'y' ? [first, side * 3, second] : axis === 'x' ? [side * 3, first, second] : [first, second, side * 3]
  ));
  const frontPair = [[-1, 3, 3], [1, 3, 3]];

  window.CubeMaster4Steps = [
    {
      mode: '4x4-centres',
      // Outer turns leave all centres united while the edges remain scrambled.
      resultMoves: moves("z2 R U F' L2 B D2"),
      endPhase: 'Les six centres sont formés',
      endDetail: 'Jaune en haut, blanc en bas · passe aux arêtes',
      inspectResult: true,
      chapters: [
        {
          title: '1 · Aligner les deux barres blanches', moves: moves('U2'),
          targets: [[-1, 3, -1], [-1, 3, 1], [1, -1, 3], [1, 1, 3]],
          result: 'Les deux barres occupent la même colonne',
          detail: 'Une barre en haut, une barre devant · à droite',
          resultTargets: [[1, 3, -1], [1, 3, 1], [1, -1, 3], [1, 1, 3]],
        },
        {
          title: '2 · Réunir le centre blanc', moves: moves("r U2 r'"),
          targets: [[1, 3, -1], [1, 3, 1], [1, -1, 3], [1, 1, 3]],
          result: 'Le centre blanc est complet en haut', detail: 'Quatre carrés blancs réunis',
          resultTargets: centre('y', 1),
        },
        {
          title: '3 · Terminer le centre jaune opposé', moves: moves("r' D2 r"),
          targets: [[1, 1, 3], [1, -1, 3]],
          result: 'Le jaune est complet en dessous', detail: 'Le centre blanc a été restauré',
          resultTargets: centre('y', -1),
        },
        {
          title: '4 · Blanc à gauche, jaune à droite', moves: moves("z' F"),
          targets: centre('y', 1), result: 'Les barres de couleur sont horizontales',
          detail: 'Blanc à gauche et jaune à droite restent protégés',
          resultTargets: centre('z', 1),
        },
        {
          title: '5 · Réunir les barres de couleur',
          moves: moves("F' r U2 r' x r U2 r' x r U2 r' x r U2 r' x"),
          targets: centre('z', 1),
          result: 'Les quatre autres centres sont unis', detail: 'Blanc et jaune sont restés sur les côtés',
          resultTargets: centre('z', 1),
        },
        {
          title: '6 · Vérifier l’ordre des six couleurs', moves: moves("z'"),
          targets: centre('x', 1), result: 'Centres jaune, rouge et vert correctement voisins',
          detail: 'Blanc en bas · les arêtes ne sont pas encore associées',
          resultTargets: centre('y', 1).concat(centre('z', 1), centre('x', 1)),
        },
      ],
    },
    {
      mode: '4x4-oll', resultMoves: [],
      endPhase: 'La parité OLL est corrigée', endDetail: 'La paire avant est orientée',
      chapters: [{
        title: 'La paire bleue–jaune est retournée devant',
        moves: moves("Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'"),
        targets: frontPair, result: 'La paire a retrouvé sa bonne orientation',
        detail: 'Dans cet exemple, la face jaune est complète', resultTargets: frontPair,
      }],
    },
    {
      mode: '4x4-pll', resultMoves: [],
      endPhase: 'La parité PLL est corrigée', endDetail: 'Les six faces sont unies dans cet exemple',
      inspectResult: true,
      chapters: [{
        title: 'Deux paires sont échangées : avant et arrière',
        moves: moves('r2 U2 r2 Uw2 r2 Uw2 U2'),
        targets: frontPair.concat([[-1, 3, -3], [1, 3, -3]]),
        result: 'Les deux paires ont retrouvé leur emplacement',
        detail: 'Le dernier U2 conserve la position des coins',
        resultTargets: frontPair.concat([[-1, 3, -3], [1, 3, -3]]),
      }],
    },
  ];
})();
