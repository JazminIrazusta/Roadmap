/* ===============================
   ROADMAP
================================ */

/**
 * Renderiza todo el roadmap en SVG
 */
async function renderRoadmap() {
  const response = await fetch("data/roadmap.json");
  const roadmapData = await response.json();

  const progress = getProgress();
  const allDone = roadmapData.every(node => progress[node.id] === 'done');

  const svg = document.querySelector('.roadmap-svg');
  svg.innerHTML = '';

  // Definir marker para flechas
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  // Gradiente para nodos
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'nodeGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '100%');
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#4c4977');
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#3e3b6b');
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);

  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill', 'var(--border)');
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Crear líneas curvas
  roadmapData.forEach(node => {
    if (node.connections) {
      node.connections.forEach(connId => {
        const target = roadmapData.find(n => n.id === connId);
        if (target) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const midX = node.x + dx / 2;
          const midY = node.y + dy / 2;
          // Curva simple
          const d = `M ${node.x} ${node.y} Q ${midX} ${node.y} ${midX} ${midY} T ${target.x} ${target.y}`;
          path.setAttribute('d', d);
          path.setAttribute('stroke', 'var(--border)');
          path.setAttribute('stroke-width', '3');
          path.setAttribute('stroke-dasharray', '10,5');
          path.setAttribute('fill', 'none');
          path.setAttribute('marker-end', 'url(#arrowhead)');
          svg.appendChild(path);
        }
      });
    }
  });

  // Crear nodos
  roadmapData.forEach(nodeData => {
    const status = progress[nodeData.id] || 'pending';
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('node');
    g.setAttribute('data-id', nodeData.id);

    let fillColor = 'url(#nodeGradient)';
    let strokeColor = 'var(--border)';
    let strokeWidth = '2';
    let outerR = 40;
    let innerR = 30;

    if (nodeData.id === 'starting' || nodeData.id === 'analyst') {
      outerR = 50;
      innerR = 38;
      fillColor = '#c084fc'; // púrpura más fuerte
    }

    if (status === 'in_progress') {
      fillColor = '#fad000'; // amarillo
      strokeColor = '#ff9f43';
    } else if (status === 'done') {
      fillColor = '#b362ff'; // púrpura
      strokeColor = '#9b4dff';
      strokeWidth = '4';
    }

    if (nodeData.id === 'analyst' && allDone) {
      fillColor = '#00ffff'; // celeste
      strokeColor = '#00bfff';
    }

    // Círculo exterior
    const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle1.setAttribute('cx', nodeData.x);
    circle1.setAttribute('cy', nodeData.y);
    circle1.setAttribute('r', outerR);
    circle1.setAttribute('fill', fillColor);
    circle1.setAttribute('stroke', strokeColor);
    circle1.setAttribute('stroke-width', strokeWidth);

    // Círculo interior
    const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle2.setAttribute('cx', nodeData.x);
    circle2.setAttribute('cy', nodeData.y);
    circle2.setAttribute('r', innerR);
    circle2.setAttribute('fill', 'var(--bg-surface)');

    // Texto
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', nodeData.x);
    text.setAttribute('y', nodeData.y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'var(--text-main)');
    text.setAttribute('font-size', '12px');
    text.setAttribute('font-weight', 'bold');
    text.textContent = nodeData.title;

    g.appendChild(circle1);
    g.appendChild(circle2);
    g.appendChild(text);

    // Event listener
    g.addEventListener('click', () => {
      if (nodeData.page) {
        window.location.href = nodeData.page;
      } else {
        setProgress(nodeData.id, newStatus);
        renderRoadmap(); // Re-render para actualizar colores
      }
    });

    svg.appendChild(g);
  });
}
