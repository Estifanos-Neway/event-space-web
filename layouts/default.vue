<template>
    <div :class="{ dark: generalStore.isDark }">
        <div class="bg-background dark:bg-backgroundDark text-onBackground dark:text-onBackgroundDark min-h-screen">
            <div v-show="generalStore.hasNotification"
                class="bg-gray-300 dark:bg-gray-300 flex justify-between items-center px-6 h-10">
                {{ generalStore.notification.message }}
                <span @click="generalStore.clearNotification" class=" cursor-pointer">X</span>
            </div>
            <div v-if="!userStore.isAuthorized" class="max-h-screen overflow-hidden">
                <div class="flex justify-between px-10 py-7 border-b">
                    <Logo />
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-6">
                            <div>
                                <NuxtLink to="/events">Events</NuxtLink>
                            </div>
                            <span>
                                |
                            </span>
                            <div class="flex gap-2">
                                <NuxtLink to="/signin">Sign In</NuxtLink>
                                <NuxtLink to="/signup">Sign Up</NuxtLink>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
                <div>
                    <slot />
                </div>
            </div>
            <div v-else class="grid grid-cols-6 max-h-screen">
                <div class="col-span-1 border-r flex flex-col justify-between items-center py-8 h-screen">
                    <div class="flex flex-col items-center gap-3">
                        <Logo />
                        <ul>
                            <li>
                                <NuxtLink to="/events">Events</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/events/my">My Events</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/events/saved">Saved</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/tickets">Tickets</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/events/create">Create</NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <div @click="useUserSignOut" class="cursor-pointer">
                        Log Out
                    </div>
                </div>
                <div class="col-span-5 max-h-screen overflow-hidden">
                    <div class="flex justify-end px-10 py-7 border-b">
                        <ThemeToggle />
                    </div>
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGeneralStore, useUserStore } from '@/pinia-stores';
import { meQueryResponse } from '@/graphql/user/me-query.types';
import { meQuery } from '@/graphql/user';
const generalStore = useGeneralStore()
const userStore = useUserStore()
const { getToken } = useApollo()
onMounted(() => {
    getToken().then(token => {
        if (token) {
            const { onResult } = useQuery<meQueryResponse>(meQuery, null, {
                pollInterval: 2 * 60 * 1000,
                fetchPolicy: "cache-and-network"
            })
            onResult(result => {
                userStore.$state = { ...result.data.me, refreshToken: userStore.refreshToken }
            })
        } else {
            userStore.$reset()
        }
    }).catch(error => {
        console.error("default layout getToken",error)
    })
})
</script>