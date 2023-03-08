<template>
    <div @scroll="handleScroll" ref="scrollingList" class="h-full overflow-scroll">
        <div v-for="event in events" class="mb-3">
            <EventCard :event="event" />
        </div>
        <div :class="{ invisible: !loading }">
            loading...
        </div>
        <div v-if="error">
            Error | <span class="text-blue-400" @click="refetchEvents">Retry</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { DocumentNode } from "graphql";
import { GetEventsVars, GetEventsRes, GetMyEventsRes, GetSavedEventsRes } from "~~/graphql/events/get-events.types";
import { getEventsQuery, getMyEventsQuery, getSavedEventsQuery } from "~~/graphql/events"
import { EventPreview } from "~~/graphql/events/event-preview.type";
type listKindType = "all" | "my" | "saved"

const props = defineProps<
    {
        listKind: listKindType
    }
>()

const paginationLimit: number = 8
let queryDocument = reactive<DocumentNode>(getEventsQuery)
let events = reactive<Array<EventPreview>>([])
let getEvents: (result: any) => Array<EventPreview>
let updateQuery: (previousResult: any, fetchMoreResult: any) => {}
switch (props.listKind) {
    case "all":
        getEvents = (result: GetEventsRes) => {
            return result.events
        }
        updateQuery = (previousResult, fetchMoreResult) => (
            {
                ...previousResult,
                events: [
                    ...previousResult.events,
                    ...fetchMoreResult.events,
                ],
            }
        )
        break
    case "my":
        queryDocument = getMyEventsQuery
        getEvents = (result: GetMyEventsRes) => {
            return result.me.events
        }
        updateQuery = (previousResult, fetchMoreResult) => (
            {
                ...previousResult,
                me: {
                    ...previousResult.me,
                    events: [
                        ...previousResult.me.events,
                        ...fetchMoreResult.me.events,
                    ]
                },
            }
        )
        break
    case "saved":
        queryDocument = getSavedEventsQuery
        getEvents = (result: GetSavedEventsRes) => {
            return result.me.bookmarks.map(bookmark => bookmark.event)
        }
        updateQuery = (previousResult, fetchMoreResult) => (
            {
                ...previousResult,
                me: {
                    ...previousResult.me,
                    bookmarks: [
                        ...previousResult.me.bookmarks,
                        ...fetchMoreResult.me.bookmarks,
                    ]
                },
            }
        )
        break
}
const { loading, onResult, onError, error, fetchMore, refetch } = useQuery<any, GetEventsVars>(
    queryDocument,
    createEventsQueryVars(
        {
            offset: 0,
            limit: paginationLimit
        }
    )
)
onResult((result) => {
    events = getEvents(result.data)
})

onError(error => {
    console.error("EventListing onError", error)
})
function refetchEvents() {
    refetch()
}

// scrolling pagination
const scrollingList = ref<HTMLInputElement | null>(null)

function loadMore() {
    if (!loading.value) {
        fetchMore({
            variables: {
                offset: events.length,
                limit: paginationLimit
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return previousResult
                return updateQuery(previousResult, fetchMoreResult)
            }
        })
    }
}

function handleScroll() {
    const element = scrollingList.value
    if (element) {
        const scrollBottom = element.scrollHeight - element.clientHeight - element.scrollTop
        if (scrollBottom <= 15) {
            loadMore()
        }
    }
}
</script>