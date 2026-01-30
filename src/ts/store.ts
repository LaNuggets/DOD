import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveToken, loadToken, clearToken } from './saveload'

export const useStore = defineStore('token', () => {
    const token = ref<string | null>(loadToken())

    const setToken = (newToken: string) => {
        token.value = newToken
        saveToken(newToken)
    }

    const getToken = () => {
        return token.value
    }

    const removeToken = () => {
        token.value = null
        clearToken()
    }

    return {
        token,
        setToken,
        getToken,
        removeToken
    }
})