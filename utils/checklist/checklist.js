import API__KEY, { TOKEN, baseUrl, boardId } from "../../secret.js";

export async function getChecklist(cardId) {
    const response = await fetch(`${baseUrl}cards/${cardId}/checklists?key=${API__KEY}&token=${TOKEN}`, {method: 'GET'});
    const data = await response.json();
    return data;
}


export async function postChecklist(cardId,checklistName) {
    const response = await fetch(`${baseUrl}cards/${cardId}/checklists?key=${API__KEY}&token=${TOKEN}&name=${encodeURIComponent(checklistName)}`,{method: 'POST'})
    const data = await response.json()
    return data
}

export async function deleteChecklist(checklistId) {
    const response = await fetch(`${baseUrl}checklists/${checklistId}?key=${API__KEY}&token=${TOKEN}`,{method: 'DELETE'})
    const data = await response.json()
    return data
}