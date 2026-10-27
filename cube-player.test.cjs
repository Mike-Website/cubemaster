const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const THREE = require('./assets/vendor/three.min.js');

const source = fs.readFileSync(`${__dirname}/cube-player.js`, 'utf8')
  .replace('if (!players.length) return;', '')
  .replace(/\}\)\(\);\s*$/, 'window.testApi = { CubeStepPlayer, getMoveDefinition, invertAlgorithm, THREE_BY_THREE_STEPS, LAST_SWAP_ALGORITHM, STEP_TWO_SEQUENCE };})();');
const win = { THREE };
vm.runInNewContext(fs.readFileSync(`${__dirname}/cube4-scenes.js`, 'utf8'), { window: win });
vm.runInNewContext(source, { window: win, document: { querySelectorAll: () => [] } });
const { CubeStepPlayer, getMoveDefinition, invertAlgorithm } = win.testApi;

function player(size = 4, mode = '4x4-centres') {
  const instance = Object.create(CubeStepPlayer.prototype);
  Object.assign(instance, {
    size, mode, cubies: [], modelRoot: new THREE.Group(),
    cubieSize: size === 4 ? 0.46 : size === 3 ? 0.62 : 0.94,
    cubieOffset: size === 4 ? 0.25 : size === 3 ? 0.66 : 0.5,
    stage: { dataset: {} }, render() {},
  });
  instance.createCube();
  return instance;
}

const directions = [
  new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
];

function face(instance, axis, side, centresOnly = false) {
  const boundary = instance.size === 4 ? 3 : 1;
  const result = [];
  for (const cubie of instance.cubies) {
    const coordinate = cubie.userData.coordinate;
    if (coordinate[axis] !== side * boundary) continue;
    if (centresOnly && ['x', 'y', 'z'].filter(key => key !== axis).some(key => Math.abs(coordinate[key]) !== 1)) continue;
    cubie.userData.materials.forEach((material, index) => {
      const normal = directions[index].clone().applyQuaternion(cubie.quaternion).round();
      if (normal[axis] === side) result.push({ coordinate: coordinate.toArray(), color: material.color.getHexString() });
    });
  }
  return result;
}

async function run() {
  for (const size of [2, 3, 4]) {
    for (const move of ['R', 'L', 'U', 'D', 'F', 'B']) {
      const p = player(size);
      const before = p.captureCubieState();
      p.applySequenceInstantly([move, `${move}'`]);
      p.expectedResultState = before;
      assert(p.matchesExpectedResult(), `${size}x${size}: ${move} and inverse`);
      p.applySequenceInstantly([move, move, move, move]);
      assert(p.matchesExpectedResult(), `${size}x${size}: four quarter turns`);
    }
  }
  for (const move of ['r', 'l', 'u', 'd', 'f', 'b', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw', 'x', 'y', 'z']) {
    const p = player();
    const definition = getMoveDefinition(move, 4);
    const layer = p.prepareLayer(definition);
    assert.equal(layer.cubies.length, /^[xyz]$/.test(move) ? 64 : move.includes('w') ? 32 : 16, move);
    p.finishLayer(layer, { ...definition, angle: 0 });
    p.expectedResultState = p.captureCubieState();
    p.applySequenceInstantly([move, `${move}'`]);
    assert(p.matchesExpectedResult(), `4x4: ${move} and inverse`);
  }
  const p = player();
  assert.equal(p.cubies.length, 64);
  for (const axis of ['x', 'y', 'z']) {
    for (const side of [-1, 1]) {
      assert.equal(face(p, axis, side).length, 16);
      assert.equal(face(p, axis, side, true).length, 4);
    }
  }
  assert.equal(getMoveDefinition('nonsense', 4), null);
  for (const step of win.testApi.THREE_BY_THREE_STEPS) {
    const p = player(3, step.mode);
    p.step3x3 = step;
    p.algorithm = step.algorithm;
    p.createInitialSetup();
    assert.equal(p.stage.dataset.cubeValidated, 'true', `${step.mode}: original setup`);
    p.applySequenceInstantly(p.algorithm);
    assert(p.matchesExpectedResult(), `${step.mode}: original result`);
  }
  for (const mode of ['first-layer', 'quick-finish', 'yellow-orient', 'last-swap']) {
    const p = player(2, mode);
    p.repetitions = 3;
    p.algorithm = ['R', 'U', "R'", "U'"];
    p.createInitialSetup();
    assert.equal(p.stage.dataset.cubeValidated, 'true', `${mode}: original setup`);
    const sequence = mode === 'yellow-orient' ? win.testApi.STEP_TWO_SEQUENCE : mode === 'last-swap' ? win.testApi.LAST_SWAP_ALGORITHM : Array.from({ length: 3 }, () => p.algorithm).flat();
    p.applySequenceInstantly(sequence);
    if (mode === 'quick-finish') p.applyMoveInstantly("U'");
    assert(p.matchesExpectedResult(), `${mode}: original result`);
  }
  for (const step of win.CubeMaster4Steps) {
    const p = player(4, step.mode);
    Object.assign(p, {
      step4x4: step, algorithm: step.chapters.flatMap(chapter => chapter.moves),
      prefersReducedMotion: true, initialCameraPosition: new THREE.Vector3(4.8, 4.25, 6.5),
      camera: new THREE.PerspectiveCamera(), currentMove: { textContent: '' },
      phase: { textContent: '' }, repeat: { textContent: '' }, progress: { style: {} },
    });
    p.stage.removeAttribute = () => {};
    p.createInitialSetup();
    const distinct = () => new Set(p.cubies.map(cubie => cubie.userData.coordinate.toArray().join(','))).size;
    assert.equal(distinct(), 64, `${step.mode}: no duplicate locations`);
    if (step.mode === '4x4-centres') {
      assert.deepEqual(face(p, 'y', 1, true).filter(square => square.color === 'ffffff').map(square => square.coordinate[0]).sort(), [-1, -1]);
      assert.deepEqual(face(p, 'z', 1, true).filter(square => square.color === 'ffffff').map(square => square.coordinate[0]).sort(), [1, 1]);
      const checkpoints = player(4, step.mode);
      checkpoints.step4x4 = step;
      checkpoints.algorithm = p.algorithm;
      checkpoints.createInitialSetup();
      step.chapters.forEach((chapter, index) => {
        checkpoints.applySequenceInstantly(chapter.moves);
        if (index === 1 || index === 2) assert(face(checkpoints, 'y', 1, true).every(square => square.color === 'ffffff'));
        if (index === 2) assert(face(checkpoints, 'y', -1, true).every(square => square.color === 'ffdb24'));
        if (index >= 3 && index <= 4) {
          assert(face(checkpoints, 'x', -1, true).every(square => square.color === 'ffffff'));
          assert(face(checkpoints, 'x', 1, true).every(square => square.color === 'ffdb24'));
        }
        if (index === 3) {
          assert(face(checkpoints, 'z', 1, true).filter(square => square.coordinate[1] === 1).every(square => square.color === '22bd4f'));
          assert(face(checkpoints, 'z', 1, true).filter(square => square.coordinate[1] === -1).every(square => square.color === '315bd4'));
        }
      });
    } else {
      for (const axis of ['x', 'y', 'z']) for (const side of [-1, 1]) {
        assert.equal(new Set(face(p, axis, side, true).map(square => square.color)).size, 1, `${step.mode}: centre remains united`);
      }
      if (step.mode === '4x4-pll') {
        assert(face(p, 'y', 1).every(square => square.color === 'ffdb24'));
        assert.equal(face(p, 'z', 1).filter(square => square.color === 'ff641a').length, 2);
        assert.equal(face(p, 'z', -1).filter(square => square.color === 'f43d45').length, 2);
      } else {
        const front = face(p, 'z', 1);
        assert(front.filter(square => square.coordinate[1] === 3 && Math.abs(square.coordinate[0]) === 1).every(square => square.color === 'ffdb24'));
      }
    }
    const animated = [];
    const animate = p.animateMove;
    p.animateMove = function (move) { animated.push(move); return animate.call(this, move); };
    await p.playFourByFourStep();
    assert(p.matchesExpectedResult(), `${step.mode}: animation reaches its expected result`);
    assert.equal(distinct(), 64);
    assert.equal(animated.length, p.algorithm.reduce((count, move) => count + (move.includes('2') ? 2 : 1), 0));
    assert.equal(p.stage.dataset.cubeResultValidated, 'true');
    for (const axis of ['x', 'y', 'z']) for (const side of [-1, 1]) {
      assert.equal(new Set(face(p, axis, side, true).map(square => square.color)).size, 1, `${step.mode}: final centres`);
      if (step.mode !== '4x4-centres') assert.equal(new Set(face(p, axis, side).map(square => square.color)).size, 1, `${step.mode}: six faces solved`);
    }
    console.log(`${step.mode}: starting case, centre preservation, animated halves and final state passed.`);
  }
  // Check both pairing cases against physically generated wing positions.
  for (const [algorithm, rightHeight] of [["u L' U' L u'", 1], ["d' L' U' L d", -1]]) {
    const p = player(4, '4x4-pll');
    p.applySequenceInstantly(['R', 'U', "R'"]);
    p.expectedResultState = p.captureCubieState();
    p.applySequenceInstantly(invertAlgorithm(algorithm.split(' ')));
    const pair = p.cubies.filter(cubie => {
      const colors = cubie.userData.materials.map(material => material.color.getHexString()).filter(color => color !== '111318');
      return colors.length === 2 && colors.includes('f43d45') && colors.includes('22bd4f');
    }).map(cubie => cubie.userData.coordinate.toArray().join(','));
    assert(pair.includes(`3,${rightHeight},3`));
    assert(pair.includes(`-3,${-rightHeight},3`));
    p.applySequenceInstantly(algorithm.split(' '));
    assert(p.matchesExpectedResult());
  }
  const moving = player(4, '4x4-pll');
  moving.prefersReducedMotion = false;
  moving.isPlaying = true;
  moving.stage.removeAttribute = () => {};
  const frames = [];
  win.requestAnimationFrame = callback => frames.push(callback);
  const animation = moving.animateMove('Rw');
  frames.shift()(0);
  frames.shift()(64);
  const pivot = moving.modelRoot.children.find(child => !child.userData.coordinate);
  const angle = pivot.rotation.x;
  moving.pause();
  frames.shift()(128);
  assert.equal(pivot.rotation.x, angle, 'pause freezes the rotating layer');
  moving.resume();
  let time = 128;
  while (frames.length) {
    frames.shift()(time += 64);
    moving.modelRoot.updateMatrixWorld(true);
    const centroid = pivot.children.reduce((sum, cubie) => sum.add(cubie.getWorldPosition(new THREE.Vector3())), new THREE.Vector3()).divideScalar(32);
    assert(Math.abs(centroid.x - 0.5) < 1e-8 && Math.abs(centroid.y) < 1e-8 && Math.abs(centroid.z) < 1e-8, 'wide layer rotates around its fixed centre without drifting');
  }
  await animation;
  assert.equal(moving.modelRoot.children.length, 64);
  console.log('Playback: pause/resume and fixed rotation centre passed.');
  console.log('Cube players: 2x2/3x3 regressions, 4x4 slices, wide turns and rotations passed.');
}

if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { player, face, invertAlgorithm, getMoveDefinition, run };
