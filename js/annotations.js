/* ===============================
   ANNOTATIONS
================================ */

/**
 * Renderiza las anotaciones para un nodo
 * @param {string} nodeId
 */
function renderAnnotations(nodeId) {
  const annotations = getAnnotations(nodeId);
  const container = document.querySelector('.annotations-container');
  container.innerHTML = '';

  annotations.forEach((annotation, index) => {
    const details = document.createElement('details');
    details.classList.add('annotation-item');

    const summary = document.createElement('summary');
    summary.textContent = annotation.title;

    const content = document.createElement('p');
    content.textContent = annotation.content;

    details.appendChild(summary);
    details.appendChild(content);
    container.appendChild(details);
  });
}

/**
 * Inicializa el formulario de anotaciones
 * @param {string} nodeId
 */
function initAnnotationForm(nodeId) {
  const form = document.getElementById('annotation-form');
  const titleInput = document.getElementById('annotation-title');
  const contentInput = document.getElementById('annotation-content');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title && content) {
      addAnnotation(nodeId, { title, content });
      renderAnnotations(nodeId);
      titleInput.value = '';
      contentInput.value = '';
    }
  });
}