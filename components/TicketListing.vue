<template>
    <div class="min-h-full h-full overflow-auto flex flex-col items-center justify-between">
        <div class="p-9 max-w-[650px] xl:max-w-[1000px]">
            <div class="w-full">
                <h3 class="text-start w-full font-bold text-2xl mb-4 pl-1 ">Your Tickets</h3>
            </div>
            <div v-if="ticketsResult" class="flex flex-col gap-12 w-fit ">
                <div v-for="ticket in ticketsResult?.me.tickets" :key="ticket.id" >
                    <TicketCard :ticket="ticket" />
                </div>
            </div>
            <div v-else-if="loadingTickets">
                Loading...
            </div>
            <div v-else-if="ticketsError">
                Error <span @click="refetchTickets">Try again</span>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { EventPreview } from "~~/graphql/events/event-preview.type";
import { MyTicketsRes } from "~~/graphql/tickets/ticket.query.types";
import { myTicketsQuery } from "../graphql/tickets"
import { Ticket } from "../graphql/tickets/ticket.type"
type organizedEvent = Array<{ event?: EventPreview, tickets?: Array<Ticket> }>

const { result: ticketsResult, loading: loadingTickets, onError: onTicketsError, error: ticketsError, refetch: refetchTickets } = useQuery<MyTicketsRes, {}>(
    myTicketsQuery,
    {},
    {
        fetchPolicy: "network-only"
    }
)
let ticketsByEvent: globalThis.Ref<organizedEvent> = ref([])
onTicketsError(error => {
    console.error("MyTicketsRes onError", error)
})
</script>