<template>
    <div :class="{ dark: generalStore.isDark }">
        <div class="bg-background dark:bg-backgroundDark text-onBackground dark:text-onBackgroundDark min-h-screen">
            <div class="flex justify-between px-10 py-7 border-b-1">
                <div class="font-bold">Event Space</div>
                <span @click="generalStore.toggleDarkMode" class="cursor-pointer">
                    <Icon v-if="generalStore.isDark" icon="line-md:moon-filled-to-sunny-filled-transition" />
                    <Icon v-else icon="line-md:sunny-filled-loop-to-moon-filled-transition" />
                </span>
            </div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useGeneralStore } from '~~/pinia-stores/general-store';
const generalStore = useGeneralStore()
</script>