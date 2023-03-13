<template>
    <div :class="{ dark: generalStore.isDark }">
        <div class="bg-background dark:bg-[#444343] text-on-background dark:text-dark-on-background min-h-screen">
            <div v-show="generalStore.hasNotification"
                class="fixed w-screen bg-gray-300 dark:bg-gray-300 flex justify-between items-center px-6 h-10 z-50">
                {{ generalStore.notification.message }}
                <span @click="generalStore.clearNotification" class=" cupo">X</span>
            </div>
            <div v-if="!userStore.isAuthorized" class="max-h-screen overflow-hidden">
                <div class="flex justify-between px-10E7E7E7 py-7 px-5 border-b">
                    <Logo />
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-6">
                            <!-- <div>
                                <NuxtLink to="/events">Events</NuxtLink>
                            </div>
                            <span>
                                |
                            </span>
                            <div class="flex gap-2">
                                <NuxtLink to="/signin">Sign In</NuxtLink>
                                <NuxtLink to="/signup">Sign Up</NuxtLink>
                            </div> -->
                            <div class="flex items-center gap-2">
                                <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown"
                                    class="text-on-background" type="button">
                                    <svg class="w-7 h-7" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path clip-rule="evenodd" fill-rule="evenodd"
                                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                            <!-- Dropdown menu -->
                            <div id="dropdown"
                                class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign
                                            out</a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                        <!-- <ThemeToggle /> -->
                    </div>
                </div>
                <div>
                    <slot />
                </div>
            </div>
            <div v-else class="max-h-screen">
                <aside id="default-sidebar"
                    class="fixed top-0 left-0 z-40 w-64 lg:w-72 bg-surface dark:bg-dark-surface h-screen transition-transform -translate-x-full md:translate-x-0"
                    aria-label="Sidebar">
                    <div
                        class="h-full pb-12 overflow-hidden bg-surface dark:bg-dark-surface flex flex-col justify-between items-center">
                        <div class="flex flex-col gap-14">
                            <div class="h-24 flex justify-center items-end">
                                <Logo />
                            </div>
                            <ul class="flex flex-col gap-9 items-center">
                                <li v-for="sideBarLink in sideBarLinks" :key="sideBarLink.text"
                                    data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar">
                                    <SideBarButton :text="sideBarLink.text" :link="sideBarLink.link"
                                        :icon="sideBarLink.icon" />
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li>
                                    <SideBarButton :text="sideBarLinkForCreate.text" :link="sideBarLinkForCreate.link"
                                        :icon="sideBarLinkForCreate.icon" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>
                <div class="max-h-screen overflow-hidden pb-20 md:ml-64 lg:ml-72">
                    <div class="h-24 flex justify-between items-center px-5 border-b">
                        <div></div>
                        <div class="flex gap-6 md:hidden">
                            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar"
                                aria-controls="default-sidebar" type="button"
                                class="inline-flex items-center text-xl md:hidden hover:bg-gray-100 outline-none">
                                <span class="sr-only">Open sidebar</span>
                                <svg class="w-9 h-9" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd" fill-rule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                                    </path>
                                </svg>
                            </button>
                            <Logo />
                        </div>
                        <div class="flex items-center gap-6">
                            <Profile />
                            <!-- <div class="w-0.5 h-8 rounded-lg bg-gray-300">
                            </div>
                            <ThemeToggle /> -->
                        </div>
                    </div>
                    <div class="h-[95vh]">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGeneralStore, useUserStore } from '@/pinia-stores';
import { meQueryResponse } from '@/graphql/user/me-query.types';
import { meQuery } from '@/graphql/user';
import { initDrawers, initDropdowns } from 'flowbite';
import { Icon } from '@iconify/vue';

const generalStore = useGeneralStore()
const userStore = useUserStore()
const { getToken } = useApollo()

onMounted(() => {
    initDropdowns()
    initDrawers()
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
        console.error("default layout getToken", error)
    })
})

// Data
const sideBarLinks = [
    {
        link: "/events",
        text: "Events",
        icon: {
            icon: "material-symbols:celebration-rounded"
        }
    },
    {
        link: "/events/my",
        text: "Your Events"
    },
    {
        link: "/events/saved",
        text: "Saved",
        icon: {
            icon: "material-symbols:bookmark-rounded"
        },

    },
    {
        link: "/tickets",
        text: "Tickets",
        icon: {
            icon: "heroicons:ticket-20-solid"
        }
    }
]

const sideBarLinkForCreate = {
    link: "/events/create",
    text: "Create",
    icon: {
        icon: "material-symbols:add-rounded"
    }
}
</script>