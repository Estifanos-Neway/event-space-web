<template>
    <div>
        <div @click.stop="() => { open = true }">
            Buy Ticket
        </div>
        <div @click.stop="() => { }">
            <TransitionRoot as="template" :show="open">
                <Dialog as="div" class="relative z-10" @close="open = false">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0"
                        enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
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
                                    class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div v-if="ticketAdded">
                                        Success
                                        <div class="mt-5 sm:mt-6">
                                            <button type="button"
                                                class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                @click="open = false">Okay</button>
                                        </div>
                                    </div>
                                    <div v-else-if="error">
                                        Error
                                        <div class="mt-5 sm:mt-6">
                                            <button type="button"
                                                class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                @click="open = false">Close</button>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <h3>
                                            {{ event.title }}
                                        </h3>
                                        <br>
                                        {{ event.price }}
                                        <!-- <div class="mb-6">
                                            <label for="base-input"
                                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Number of Tickets
                                            </label>
                                            <input type="number" id="base-input"
                                                class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        </div> -->
                                        <div class="mt-5 sm:mt-6">
                                            <button type="button" @click="buyTicket"
                                                class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                :class="{ 'disabled bg-indigo-500': adding }">Buy
                                                Now</button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventPreview } from '~~/graphql/events/event-preview.type';
import { initModals } from 'flowbite'
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const open = ref(false)
const props = defineProps<{
    event: EventPreview
}>()

const ticketAdded = ref(false)
const { mutate: add, onDone: onAddDone, onError: onAddError, loading: adding, error } = addTicket()
onAddDone(() => {
    ticketAdded.value = true
})
onAddError(error => {
    console.error("onAddError:Ticket", error)
})

function buyTicket() {
    if (adding.value) return
    add({ eventId: props.event.id })
}

onMounted(() => {
    initModals()
})
</script>