<template>
    <div>
        <div class="font-bold">E: {{ data }}</div>
    </div>
</template>

<script setup lang="ts">
import getLatestEventsQuery from "@/graphql/events/get-latest-events.gql"

const variables = { limit: 5 }
const { data } = await useAsyncQuery(getLatestEventsQuery, variables)

</script>