const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'guide.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '3x3/index.html'), 'utf8');

function fixture({hash = '', blockedHistory = false, missingControls = false,
  stepIds = ['cache', 'centre', 'demonter', 'nettoyer', 'lubrifier', 'remonter', 'verifier']} = {}) {
  const document = {activeElement: null};
  function element(id = '') {
    const attributes = new Map();
    return {
      id, dataset: {}, hidden: false, disabled: false, textContent: '',
      listeners: new Map(), classList: {add() {}},
      setAttribute(name, value) { attributes.set(name, value); },
      removeAttribute(name) { attributes.delete(name); },
      hasAttribute(name) { return attributes.has(name); },
      getAttribute(name) { return attributes.get(name); },
      addEventListener(name, listener) { this.listeners.set(name, listener); },
      focus() { document.activeElement = this; },
      closest(selector) { return selector === 'button' ? this : null; }
    };
  }
  const steps = stepIds.map(element);
  const buttons = steps.map((_, index) => {
    const button = element();
    button.dataset.stepIndex = String(index);
    button.setAttribute('data-step-index', String(index));
    return button;
  });
  const guide = element();
  const navigation = element();
  const controls = element();
  const status = element();
  navigation.hidden = controls.hidden = status.hidden = true;
  const previous = element();
  const next = element();
  const nextLabel = element();
  const position = element();
  const progress = element();
  const selected = {
    '[data-step-navigation]': navigation, '[data-step-controls]': missingControls ? null : controls,
    '[data-step-status]': status, '[data-direction="-1"]': previous,
    '[data-direction="1"]': next, '[data-next-label]': nextLabel,
    '[data-position-label]': position, '[data-step-progress]': progress
  };
  guide.querySelector = selector => selected[selector];
  guide.querySelectorAll = selector => selector === '[data-cleaning-step]' ? steps : buttons;
  document.querySelector = () => guide;
  const location = {hash};
  const window = element();
  const replacements = [];
  const history = {replaceState(state, title, url) {
    if (blockedHistory) throw new Error('Local URL updates unavailable');
    replacements.push(url);
    location.hash = url;
  }};
  vm.runInNewContext(source, {document, window, location, history});
  const click = button => guide.listeners.get('click')({target: button});
  const visible = () => steps.filter(step => !step.hidden).map(step => step.id);
  const key = keyName => navigation.listeners.get('keydown')({key: keyName, preventDefault() {}});
  return {steps, buttons, navigation, controls, status, previous, next, nextLabel,
    position, progress, document, replacements, click, visible, key,
    hashchange(value) { location.hash = value; window.listeners.get('hashchange')(); }};
}

test('opens the first step without a completion checkbox', () => {
  const page = fixture();
  assert.deepEqual(page.visible(), ['cache']);
  assert.equal(page.buttons[0].getAttribute('aria-current'), 'step');
  assert.equal(page.previous.disabled, true);
  assert.equal(page.navigation.hidden, false);
  assert.equal(page.controls.hidden, false);
  assert.equal(page.status.hidden, false);
  assert.equal(page.position.textContent, 'Étape 1 sur 7');
  assert.equal(page.progress.value, 1);
  assert.equal(page.replacements.length, 0);
});

test('next and previous select one step and update progress', () => {
  const page = fixture();
  page.click(page.next);
  assert.deepEqual(page.visible(), ['centre']);
  assert.equal(page.previous.disabled, false);
  assert.equal(page.progress.value, 2);
  assert.equal(page.buttons[0].hasAttribute('aria-current'), false);
  assert.deepEqual(page.replacements, ['#centre']);
  page.click(page.previous);
  assert.deepEqual(page.visible(), ['cache']);
  assert.equal(page.previous.disabled, true);
  page.click(page.previous);
  assert.deepEqual(page.visible(), ['cache']);
});

test('numbered navigation supports direct selection', () => {
  const page = fixture();
  page.click(page.buttons[3]);
  assert.deepEqual(page.visible(), ['nettoyer']);
  assert.equal(page.buttons[3].getAttribute('aria-current'), 'step');
  assert.equal(page.position.textContent, 'Étape 4 sur 7');
  assert.equal(page.progress.value, 4);
  assert.deepEqual(page.replacements, ['#nettoyer']);
});

test('the final action restarts the guide', () => {
  const page = fixture();
  page.click(page.buttons[6]);
  assert.equal(page.nextLabel.textContent, 'Revoir le parcours');
  assert.equal(page.progress.value, 7);
  page.click(page.next);
  assert.deepEqual(page.visible(), ['cache']);
  assert.equal(page.nextLabel.textContent, 'Étape suivante');
  assert.equal(page.progress.value, 1);
});

test('existing step anchors work on entry and hash changes', () => {
  const page = fixture({hash: '#remonter'});
  assert.deepEqual(page.visible(), ['remonter']);
  page.hashchange('#verifier');
  assert.deepEqual(page.visible(), ['verifier']);
  page.hashchange('#avant');
  assert.deepEqual(page.visible(), ['verifier']);
  assert.equal(page.replacements.length, 0);
});

test('navigation works when local history updates are blocked', () => {
  const page = fixture({blockedHistory: true});
  page.click(page.next);
  assert.deepEqual(page.visible(), ['centre']);
  assert.equal(page.progress.value, 2);
});

test('arrow keys, Home and End move focus to the active step', () => {
  const page = fixture();
  page.buttons[0].focus();
  page.key('End');
  assert.deepEqual(page.visible(), ['verifier']);
  assert.equal(page.document.activeElement, page.buttons[6]);
  page.key('Home');
  page.key('ArrowLeft');
  assert.deepEqual(page.visible(), ['cache']);
  page.key('ArrowRight');
  assert.deepEqual(page.visible(), ['centre']);
  assert.equal(page.document.activeElement, page.buttons[1]);
});

test('incomplete component markup leaves all content readable', () => {
  const page = fixture({missingControls: true});
  assert.equal(page.visible().length, 7);
  assert.equal(page.navigation.hidden, true);
});

test('page has all seven source steps and only six material checkboxes', () => {
  assert.equal((html.match(/data-cleaning-step\b/g) || []).length, 7);
  assert.equal((html.match(/type="checkbox"/g) || []).length, 6);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(html, /Étape terminée|data-complete|cm-tab|role="tabpanel"/);
  assert.doesNotMatch(html, /data-cleaning-step[^>]*\bhidden\b/);
  assert.match(html, /data-lucide="layers-2"[^>]*><\/i><span>Chiffon microfibre/);
  assert.match(html, /Visuels de maquette générés/);
});

test('FAQ contains five native questions outside the step navigator', () => {
  const faq = html.slice(html.indexOf('<section class="cm-faq"'), html.indexOf('</main>'));
  assert.equal((faq.match(/<details\b/g) || []).length, 5);
  assert.equal((faq.match(/<summary\b/g) || []).length, 5);
  assert.equal((faq.match(/<h3\b/g) || []).length, 5);
  assert.match(faq, /aria-labelledby="faq-titre"/);
  assert.match(faq, /sans le démonter/);
  assert.match(faq, /Ne plonge pas le cube assemblé dans l’eau/);
  assert.doesNotMatch(faq, /data-cleaning-step|data-step-index|\shidden(?:[\s=>])/);
});

test('maintenance content covers complete drying and safe lubricant dosing', () => {
  assert.match(html, /laisse-les sécher complètement avant le remontage/);
  assert.match(html, /Choisis un lubrifiant spécial cube compatible avec ton modèle/);
  assert.match(html, /Une petite quantité|une petite quantité/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
});

test('all maintenance references open securely in a new tab', () => {
  const references = html.match(/<p class="cm-faq-sources">[\s\S]*?<\/p>/)[0];
  const links = [...references.matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
  assert.equal(links.length, 3);
  links.forEach(link => {
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
  });
});

const adaptations = [
  {slug: '2x2', name: '2x2', terms: /huit coins/, faq: /Faut-il retirer les huit coins/},
  {slug: '4x4', name: '4x4', terms: /centres mobiles/, faq: /couche interne du 4x4/},
  {slug: 'megaminx', name: 'Mégaminx', terms: /couleurs de chaque arête/, faq: /retrouver les bonnes couleurs/},
  {slug: 'pyraminx', name: 'Pyraminx', terms: /quatre petites pointes/, faq: /retirer les quatre petites pointes/},
  {slug: 'gearcube', name: 'Gear Cube', terms: /alignement des engrenages/, faq: /poussière entre les dents/}
];

const rubiksSeries = {
  '2x2': ['rubiks-2x2-preparation-v2', 'rubiks-2x2-pieces-v2',
    'rubiks-2x2-nettoyage-v2', 'rubiks-2x2-lubrifiant-v2',
    'rubiks-2x2-remontage-v3', 'rubiks-2x2-controle-v2'],
  '4x4': ['rubiks-4x4-preparation-v2', 'rubiks-4x4-pieces-v2',
    'rubiks-4x4-nettoyage-v2', 'rubiks-4x4-lubrifiant-v2',
    'rubiks-4x4-remontage-v2', 'rubiks-4x4-controle-v2']
};

for (const adaptation of adaptations) {
  const pageHtml = fs.readFileSync(path.join(__dirname, adaptation.slug, 'index.html'), 'utf8');
  const stepIds = [...pageHtml.matchAll(/<article\b[^>]*id="([^"]+)"[^>]*data-cleaning-step/g)]
    .map(match => match[1]);

  test(`${adaptation.name}: keeps six readable steps and the validated preparation block`, () => {
    assert.equal(stepIds.length, 6);
    assert.equal((pageHtml.match(/type="checkbox"/g) || []).length, 6);
    assert.equal((pageHtml.match(/<h1\b/g) || []).length, 1);
    assert.match(pageHtml, /<body class="cm-cleaning">/);
    assert.match(pageHtml, /Avant le premier geste/);
    assert.match(pageHtml, /Sur ton établi\./);
    assert.match(pageHtml, /data-lucide="layers-2"[^>]*><\/i><span>Chiffon microfibre/);
    assert.match(pageHtml, /href="\.\.\/guide.css"/);
    assert.match(pageHtml, /src="\.\.\/guide.js"/);
    assert.doesNotMatch(pageHtml, /Étape terminée|data-complete|class="construction"|guide-toc|guide-card/);
    assert.doesNotMatch(pageHtml, /data-cleaning-step[^>]*\shidden(?:[\s=>])/);
    assert.match(pageHtml, adaptation.terms);
  });

  test(`${adaptation.name}: its rail, progress and existing anchors match the steps`, () => {
    const controls = [...pageHtml.matchAll(/data-step-index="(\d+)"[^>]*aria-controls="([^"]+)"/g)];
    assert.equal(controls.length, stepIds.length);
    controls.forEach((match, index) => {
      assert.equal(Number(match[1]), index);
      assert.equal(match[2], stepIds[index]);
      assert.equal(stepIds[index], `etape-${index + 1}`);
    });
    assert.match(pageHtml, /<progress max="6" value="1"/);
    const page = fixture({stepIds, hash: '#etape-2'});
    assert.deepEqual(page.visible(), ['etape-2']);
    assert.equal(page.progress.max, 6);
    page.click(page.next);
    assert.deepEqual(page.visible(), ['etape-3']);
    page.click(page.previous);
    assert.deepEqual(page.visible(), ['etape-2']);
    page.buttons[1].focus();
    page.key('End');
    assert.deepEqual(page.visible(), ['etape-6']);
    assert.equal(page.position.textContent, 'Étape 6 sur 6');
    assert.equal(page.nextLabel.textContent, 'Revoir le parcours');
    page.click(page.next);
    assert.deepEqual(page.visible(), ['etape-1']);
  });

  test(`${adaptation.name}: has five puzzle-specific FAQ answers and safe source links`, () => {
    const faq = pageHtml.slice(pageHtml.indexOf('<section class="cm-faq"'), pageHtml.indexOf('</main>'));
    assert.equal((faq.match(/<details\b/g) || []).length, 5);
    assert.equal((faq.match(/name="faq-nettoyage" open/g) || []).length, 1);
    assert.match(faq, adaptation.faq);
    assert.doesNotMatch(faq, /data-cleaning-step|data-step-index|\shidden(?:[\s=>])/);
    const links = [...faq.matchAll(/<a\b[^>]*>/g)].map(match => match[0]);
    assert.equal(links.length, 3);
    links.forEach(link => {
      assert.match(link, /target="_blank"/);
      assert.match(link, /rel="noopener noreferrer"/);
    });
  });

  test(`${adaptation.name}: uses puzzle-specific images with explicit provenance`, () => {
    const figures = [...pageHtml.matchAll(/<figure class="cm-photo cm-photo-generated([^"]*)">([\s\S]*?)<\/figure>/g)];
    const series = rubiksSeries[adaptation.slug];
    assert.equal(figures.length, 6);
    const sources = [];
    figures.forEach(([, classes, content], index) => {
      assert.match(content, new RegExp(`loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"`));
      if (series) {
        assert.equal(classes, ' cm-photo-reference');
        const expected = `../../assets/images/nettoyage/${series[index]}.webp`;
        const src = content.match(/src="([^"]+)"/)[1];
        assert.equal(src, expected);
        sources.push(src);
        assert.match(content, /alt="Illustration générée : [^"]+"/);
        assert.match(content, /width="1254" height="1254"/);
        assert.match(content, /Illustration générée · Référence Rubik’s 2008/);
        const image = fs.readFileSync(path.resolve(__dirname, adaptation.slug, src));
        assert.equal(image.toString('ascii', 0, 4), 'RIFF');
        assert.equal(image.toString('ascii', 8, 12), 'WEBP');
        assert.ok(image.length < 200000, 'Keep each step image lightweight');
        const original = fs.readFileSync(path.resolve(__dirname, adaptation.slug, src.replace(/\.webp$/, '.png')));
        assert.equal(original.toString('ascii', 12, 16), 'IHDR');
        assert.equal(original.readUInt32BE(16), 1254);
        assert.equal(original.readUInt32BE(20), 1254);
        return;
      }
      assert.equal(classes, index < 2 ? '' : index < 4 ? ' cm-photo-middle' : ' cm-photo-last');
      assert.match(content, new RegExp(`src="\\.\\.\\/\\.\\.\\/assets/images/nettoyage/atelier-${adaptation.slug}-genere\\.webp"`));
      assert.match(content, /alt="Illustration générée : [^"]+intact[^"]*"/);
      assert.match(content, /width="2172" height="724"/);
      assert.match(content, /Illustration générée · Vue extérieure/);
    });
    if (series) {
      assert.equal(new Set(sources).size, 6, 'Each step must show a distinct scene');
      assert.doesNotMatch(pageHtml, /atelier-[24]x[24]-genere|Vue extérieure|cm-photo-middle|cm-photo-last/);
      assert.match(pageHtml, /illustrations générées en validation/);
      assert.match(pageHtml, /ni des photos réelles ni des plans techniques exacts/);
      assert.match(pageHtml, /flacon fermé ne précise ni une zone d’application ni un dosage/);
    } else {
      const image = fs.readFileSync(path.join(__dirname, `../assets/images/nettoyage/atelier-${adaptation.slug}-genere.webp`));
      assert.equal(image.toString('ascii', 0, 4), 'RIFF');
      assert.equal(image.toString('ascii', 8, 12), 'WEBP');
      assert.ok(image.length < 200000, 'Keep the workshop triptych lightweight');
      assert.match(pageHtml, /pas un démontage documenté/);
    }
    assert.doesNotMatch(pageHtml, /cm-photo-placeholder|Photo réelle .* à ajouter/);
  });

  test(`${adaptation.name}: keeps model-dependent care precautions`, () => {
    assert.doesNotMatch(pageHtml, /atelier-3x3-propositions|cube-player|three(?:\.min)?\.js/);
    assert.match(pageHtml, /laisse-les sécher complètement avant le remontage/);
    assert.match(pageHtml, /notice/);
    assert.match(pageHtml, /petite quantité/);
    assert.match(pageHtml, /WD-40/);
    assert.match(pageHtml, /name="robots" content="noindex, nofollow"/);
  });

  test(`${adaptation.name}: local files and accessibility references resolve`, () => {
    const ids = [...pageHtml.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, attribute] of pageHtml.matchAll(/aria-(?:labelledby|controls)="([^"]+)"/g)) {
      attribute.split(' ').forEach(id => assert.ok(ids.includes(id), `Unknown accessible ID: ${id}`));
    }
    for (const [, url] of pageHtml.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
      if (/^(?:https?:|#)/.test(url)) continue;
      assert.ok(fs.existsSync(path.resolve(__dirname, adaptation.slug, url)), `Missing local file: ${url}`);
    }
  });
}

test('all adapted FAQs differ from each other and the 3x3 reference', () => {
  const questions = [html, ...adaptations.map(({slug}) =>
    fs.readFileSync(path.join(__dirname, slug, 'index.html'), 'utf8'))]
    .map(page => [...page.matchAll(/<summary><h3>([^<]+)<\/h3>/g)].map(match => match[1]).join('\n'));
  assert.equal(new Set(questions).size, questions.length);
});

test('the rail lays out six or seven steps without a hardcoded column count', () => {
  const css = fs.readFileSync(path.join(__dirname, 'guide.css'), 'utf8');
  const rail = css.match(/\.cm-wizard-rail\s*\{([^}]+)\}/)[1];
  assert.match(rail, /grid-auto-flow: column/);
  assert.match(rail, /grid-auto-columns: minmax\(0, 1fr\)/);
  assert.doesNotMatch(rail, /repeat\(7/);
});

test('generated workshop images have their own mobile crop without changing the 3x3 reference', () => {
  const css = fs.readFileSync(path.join(__dirname, 'guide.css'), 'utf8');
  assert.match(css, /\.cm-photo img \{ top: -25%; \}/);
  assert.match(css, /\.cm-workspace-visual \.cm-photo-generated \{ aspect-ratio: 1\.25; \}/);
  assert.match(css, /\.cm-photo-generated img \{ top: -12\.5%; \}/);
});

test('square step images remain fully visible rather than using the triptych crop', () => {
  const css = fs.readFileSync(path.join(__dirname, 'guide.css'), 'utf8');
  const rule = css.match(/\.cm-cleaning \.cm-photo-reference img\s*\{([^}]+)\}/)[1];
  assert.match(rule, /inset: 0/);
  assert.match(rule, /width: 100%/);
  assert.match(rule, /height: 100%/);
  assert.match(rule, /object-fit: contain/);
  assert.match(rule, /transform: none/);
  const mobile = css.slice(css.indexOf('@media (max-width: 600px)'));
  assert.match(mobile, /\.cm-workspace-visual \.cm-photo-reference \{ aspect-ratio: 1; \}/);
});

for (const slug of ['2x2', '4x4']) {
  test(`${slug}: distinguishes the archived Rubik's assembly source from a current dismantling notice`, () => {
    const page = fs.readFileSync(path.join(__dirname, slug, 'index.html'), 'utf8');
    const source = page.match(/<a\b[^>]+Mechanism\.pdf"[^>]*>/)[0];
    assert.match(source, /target="_blank"/);
    assert.match(source, /rel="noopener noreferrer"/);
    assert.match(page, /archive 2008/);
    assert.match(page, /ancienne version/);
    assert.match(page, /pas un geste d’extraction|ne montre pas comment retirer la première pièce/);
  });
}

test('2x2: follows the same three corner colors from preparation to reassembly', () => {
  const page = fs.readFileSync(path.join(__dirname, '2x2/index.html'), 'utf8');
  assert.match(page, /six coins dans le corps et deux coins séparés/);
  assert.match(page, /sept coins en place/);
  assert.match(page, /coin rouge-blanc-vert rejoint ainsi les faces rouge, blanche et verte/);
  assert.match(page, /huit coins visibles ne signifie pas huit pièces librement amovibles/);
});

test('4x4: distinguishes the piece families and successive reassembly states', () => {
  const page = fs.readFileSync(path.join(__dirname, '4x4/index.html'), 'utf8');
  assert.match(page, /un centre porte un carré de couleur, un élément d’arête en porte deux et un coin en porte trois/);
  assert.match(page, /pas l’ensemble des pièces du 4x4/);
  assert.match(page, /noyau sphérique fermé au-dessus de deux rangées/);
  assert.match(page, /trois rangées inférieures de quatre carrés/);
  assert.match(page, /Le noyau reste assemblé/);
});

test('the Rubik’s series records provenance and the exact prompts for every selected asset', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,
    '../assets/images/nettoyage/creation-entretien-rubiks-v2.json'), 'utf8'));
  assert.deepEqual(manifest.scope, ['2x2', '4x4']);
  assert.equal(manifest.images.length, 12);
  for (const [slug, series] of Object.entries(rubiksSeries)) {
    const images = manifest.images.filter(image => image.slug === slug);
    assert.deepEqual(images.map(image => image.webp), series.map(name => `${name}.webp`));
    images.forEach((image, index) => {
      assert.equal(image.step, index + 1);
      assert.equal(typeof image.prompt, 'string');
      assert.ok(image.prompt.length > 100);
      assert.match(image.mechanical_reference, /Mechanism\.pdf$/);
      assert.ok(fs.existsSync(path.join(__dirname, '../assets/images/nettoyage', image.original)));
    });
  }
});
