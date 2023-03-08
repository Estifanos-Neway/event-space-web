<template>
    <div @click="router.push(`/events/${event.id}`)" class="bg-slate-200 p-3 cursor-pointer">
        <p class="font-bold">
            {{ event.title }}
        </p>
        <p>
            {{ event.description }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { EventPreview } from "@/graphql/events/event-preview.type"

const router = useRouter()

defineProps<{
    event: EventPreview
}>()

</script>