export const getAsync = (url: string, token: null | string = null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return fetch(`http://127.0.0.1:8000/${url}`, { headers });
  };