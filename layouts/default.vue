<template>
    <div :class="{ dark: generalStore.isDark }">
        <div class="bg-background dark:bg-backgroundDark text-onBackground dark:text-onBackgroundDark min-h-screen">
            <div v-show="generalStore.hasNotification" class="bg-gray-300 dark:bg-gray-300 flex justify-between items-center px-6 h-10">
                {{ generalStore.notification.message }}
                <span @click="generalStore.clearNotification" class=" cursor-pointer">X</span>
            </div>
            <div class="flex justify-between px-10 py-7 border-b">
                <div class="font-bold">Event Space</div>
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
                    <span @click="generalStore.toggleDarkMode" class="cursor-pointer">
                        <Icon v-if="generalStore.isDark" icon="line-md:moon-filled-to-sunny-filled-transition" />
                        <Icon v-else icon="line-md:sunny-filled-loop-to-moon-filled-transition" />
                    </span>
                </div>
            </div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useGeneralStore } from '@/pinia-stores';
const generalStore = useGeneralStore()
</script>