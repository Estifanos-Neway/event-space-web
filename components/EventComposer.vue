<template>
    <div class="p-5">
        <Form v-slot="{ handleSubmit }" :validation-schema="schema" :initial-values="initialValues">
            <form @submit.prevent="handleSubmit($event, onSubmit)" class="flex flex-col gap-5 max-w-xl" novalidate>
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
                    <Field v-slot="{ field, errors }" name="description">
                        <textarea v-bind="field" name="description" rows="5" />
                        <div v-if="errors[0]">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="tags">
                        Tags <span class="text-sm">(put space between each tag)</span>
                    </label>
                    <div class="flex gap-3">
                        <div v-for="tag, index in tags" :key="tag + index" id="toast-default"
                            class="flex items-center w-fit p-2 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
                            <div class="ml-3 text-sm font-normal">{{ tag }}</div>
                            <button type="button" @click="dropTag(index)"
                                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800">
                                <span class="sr-only">drop</span>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <input type="text" name="tags" v-model="tag" @input="addTag" @focusout="addTag" />
                </div>
                <div class="flex flex-col gap-2">
                    <div>
                        Images
                    </div>
                    <div class="grid grid-cols-3 gap-6">
                        <EventImagePreview v-for="image, index in selectedImages" :imagesArray="selectedImages"
                            :index="index" :key="image.id" />
                    </div>
                    <div>
                        <FileSelector fieldName="images" accept="image/*" :selectedFiles="getSelectedImagesRef()" />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="date">
                        Date
                    </label>
                    <Field name="date" type="datetime-local" />
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
                                v-show="!citySearchText || searchedCities[index]" :key="city.id">
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
                    <div>
                        Map Coordinates
                    </div>
                    <div class="flex gap-4">
                        <div class="flex flex-col gap-2 text-sm">
                            <label for="latitude">
                                Latitude
                            </label>
                            <Field name="latitude" type="number" step="any" />
                            <ErrorMessage name="latitude" />
                        </div>
                        <div class="flex flex-col gap-2 text-sm">
                            <label for="longitude">
                                Longitude
                            </label>
                            <Field name="longitude" type="number" step="any" />
                            <ErrorMessage name="longitude" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="specificAddress">
                        Specific Location
                    </label>
                    <Field name="specificAddress" />
                    <ErrorMessage name="specificAddress" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="title">
                        Price
                    </label>
                    <Field name="price" type="number" />
                    <ErrorMessage name="price" />
                </div>
                <button :disabled="isSubmitting" :class="{ 'text-blue-600': isSubmitting }">Publish Event</button>
            </form>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { SelectedImage, ComposedEvent } from './types';
import { Form, Field, ErrorMessage } from "vee-validate"
import { string, object, number, date } from "yup"
import { initDropdowns } from "flowbite"
import { Event } from '~~/graphql/events/event.type';
import { getRandomString } from '~~/commons/functions';
import { UseMutationReturn } from '@vue/apollo-composable';
import { DocumentNode, FetchResult } from '@apollo/client';
import { useGeneralStore } from '~~/pinia-stores';

const generalStore = useGeneralStore()
const props = defineProps<
    {
        oldEvent?: Event
        submitter: (composedEvent: ComposedEvent) => UseMutationReturn<any, any>
        getId: (result: FetchResult) => string
    }
>()

// schema
const schema = object({
    title: string().required("Title is required").label("Title"),
    description: string().label("Description"),
    date: date().typeError("Date is required").required("Date is required").min(new Date(), "Date can't be set to past").label("Date"),
    latitude: number().transform((value) => (isNaN(value) ? 0 : value)).min(-90).max(90),
    longitude: number().transform((value) => (isNaN(value) ? 0 : value)).min(-180).max(180),
    specificAddress: string().label("Specific Location"),
    price: number().default(0).transform((value) => (isNaN(value) ? 0 : value)).min(0).label("Price"),
})

const oldEvent = props.oldEvent
// initial values
const tempInitialValues: ComposedEvent = {}
if (props.oldEvent) {
    tempInitialValues.title = oldEvent?.title
    tempInitialValues.description = oldEvent?.description
    tempInitialValues.date = oldEvent?.date.toString().substring(0, 16)
    tempInitialValues.latitude = oldEvent?.location[0]
    tempInitialValues.longitude = oldEvent?.location[1]
    tempInitialValues.specificAddress = oldEvent?.specificAddress
    tempInitialValues.price = oldEvent?.price
}
const initialValues = ref(
    tempInitialValues
)

// Cities
const { result: getCitiesResult, onError: onGetCitiesError } = getCities()
onGetCitiesError(error => {
    console.error("onGetCitiesError:", error)
})

const selectedCity = ref<string | undefined>(oldEvent?.city.id ?? undefined)
const selectedCityName = ref<string | undefined>(oldEvent?.city.name ?? undefined)
watch(selectedCity, () => {
    selectedCityName.value = getCitiesResult.value?.cities.find(city => city.id === selectedCity.value)?.name
})

const citySearchText = ref("")
const searchedCities = ref<Boolean[]>([])
watch(citySearchText, () => {
    if (getCitiesResult.value) {
        searchedCities.value = getCitiesResult.value?.cities.map(
            city => city.name.toLowerCase().includes(citySearchText.value.toLocaleLowerCase()
            )
        )
    }
})

// images
const convertedOldImages: SelectedImage[] = (props.oldEvent?.images ?? []).map(
    (image, index) => (
        {
            content: image,
            id: -1 * (index + 1),
            isThumbnail: index === 0,
            isB64: false
        }
    )
)
// const oldImages = ref<SelectedImage[]>(convertedOldImages)
const selectedImages = ref<SelectedImage[]>([...convertedOldImages])
function getSelectedImagesRef(): globalThis.Ref<SelectedImage[]> {
    return selectedImages
}

// tags
const tagDelimiter = " "
const tag = ref<string>("")
const tags = ref<string[]>(oldEvent?.tags ? [...oldEvent?.tags] : [])
// @ts-ignore
function addTag(event) {
    if (tag.value.includes(tagDelimiter) || event.type === "focusout") {
        tags.value = tags.value.concat(tag.value.split(tagDelimiter).filter(t => t !== "" && !tags.value.includes(t)))
        tag.value = ""
    }
}
function dropTag(index: number) {
    tags.value.splice(index, 1)
}

const isSubmitting = ref(false);

function onSubmit(composedEvent: ComposedEvent) {
    isSubmitting.value = true
    // modifications
    composedEvent.price = composedEvent.price ?? 0

    // upload images
    const selectedImagesLength = selectedImages.value.length
    let images: string[] = []
    for (let i = 0; i < selectedImagesLength; i++) {
        const thisImage = selectedImages.value[i]
        if (thisImage.isB64) break
        else images.push(thisImage.content as string)
    }
    if (selectedImagesLength > images.length) {
        const fileUploadMutationText = `mutation FileUploadMutation {${createMutationsFromImages(selectedImages.value)}}`
        const fileUploadMutationDoc: DocumentNode = gql(fileUploadMutationText)
        const { mutate: uploadImages, onDone: onUploadImagesDone, onError: onUploadImagesError, loading: uploading } = useMutation(
            fileUploadMutationDoc,
            {
                fetchPolicy: "no-cache"
            }
        )
        uploadImages()

        // save event
        onUploadImagesDone((result) => {
            images = images.concat(Object.values(result.data).map((image: any) => image.filePath))
            for (let i = 0; i < selectedImagesLength; i++) {
                const thisImage = selectedImages.value[i]
                if (thisImage.isThumbnail) {
                    images.unshift(images.splice(i, 1)[0])
                }
            }
            saveEvent(composedEvent, images)
        })
        onUploadImagesError(error => {
            console.error("uploadingEventImagesOnError:", error)
            generalStore.setSystemErrorNotification()
            isSubmitting.value = false
        })
    } else {
        for (let i = 0; i < selectedImagesLength; i++) {
            const thisImage = selectedImages.value[i]
            if (thisImage.isThumbnail) {
                images.unshift(images.splice(i, 1)[0])
            }
        }
        saveEvent(composedEvent, images)
    }
}

function saveEvent(composedEvent: ComposedEvent, images: string[]) {
    const { mutate, onDone, onError, loading } = props.submitter(
        {
            ...composedEvent,
            tags: tags.value,
            cityId: selectedCity.value,
            images
        }
    )
    mutate()
    onDone(result => {
        const id = props.getId(result)
        if (id) {
            useRouter().replace(`/events/${id}`)
        } else {
            console.error("savingEventOnDone:", result)
            generalStore.setSystemErrorNotification()
            isSubmitting.value = false

        }
    })
    onError(error => {
        console.error("savingEventOnError:", error)
        generalStore.setSystemErrorNotification()
        isSubmitting.value = false
    })
}

function createMutationsFromImages(images: SelectedImage[]): string {
    return images.reduce(
        (mutationText, image) => {
            const newMutationText = !image.isB64 ? "" : `M${getRandomString()}:uploadFile(
                arg:{
                    base64Str:"${image.content.toString().replace('data:', '').replace(/^.+,/, '')}",
                    category:"event-image",
                    extension:"${image.extension}",
                    fileName:"${getRandomString() + Date.now()}${image.extension}"
                }
                ){
                    filePath
                }\n`
            return mutationText + newMutationText
        }
        , ""
    )
}

onMounted(() => {
    initDropdowns()
})
</script>