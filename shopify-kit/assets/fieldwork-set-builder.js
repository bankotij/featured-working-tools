(() => {
  if (customElements.get('fieldwork-set-builder')) return;
  class FieldworkSetBuilder extends HTMLElement {
    connectedCallback() {
      if (this.bound) return;
      this.bound = true;
      this.form = this.querySelector('form');
      this.button = this.querySelector('[data-submit]');
      this.status = this.querySelector('[data-status]');
      this.cartLink = this.querySelector('[data-cart-link]');
      this.form.addEventListener('change', event => {
        if (event.target.matches('[data-include][data-required]')) event.target.checked = true;
        const group = event.target.closest('fieldset');
        if (group && event.target.matches('[data-variant]')) {
          const image = group.querySelector('img');
          const url = event.target.selectedOptions[0]?.dataset.image;
          if (image && url) { image.removeAttribute('srcset'); image.src = url; }
        }
        this.update();
      });
      this.form.addEventListener('submit', event => { event.preventDefault(); this.submit(); });
      this.update();
    }
    selection() {
      const items = [];
      let total = 0;
      let requiredUnavailable = false;
      for (const group of this.querySelectorAll('fieldset')) {
        const include = group.querySelector('[data-include]');
        const option = group.querySelector('[data-variant]')?.selectedOptions[0];
        const available = option?.dataset.available === 'true' && !include.disabled;
        if (include.hasAttribute('data-required') && !available) requiredUnavailable = true;
        if (!include.checked || !available) continue;
        const id = Number(option.value), price = Number(option.dataset.price);
        if (!Number.isSafeInteger(id) || id <= 0 || !Number.isFinite(price) || price < 0) throw new Error('A selected variant is invalid. Refresh the page.');
        items.push({id, quantity: 1});
        total += price;
      }
      return {items,total,requiredUnavailable};
    }
    update() {
      try {
        const state = this.selection();
        this.querySelector('[data-total]').textContent = new Intl.NumberFormat(document.documentElement.lang || 'en', {style:'currency',currency:this.dataset.currency || 'USD'}).format(state.total / 100);
        this.button.disabled = this.busy || state.requiredUnavailable || !state.items.length;
        this.status.textContent = state.requiredUnavailable ? 'A required piece is unavailable. Please choose another set.' : !state.items.length ? 'Select at least one available piece.' : '';
      } catch (error) { this.button.disabled = true; this.status.textContent = error.message; }
    }
    async submit() {
      if (this.busy) return;
      let state;
      try { state = this.selection(); } catch (error) { this.status.textContent = error.message; return; }
      if (state.requiredUnavailable || !state.items.length) { this.update(); return; }
      this.busy = true;
      this.button.disabled = true;
      this.button.textContent = 'Adding your set…';
      this.status.textContent = '';
      this.cartLink.hidden = true;
      const root = (window.Shopify?.routes?.root || this.dataset.root || '/').replace(/\/?$/, '/');
      const group = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const items = state.items.map(item => ({...item, properties:{_fieldwork_set:group}}));
      let serverMessage;
      try {
        const response = await fetch(root + 'cart/add.js', {method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({items})});
        const data = await response.json();
        if (!response.ok) {
          serverMessage = typeof data.description === 'string' ? data.description : 'The set could not be added. Check availability and review your cart.';
          throw new Error(serverMessage);
        }
        this.status.textContent = 'Set added. Opening your cart…';
        window.location.assign(root + 'cart');
      } catch (error) {
        this.busy = false;
        this.button.textContent = 'Add selected set to cart';
        this.update();
        this.status.textContent = serverMessage || 'The result is uncertain. Review your cart before making another attempt.';
        this.cartLink.hidden = false;
      }
    }
  }
  customElements.define('fieldwork-set-builder', FieldworkSetBuilder);
})();
