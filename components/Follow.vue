<template>
    <div>
        <div class="w-full p-2 pr-3 border-2 border-primary text-on-surface text-center font-medium rounded-md cupo"
            @click.stop="toggleFollow" :class="{ 'text-blue-800': adding || dropping }">
            <span v-if="thisEvent.followed_by_user">
                <span>Following</span>
            </span>
            <span v-else class="flex gap-2 items-center">
                <Icon icon="material-symbols:add-rounded" class="text-3xl" />
                <span>Follow</span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '~~/graphql/events/event.type';
import { Icon } from '@iconify/vue';
import { useUserStore } from '~~/pinia-stores';

const props = defineProps<{
    event: Event
}>()

const userStore = useUserStore()
const router = useRouter()
const thisEvent = { ...props.event, user: { ...props.event.user } }
const { mutate: add, onDone: onAddDone, onError: onAddError, loading: adding } = addFollow()
const { mutate: drop, onDone: onDropDone, onError: onDropError, loading: dropping } = dropFollow()
onAddDone(result => {
    thisEvent.followed_by_user = result.data?.insertFollowsOne.id
    thisEvent.user.followersCount++
})
onAddError(error => {
    console.error("onAddError:", error)
})
onDropDone(() => {
    thisEvent.followed_by_user = undefined
    thisEvent.user.followersCount--
})
onDropError(error => {
    console.error("onDropError:", error)
})

function toggleFollow() {
    if (!userStore.isAuthorized) {
        router.push("/signin")
    } else if (adding.value || dropping.value) {
        return
    } else if (thisEvent.followed_by_user) {
        drop({ id: thisEvent.followed_by_user })
    } else {
        add({ followedId: thisEvent.user.id })
    }
}

</script>