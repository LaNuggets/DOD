export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const loadToken = (): string | null => {
    return localStorage.getItem('token');
}

export const clearToken = () => {
    localStorage.removeItem('token');
}

export const getUsernameFromToken = (token: string | null) => {
    if (!token) return null
    try {
        const parts = token.split('.')
        if (!parts[1] || parts.length < 2) return null
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        return payload.username || payload.preferred_username || payload.sub || payload.name || null
    } catch {
        return null
    }
}
