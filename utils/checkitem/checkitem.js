import API__KEY, { TOKEN, baseUrl, boardId } from "../../secret.js";


export async function getCheckItem(checklistId) {
    const response = await fetch(`${baseUrl}checklists/${checklistId}/checkItems?key=${API__KEY}&token=${TOKEN}`,{method: 'GET'});
    const data = await response.json();
    return data;
}

export async function postCheckItem(checklistId, name) {
  const response = await fetch(`${baseUrl}checklists/${checklistId}/checkItems?name=${name}&key=${API__KEY}&token=${TOKEN}`, {method: "POST"});
  const data = await response.json();
  return data
}

export async function deleteCheckItem(checklistId, itemId) {
  const response = await fetch(`${baseUrl}checklists/${checklistId}/checkItems/${itemId}?key=${API__KEY}&token=${TOKEN}`,{method: "DELETE"});
  const data = await response.json();
}

export async function updateCheckItemState(cardId, itemId, state) {
  const response = await fetch(`${baseUrl}cards/${cardId}/checkItem/${itemId}?state=${state}&key=${API__KEY}&token=${TOKEN}`,{method: "PUT"})
  const data = await response.json();
  return data
}

