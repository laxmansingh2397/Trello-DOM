import API__KEY, { TOKEN, baseUrl, boardId } from "../../secret.js";
// import { getList } from "../lists/lists.js";

export async function getCard(listId) {
    const response = await fetch(`${baseUrl}lists/${listId}/cards?key=${API__KEY}&token=${TOKEN}`);
    const data = await response.json();
    return data;
}

export async function postCard(listId, cardName) {
    const response = await fetch(`${baseUrl}cards?key=${API__KEY}&token=${TOKEN}&idList=${listId}&name=${encodeURIComponent(cardName)}`, { method: 'POST' });
    const data = await response.json();
    return data;
}

export async function deleteCard(cardId) {
    const response = await fetch(`${baseUrl}cards/${cardId}?key=${API__KEY}&token=${TOKEN}`, { method: 'DELETE' });
    const data = await response.json();
    return data;
}