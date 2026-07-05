document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  if (!app) {
    return;
  }

  app.innerHTML = `
    <div class="container">
      <section class="hero" aria-labelledby="landing-title">
        <h1 id="landing-title">Landing page en construcción</h1>
        <p>La estructura base ya está preparada para el contenido de la propuesta.</p>
      </section>

      <section class="section" aria-label="Secciones previstas">
        <h2>Secciones previstas</h2>
        <ul>
          <li>Hero</li>
          <li>Problema</li>
          <li>Solución</li>
          <li>Evidencia</li>
          <li>Beneficios</li>
          <li>CTA</li>
          <li>Footer</li>
        </ul>
      </section>
    </div>
  `;
});
