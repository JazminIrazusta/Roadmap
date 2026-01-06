document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cardForm");
  const cardsContainer = document.getElementById("cardsContainer");

  const STORAGE_KEY = "excel_cards";

  // Cargar tarjetas al iniciar
  loadCards();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const content = document.getElementById("content").value;

    const card = {
      id: Date.now(),
      title,
      description,
      content
    };

    const cards = getCards();
    cards.push(card);
    saveCards(cards);
    renderCard(card);
    form.reset();
  });

  // Event delegation for edit and delete
  cardsContainer.addEventListener("click", function(e) {
    const cardElement = e.target.closest(".card");
    if (!cardElement) return;
    const cardId = parseInt(cardElement.getAttribute("data-id"));

    if (e.target.classList.contains("edit-btn")) {
      editCard(cardId);
    } else if (e.target.classList.contains("delete-btn")) {
      deleteCard(cardId);
    }
  });

  function getCards() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveCards(cards) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  function loadCards() {
    cardsContainer.innerHTML = "";
    const cards = getCards();
    cards.forEach(renderCard);
  }

  function renderCard(card) {
    const details = document.createElement("details");
    details.className = "card";
    details.setAttribute("data-id", card.id);
    details.innerHTML = `
      <summary class="card__title">${card.title}</summary>
      <p class="card__text">${card.description}</p>
      <details class="details">
        <summary class="summary">Contenido completo</summary>
        <div class="details__body">
          <p>${card.content.replace(/\n/g, "<br>")}</p>
        </div>
      </details>
      <div class="card__actions">
        <button class="btn btn--small edit-btn">Editar</button>
        <button class="btn btn--small delete-btn">Eliminar</button>
      </div>
    `;
    cardsContainer.appendChild(details);
  }

  function editCard(cardId) {
    const cards = getCards();
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = cards[cardIndex];
    const newTitle = prompt("Editar título:", card.title);
    const newDesc = prompt("Editar descripción:", card.description);
    const newContent = prompt("Editar contenido:", card.content);

    if (newTitle !== null && newDesc !== null && newContent !== null) {
      cards[cardIndex] = { ...card, title: newTitle, description: newDesc, content: newContent };
      saveCards(cards);
      loadCards();
    }
  }

  function deleteCard(cardId) {
    if (confirm("¿Eliminar esta tarjeta?")) {
      const cards = getCards();
      const newCards = cards.filter(c => c.id !== cardId);
      saveCards(newCards);
      loadCards();
    }
  }
});