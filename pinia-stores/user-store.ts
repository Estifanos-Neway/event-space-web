import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => ({
        id: "",
        email: "",
        name: "",
        description: "",
        avatarUrl: "",
        memberSince: "",
        refreshToken:""
    }),
    getters: {
        isAuthorized(state) {
            return state.id !== ""
        }
    },
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
        }),
    },
})