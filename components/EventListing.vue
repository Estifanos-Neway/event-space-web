<template>
    <div>
        <div>
            {{ result }}
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
import { GetEventsVars } from "~~/graphql/events/get-events.types";
import { getEventsQuery, getMyEventsQuery, getSavedEventsQuery } from "~~/graphql/events"
type listKindType = "all" | "my" | "saved"


const props = defineProps<
    {
        listKind: listKindType
    }
>()
const paginationLimit: number = 8
let queryDocument = reactive<DocumentNode>(getEventsQuery)
switch (props.listKind) {
    case "my":
        queryDocument = getMyEventsQuery
        break
    case "saved":
        queryDocument = getSavedEventsQuery
}
const { loading, result, onError, error, fetchMore, refetch } = useQuery<any, GetEventsVars>(
    queryDocument,
    createEventsQueryVars(
        {
            offset: 0,
            limit: paginationLimit
        }
    )
)
onError(error => {
    console.error("EventListing onError", error)
})
function refetchEvents() {
    refetch()
}
</script>