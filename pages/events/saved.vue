<template>
    <div>
        <EventListing v-if="userStore.isAuthorized" listKind="saved" />
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/pinia-stores';
const router = useRouter()
const userStore = useUserStore()
if (!userStore.isAuthorized) router.replace("/signin")
</script>