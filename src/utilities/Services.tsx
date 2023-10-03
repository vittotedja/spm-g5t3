const api_path = window.location.host === 'localhost:5173' ? 'http://localhost:8000/' : ''

export async function setInitial(setResult: Function, url: string, list: boolean = true) {
    const response = await getAsync(url)
    const data = await response.json()
    setResult(list ? data : data[0])
    return data[0]
}

export const getAsync = (url: string, token: null | string = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const api_path = import.meta.env.NODE_ENV === 'production' ? window.location.host + '/' : 'http://localhost:8000/'
    return fetch(api_path + url, { headers });
};