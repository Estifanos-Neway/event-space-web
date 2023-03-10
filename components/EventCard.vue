<template>
    <div @click="router.push(`/events/${event.id}`)" class="bg-slate-200 p-5 px-10 cupo">
        <p class="font-bold">
            {{ event.title }}
        </p>
        <p>
            {{ event.description.substring(0, descriptionPreviewLength) }}
            {{ event.description.length > descriptionPreviewLength ? `...` : `` }}
        </p>
        <br>
        <ul>
            <li>{{ event.city.name }}</li>
            <li>{{ event.date }}</li>

            <li>{{ event.id }}</li>
        </ul>
        <br>
        <div class="flex justify-between items-end">
            <div>
                <span>{{ event.price }}</span>
                <BuyTicket :event="event" />
            </div>
            <Bookmark :isPreview="true" :event="event" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventPreview } from "@/graphql/events/event-preview.type"

const router = useRouter()
const descriptionPreviewLength: number = 124
defineProps<{
    event: EventPreview
}>()

</script>