import { getList, postList, deleteList } from "./utils/lists/lists.js";
import { getCard, postCard, deleteCard} from "./utils/cards/card.js";
import { getChecklist, postChecklist, deleteChecklist } from "./utils/checklist/checklist.js";
import { getCheckItem, postCheckItem, deleteCheckItem, updateCheckItemState } from "./utils/checkitem/checkitem.js";

const backDrop = document.getElementById('back-drop');
const mainContainer = document.getElementById("main-container");


let listsWithCards = []; // single source of truth

// Load lists + cards together
async function loadBoard() {
  const lists = await getList();
  // console.log(lists);
  listsWithCards = await Promise.all(
    lists.map(async list => {
      const cards = await getCard(list.id);
      return { ...list, cards };
    })
  );
  // console.log(listsWithCards);
  renderList(listsWithCards);
}

loadBoard();

// this will render list logic start from here
function renderList(lists) {
  mainContainer.innerHTML = `
    <div class="board-name">
        <h2>Laxman</h2>
    </div>
    <div class="list-container">    
      ${lists.map((list, index) => `
        <div class="list">
          <div class="list-header">
            <h3>${list.name}</h3>
            <button data-id="${list.id}" class="delete-list-btn">X</button>
          </div>

          <div class="cards" id="list-${list.id}">
            ${list.cards?.map((card, index) => `
                <div class="card">
                    <div class="radio-card">
                      <input type="radio">
                      <h4>${card.name}</h4>
                    </div>
                    <button data-id=${card.id} class="delete-card-btn">X</button>
                </div>
              `).join("") || ""
    }
          </div>

          <div class="add-card">
          <input class="input-card ${index} ${list.id}"  type="text" placeholder="Enter a title" style='display:none;'>
            <button class='add-card ${index}' id=${list.id}>+ Add a card</button>
          </div>
        </div>
      `).join("")}

      <div class="add-list-btn">
        <input id="input-list" type="text" placeholder="Enter List Name...">
        <button id="add-list-btn">+ Add List</button>
      </div>
    </div>
  `;

  // Re-bind events
  document.getElementById("add-list-btn").addEventListener("click", addListHandler);
  document.querySelectorAll(".delete-list-btn").forEach(btn =>
    btn.addEventListener("click", deleteListHandler)
  );
  document.querySelector(".list-container").addEventListener('click', showCardInput);
  document.querySelector(".list-container").addEventListener('keydown', addCardHandler);
  
  document.querySelectorAll(".delete-card-btn").forEach(btn => btn.addEventListener("click", deleteCardHandler))

  document.querySelectorAll(".card").forEach(btn => btn.addEventListener('click', showCardModel))

  document.querySelectorAll("#add-checklist-btn").forEach(btn => btn.addEventListener('click', showCheklistInputField))
}

// add list and delete list start from here

async function addListHandler() {
  const input = document.getElementById("input-list");
  if (!input.value.trim()) return;

  const newList = await postList(input.value.trim());
  const cards = await getCard(newList.id); // fetch cards (likely empty at first)
  listsWithCards = [{ ...newList, cards }, ...listsWithCards];
  renderList(listsWithCards);
}

async function deleteListHandler(e) {
  const listId = e.target.dataset.id;
  await deleteList(listId);
  listsWithCards = listsWithCards.filter(list => list.id != listId);
  renderList(listsWithCards);
}

//cards logic starts from here

function showCardInput(e) {
  const input = document.querySelectorAll('.input-card');

  input.forEach((value) => {
    if (e.target.classList[1] === value.classList[1]) {
      value.style.display = 'block';
    }
    else {
      value.style.display = 'none';
    }
  })
}

async function addCardHandler(e) {
  if (!e.target.classList.contains('input-card')) return

  if (e.key === 'Enter') {
    let listId = e.target.classList[2];
    let cardName = e.target.value;
    await postCard(listId, cardName);

    const updatedCards = await getCard(listId);

    listsWithCards = listsWithCards.map(list => list.id === listId ? { ...list, cards: updatedCards } : list);

    e.target.value = "";
    renderList(listsWithCards);
  }
}

async function deleteCardHandler(e) {
  const cardId = e.target.dataset.id
  console.log(cardId);
  await deleteCard(cardId);
  listsWithCards = listsWithCards.map(list => {
    return { ...list, cards: list.cards.filter(card => card.id != cardId) };
  });
  renderList(listsWithCards);
}


// Inside cards model will open and shows checklist and checkitems start here

async function showCheklistInputField(e) {
  const inputChecklist = document.querySelector('.input-checklist');
  inputChecklist.style.display = 'block';
}

async function showCardModel(e) {
  if (e.target.classList.contains("delete-card-btn")) return;

  const cardElement = e.currentTarget;
  const cardName = cardElement.querySelector("h4").textContent;
  const cardId = cardElement.querySelector("button").dataset.id;
  document.getElementById("model-card-name").textContent = cardName;

  await renderChecklists(cardId);

  const checklistName = document.getElementById('input-add-checklist');
  checklistName.value = "";
  checklistName.onkeydown = (e) => addChecklistHandler(e, cardId, checklistName);

  // Show modal
  document.getElementById("model").style.display = "block";
  document.getElementById("back-drop").style.display = "block";

  // Close events
  document.querySelector(".close-model").onclick = () => {
    document.getElementById("model").style.display = "none";
    document.getElementById("back-drop").style.display = "none";
    checklistName.style.display = "None"
  };
  document.getElementById("back-drop").onclick = () => {
    document.getElementById("model").style.display = "none";
    document.getElementById("back-drop").style.display = "none";
    checklistName.style.display = "None"
  };

}

//Render checklist and checklist items starts from here

async function renderChecklists(cardId) {
  const checklists = await getChecklist(cardId);
  const checklistUl = document.getElementById("checklist-items");
  checklistUl.innerHTML = "";

  if (checklists.length) {
    checklists.forEach(checklist => {
      checklistUl.innerHTML += `
        <li>
          <div class="checklist-div">
            <div><strong>${checklist.name}</strong></div>
            <div><button data-id="${checklist.id}" class="delete-checklist-btn">Delete</button></div>
          </div>
          <div class="add-checkitem">
            <button data-id="${checklist.id}" class="add-checkitem-btn">+ Add CheckItem</button>
            <input class="input-checkitem" data-checklist-id="${checklist.id}" placeholder="Add an item" style="display:none">
          </div>
          <ul>
            ${checklist.checkItems.map(item => `
              <li class="checkitem">
                <div class="checkitem-input-div">
                  <div class="checkitem-and-input">
                    <input type="checkbox" data-checklist-id="${checklist.id}" data-item-id="${item.id}" ${item.state === "complete" ? "checked" : ""}>
                    ${item.name}
                  </div>
                  <div>
                    <button class="delete-checkitem-btn" data-checklist-id="${checklist.id}" data-item-id="${item.id}">x</button>
                  </div>
                </div>
              </li>
            `).join("")}
          </ul>
        </li>
      `;
    });
  } else {
    checklistUl.innerHTML = "<p>No checklist available</p>";
  }

  // Now reattach events
  checklistUl.querySelectorAll(".delete-checklist-btn").forEach(btn =>
    btn.addEventListener('click', (e) => deleteChecklistHandler(e, cardId))
  );

  checklistUl.querySelectorAll(".add-checkitem-btn").forEach(btn =>
    btn.addEventListener('click', (e) => {
      const checklistId = e.target.dataset.id;
      const input = checklistUl.querySelector(`.input-checkitem[data-checklist-id="${checklistId}"]`);
      input.style.display = "block";
      input.focus();
    })
  );

  checklistUl.querySelectorAll(".input-checkitem").forEach(input =>
    input.addEventListener("keypress", (e) => addCheckItemHandler(e, cardId))
  );

  checklistUl.querySelectorAll(".delete-checkitem-btn").forEach(btn =>
    btn.addEventListener("click", (e) => deleteCheckItemHandler(e, cardId))
  );

  checklistUl.querySelectorAll(".checkitem input[type='checkbox']").forEach(checkbox =>
    checkbox.addEventListener("change", (e) => toggleCheckItemHandler(e, cardId))
  );
}

//Checklist start from here

async function addChecklistHandler(e, cardId, checklistInput) {
  if (e.key !== 'Enter') return;
  const checklistName = checklistInput.value.trim();
  if (!checklistName) return;

  await postChecklist(cardId, checklistName);
  checklistInput.value = ""; // clear after adding
  await renderChecklists(cardId);
}

async function deleteChecklistHandler(e, cardId) {
  const checklistId = e.target.dataset.id;
  await deleteChecklist(checklistId);
  await renderChecklists(cardId);
}

// checkItems start from here

async function addCheckItemHandler(e, cardId) {
  if (e.key !== "Enter") return;

  const checklistId = e.target.dataset.checklistId;
  const itemName = e.target.value.trim();
  if (!itemName) return;

  await postCheckItem(checklistId, itemName);
  e.target.value = "";
  e.target.style.display = "none";

  await renderChecklists(cardId);
}

async function deleteCheckItemHandler(e, cardId) {
  const checklistId = e.target.dataset.checklistId;
  const itemId = e.target.dataset.itemId;

  await deleteCheckItem(checklistId, itemId);
  await renderChecklists(cardId);
}

async function toggleCheckItemHandler(e, cardId) {
  const checklistId = e.target.dataset.checklistId;
  const itemId = e.target.dataset.itemId;
  const newState = e.target.checked ? "complete" : "incomplete";

  await updateCheckItemState(cardId, itemId, newState);
  await renderChecklists(cardId);
}
