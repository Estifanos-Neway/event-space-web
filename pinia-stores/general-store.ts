import { defineStore } from "pinia";

export const useGeneralStore = defineStore("generalStore", {
    state: () => ({
        theme: {
            dark: false
        }
    }),
    getters: {
        isDark(state) {
            return state.theme.dark
        }
    },
    actions: {
        toggleDarkMode() {
            this.theme.dark = !this.theme.dark
        }
    }
}
)