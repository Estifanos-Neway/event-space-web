<template>
    <div>
        <p>{{ thisEvent.user.followers_count }} Followers </p>
        <div class="border-2 w-fit p-1 pr-3 border-gray-500 rounded-md cursor-pointer" @click.stop="toggleFollow"
            :class="{ 'text-blue-800': adding || dropping }">
            <div class="text-2xl">
                <span v-if="thisEvent.followed_by_user">
                    <span>Following</span>
                </span>
                <span v-else class="flex gap-4 items-center">
                    <Icon icon="material-symbols:bookmark-rounded" />
                    <span>Follow</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '~~/graphql/events/event.type';
import { Icon } from '@iconify/vue';

const props = defineProps<{
    event: Event
}>()

const thisEvent = { ...props.event, user: { ...props.event.user } }
const { mutate: add, onDone: onAddDone, onError: onAddError, loading: adding } = addFollow()
const { mutate: drop, onDone: onDropDone, onError: onDropError, loading: dropping } = dropFollow()
onAddDone(result => {
    thisEvent.followed_by_user = result.data?.insertFollowsOne.id
    thisEvent.user.followers_count++
})
onAddError(error => {
    console.error("onAddError:", error)
})
onDropDone(() => {
    thisEvent.followed_by_user = undefined
    thisEvent.user.followers_count--
})
onDropError(error => {
    console.error("onDropError:", error)
})

function toggleFollow() {
    if (adding.value || dropping.value) return
    else if (thisEvent.followed_by_user) {
        drop({ id: thisEvent.followed_by_user })
    } else {
        add({ followedId: thisEvent.user.id })
    }
}

</script>