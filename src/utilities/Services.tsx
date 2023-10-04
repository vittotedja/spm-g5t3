const api_path = window.location.host === 'localhost:5173' ? 'http://localhost:8000/' : window.location.origin + '/';

export async function setInitial(setResult: Function, url: string, list: boolean = true) {
    const response = await getAsync(url)
    const data = await response.json()
    setResult(list ? data : data[0])
    return data[0]
}

export const getAsync = (url: string, token: null | string = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    return fetch(api_path + url, { headers })
};

export const postAsync = (url: string, data: any, token: null | string = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    return fetch(api_path + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify(data),
    })
}

export const putAsync = (url: string, data: any, token: null | string = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    return fetch(api_path + url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify(data),
    })
}