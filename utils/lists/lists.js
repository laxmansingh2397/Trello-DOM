import API__KEY, { TOKEN, baseUrl, boardId } from "../../secret.js";

export async function getList() {
    const response = await fetch(`${baseUrl}boards/${boardId}/lists?key=${API__KEY}&token=${TOKEN}`)
    const data = await response.json()
    // console.log(data);
    return data
}

export async function postList(listName) {
    const response = await fetch(`${baseUrl}boards/${boardId}/lists?name=${listName}&key=${API__KEY}&token=${TOKEN}`, { method: 'POST' });
    const data = await response.json();
    return data
}

export async function deleteList(listId) {
    const response = await fetch(`${baseUrl}lists/${listId}/closed?key=${API__KEY}&token=${TOKEN}&value=true`,{method: 'PUT'})
    const data = await response.json()
    // console.log(data);
    return data
}