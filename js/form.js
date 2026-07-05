document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('[data-form]');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');

      if (button) {
        button.disabled = true;
        button.textContent = 'Enviado';
      }
    });
  });
});
