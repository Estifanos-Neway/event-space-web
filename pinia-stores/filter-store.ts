import { defineStore } from "pinia";

export const useFilterStore = defineStore("filterStore", {
    state: () => ({
        orderBy: {}
    })
})