/* ===============================
   STORAGE
================================ */

const STORAGE_KEY = "roadmap-progress";
const ANNOTATIONS_KEY = "roadmap-annotations";

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

/**
 * Obtiene las anotaciones guardadas para un nodo
 * @param {string} nodeId
 */
function getAnnotations(nodeId) {
  const allAnnotations = JSON.parse(localStorage.getItem(ANNOTATIONS_KEY)) || {};
  return allAnnotations[nodeId] || [];
}

/**
 * Guarda una nueva anotación para un nodo
 * @param {string} nodeId
 * @param {object} annotation {title, content}
 */
function addAnnotation(nodeId, annotation) {
  const allAnnotations = JSON.parse(localStorage.getItem(ANNOTATIONS_KEY)) || {};
  if (!allAnnotations[nodeId]) {
    allAnnotations[nodeId] = [];
  }
  allAnnotations[nodeId].push(annotation);
  localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(allAnnotations));
}
