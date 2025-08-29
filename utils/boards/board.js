import API__KEY, { TOKEN, baseUrl, boardId} from "../api/secret.js";

export async function getBoard() {
    const response = await fetch(`${baseUrl}boards/${boardId}?key=${API__KEY}&token=${TOKEN}`);
    const data = await response.json()
    // console.log(data);
    return data.id
}

// getBoard()