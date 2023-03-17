<template>
    <div v-if="ticket.id" class="space-y-3 border-2 w-full rounded-md p-5 px-3 shadow-md hover:border-primary 2lg:flex">
        <img :src="createStaticServerLink(`static/images/ticket-qr-codes/${ticket.id}.png`)" 
        class=" h-[200px] object-contain"/>
        <div class="space-y-4 px-5">
            <div class="flex flex-wrap">
                <span class="ticket-name-col">Ticket Id: </span>
                <span class="ticket-detail-col">{{ ticket.id }}</span>
            </div>

            <div class="ticket-row">
                <span class="ticket-name-col">Event: </span>
                <span class="ticket-detail-col">
                    <NuxtLink v-if="ticket.event" :to="`events/${ticket.event.id}`" class="text-primary font-medium">{{ ticket.event.title }}</NuxtLink>
                    <span v-else>This event is not available!</span>
                </span>
            </div>
            <div v-if="ticket.event" class="ticket-row">
                <span class="ticket-name-col">Price: </span>
                <span class="ticket-detail-col">{{ ticket.event.price }}</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-name-col">Buy date: </span>
                <span class="ticket-detail-col">{{ getFullFormattedDate(ticket.createdAt) }}</span>
            </div>
            <div v-if="ticket.event" class="ticket-row">
                <span class="ticket-name-col">Event Date: </span>
                <span class="ticket-detail-col">{{ getFullFormattedDate(ticket.event.date) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { createStaticServerLink, getFullFormattedDate } from '~~/commons/functions';
import { Ticket } from '~~/graphql/tickets/ticket.type';

const props = defineProps<
    {
        ticket: Ticket
    }
>()
</script>

<style>
.ticket-row {
    @apply flex flex-wrap gap-x-2
}

.ticket-detail-col {
    @apply block pl-3
}

.ticket-name-col {
    @apply font-bold
}
</style>