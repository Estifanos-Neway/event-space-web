<template>
    <div class="h-full overflow-auto pt-10">
        <div v-if="result?.eventsByPk" class="mx-auto w-fit max-w-[1090px]">
            <div class="px-7 max-xl:2lg:px-28">
                <h3 class="text-xl font-bold mb-6">{{ result.eventsByPk.title }}</h3>
            </div>
            <div class="xl:grid grid-cols-5 gap-20 min-h-screen px-7 max-xl:2lg:px-28">
                <div class=" flex flex-col gap-10 col-span-3">
                    <div>
                        <div>
                            <div class="mb-4">
                                <img :src="createStaticServerLink(result.eventsByPk.images[0])"
                                    class="mb-4 rounded-md w-full h-72 object-cover" />
                                <p>{{ result.eventsByPk.description ?? "" }}</p>
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="flex gap-2 items-center">
                                    <Icon icon="material-symbols:date-range" class="text-primary text-2xl" />
                                    <span>{{ new Date(result.eventsByPk.date).toLocaleString([], {
                                        year: 'numeric', month: 'numeric', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    }) }}</span>
                                </div>
                                <div class="flex gap-2 items-center" v-if="result.eventsByPk.city?.name">
                                    <Icon icon="mdi:map-marker" class="text-primary text-2xl" />
                                    <span>{{ result.eventsByPk.city.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-surface px-5 py-7 xl:hidden">
                        <div class="flex gap-10 w-full mb-7">
                            <div class="w-full">
                                <h3 class="font-bold"> {{ result.eventsByPk.price }} ETB</h3>
                                <BuyTicket :event="result.eventsByPk" />
                            </div>
                            <div class="w-full">
                                <Bookmark :isPreview="false" :event="result.eventsByPk" />
                            </div>
                        </div>
                        <div>
                            <p class="font-semibold">Organized BY</p>
                            <div class="flex justify-between items-end mb-2">
                                <div>
                                    <div :user="userStore" id="userDropdownInEvent" class="z-10 hidden">
                                        <ProfileCard :editable="false" :user="userStore" />
                                    </div>
                                    <p class="font-semibold text-primary" data-dropdown-toggle="userDropdownInEvent"
                                        data-dropdown-placement="bottom-start">
                                        <snap class="cupo">{{ result.eventsByPk.user.name }}</snap>
                                    </p>
                                </div>
                                <p class="whitespace-nowrap"><span class="font-bold">{{
                                    result.eventsByPk.user.followersCount
                                }}</span> Followers </p>
                            </div>
                            <Follow :event="result.eventsByPk" />
                        </div>
                    </div>

                    <!-- <div className=' flex justify-center items-center'>
                        <div className='group text-xl'>
                            <strong className='group-hover:text-red-500'>Hover on me </strong>
                            <strong className='group-hover:text-green-500'>the texts will be </strong>
                            <strong className='group-hover:text-blue-500'>of different colors</strong>
                        </div>
                    </div> -->
                    <!-- <button data-popover-target="popover-default" type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Default
                        popover</button>
                    <div data-popover id="popover-default" role="tooltip"
                        class="absolute z-10 invisible inline-block w-64 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                        <div
                            class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                            <h3 class="font-semibold text-gray-900 dark:text-white">Popover title</h3>
                        </div>
                        <div class="px-3 py-2">
                            <p>And here's some amazing content. It's very engaging. Right?</p>
                        </div>
                        <div data-popper-arrow></div>
                    </div> -->
                    <div>
                        <h3 class="mb-1">Location In map</h3>
                        <iframe v-if="result.eventsByPk.location?.[0] && result.eventsByPk.location?.[1]"
                            class="w-full h-96"
                            :src="`https://maps.google.com/maps?q=${result.eventsByPk.location?.[0]},${result.eventsByPk.location?.[1]}&z=15&output=embed`"></iframe>
                        <div v-else class="flex gap-2 border-2 px-5 py-10 rounded-md" v-if="result.eventsByPk.city?.name">
                            <Icon icon="mdi:map-marker" class="text-primary text-2xl" />
                            <span>Coordinates not provided</span>
                        </div>
                    </div>
                    <div>
                        <h4 class="mb-1">More images</h4>
                        <!-- <div class="grid grid-cols-3 gap-3">
                            <img class="h-40 object-cover" v-for="imageUrl in result.eventsByPk.images" :key="imageUrl"
                                :src="createStaticServerLink(imageUrl)" />
                        </div> -->
                        <div class="space-y-4">
                            <img class="h-72 w-full object-cover rounded-md" v-for="imageUrl in result.eventsByPk.images"
                                :key="imageUrl" :src="createStaticServerLink(imageUrl)" />
                        </div>
                    </div>
                    <div v-if="userStore.id === result.eventsByPk.user.id">
                        <hr class="pt-6 mt-4" />
                        <h4 class="font-bold mb-1">Actions</h4>
                        <div class="pl-4">
                            <div class="flex items-center gap-2 mb-1">
                                <Icon icon="material-symbols:edit-outline" class="text-lg" />
                                <NuxtLink :to="'/events/' + result.eventsByPk.id + '/edit'"><button>Edit</button>
                                </NuxtLink>
                            </div>
                            <div class="flex items-center gap-2 text-error cupo">
                                <Icon icon="ph:trash-simple" class="text-lg" />
                                <div @click="isDeleteConfirmPopupOpen = true">Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-surface px-6 py-10 h-fit max-xl:hidden col-span-2 flex flex-col gap-7">
                    <div class="w-full">
                        <h3 class="font-bold"> {{ result.eventsByPk.price }} ETB</h3>
                        <BuyTicket :event="result.eventsByPk" />
                    </div>
                    <div class="w-full">
                        <Bookmark :isPreview="false" :event="result.eventsByPk" />
                    </div>
                    <div>
                        <p class="font-semibold">Organized BY</p>
                        <div class="flex justify-between items-end mb-2">
                            <div>
                                <div :user="userStore" id="userDropdownInEvent2" class="z-10 hidden">
                                    <ProfileCard :editable="false" :user="userStore" />
                                </div>
                                <p class="font-semibold text-primary" data-dropdown-toggle="userDropdownInEvent2"
                                    data-dropdown-placement="bottom-start">
                                    <snap class="cupo">{{ result.eventsByPk.user.name }}</snap>
                                </p>
                            </div>
                            <p class="whitespace-nowrap"><span class="font-bold">{{
                                result.eventsByPk.user.followersCount
                            }}</span> Followers </p>
                        </div>
                        <Follow :event="result.eventsByPk" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="error">
            Error getting event detail <span @click="refetchEvents">[Retry]</span>
        </div>
        <div v-else="loading">
            Loading...
        </div>
        <Footer />

        <!-- Delete confirmation pop -->
        <TransitionRoot :show="isDeleteConfirmPopupOpen">
            <Dialog as="div" class="relative z-10" @close="closeDeleteConfirmPopup">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                    leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div class="fixed inset-0 z-10 overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild as="template" enter="ease-out duration-300"
                            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                            leave-from="opacity-100 translate-y-0 sm:scale-100"
                            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <DialogPanel
                                class="relative transform overflow-hidden rounded-lg bg-background px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                    <button type="button"
                                        class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        @click="closeDeleteConfirmPopup">
                                        <span class="sr-only">Close</span>
                                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div class="sm:flex sm:items-start">
                                    <div
                                        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                            Deleting an event</DialogTitle>
                                        <div class="mt-2">
                                            <p class="text-sm text-gray-500">Are you sure you want to delete this event?</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button type="button"
                                        class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        @click="deleteEvent">Delete</button>
                                    <button type="button"
                                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        @click="closeDeleteConfirmPopup">Cancel</button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup lang="ts">
import { GetEventQueryRes, GetEventQueryVars } from '~~/graphql/events/get-event-query.types';
import { getEventQuery } from "~~/graphql/events"
import { useUserStore } from '~~/pinia-stores';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { deleteEventMutation } from '~~/graphql/events'
import { DeleteEventRes, DeleteEventVars } from '~~/graphql/events/delete-event.mutation.types'
import { createStaticServerLink } from '~~/commons/functions';
import { Icon } from '@iconify/vue';

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const { result, error, onError: onQueryDetailsError, refetch } = useQuery<GetEventQueryRes, GetEventQueryVars>(
    getEventQuery,
    {
        id: route.params.id as string
    },
    {
        fetchPolicy: "network-only"
    }
)

onQueryDetailsError(error => {
    console.error("getting event detail onError:", error)
})

function refetchEvents() {
    refetch()
}

const { mutate, onError, onDone, loading: deleting } = useMutation<DeleteEventRes, DeleteEventVars>(
    deleteEventMutation,
    {
        fetchPolicy: "network-only"
    }
)
onDone(() => {
    router.replace("/events")
})
onError(error => {
    console.error("deleting event onError:", error)
})
function deleteEvent() {
    if (result.value) {
        mutate({ id: result.value.eventsByPk.id })
    }
}

// deleting dialog
const isDeleteConfirmPopupOpen = ref(false)
function closeDeleteConfirmPopup() {
    if (!deleting.value) isDeleteConfirmPopupOpen.value = false
}
</script>