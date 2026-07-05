/**
 * form.js – Lógica del formulario de descarga de la guía
 * - Validación de campos (nombre y email)
 * - Manejo del envío con simulación de éxito
 * - Mensaje de agradecimiento al usuario
 * - Feedback visual para errores (campos vacíos o email inválido)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar el formulario de la CTA (descarga de guía)
  const ctaForm = document.querySelector('.cta-form');

  if (!ctaForm) {
    // Si no hay formulario en la página, no hacer nada
    return;
  }

  // Elementos del formulario
  const emailInput = ctaForm.querySelector('input[type="email"]');
  const submitButton = ctaForm.querySelector('button[type="submit"]');

  // Crear contenedor para mensajes de error y éxito
  const feedbackContainer = document.createElement('div');
  feedbackContainer.className = 'form-feedback';
  ctaForm.appendChild(feedbackContainer);

  // Función para mostrar mensaje de error en un campo
  const showFieldError = (input, message) => {
    // Eliminar error previo
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Marcar visualmente el campo como inválido
    input.classList.add('input-error');

    // Crear elemento de error
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');

    // Insertar después del input
    input.parentElement.insertBefore(errorEl, input.nextSibling);
  };

  // Función para limpiar errores de un campo
  const clearFieldError = (input) => {
    input.classList.remove('input-error');
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  };

  // Función para validar email
  const isValidEmail = (email) => {
    // Expresión regular simple pero efectiva
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para mostrar mensaje de feedback general (éxito o error)
  const showFeedback = (message, type) => {
    feedbackContainer.textContent = message;
    feedbackContainer.className = `form-feedback form-feedback--${type}`;
    feedbackContainer.setAttribute('role', type === 'error' ? 'alert' : 'status');
  };

  // Función para limpiar feedback general
  const clearFeedback = () => {
    feedbackContainer.textContent = '';
    feedbackContainer.className = 'form-feedback';
    feedbackContainer.removeAttribute('role');
  };

  // Función para simular envío exitoso
  const simulateSuccess = () => {
    // Deshabilitar botón y cambiar texto
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando…';

    // Simular demora de red (1.5 segundos)
    setTimeout(() => {
      // Mostrar mensaje de agradecimiento
      showFeedback('¡Gracias! Revisa tu correo para descargar la guía.', 'success');

      // Restaurar botón (opcional, podría quedar deshabilitado)
      submitButton.disabled = false;
      submitButton.textContent = 'Descargar guía';

      // Limpiar campos
      emailInput.value = '';
      clearFieldError(emailInput);
    }, 1500);
  };

  // Manejar el envío del formulario
  ctaForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Limpiar feedback previo
    clearFeedback();
    clearFieldError(emailInput);

    // Obtener valores
    const email = emailInput.value.trim();

    // Validar campos
    let hasError = false;

    if (!email) {
      showFieldError(emailInput, 'El correo electrónico es obligatorio.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, 'Introduce un correo electrónico válido (ej: usuario@dominio.com).');
      hasError = true;
    }

    if (hasError) {
      // Mostrar mensaje de error general
      showFeedback('Corrige los errores antes de continuar.', 'error');
      return;
    }

    // Si todo es válido, simular envío exitoso
    simulateSuccess();
  });

  // Limpiar errores al escribir en los campos
  emailInput.addEventListener('input', () => {
    clearFieldError(emailInput);
    clearFeedback();
  });

  // ============================================================
  // Estilos CSS para el feedback visual (se inyectan dinámicamente)
  // ============================================================
  const style = document.createElement('style');
  style.textContent = `
    /* Contenedor de feedback general */
    .form-feedback {
      width: 100%;
      margin-top: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
      text-align: center;
      transition: opacity 0.3s ease;
    }

    .form-feedback--error {
      background-color: #fce4e4;
      color: #b33a3a;
      border: 1px solid #e8b4b4;
    }

    .form-feedback--success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    /* Error de campo */
    .field-error {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.8rem;
      color: #b33a3a;
    }

    /* Input con error */
    .input-error {
      border-color: #b33a3a !important;
      box-shadow: 0 0 0 2px rgba(179, 58, 58, 0.2) !important;
    }

    /* Botón deshabilitado */
    .cta-form button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
});
