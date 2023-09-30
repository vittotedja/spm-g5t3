export const getAsync = (url: string, token: null | string = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const api_path = import.meta.env.NODE_ENV === 'production' ? window.location.host + '/' : 'http://localhost:8000/'
    return fetch(api_path + url, { headers });
};