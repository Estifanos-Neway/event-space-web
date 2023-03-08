<template>
    <div class="h-full overflow-auto">
        <div v-if="loading">
            Loading...
        </div>
        <div v-else-if="error">
            Error getting event detail <span @click="refetchEvents">[Retry]</span>
        </div>
        <pre v-else>
            {{ result }}
        </pre>
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
    }
)
onError(error => {
    console.error("getting event detail onError:")
})

function refetchEvents() {
    refetch()
}
</script>