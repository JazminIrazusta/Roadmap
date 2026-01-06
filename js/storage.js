/* ===============================
   STORAGE
================================ */

const STORAGE_KEY = "roadmap-progress";

/**
 * Obtiene el progreso guardado
 */
function getProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

/**
 * Guarda el estado de un nodo
 * @param {string} id
 * @param {string} status
 */
function setProgress(id, status) {
  const progress = getProgress();
  progress[id] = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
