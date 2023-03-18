<template>
    <Head>
        <Title>My events</Title>
    </Head>
    <EventListing title="My events" v-if="userStore.isAuthorized" listKind="my" />
</template>

<script setup lang="ts">
import { useUserStore } from '@/pinia-stores';
const router = useRouter()
const userStore = useUserStore()
if (!userStore.isAuthorized) router.replace("/signin")
</script>