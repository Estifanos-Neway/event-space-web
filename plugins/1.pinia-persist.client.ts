import { useGeneralStore } from '@/pinia-stores'

export default defineNuxtPlugin(nuxtApp => {
    const generalStore = useGeneralStore();
    const storedState = localStorage.getItem("state")
    if (storedState) {
        generalStore.$state = JSON.parse(storedState).generalStore
        generalStore.clearNotification()
    }
    watchEffect(
        () => {
            const stateToStore = { generalStore: generalStore.$state }
            localStorage.setItem("state", JSON.stringify(stateToStore))
        }
    )
})