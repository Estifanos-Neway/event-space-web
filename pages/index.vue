<template>
    <div class="h-full overflow-auto">
        Home
        <div v-if="loading">
            Loading...
        </div>
        <div v-else-if="error">
            Loading...
        </div>
        <div v-else class="flex gap-14 w-full h-fit flex-wrap justify-center ">
            <EventCard v-for="event in result?.eventsByLocation" :key="event.id" :event="event" />
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