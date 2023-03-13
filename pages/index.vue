<template>
    <div>
        Home
        <div v-if="loading">
            Loading...
        </div>
        <div v-else-if="error">
            Loading...
        </div>
        <div v-else class="flex gap-2">
            <div v-for="event in result?.eventsByLocation" :key="event.id">
                <EventCard :event="event" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/pinia-stores';
const router = useRouter()
const userStore = useUserStore()
if (userStore.isAuthorized) {
    router.replace("/events")
}
const { loading, result, onError, error } = useEventsByLocation(0, 3)
onError(error => {
    console.error("useEventsByLocation onError", error)
})


</script>