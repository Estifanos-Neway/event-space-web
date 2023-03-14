<template>
    <div @click="router.push(`/events/${event.id}`)" class="border-2 border-gray-300 w-[85%] sm:w-[75%] md:w-[65%] lg:w-[400px] cupo rounded-xl overflow-hidden">
        <div class="h-52">
            <img v-if="event.images" :src="createStaticServerLink(event.images)" class="w-full h-full object-cover " />
            <div v-else class="w-full h-full bg-gray-800">

            </div>
        </div>
        <div class="flex flex-col px-5 py-8 gap-8">
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                    <h3 class="font-bold">
                        {{ event.title }}
                    </h3>
                    <p>
                        {{ description.length > descriptionPreviewLength ? description.substring(0,
                            descriptionPreviewLength) + `...` : description }}
                    </p>
                </div>
                <div class="flex flex-col gap-1">
                    <div class="flex gap-2 items-center">
                        <Icon icon="material-symbols:date-range" class="text-primary text-2xl" />
                        <span>{{ new Date(event.date).toLocaleString([], {
                            year: 'numeric', month: 'numeric', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        }) }}</span>
                    </div>
                    <div class="flex gap-2 items-center" v-if="event.city?.name">
                        <Icon icon="mdi:map-marker" class="text-primary text-2xl" />
                        <span>{{ event.city.name }}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col gap-2">
                <div class="flex justify-between px-1">
                    <span class="font-bold text-xl">
                        {{
                            event.price ? `${event.price} ETB` : "FREE"
                        }}
                    </span>
                    <Bookmark :isPreview="true" :event="event" />
                </div>
                <BuyTicket v-if="event.price" :event="event" />
                <div v-else class="text-center border-t border-primary pt-2">
                    This is free event!
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventPreview } from "@/graphql/events/event-preview.type"
import { Icon } from '@iconify/vue';
import { createStaticServerLink } from "~~/commons/functions";

const router = useRouter()
const descriptionPreviewLength: number = 90
const props = defineProps<{
    event: EventPreview
}>()
const description = props.event.description ?? ""
</script>