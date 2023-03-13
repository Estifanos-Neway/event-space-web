<template>
    <div class="h-full overflow-scroll p-5">
        <div v-if="loading">
            Loading...
        </div>
        <div v-else-if="error">
            Error
        </div>
        <div v-else class="p-4 flex flex-col gap-5">
            <div v-for="ticketsAndEvents in ticketsByEvent" class="bg-gray-400 flex flex-col p-4 gap-5" :key="ticketsAndEvents.event?.id">
                <div class="font-bold">
                    <NuxtLink :to="`/events/${ticketsAndEvents.event?.id}`"> {{ ticketsAndEvents.event?.title }}</NuxtLink>
                </div>
                <hr>
                <div class="flex flex-col gap-3">
                    <div v-for="ticket in ticketsAndEvents.tickets" :key="ticket.id">
                        <span class="font-bold">{{ ticket.id }}</span>
                        <br>
                        {{ ticket.createdAt }} ( {{ ticket.isValid }})
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventPreview } from "~~/graphql/events/event-preview.type";
import { MyTicketsRes } from "~~/graphql/tickets/ticket.query.types";
import { myTicketsQuery } from "../graphql/tickets"
import { Ticket } from "../graphql/tickets/ticket.type"
import { initAccordions } from 'flowbite'
type organizedEvent = Array<{ event?: EventPreview, tickets?: Array<Ticket> }>

const { loading, onResult, onError, error, } = useQuery<MyTicketsRes, {}>(
    myTicketsQuery,
    {},
    {
        fetchPolicy: "network-only"
    }
)
let ticketsByEvent: globalThis.Ref<organizedEvent> = ref([])
onResult(result => {
    const tempTicketsByEvent: organizedEvent = []
    const eventIds: Array<string> = []
    result.data.me.tickets.forEach(ticket => {
        const eventId = ticket.event.id
        const index = eventIds.indexOf(eventId)
        const newTicket = { ...ticket, event: {} as EventPreview }
        if (index !== -1) {
            tempTicketsByEvent[index].tickets!.push(newTicket)
        } else {
            eventIds.push(eventId)
            tempTicketsByEvent.push({ event: ticket.event, tickets: [newTicket] })
        }
    })
    ticketsByEvent.value = [...tempTicketsByEvent]
})
onError(error => {
    console.error("MyTicketsRes onError", error)
})
onMounted(() => {
    initAccordions()
})
</script>