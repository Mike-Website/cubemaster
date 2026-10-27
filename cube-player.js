(function () {
  "use strict";

  const THREE = window.THREE;
  const players = document.querySelectorAll("[data-cube-player]");

  if (!players.length) return;

  if (!THREE) {
    players.forEach(showUnavailablePlayer);
    return;
  }

  const COLORS = {
    black: 0x111318,
    blue: 0x315bd4,
    green: 0x22bd4f,
    orange: 0xff641a,
    red: 0xf43d45,
    white: 0xffffff,
    yellow: 0xffdb24,
  };
  const CUBIE_SIZE = 0.94;
  const CUBIE_OFFSET = 0.5;
  const QUARTER_TURN = Math.PI / 2;
  const MOVE_DURATION = 840;
  const MOVE_PAUSE = 240;
  const DOUBLE_TURN_PAUSE = 560;
  const REPETITION_PAUSE = 720;
  const OUTLINE_FADE_DURATION = 560;
  const CAMERA_INSPECTION_DURATION = 1800;
  const INSERTION_ALGORITHM = ["R", "U", "R'", "U'"];
  const STEP_TWO_REPETITIONS = [2, 4, 2, 4];
  const STEP_TWO_SEQUENCE = createStepTwoSequence();
  const STEP_TWO_TARGET_ALGORITHM = parseAlgorithm("L D L' D' L' F L2 D' L' D' L D L' F'");
  const LAST_SWAP_ALGORITHM = parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'");
  const FIRST_LAYER_RESULT_SEQUENCE = mapAlgorithmForFrontFlip([
    ...STEP_TWO_TARGET_ALGORITHM,
    ...invertAlgorithm(STEP_TWO_SEQUENCE),
  ]);
  const THREE_BY_THREE_STEPS = [
    {
      mode: "3x3-cross",
      algorithm: parseAlgorithm("F2"),
      target: new THREE.Vector3(0, -1, 1),
      startPhase: "Une arête blanche est alignée avec son centre",
      startDetail: "La face blanche reste en dessous",
      endPhase: "La croix blanche est terminée",
      endDetail: "Les quatre couleurs latérales correspondent aux centres",
      resultView: true,
    },
    {
      mode: "3x3-white-corner",
      algorithm: parseAlgorithm("R U R' U'"),
      target: new THREE.Vector3(1, -1, 1),
      startPhase: "Le coin blanc–rouge–vert est au-dessus de sa place",
      startDetail: "Croix blanche conservée en dessous",
      endPhase: "Le coin blanc est inséré",
      endDetail: "La première couche progresse sans casser la croix",
    },
    {
      mode: "3x3-middle-right",
      algorithm: parseAlgorithm("U R U' R' U' F' U F"),
      target: new THREE.Vector3(1, 0, 1),
      startPhase: "L’arête rouge–verte doit partir à droite",
      startDetail: "Aucun carré jaune sur cette arête",
      endPhase: "L’arête est insérée au deuxième étage",
      endDetail: "Les deux premiers étages sont terminés",
    },
    {
      mode: "3x3-yellow-cross",
      algorithm: parseAlgorithm("F R U R' U' F'"),
      target: new THREE.Vector3(0, 1, 1),
      startPhase: "Le motif jaune est orienté face à toi",
      startDetail: "Applique l’algorithme sans changer la prise",
      endPhase: "La croix jaune est formée",
      endDetail: "Les coins jaunes restent à orienter",
    },
    {
      mode: "3x3-yellow-face",
      algorithm: parseAlgorithm("R U R' U R U2 R'"),
      target: new THREE.Vector3(1, 1, 1),
      startPhase: "Le poisson jaune est placé dans le bon sens",
      startDetail: "Le coin repéré reste devant à droite",
      endPhase: "Toute la face jaune est orientée",
      endDetail: "Il reste à placer les pièces du dernier étage",
    },
    {
      mode: "3x3-final",
      algorithm: parseAlgorithm("F' L F' R2 F L' F' R2 F2 F2 U L R' F2 L' R U F2"),
      target: new THREE.Vector3(1, 1, 1),
      startPhase: "Les pièces jaunes sont orientées mais mal placées",
      startDetail: "Commence par positionner les coins",
      middlePhase: "Les coins sont placés",
      middleDetail: "Positionne maintenant les quatre arêtes",
      endPhase: "Le Rubik’s Cube 3x3 est résolu",
      endDetail: "Les six faces sont unies",
      splitAt: 9,
      secondTarget: new THREE.Vector3(0, 1, 1),
    },
  ];

  function CubeStepPlayer(element) {
    this.element = element;
    this.stage = element.querySelector("[data-cube-stage]");
    this.toggleButton = element.querySelector("[data-cube-toggle]");
    this.toggleIcon = element.querySelector("[data-cube-toggle-icon]");
    this.currentMove = element.querySelector("[data-cube-current-move]");
    this.phase = element.querySelector("[data-cube-phase]");
    this.repeat = element.querySelector("[data-cube-repeat]");
    this.progress = element.querySelector("[data-cube-progress]");
    this.mode = element.dataset.playerMode || "first-layer";
    this.step3x3 = getThreeByThreeStep(this.mode);
    this.step4x4 = (window.CubeMaster4Steps || []).find((step) => step.mode === this.mode);
    this.size = Number(element.dataset.size) || (this.step3x3 ? 3 : 2);
    this.cubieSize = this.size === 4 ? 0.46 : this.size === 3 ? 0.62 : CUBIE_SIZE;
    this.cubieOffset = this.size === 4 ? 0.25 : this.size === 3 ? 0.66 : CUBIE_OFFSET;
    this.repetitions = Number(element.dataset.repetitions) || 3;
    this.algorithm = parseAlgorithm(element.dataset.algorithm);
    if (this.step4x4) this.algorithm = this.step4x4.chapters.flatMap((chapter) => chapter.moves);
    this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.isPlaying = false;
    this.isPaused = false;
    this.cubies = [];
    this.initialState = [];
    this.initialCameraPosition = getInitialCameraPosition(this.mode);
    this.resultCameraPosition = new THREE.Vector3(4.8, -4.25, 6.5);
    this.expectedResultState = [];

    if (!this.stage || !this.toggleButton) return;

    try {
      this.createScene();
      this.createCube();
      this.createInitialSetup();
      this.initialTargetCubie = this.targetCubie;
      this.captureInitialState();
      this.bindEvents();
      this.updatePlaybackControl();
      this.resize();
      this.render();
      this.validateRenderedPixels();
    } catch (error) {
      console.error("CubeMaster 3D player:", error);
      this.showUnavailable();
    }
  }

  CubeStepPlayer.prototype.createScene = function () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    this.camera.position.copy(this.initialCameraPosition);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.renderer.domElement.setAttribute("data-cube-canvas", "");
    this.stage.prepend(this.renderer.domElement);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xaeb7ca, 1.15);
    this.scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
    keyLight.position.set(5, 8, 7);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb9c7ff, 0.45);
    fillLight.position.set(-5, 1, 4);
    this.scene.add(fillLight);

    this.modelRoot = new THREE.Group();
    this.modelRoot.rotation.y = -0.04;
    this.scene.add(this.modelRoot);
    this.initialModelRotation = this.modelRoot.rotation.clone();
  };

  CubeStepPlayer.prototype.createCube = function () {
    const targetHomeCoordinate = getTargetHomeCoordinate(this.mode);
    const coordinates = this.size === 4 ? [-3, -1, 1, 3] : this.size === 3 ? [-1, 0, 1] : [-1, 1];

    coordinates.forEach((x) => {
      coordinates.forEach((y) => {
        coordinates.forEach((z) => {
          const coordinate = new THREE.Vector3(x, y, z);
          const isTarget = coordinate.equals(targetHomeCoordinate);
          const cubie = this.createCubie(coordinate, isTarget);

          cubie.position.copy(coordinate).multiplyScalar(this.cubieOffset);
          cubie.userData.coordinate = coordinate.clone();
          cubie.userData.homeCoordinate = coordinate.clone();
          cubie.userData.isTarget = isTarget;
          cubie.userData.cubieSize = this.cubieSize;
          this.modelRoot.add(cubie);
          this.cubies.push(cubie);

          if (isTarget) this.targetCubie = cubie;
        });
      });
    });

    this.stage.dataset.cubieCount = String(this.cubies.length);
  };

  CubeStepPlayer.prototype.createCubie = function (coordinate, isTarget) {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(this.cubieSize, this.cubieSize, this.cubieSize);
    const faceColors = getFaceColors(this.mode);
    const boundary = this.size === 4 ? 3 : 1;
    const materials = [
      this.createFaceMaterial(coordinate.x === boundary ? faceColors.xPositive : COLORS.black, isTarget && coordinate.x === boundary),
      this.createFaceMaterial(coordinate.x === -boundary ? faceColors.xNegative : COLORS.black, isTarget && coordinate.x === -boundary),
      this.createFaceMaterial(coordinate.y === boundary ? faceColors.yPositive : COLORS.black, isTarget && coordinate.y === boundary),
      this.createFaceMaterial(coordinate.y === -boundary ? faceColors.yNegative : COLORS.black, isTarget && coordinate.y === -boundary),
      this.createFaceMaterial(coordinate.z === boundary ? faceColors.zPositive : COLORS.black, isTarget && coordinate.z === boundary),
      this.createFaceMaterial(coordinate.z === -boundary ? faceColors.zNegative : COLORS.black, isTarget && coordinate.z === -boundary),
    ];
    const mesh = new THREE.Mesh(geometry, materials);
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edges = new THREE.LineSegments(
      edgeGeometry,
      new THREE.LineBasicMaterial({ color: COLORS.black })
    );

    group.add(mesh);
    group.add(edges);
    group.userData.materials = materials;

    if (isTarget) {
      const targetOutline = createTargetOutline(this.cubieSize);
      group.add(targetOutline);
      group.userData.targetOutline = targetOutline;
    }

    return group;
  };

  CubeStepPlayer.prototype.createFaceMaterial = function (color, isTargetSticker) {
    const isInternalFace = color === COLORS.black;
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.02,
      roughness: isInternalFace ? 0.88 : 0.58,
    });

    if (isTargetSticker) {
      material.userData.isTargetSticker = true;
    }

    return material;
  };

  CubeStepPlayer.prototype.createInitialSetup = function () {
    this.stage.dataset.cubeMode = this.mode;

    if (this.step4x4) {
      this.applySequenceInstantly(this.step4x4.resultMoves || []);
      this.expectedResultState = this.captureCubieState();
      this.applySequenceInstantly(invertAlgorithm(this.algorithm));
      this.stage.dataset.cubeValidated = String(this.size === 4 && this.cubies.length === 64);
      return;
    }

    if (this.step3x3) {
      this.createThreeByThreeSetup();
      return;
    }

    if (this.mode === "yellow-orient") {
      this.createYellowOrientationSetup();
      return;
    }

    if (this.mode === "last-swap") {
      this.createLastSwapSetup();
      return;
    }

    if (this.mode === "quick-finish") {
      this.createQuickFinishSetup();
      return;
    }

    this.createFirstLayerSetup();
  };

  CubeStepPlayer.prototype.applySequenceInstantly = function (moves) {
    moves.forEach((move) => this.applyMoveInstantly(move));
  };

  CubeStepPlayer.prototype.createThreeByThreeSetup = function () {
    const stepIndex = THREE_BY_THREE_STEPS.indexOf(this.step3x3);
    const followingMoves = THREE_BY_THREE_STEPS
      .slice(stepIndex + 1)
      .flatMap((step) => step.algorithm);

    this.applySequenceInstantly(invertAlgorithm(followingMoves));
    this.expectedResultState = this.captureCubieState();
    this.applySequenceInstantly(invertAlgorithm(this.algorithm));
    this.targetCubie = this.findCubieByHomeCoordinate(this.step3x3.target);
    this.stage.dataset.cubeValidated = String(
      this.size === 3 &&
      this.cubies.length === 27 &&
      algorithmsMatch(this.algorithm, this.step3x3.algorithm) &&
      Boolean(this.targetCubie)
    );
  };

  CubeStepPlayer.prototype.createFirstLayerSetup = function () {
    this.applySequenceInstantly(FIRST_LAYER_RESULT_SEQUENCE);
    this.expectedResultState = this.captureCubieState();
    this.applySequenceInstantly(invertAlgorithm(repeatMoves(INSERTION_ALGORITHM, this.repetitions)));
    this.targetCubie = this.findCubieByHomeCoordinate(new THREE.Vector3(1, -1, 1));
    this.stage.dataset.cubeValidated = String(this.validateTargetStart());
  };

  CubeStepPlayer.prototype.createQuickFinishSetup = function () {
    this.expectedResultState = this.captureCubieState();
    this.applyMoveInstantly("U");
    this.applySequenceInstantly(invertAlgorithm(repeatMoves(INSERTION_ALGORITHM, this.repetitions)));
    this.targetCubie = this.findCubieByHomeCoordinate(new THREE.Vector3(1, -1, 1));
    this.stage.dataset.cubeValidated = String(this.validateTargetStart());
  };

  CubeStepPlayer.prototype.createYellowOrientationSetup = function () {
    this.applySequenceInstantly(STEP_TWO_TARGET_ALGORITHM);
    this.expectedResultState = this.captureCubieState();
    this.applySequenceInstantly(invertAlgorithm(STEP_TWO_SEQUENCE));
    this.setTargetCubieAtCoordinate(new THREE.Vector3(1, -1, 1));
    this.initialTargetCubie = this.targetCubie;
    this.stage.dataset.cubeValidated = String(this.validateYellowOrientationStart());
  };

  CubeStepPlayer.prototype.createLastSwapSetup = function () {
    this.expectedResultState = this.captureCubieState();
    this.applySequenceInstantly(LAST_SWAP_ALGORITHM);
    this.targetCubie = this.findCubieByHomeCoordinate(new THREE.Vector3(1, 1, -1));
    this.stage.dataset.cubeValidated = String(this.validateLastSwapStart());
  };

  CubeStepPlayer.prototype.captureCubieState = function () {
    return this.cubies.map((cubie) => ({
      coordinate: cubie.userData.coordinate.clone(),
      quaternion: cubie.quaternion.clone(),
    }));
  };

  CubeStepPlayer.prototype.matchesExpectedResult = function () {
    return this.expectedResultState.length === this.cubies.length && this.cubies.every((cubie, index) => {
      const expected = this.expectedResultState[index];
      return cubie.userData.coordinate.equals(expected.coordinate) && cubie.quaternion.angleTo(expected.quaternion) < 0.001;
    });
  };

  CubeStepPlayer.prototype.validateYellowOrientationStart = function () {
    const whiteLayerIsSolved = this.cubies
      .filter((cubie) => cubie.userData.homeCoordinate.y === 1)
      .every((cubie) => isCubieSolved(cubie));
    const yellowCornersNeedOrientation = this.cubies
      .filter((cubie) => cubie.userData.homeCoordinate.y === -1)
      .every((cubie) => !getStickerDirection(cubie, new THREE.Vector3(0, -1, 0)).equals(new THREE.Vector3(0, -1, 0)));

    return whiteLayerIsSolved && yellowCornersNeedOrientation;
  };

  CubeStepPlayer.prototype.validateLastSwapStart = function () {
    const yellowIsOnTop = this.cubies
      .filter((cubie) => cubie.userData.homeCoordinate.y === 1)
      .every((cubie) => getStickerDirection(cubie, new THREE.Vector3(0, 1, 0)).equals(new THREE.Vector3(0, 1, 0)));
    const whiteLayerIsSolved = this.cubies
      .filter((cubie) => cubie.userData.homeCoordinate.y === -1)
      .every((cubie) => isCubieSolved(cubie));
    const blueFaceIsSolved = this.cubies
      .filter((cubie) => cubie.userData.coordinate.x === -1)
      .every((cubie) => getStickerDirection(cubie, new THREE.Vector3(-1, 0, 0)).equals(new THREE.Vector3(-1, 0, 0)));
    const trackedCornerIsCorrect = this.targetCubie &&
      this.targetCubie.userData.coordinate.equals(new THREE.Vector3(1, 1, 1)) &&
      getStickerDirection(this.targetCubie, new THREE.Vector3(1, 0, 0)).equals(new THREE.Vector3(0, 0, 1));

    return yellowIsOnTop && whiteLayerIsSolved && blueFaceIsSolved && trackedCornerIsCorrect;
  };

  CubeStepPlayer.prototype.validateTargetStart = function () {
    if (!this.targetCubie) return false;

    const coordinate = this.targetCubie.userData.coordinate;
    const whiteDirection = new THREE.Vector3(0, -1, 0)
      .applyQuaternion(this.targetCubie.quaternion)
      .round();
    const redDirection = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(this.targetCubie.quaternion)
      .round();
    const greenDirection = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(this.targetCubie.quaternion)
      .round();

    return (
      coordinate.equals(new THREE.Vector3(1, 1, 1)) &&
      whiteDirection.equals(new THREE.Vector3(0, 1, 0)) &&
      redDirection.equals(new THREE.Vector3(1, 0, 0)) &&
      greenDirection.equals(new THREE.Vector3(0, 0, 1))
    );
  };

  CubeStepPlayer.prototype.captureInitialState = function () {
    this.initialState = this.cubies.map((cubie) => ({
      coordinate: cubie.userData.coordinate.clone(),
      position: cubie.position.clone(),
      quaternion: cubie.quaternion.clone(),
    }));
  };

  CubeStepPlayer.prototype.reset = function () {
    this.cubies.forEach((cubie, index) => {
      const state = this.initialState[index];
      cubie.userData.coordinate.copy(state.coordinate);
      cubie.position.copy(state.position);
      cubie.quaternion.copy(state.quaternion);
      cubie.scale.set(1, 1, 1);
      hideTargetOutline(cubie);
    });

    this.targetCubie = this.initialTargetCubie;
    this.camera.position.copy(this.initialCameraPosition);
    this.camera.lookAt(0, 0, 0);
    this.modelRoot.rotation.copy(this.initialModelRotation);
    this.isPaused = false;
    this.setTargetOutlineOpacity(0);
    if (this.step4x4) {
      this.setPhase(this.step4x4.chapters[0].title, "Prêt à démarrer");
      this.setCurrentMove("Départ");
    } else if (this.step3x3) {
      this.setPhase(this.step3x3.startPhase, "Prêt à démarrer");
      this.setCurrentMove(this.algorithm.join(" "));
    } else if (this.mode === "yellow-orient") {
      this.setPhase("Face blanche en haut", "Prêt à démarrer");
      this.setCurrentMove("R U R' U' · 4 coins");
    } else if (this.mode === "last-swap") {
      this.setPhase("Face bleue résolue à gauche", "Prêt à démarrer");
      this.setCurrentMove(LAST_SWAP_ALGORITHM.join(" "));
    } else if (this.mode === "quick-finish") {
      this.setPhase("Coin au-dessus de son emplacement", "Prêt à démarrer");
      this.setCurrentMove(this.algorithm.join(" ") + " ×" + this.repetitions + " · U'");
    } else {
      this.setPhase("Coin au-dessus de son emplacement", "Prêt à démarrer");
      this.setCurrentMove(this.algorithm.join(" ") + " ×" + this.repetitions);
    }
    this.setProgress(0);
    this.stage.dataset.cubeState = "ready";
    this.render();
  };

  CubeStepPlayer.prototype.bindEvents = function () {
    this.toggleButton.addEventListener("click", () => {
      if (!this.isPlaying) {
        this.play();
      } else if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    });

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.stage);
    } else {
      window.addEventListener("resize", () => this.resize());
    }
  };

  CubeStepPlayer.prototype.pause = function () {
    if (!this.isPlaying || this.isPaused) return;

    this.isPaused = true;
    this.stage.dataset.cubeState = "paused";
    this.updatePlaybackControl();
  };

  CubeStepPlayer.prototype.resume = function () {
    if (!this.isPlaying || !this.isPaused) return;

    this.isPaused = false;
    this.stage.dataset.cubeState = "playing";
    this.updatePlaybackControl();
  };

  CubeStepPlayer.prototype.updatePlaybackControl = function () {
    if (!this.toggleButton || !this.toggleIcon) return;

    let icon = "▶";
    let label = "Lire l’animation";

    if (this.isPlaying && !this.isPaused) {
      icon = "⏸";
      label = "Mettre en pause";
    } else if (this.isPlaying && this.isPaused) {
      label = "Reprendre l’animation";
    } else if (this.stage.dataset.cubeState === "complete") {
      label = "Relancer l’animation";
    }

    this.toggleIcon.textContent = icon;
    this.toggleButton.setAttribute("aria-label", label);
    this.toggleButton.setAttribute("title", label);
    this.toggleButton.setAttribute("aria-pressed", String(this.isPaused));
  };

  CubeStepPlayer.prototype.play = async function () {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.reset();
    this.stage.dataset.cubeState = "playing";
    this.updatePlaybackControl();

    if (this.step4x4) {
      await this.playFourByFourStep();
    } else if (this.step3x3) {
      await this.playThreeByThreeStep();
    } else if (this.mode === "yellow-orient") {
      await this.playYellowOrientationStep();
    } else if (this.mode === "last-swap") {
      await this.playLastSwapStep();
    } else if (this.mode === "quick-finish") {
      await this.playQuickFinishStep();
    } else {
      await this.playFirstLayerStep();
    }

    this.stage.dataset.cubeState = "complete";
    this.isPlaying = false;
    this.isPaused = false;
    this.updatePlaybackControl();
  };

  CubeStepPlayer.prototype.setFourByFourTargets = function (coordinates) {
    this.cubies.forEach(hideTargetOutline);
    this.trackedCubies = (coordinates || []).map((coordinate) =>
      this.cubies.find((cubie) => cubie.userData.coordinate.equals(new THREE.Vector3(...coordinate)))
    ).filter(Boolean);
    this.targetCubie = this.trackedCubies[0];
  };

  CubeStepPlayer.prototype.animateFourByFourOutline = function (opacity) {
    return Promise.all((this.trackedCubies || []).map((cubie) => {
      const outline = ensureTargetOutline(cubie);
      const material = outline.userData.material;
      const startOpacity = material.opacity;
      outline.visible = true;
      return tween(this, this.prefersReducedMotion ? 0 : OUTLINE_FADE_DURATION, (progress) => {
        material.opacity = startOpacity + (opacity - startOpacity) * easeInOutCubic(progress);
        this.render();
      }).then(() => { outline.visible = opacity > 0; });
    }));
  };

  CubeStepPlayer.prototype.playFourByFourStep = async function () {
    let completedMoves = 0;
    for (const [index, chapter] of this.step4x4.chapters.entries()) {
      this.setPhase(chapter.title, "Séquence " + (index + 1) + " sur " + this.step4x4.chapters.length);
      this.setCurrentMove("Départ");
      this.setFourByFourTargets(chapter.targets);
      await this.animateFourByFourOutline(1);
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1600);
      await this.animateFourByFourOutline(0);
      for (const move of chapter.moves) {
        await this.animateTeachingMove(move);
        completedMoves += 1;
        this.setProgress(completedMoves / this.algorithm.length * 100);
        await pauseAwareWait(this, this.prefersReducedMotion ? 0 : MOVE_PAUSE);
      }
      this.setPhase(chapter.result, chapter.detail);
      this.setFourByFourTargets(chapter.resultTargets);
      await this.animateFourByFourOutline(1);
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1800);
    }
    this.stage.dataset.cubeResultValidated = String(this.matchesExpectedResult());
    this.setPhase(this.step4x4.endPhase, this.step4x4.endDetail);
    this.setCurrentMove("✓");
    if (this.step4x4.inspectResult) await this.animateCameraInspection();
  };

  CubeStepPlayer.prototype.playThreeByThreeStep = async function () {
    const step = this.step3x3;
    const totalMoves = this.algorithm.length;
    let completedMoves = 0;

    this.setPhase(step.startPhase, step.startDetail);
    this.setCurrentMove("Départ");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 650);
    await this.animateTargetOutline(1);
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1100);
    await this.animateTargetOutline(0);

    for (let moveIndex = 0; moveIndex < this.algorithm.length; moveIndex += 1) {
      if (step.splitAt === moveIndex) {
        this.setPhase(step.middlePhase, step.middleDetail);
        this.setTargetCubieAtCoordinate(step.secondTarget);
        await this.animateTargetOutline(1);
        await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 900);
        await this.animateTargetOutline(0);
      }

      await this.animateTeachingMove(this.algorithm[moveIndex]);
      completedMoves += 1;
      this.setProgress((completedMoves / totalMoves) * 100);
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : MOVE_PAUSE);
    }

    this.stage.dataset.cubeResultValidated = String(this.matchesExpectedResult());
    if (step.secondTarget) {
      this.setTargetCubieAtCoordinate(step.secondTarget);
    } else {
      this.setTargetCubieByHomeCoordinate(step.target);
    }
    await this.animateTargetOutline(1);
    this.setCurrentMove("✓");
    this.setPhase(step.endPhase, step.endDetail);

    if (step.resultView) {
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 900);
      await this.animateCameraToResult();
    } else if (step.inspectResult) {
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 900);
      await this.animateCameraInspection();
    } else {
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1500);
    }
  };

  CubeStepPlayer.prototype.playFirstLayerStep = async function () {
    this.setPhase("Le coin blanc–rouge–vert est aligné", "Repère le coin suivi");
    this.setCurrentMove("Départ");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 650);
    await this.animateTargetOutline(1);
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1250);
    await this.animateTargetOutline(0);
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 420);

    const totalMoves = this.algorithm.length * this.repetitions + 1;
    let completedMoves = 0;

    for (let repetition = 1; repetition <= this.repetitions; repetition += 1) {
      this.setPhase("R U R' U'", "Répétition " + repetition + " sur " + this.repetitions);

      for (const move of this.algorithm) {
        this.setCurrentMove(move);
        await this.animateMove(move);
        completedMoves += 1;
        this.setProgress((completedMoves / totalMoves) * 100);
        await pauseAwareWait(this, this.prefersReducedMotion ? 0 : MOVE_PAUSE);
      }

      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : REPETITION_PAUSE);
    }

    this.stage.dataset.cubeResultValidated = String(this.matchesExpectedResult());
    this.setTargetCubieAtCoordinate(new THREE.Vector3(1, -1, 1));
    await this.animateTargetOutline(1);
    this.setPhase("La première couche est terminée", "Retourne le cube pour l’étape 2");
    this.setCurrentMove("180°");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 620);
    await this.animateModelFlip(false);
    completedMoves += 1;
    this.setProgress(100);
    this.setCurrentMove("✓");
    this.setPhase("Face blanche en haut, jaune en bas", "Position de départ de l’étape 2");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1450);
    this.setPhase("Première couche terminée", "Étape 1 validée");
  };

  CubeStepPlayer.prototype.playQuickFinishStep = async function () {
    const totalMoves = this.algorithm.length * this.repetitions + 1;
    let completedMoves = 0;

    this.setPhase("Observe les trois faces cachées", "Dos, gauche et dessous");
    this.setCurrentMove("Vue opposée");
    await this.animateCameraInspection();

    this.setPhase("Le coin blanc–rouge–vert est aligné", "Cas particulier");
    this.setCurrentMove("Départ");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 650);
    await this.animateTargetOutline(1);
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1150);
    await this.animateTargetOutline(0);

    for (let repetition = 1; repetition <= this.repetitions; repetition += 1) {
      this.setPhase("R U R' U'", "Répétition " + repetition + " sur " + this.repetitions);
      for (const move of this.algorithm) {
        this.setCurrentMove(move);
        await this.animateMove(move);
        completedMoves += 1;
        this.setProgress((completedMoves / totalMoves) * 100);
        await pauseAwareWait(this, this.prefersReducedMotion ? 0 : MOVE_PAUSE);
      }
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : REPETITION_PAUSE);
    }

    this.setPhase("Le coin est inséré", "Dernier alignement");
    this.setCurrentMove("U'");
    await this.animateMove("U'");
    completedMoves += 1;
    this.setProgress((completedMoves / totalMoves) * 100);
    this.stage.dataset.cubeResultValidated = String(this.matchesExpectedResult());
    this.setTargetCubieAtCoordinate(new THREE.Vector3(1, -1, 1));
    await this.animateTargetOutline(1);
    await this.animateCameraToResult();
    this.setCurrentMove("✓");
    this.setPhase("Le Rubik’s Cube 2x2 est résolu", "U' a réaligné la dernière couche");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1450);
  };

  CubeStepPlayer.prototype.playYellowOrientationStep = async function () {
    const totalMoves = STEP_TWO_SEQUENCE.length + 1;
    let completedMoves = 0;

    this.setPhase("Face blanche en haut, jaune en bas", "Coin 1 en bas devant à droite");
    this.setCurrentMove("Coin 1");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 650);
    await this.animateTargetOutline(1);
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1050);

    for (let coinIndex = 0; coinIndex < STEP_TWO_REPETITIONS.length; coinIndex += 1) {
      const coinNumber = coinIndex + 1;
      const repetitions = STEP_TWO_REPETITIONS[coinIndex];

      for (let repetition = 1; repetition <= repetitions; repetition += 1) {
        this.setPhase("R U R' U'", "Coin " + coinNumber + " · répétition " + repetition + " sur " + repetitions);
        for (const move of INSERTION_ALGORITHM) {
          this.setCurrentMove(move);
          await this.animateMove(move);
          completedMoves += 1;
          this.setProgress((completedMoves / totalMoves) * 100);
          await pauseAwareWait(this, this.prefersReducedMotion ? 0 : MOVE_PAUSE);
        }
        await pauseAwareWait(this, this.prefersReducedMotion ? 0 : REPETITION_PAUSE);
      }

      this.setPhase("Le carré jaune regarde vers le bas", "Coin " + coinNumber + " orienté");
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 780);
      await this.animateTargetOutline(0);
      this.setCurrentMove("D'");
      this.setPhase("Tourne seulement la face du bas", coinNumber < 4 ? "Amène le coin suivant" : "Réaligne la face jaune");
      await this.animateMove("D'");
      completedMoves += 1;
      this.setProgress((completedMoves / totalMoves) * 100);
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : MOVE_PAUSE);

      if (coinNumber < 4) {
        this.setTargetCubieAtCoordinate(new THREE.Vector3(1, -1, 1));
        await this.animateTargetOutline(1);
        await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 720);
      }
    }

    this.stage.dataset.cubeResultValidated = String(this.matchesExpectedResult());
    this.setPhase("La face jaune est complète en dessous", "Retourne le cube à 180°");
    this.setCurrentMove("180°");
    this.setTargetCubieByHomeCoordinate(new THREE.Vector3(-1, -1, -1));
    await this.animateTargetOutline(1);
    await this.animateModelFlip(true);
    completedMoves += 1;
    this.setProgress(100);
    this.setCurrentMove("✓");
    this.setPhase("Face jaune en haut, face bleue à gauche", "Cas transmis à l’étape 3");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1600);
  };

  CubeStepPlayer.prototype.playLastSwapStep = async function () {
    const totalMoves = this.algorithm.length;
    let completedMoves = 0;

    this.setPhase("Face bleue résolue à gauche", "Carré vert en haut à droite du rouge");
    this.setCurrentMove("Départ");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 650);
    await this.animateTargetOutline(1);
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1150);
    await this.animateTargetOutline(0);

    this.setPhase("Algorithme final", "Va jusqu’au dernier F'");
    for (const move of this.algorithm) {
      await this.animateTeachingMove(move);
      completedMoves += 1;
      this.setProgress((completedMoves / totalMoves) * 100);
      await pauseAwareWait(this, this.prefersReducedMotion ? 0 : MOVE_PAUSE);
    }

    this.stage.dataset.cubeResultValidated = String(this.matchesExpectedResult());
    this.setTargetCubieAtCoordinate(new THREE.Vector3(1, 1, 1));
    await this.animateTargetOutline(1);
    this.setCurrentMove("✓");
    this.setPhase("Le Rubik’s Cube 2x2 est résolu", "Les six faces sont unies");
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1600);
  };

  CubeStepPlayer.prototype.animateTeachingMove = async function (move) {
    this.teachingMove = move;
    if (!move.includes("2")) {
      this.setCurrentMove(move);
      await this.animateMove(move);
      return;
    }

    const quarterTurn = move.replace("2", "");
    this.setCurrentMove(quarterTurn + " · 1/2");
    await this.animateMove(quarterTurn);
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : DOUBLE_TURN_PAUSE);
    this.setCurrentMove(quarterTurn + " · 2/2");
    await this.animateMove(quarterTurn);
  };

  CubeStepPlayer.prototype.animateMove = function (move) {
    const definition = getMoveDefinition(move, this.size);
    if (!definition) return Promise.resolve();

    const layer = this.prepareLayer(definition);
    const duration = this.prefersReducedMotion ? 0 : MOVE_DURATION;
    this.stage.dataset.activeFace = this.size === 4 ? this.teachingMove || move : move;

    return tween(this, duration, (progress) => {
      layer.pivot.rotation[definition.axis] = definition.angle * easeInOutCubic(progress);
      this.render();
    }).then(() => {
      layer.pivot.rotation[definition.axis] = definition.angle;
      this.finishLayer(layer, definition);
      this.stage.removeAttribute("data-active-face");
      this.render();
    });
  };

  CubeStepPlayer.prototype.applyMoveInstantly = function (move) {
    const definition = getMoveDefinition(move, this.size);
    if (!definition) return;

    const layer = this.prepareLayer(definition);
    layer.pivot.rotation[definition.axis] = definition.angle;
    this.finishLayer(layer, definition);
  };

  CubeStepPlayer.prototype.prepareLayer = function (definition) {
    const pivot = new THREE.Group();
    const cubies = this.cubies.filter(
      (cubie) => definition.layers.includes(Math.round(cubie.userData.coordinate[definition.axis]))
    );

    this.modelRoot.add(pivot);
    cubies.forEach((cubie) => pivot.add(cubie));

    return { cubies, pivot };
  };

  CubeStepPlayer.prototype.finishLayer = function (layer, definition) {
    layer.pivot.updateMatrix();

    layer.cubies.forEach((cubie) => {
      cubie.updateMatrix();
      const matrix = new THREE.Matrix4().multiplyMatrices(layer.pivot.matrix, cubie.matrix);
      const coordinate = cubie.userData.coordinate
        .clone()
        .applyAxisAngle(definition.vector, definition.angle)
        .round();

      this.modelRoot.add(cubie);
      matrix.decompose(cubie.position, cubie.quaternion, cubie.scale);
      cubie.userData.coordinate.copy(coordinate);
      cubie.position.copy(coordinate).multiplyScalar(this.cubieOffset);
      cubie.quaternion.normalize();
      snapQuaternion(cubie.quaternion);
    });

    this.modelRoot.remove(layer.pivot);
  };

  CubeStepPlayer.prototype.animateCameraToResult = function () {
    const start = this.camera.position.clone();
    const duration = this.prefersReducedMotion ? 0 : 1450;

    return tween(this, duration, (progress) => {
      const eased = easeInOutCubic(progress);
      this.camera.position.lerpVectors(start, this.resultCameraPosition, eased);
      this.camera.lookAt(0, 0, 0);
      this.render();
    });
  };

  CubeStepPlayer.prototype.animateCameraInspection = async function () {
    const start = this.initialCameraPosition.clone();
    const duration = this.prefersReducedMotion ? 0 : CAMERA_INSPECTION_DURATION;

    const placeCamera = (angle) => {
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);

      this.camera.position.set(
        start.x * cosine + start.z * sine,
        start.y * cosine,
        -start.x * sine + start.z * cosine
      );
      this.camera.lookAt(0, 0, 0);
      this.render();
    };

    await tween(this, duration, (progress) => {
      placeCamera(Math.PI * easeInOutCubic(progress));
    });
    await pauseAwareWait(this, this.prefersReducedMotion ? 0 : 1250);
    await tween(this, duration, (progress) => {
      placeCamera(Math.PI * (1 - easeInOutCubic(progress)));
    });

    this.camera.position.copy(start);
    this.camera.lookAt(0, 0, 0);
    this.render();
  };

  CubeStepPlayer.prototype.animateModelFlip = function (moveCameraToLeft) {
    const startRotation = this.modelRoot.rotation.z;
    const startCamera = this.camera.position.clone();
    const endCamera = moveCameraToLeft
      ? new THREE.Vector3(-4.8, 4.25, 6.5)
      : startCamera.clone();
    const duration = this.prefersReducedMotion ? 0 : 1650;

    return tween(this, duration, (progress) => {
      const eased = easeInOutCubic(progress);
      this.modelRoot.rotation.z = startRotation + Math.PI * eased;
      this.camera.position.lerpVectors(startCamera, endCamera, eased);
      this.camera.lookAt(0, 0, 0);
      this.render();
    });
  };

  CubeStepPlayer.prototype.setTargetOutlineOpacity = function (opacity) {
    if (!this.targetCubie) return;

    const outline = ensureTargetOutline(this.targetCubie);

    outline.visible = opacity > 0.001;
    outline.userData.material.opacity = opacity;
  };

  CubeStepPlayer.prototype.setTargetCubieAtCoordinate = function (coordinate) {
    if (this.targetCubie) hideTargetOutline(this.targetCubie);

    this.targetCubie = this.cubies.find((cubie) => cubie.userData.coordinate.equals(coordinate));
    if (this.targetCubie) ensureTargetOutline(this.targetCubie);
  };

  CubeStepPlayer.prototype.findCubieByHomeCoordinate = function (coordinate) {
    return this.cubies.find((cubie) => cubie.userData.homeCoordinate.equals(coordinate));
  };

  CubeStepPlayer.prototype.setTargetCubieByHomeCoordinate = function (coordinate) {
    if (this.targetCubie) hideTargetOutline(this.targetCubie);

    this.targetCubie = this.findCubieByHomeCoordinate(coordinate);
    if (this.targetCubie) ensureTargetOutline(this.targetCubie);
  };

  CubeStepPlayer.prototype.animateTargetOutline = function (targetOpacity) {
    if (!this.targetCubie) return Promise.resolve();

    const outline = ensureTargetOutline(this.targetCubie);
    const material = outline.userData.material;
    const startOpacity = material.opacity;
    const duration = this.prefersReducedMotion ? 0 : OUTLINE_FADE_DURATION;

    outline.visible = true;

    return tween(this, duration, (progress) => {
      material.opacity = startOpacity + (targetOpacity - startOpacity) * easeInOutCubic(progress);
      this.render();
    }).then(() => {
      material.opacity = targetOpacity;
      outline.visible = targetOpacity > 0.001;
      this.render();
    });
  };

  CubeStepPlayer.prototype.resize = function () {
    if (!this.renderer || !this.camera) return;

    const width = Math.max(this.stage.clientWidth, 1);
    const height = Math.max(this.stage.clientHeight, 1);
    const aspect = width / height;

    this.renderer.setSize(width, height, false);
    this.camera.aspect = aspect;
    this.camera.zoom = aspect < 0.86 ? 0.82 : aspect < 1.15 ? 0.9 : 1;
    this.camera.updateProjectionMatrix();
    this.render();
  };

  CubeStepPlayer.prototype.render = function () {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  };

  CubeStepPlayer.prototype.validateRenderedPixels = function () {
    const context = this.renderer && this.renderer.getContext();
    if (!context) return;

    const width = context.drawingBufferWidth;
    const height = context.drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, pixels);

    let visibleSamples = 0;
    for (let index = 3; index < pixels.length; index += 64) {
      if (pixels[index] > 20) visibleSamples += 1;
    }

    this.stage.dataset.cubePixelsValidated = String(visibleSamples > 80);
  };

  CubeStepPlayer.prototype.setPhase = function (phase, repeat) {
    if (this.phase) this.phase.textContent = phase;
    if (this.repeat) this.repeat.textContent = repeat;
  };

  CubeStepPlayer.prototype.setCurrentMove = function (move) {
    if (this.currentMove) this.currentMove.textContent = move;
  };

  CubeStepPlayer.prototype.setProgress = function (percentage) {
    if (this.progress) this.progress.style.width = Math.max(0, Math.min(100, percentage)) + "%";
  };

  CubeStepPlayer.prototype.showUnavailable = function () {
    this.stage.classList.add("is-unavailable");
    this.setPhase("Animation 3D indisponible", "Recharge la page pour réessayer");
    this.toggleButton.disabled = true;
  };

  function createTargetOutline(cubieSize) {
    const outline = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
      color: COLORS.blue,
      depthWrite: false,
      opacity: 0,
      transparent: true,
    });
    const size = cubieSize || CUBIE_SIZE;
    const length = size + 0.11;
    const half = size / 2 + 0.04;
    const thickness = Math.max(0.024, size * 0.037);
    const xEdge = new THREE.BoxGeometry(length, thickness, thickness);
    const yEdge = new THREE.BoxGeometry(thickness, length, thickness);
    const zEdge = new THREE.BoxGeometry(thickness, thickness, length);

    [-1, 1].forEach((firstSide) => {
      [-1, 1].forEach((secondSide) => {
        const horizontal = new THREE.Mesh(xEdge, material);
        horizontal.position.set(0, firstSide * half, secondSide * half);
        horizontal.renderOrder = 4;
        outline.add(horizontal);

        const vertical = new THREE.Mesh(yEdge, material);
        vertical.position.set(firstSide * half, 0, secondSide * half);
        vertical.renderOrder = 4;
        outline.add(vertical);

        const depth = new THREE.Mesh(zEdge, material);
        depth.position.set(firstSide * half, secondSide * half, 0);
        depth.renderOrder = 4;
        outline.add(depth);
      });
    });

    outline.userData.material = material;
    outline.visible = false;
    return outline;
  }

  function ensureTargetOutline(cubie) {
    if (!cubie.userData.targetOutline) {
      const outline = createTargetOutline(cubie.userData.cubieSize);
      cubie.add(outline);
      cubie.userData.targetOutline = outline;
    }

    return cubie.userData.targetOutline;
  }

  function hideTargetOutline(cubie) {
    const outline = cubie.userData.targetOutline;
    if (!outline) return;

    outline.userData.material.opacity = 0;
    outline.visible = false;
  }

  function getInitialCameraPosition(mode) {
    return mode === "last-swap"
      ? new THREE.Vector3(-4.8, 4.25, 6.5)
      : new THREE.Vector3(4.8, 4.25, 6.5);
  }

  function getTargetHomeCoordinate(mode) {
    const step3x3 = getThreeByThreeStep(mode);
    if (step3x3) return step3x3.target.clone();

    return mode === "last-swap"
      ? new THREE.Vector3(1, 1, -1)
      : new THREE.Vector3(1, -1, 1);
  }

  function getFaceColors(mode) {
    if (mode === "4x4-oll") {
      return {
        xPositive: COLORS.red, xNegative: COLORS.orange,
        yPositive: COLORS.yellow, yNegative: COLORS.white,
        zPositive: COLORS.blue, zNegative: COLORS.green,
      };
    }
    if (mode === "yellow-orient" || mode === "4x4-centres") {
      return {
        xPositive: COLORS.blue,
        xNegative: COLORS.green,
        yPositive: COLORS.white,
        yNegative: COLORS.yellow,
        zPositive: COLORS.red,
        zNegative: COLORS.orange,
      };
    }

    return {
      xPositive: COLORS.green,
      xNegative: COLORS.blue,
      yPositive: COLORS.yellow,
      yNegative: COLORS.white,
      zPositive: COLORS.red,
      zNegative: COLORS.orange,
    };
  }

  function getThreeByThreeStep(mode) {
    return THREE_BY_THREE_STEPS.find((step) => step.mode === mode);
  }

  function algorithmsMatch(first, second) {
    return first.length === second.length && first.every((move, index) => move === second[index]);
  }

  function createStepTwoSequence() {
    const sequence = [];

    STEP_TWO_REPETITIONS.forEach((repetitions) => {
      sequence.push(...repeatMoves(INSERTION_ALGORITHM, repetitions));
      sequence.push("D'");
    });

    return sequence;
  }

  function mapAlgorithmForFrontFlip(moves) {
    const faceMap = { B: "B", D: "U", F: "F", L: "R", R: "L", U: "D" };

    return moves.map((move) => faceMap[move.charAt(0)] + move.slice(1));
  }

  function getStickerDirection(cubie, homeDirection) {
    return homeDirection.clone().applyQuaternion(cubie.quaternion).round();
  }

  function parseAlgorithm(value) {
    const moves = (value || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return moves.length ? moves : INSERTION_ALGORITHM.slice();
  }

  function getMoveDefinition(move, size = 2) {
    if (!/^(?:[RLUDFB]w?|[rludfbxyz])(?:2|')?$/.test(move)) return null;
    const face = move.charAt(0).toUpperCase();
    const isPrime = move.includes("'");
    const isDouble = move.includes("2");
    const definitions = {
      B: { axis: "z", layer: -1, direction: 1, vector: new THREE.Vector3(0, 0, 1) },
      D: { axis: "y", layer: -1, direction: 1, vector: new THREE.Vector3(0, 1, 0) },
      F: { axis: "z", layer: 1, direction: -1, vector: new THREE.Vector3(0, 0, 1) },
      L: { axis: "x", layer: -1, direction: 1, vector: new THREE.Vector3(1, 0, 0) },
      R: { axis: "x", layer: 1, direction: -1, vector: new THREE.Vector3(1, 0, 0) },
      U: { axis: "y", layer: 1, direction: -1, vector: new THREE.Vector3(0, 1, 0) },
      X: { axis: "x", direction: -1, vector: new THREE.Vector3(1, 0, 0) },
      Y: { axis: "y", direction: -1, vector: new THREE.Vector3(0, 1, 0) },
      Z: { axis: "z", direction: -1, vector: new THREE.Vector3(0, 0, 1) },
    };
    const definition = definitions[face];

    if (!definition) return null;

    const boundary = size === 4 ? 3 : 1;
    const rotation = /^[xyz]/.test(move);
    const inner = size === 4 && /^[rludfb]/.test(move);
    const wide = move.includes("w");
    const layers = rotation ? (size === 4 ? [-3, -1, 1, 3] : size === 3 ? [-1, 0, 1] : [-1, 1])
      : inner ? [definition.layer]
      : wide ? [definition.layer * boundary, size === 4 ? definition.layer : 0]
      : [definition.layer * boundary];
    return {
      angle: definition.direction * (isPrime ? -1 : 1) * (isDouble ? 2 : 1) * QUARTER_TURN,
      axis: definition.axis,
      face,
      layer: definition.layer,
      layers,
      vector: definition.vector,
    };
  }

  function repeatMoves(moves, repetitions) {
    const result = [];

    for (let repetition = 0; repetition < repetitions; repetition += 1) {
      result.push(...moves);
    }

    return result;
  }

  function invertAlgorithm(moves) {
    return moves.slice().reverse().map((move) => {
      if (move.includes("2")) return move;
      return move.includes("'") ? move.replace("'", "") : move + "'";
    });
  }

  function isCubieOriented(cubie) {
    return cubie.quaternion.angleTo(new THREE.Quaternion()) < 0.001;
  }

  function isCubieSolved(cubie) {
    return cubie.userData.coordinate.equals(cubie.userData.homeCoordinate) && isCubieOriented(cubie);
  }

  function snapQuaternion(quaternion) {
    const matrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
    const elements = matrix.elements;
    [0, 1, 2, 4, 5, 6, 8, 9, 10].forEach((index) => {
      elements[index] = Math.round(elements[index]);
    });
    quaternion.setFromRotationMatrix(matrix).normalize();
  }

  function tween(player, duration, update) {
    if (!duration) {
      update(1);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let elapsed = 0;
      let previousTime = null;

      function frame(now) {
        if (previousTime === null) previousTime = now;

        const delta = Math.min(now - previousTime, 64);
        previousTime = now;

        if (!player.isPaused) elapsed += delta;

        const progress = Math.min(elapsed / duration, 1);
        update(progress);

        if (progress < 1) {
          window.requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }

      window.requestAnimationFrame(frame);
    });
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function pauseAwareWait(player, duration) {
    if (!duration) return Promise.resolve();

    return new Promise((resolve) => {
      let elapsed = 0;
      let previousTime = null;

      function frame(now) {
        if (previousTime === null) previousTime = now;

        const delta = Math.min(now - previousTime, 64);
        previousTime = now;

        if (!player.isPaused) elapsed += delta;

        if (elapsed >= duration) {
          resolve();
        } else {
          window.requestAnimationFrame(frame);
        }
      }

      window.requestAnimationFrame(frame);
    });
  }

  function showUnavailablePlayer(element) {
    const stage = element.querySelector("[data-cube-stage]");
    const toggleButton = element.querySelector("[data-cube-toggle]");
    const phase = element.querySelector("[data-cube-phase]");
    const repeat = element.querySelector("[data-cube-repeat]");

    if (stage) stage.classList.add("is-unavailable");
    if (toggleButton) toggleButton.disabled = true;
    if (phase) phase.textContent = "Animation 3D indisponible";
    if (repeat) repeat.textContent = "Recharge la page pour réessayer";
  }

  players.forEach((element) => {
    const player = new CubeStepPlayer(element);
    element.cubeStepPlayer = player;
  });
})();
