(() => {
  const guide = document.querySelector('[data-cleaning-guide]');
  if (!guide) return;

  const steps = [...guide.querySelectorAll('[data-cleaning-step]')];
  const buttons = [...guide.querySelectorAll('[data-step-index]')];
  const navigation = guide.querySelector('[data-step-navigation]');
  const controls = guide.querySelector('[data-step-controls]');
  const status = guide.querySelector('[data-step-status]');
  const previous = guide.querySelector('[data-direction="-1"]');
  const next = guide.querySelector('[data-direction="1"]');
  const nextLabel = guide.querySelector('[data-next-label]');
  const position = guide.querySelector('[data-position-label]');
  const progress = guide.querySelector('[data-step-progress]');
  if (!steps.length || buttons.length !== steps.length || !navigation || !controls ||
      !status || !previous || !next || !nextLabel || !position || !progress) return;

  let activeStep = 0;

  function selectStep(index, updateUrl = true) {
    if (!Number.isInteger(index) || index < 0 || index >= steps.length) return;
    activeStep = index;
    steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== index; });
    buttons.forEach((button, stepIndex) => {
      if (stepIndex === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    previous.disabled = index === 0;
    nextLabel.textContent = index === steps.length - 1 ? 'Revoir le parcours' : 'Étape suivante';
    next.setAttribute('aria-label', index === steps.length - 1 ? 'Revoir le parcours depuis la première étape' : 'Étape suivante');
    position.textContent = `Étape ${index + 1} sur ${steps.length}`;
    progress.max = steps.length;
    progress.value = index + 1;
    if (updateUrl) {
      try { history.replaceState(null, '', `#${steps[index].id}`); }
      catch { /* Certains navigateurs restreignent les URL des fichiers locaux. */ }
    }
  }

  guide.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.hasAttribute('data-step-index')) selectStep(Number(button.dataset.stepIndex));
    else if (button === previous) selectStep(Math.max(0, activeStep - 1));
    else if (button === next) selectStep((activeStep + 1) % steps.length);
  });

  navigation.addEventListener('keydown', event => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? steps.length - 1 :
      Math.max(0, Math.min(steps.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
    selectStep(target);
    buttons[target].focus({preventScroll: true});
  });

  window.addEventListener('hashchange', () => {
    const index = steps.findIndex(step => `#${step.id}` === location.hash);
    if (index >= 0) selectStep(index, false);
  });

  navigation.hidden = false;
  controls.hidden = false;
  status.hidden = false;
  guide.classList.add('is-interactive');
  const initialStep = steps.findIndex(step => `#${step.id}` === location.hash);
  selectStep(initialStep < 0 ? 0 : initialStep, false);
  window.lucide?.createIcons({attrs: {'stroke-width': 1.8}});
})();
