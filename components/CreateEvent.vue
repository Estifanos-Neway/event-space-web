<template>
    <div class="h-full overflow-scroll p-5">
        <h3>Create New Event</h3>
        <br>
        <Form v-slot="{ handleSubmit, isSubmitting }" :validation-schema="schema">
            <form @submit="handleSubmit($event, onSubmit)" class="flex flex-col gap-5 max-w-xl">
                <div class="flex flex-col gap-2">
                    <label for="title">
                        Title
                    </label>
                    <Field name="title" />
                    <ErrorMessage name="title" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="description">
                        Description
                    </label>
                    <Field name="description" />
                    <ErrorMessage name="description" />
                </div>
                <div class="flex flex-col gap-2">
                    <div>
                        Images
                    </div>
                    <div>
                        <FileSelector fieldName="images" accept="image/*" :selectedFiles="getSelectedImagesRef()" />
                    </div>
                    <div class="grid grid-cols-3 gap-6">
                        <EventImagePreview v-for="image, index in selectedImages" :imagesArray="selectedImages"
                            :index="index" :key="image.id" />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="date">
                        Date
                    </label>
                    <Field name="date" type="date" />
                    <ErrorMessage name="date" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="city">
                        City
                    </label>
                    <button id="dropdownSearchButton" data-dropdown-toggle="dropdownSearch" data-dropdown-placement="bottom"
                        class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        type="button">{{ selectedCityName ?? 'Select city' }}<svg class="w-4 h-4 ml-2" aria-hidden="true"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div id="dropdownSearch" class="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                        <div class="p-3">
                            <label for="input-group-search" class="sr-only">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <input type="text" id="input-group-search" v-model="citySearchText"
                                    class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                    placeholder="Search city">
                            </div>
                        </div>
                        <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownSearchButton">
                            <li v-for="(city, index) in getCitiesResult?.cities"
                                v-show="!citySearchText || searchedCities[index]">
                                <div class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input :id="city.id" type="radio" :value="city.id" v-model="selectedCity" name="city"
                                        class="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label :for="city.id"
                                        class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{{
                                            city.name }}</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="specificLocation">
                        Specific Location
                    </label>
                    <Field name="specificLocation" />
                    <ErrorMessage name="specificLocation" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="tags">
                        Tags
                    </label>
                    <Field name="tags" />
                    <ErrorMessage name="description" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="title">
                        Price
                    </label>
                    <Field name="price" type="number" />
                    <ErrorMessage name="price" />
                </div>
                <button :disabled="isSubmitting">Add Event</button>
            </form>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { SelectedImage } from './types';
import { Form, Field, ErrorMessage } from "vee-validate"
import { string, object, number, date } from "yup"
import { initDropdowns } from "flowbite"

// schema
const schema = object({
    title: string().required("Title is required").label("Title"),
    description: string().label("Description"),
    date: date().typeError("Date is required").required("Date is required").min(new Date(), "Date can't be set to past").label("Date"),
    price: number().transform((value) => (isNaN(value) ? 0 : value)).min(0).label("Price"),
    specificLocation: string().label("Specific Location"),
})

// Cities
const { result: getCitiesResult, onError: onGetCitiesError } = getCities()
onGetCitiesError(error => {
    console.error("onGetCitiesError:", error)
})

const selectedCity = ref<string>()
const selectedCityName = ref<string>()
watch(selectedCity, () => {
    selectedCityName.value = getCitiesResult.value?.cities.find(city => city.id === selectedCity.value)?.name
})

const citySearchText = ref("")
const searchedCities = ref<Boolean[]>([])
watch(citySearchText, () => {
    if (getCitiesResult.value) {
        searchedCities.value = getCitiesResult.value?.cities.map(city => city.name.toLowerCase().includes(citySearchText.value.toLocaleLowerCase()))
    }
})

// images
const selectedImages = ref<Array<SelectedImage>>([])
// watch(selectedImages, () => {
// })

function getSelectedImagesRef(): globalThis.Ref<Array<SelectedImage>> {
    return selectedImages
}

function onSubmit() {
    console.log("Adding event")
}
onMounted(() => {
    initDropdowns()
})
</script>