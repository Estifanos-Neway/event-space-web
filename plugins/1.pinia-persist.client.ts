import { useGeneralStore } from '~~/pinia-stores/general-store'

export default defineNuxtPlugin(nuxtApp => {
    const generalStore = useGeneralStore();
    const storedState = localStorage.getItem("state")
    if (storedState) {
        generalStore.$state = JSON.parse(storedState).generalStore
    }
    console.log(nuxtApp.pinia)
    watchEffect(
        () => {
            console.log(nuxtApp.pinia)
            localStorage.setItem("state", JSON.stringify({ generalStore: generalStore.$state }))
        }
    )
})