<template>
    <div class="h-full overflow-auto">
        <div v-if="result">
            <div>
                {{ result.eventsByPk.price }}
                <BuyTicket :event="result.eventsByPk" />
                <Bookmark :isPreview="false" :event="result.eventsByPk" />
                <Follow :event="result.eventsByPk" />
            </div>
            <pre>{{ result }}</pre>
        </div>
        <div v-else-if="error">
            Error getting event detail <span @click="refetchEvents">[Retry]</span>
        </div>
        <div v-else="loading">
            Loading...
        </div>

    </div>
</template>

<script setup lang="ts">
import { GetEventQueryRes, GetEventQueryVars } from '~~/graphql/events/get-event-query.types';
import { getEventQuery } from "~~/graphql/events"

const route = useRoute()
const { result, loading, error, onError, refetch } = useQuery<GetEventQueryRes, GetEventQueryVars>(
    getEventQuery,
    {
        id: route.params.id as string
    },
    {
        fetchPolicy: "network-only"
    }
)
onError(error => {
    console.error("getting event detail onError:")
})

function refetchEvents() {
    refetch()
}
</script>