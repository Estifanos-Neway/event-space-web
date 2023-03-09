<template>
    <div>
        <div v-if="isPreview" class="flex gap-2 items-center">
            <div class="text-3xl" @click.stop="toggleBookmark" :class="{ 'text-blue-800': adding || dropping }">
                <span v-if="thisEvent.bookmarked_by_user">
                    <Icon icon="material-symbols:bookmark-rounded" />
                </span>
                <span v-else>
                    <Icon icon="material-symbols:bookmark-outline-rounded" />
                </span>
            </div>
            <span class="text-2xl">{{ thisEvent.bookmarks_count }}</span>
        </div>
        <div v-else>
            <p>{{ thisEvent.bookmarks_count }} Bookmarks</p>
            <div class="flex gap-4 items-center border-2 w-fit p-1 pr-3 border-gray-500 rounded-md cursor-pointer" @click.stop="toggleBookmark"
                :class="{ 'text-blue-800': adding || dropping }">
                <div class="text-3xl">
                    <span v-if="thisEvent.bookmarked_by_user">
                        <Icon icon="material-symbols:bookmark-rounded" />
                    </span>
                    <span v-else>
                        <Icon icon="material-symbols:bookmark-outline-rounded" />
                    </span>
                </div>
                {{ thisEvent.bookmarked_by_user ? "Bookmarked" : "Bookmark" }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventPreview } from '~~/graphql/events/event-preview.type';
import { Icon } from '@iconify/vue';

const props = defineProps<{
    isPreview: boolean
    event: EventPreview
}>()

const thisEvent = { ...props.event }
const { mutate: add, onDone: onAddDone, onError: onAddError, loading: adding } = addBookmark()
const { mutate: drop, onDone: onDropDone, onError: onDropError, loading: dropping } = dropBookmark()
onAddDone(result => {
    thisEvent.bookmarked_by_user = result.data?.insertBookmarksOne.id
    thisEvent.bookmarks_count++
})
onAddError(error => {
    console.error("onAddError:", error)
})
onDropDone(() => {
    thisEvent.bookmarked_by_user = undefined
    thisEvent.bookmarks_count--
})
onDropError(error => {
    console.error("onDropError:", error)
})

function toggleBookmark() {
    if (adding.value || dropping.value) return
    else if (thisEvent.bookmarked_by_user) {
        drop({ id: thisEvent.bookmarked_by_user })
    } else {
        add({ eventId: thisEvent.id })
    }
}

</script>