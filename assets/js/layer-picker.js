/* Klimaspuren v0.8: eigenständiges, barrierearm bedienbares Layermenü.
   Die Kartensoftware verwendet weiter das Select-Change-Event. */
(() => {
  'use strict';
  const picker = document.getElementById('climate-layer-picker');
  const select = document.getElementById('climate-select');
  const current = document.getElementById('climate-layer-current');
  if (!picker || !select || !current) return;
  const options = [...picker.querySelectorAll('button[data-layer]')];
  const updateSelection = () => {
    const selected = options.find(button => button.dataset.layer === select.value);
    if (!selected) return;
    current.textContent = selected.textContent.trim();
    options.forEach(button => {
      const active = button === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  options.forEach(button => button.addEventListener('click', () => {
    select.value = button.dataset.layer;
    updateSelection();
    picker.open = false;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }));
  select.addEventListener('change', updateSelection);
  document.addEventListener('pointerdown', event => {
    if (picker.open && !picker.contains(event.target)) picker.open = false;
  });
  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape' && picker.open) {
      picker.open = false;
      current.focus();
    }
  });
  updateSelection();
})();
