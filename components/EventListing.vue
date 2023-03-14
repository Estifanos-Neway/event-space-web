<template>
    <div @scroll="handleScroll" ref="scrollingList" class="h-full overflow-auto p-5">

        <div class="flex gap-4">
            <div>
                <div class="flex items-center mb-4" v-if="props.listKind !== 'saved'">
                    <input id="sort-by-location-checkbox" type="checkbox" v-model="sortByLocation"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="sort-by-location-checkbox"
                        class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sort by location</label>
                </div>
                Sort BY
                <br>
                <select name="None" v-model="sortBy">
                    <option value="none">None</option>
                    <option value="dateAsc">date A</option>
                    <option value="dateDesc">date D</option>
                    <option value="priceAsc">price A</option>
                    <option value="priseDesc">price D</option>
                </select>
            </div>
            <div class="flex flex-col gap-2">
                Price range
                <label for="min-price">Min price</label>
                <input v-model="minPrice" type="number" name="min-price">
                <label for="max-price">Max price</label>
                <input v-model="maxPrice" type="number" name="max-price">
            </div>
            <div class="flex flex-col gap-2">
                Date range
                <label for="min-date">Min date</label>
                <input v-model="minDate" type="date" name="min-date">
                <label for="max-date">Max date</label>
                <input v-model="maxDate" type="date" name="max-date">
            </div>

            <div>
                <button id="dropdownSearchButton" data-dropdown-toggle="dropdownSearch" data-dropdown-placement="bottom"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button">Select city<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div id="dropdownSearch" class="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                    <div class="p-3">
                        <label for="input-group-search" class="sr-only">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor"
                                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <input type="text" id="input-group-search" v-model="citySearchText"
                                class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search city">
                        </div>
                    </div>
                    <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownSearchButton">
                        <li v-for="(city, index) in getCitiesResult?.cities"
                            v-show="!citySearchText || searchedCities[index]" :key="city.id">
                            <div class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input :id="city.id" type="checkbox" :value="city.id" v-model="selectedCities"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                <label :for="city.id"
                                    class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{{
                                        city.name }}</label>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="relative" v-if="props.listKind !== 'saved'">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
            <input type="search" v-model="searchText"
                class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Events...">
        </div>
        <br>
        <div v-for="event in events" class="mb-3" :key="event.id">
            <EventCard :event="event" />
        </div>
        <div :class="{ invisible: !loading }">
            loading...
        </div>
        <div v-if="error">
            Error | <span class="text-blue-400" @click="refetchEvents">Retry</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { DocumentNode } from "graphql";
import { GetEventsVars, SearchEventsRes, GetEventsRes, GetMyEventsRes, GetSavedEventsRes, GetEventsByLocationRes } from "~~/graphql/events/get-events.types";
import { getEventsQuery, searchEventsQuery, getEventByLocationQuery, getMyEventsQuery, getSavedEventsQuery } from "~~/graphql/events"
import { EventPreview } from "~~/graphql/events/event-preview.type";
import { useUserStore } from "~~/pinia-stores";
import { initDropdowns } from 'flowbite'
import { useGeolocation } from '@vueuse/core'
type listKindType = "all" | "my" | "saved" | "search" | "location"

const userStore = useUserStore()
const props = defineProps<
    {
        listKind: listKindType
    }
>()
const { coords } = useGeolocation()
// vars
const paginationLimit: number = 8
const userId = userStore.id
let queryDocument = ref<DocumentNode>(getEventsQuery)
let queryVars = reactive<GetEventsVars>(
    {
        offset: 0,
        limit: paginationLimit,
        orderBy: {},
        cityId: {},
        date: {},
        price: {},
        userId: userId && props.listKind === "my" ? { _eq: userId } : {},
        bookmarks: {},
        search: "",
        lat: coords.value.latitude,
        long: coords.value.longitude,
    }
)
let events = reactive<Array<EventPreview>>([])
let getEvents: (result: any) => Array<EventPreview>
let updateQuery: (previousResult: any, fetchMoreResult: any) => {}

// sort by location
watch(coords, () => {
    queryVars.lat = coords.value.latitude
    queryVars.long = coords.value.longitude
})
const sortByLocation = ref<boolean>(true)
watch(sortByLocation, () => {
    if (sortByLocation.value) {
        setQueries("location")
        sortBy.value = "none"
    } else {
        setQueries(props.listKind)
    }
})

// search
const searchText = ref("")
watch(searchText, () => {
    if (searchText.value.length > 2 && props.listKind !== "saved") {
        queryVars.search = searchText.value
        setQueries("search")
    } else {
        setQueries(props.listKind)
    }
})

// sortBY
const sortBys = {
    "none": {},
    "dateAsc": { date: "ASC" },
    "dateDesc": { date: "DESC" },
    "priceAsc": { price: "ASC" },
    "priseDesc": { price: "DESC" },
}
const sortBy = ref("none")
watch(sortBy, (newValue) => {
    if (newValue != "none") {
        sortByLocation.value = false
    }
    // @ts-ignore
    queryVars.orderBy = sortBys[newValue]
})

// filter by price
const minPrice = ref()
const maxPrice = ref()
watch([minPrice, maxPrice], ([minP, maxP]) => {
    const range: { _gte?: number, _lte?: number } = {}
    if (typeof minP === "number") {
        range._gte = minP
    }
    if (typeof maxP === "number") {
        range._lte = maxP
    }
    queryVars.price = range
})

// filter by date
const minDate = ref<string>()
const maxDate = ref<string>()
watch([minDate, maxDate], ([minD, maxD]) => {
    const range: { _gte?: string, _lte?: string } = {}
    if (minD) {
        range._gte = minD
    }
    if (maxD) {
        range._lte = maxD
    }
    queryVars.date = range
})

// filter by cities
const { result: getCitiesResult, onError: onGetCitiesError } = getCities()
onGetCitiesError(error => {
    console.error("onGetCitiesError:", error)
})
const selectedCities = ref<Array<string>>([])
watch(selectedCities, () => {
    if (selectedCities.value.length) {
        queryVars.cityId = { _in: selectedCities.value }
    } else {
        queryVars.cityId = {}
    }
})
const citySearchText = ref("")
const searchedCities = ref<Boolean[]>([])
watch(citySearchText, () => {
    if (getCitiesResult.value) {
        searchedCities.value = getCitiesResult.value?.cities.map(city => city.name.toLowerCase().includes(citySearchText.value.toLocaleLowerCase()))
    }
})
function setQueries(listKind: listKindType) {
    switch (listKind) {
        case "all":
            queryDocument.value = getEventsQuery
            getEvents = (result: GetEventsRes) => {
                return result.events
            }
            updateQuery = (previousResult: GetEventsRes, fetchMoreResult: GetEventsRes) => (
                {
                    ...previousResult,
                    events: [
                        ...previousResult.events,
                        ...fetchMoreResult.events,
                    ],
                }
            )
            break
        case "my":
            queryDocument.value = getMyEventsQuery
            getEvents = (result: GetMyEventsRes) => {
                return result.me.events
            }
            updateQuery = (previousResult: GetMyEventsRes, fetchMoreResult: GetMyEventsRes) => (
                {
                    ...previousResult,
                    me: {
                        ...previousResult.me,
                        events: [
                            ...previousResult.me.events,
                            ...fetchMoreResult.me.events,
                        ]
                    },
                }
            )
            break
        case "saved":
            queryDocument.value = getSavedEventsQuery
            getEvents = (result: GetSavedEventsRes) => {
                return result.me.bookmarks.map(bookmark => bookmark.event)
            }
            updateQuery = (previousResult: GetSavedEventsRes, fetchMoreResult: GetSavedEventsRes) => (
                {
                    ...previousResult,
                    me: {
                        ...previousResult.me,
                        bookmarks: [
                            ...previousResult.me.bookmarks,
                            ...fetchMoreResult.me.bookmarks,
                        ]
                    },
                }
            )
            break
        case "search":
            queryDocument.value = searchEventsQuery
            getEvents = (result: SearchEventsRes) => {
                return result.searchEvents
            }
            updateQuery = (previousResult: SearchEventsRes, fetchMoreResult: SearchEventsRes) => (
                {
                    ...previousResult,
                    events: [
                        ...previousResult.searchEvents,
                        ...fetchMoreResult.searchEvents,
                    ],
                }
            )
            break
        case "location":
            queryDocument.value = getEventByLocationQuery
            getEvents = (result: GetEventsByLocationRes) => {
                return result.eventsByLocation
            }
            updateQuery = (previousResult: GetEventsByLocationRes, fetchMoreResult: GetEventsByLocationRes) => (
                {
                    ...previousResult,
                    events: [
                        ...previousResult.eventsByLocation,
                        ...fetchMoreResult.eventsByLocation,
                    ],
                }
            )
            break
    }
}
setQueries(props.listKind)

const { loading, onResult, onError: onGetEventsError, error, fetchMore, refetch } = useQuery<any, GetEventsVars>(
    queryDocument,
    queryVars,
    {
        fetchPolicy: "network-only"
    }
)
onResult((result) => {
    events = getEvents(result.data)
})

onGetEventsError(error => {
    console.error(" onGetEventsError:", error)
})
function refetchEvents() {
    refetch()
}

// scrolling pagination
const scrollingList = ref<HTMLInputElement | null>(null)

function loadMore() {
    if (!loading.value) {
        fetchMore({
            variables: {
                offset: events.length,
                limit: paginationLimit
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return previousResult
                return updateQuery(previousResult, fetchMoreResult)
            }
        })
    }
}

function handleScroll() {
    const element = scrollingList.value
    if (element) {
        const scrollBottom = element.scrollHeight - element.clientHeight - element.scrollTop
        if (scrollBottom <= 15) {
            loadMore()
        }
    }
}

onMounted(() => {
    initDropdowns()
})
</script>