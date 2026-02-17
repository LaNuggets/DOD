export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const loadToken = (): string | null => {
    return localStorage.getItem('token');
}

export const clearToken = () => {
    localStorage.removeItem('token');
}
