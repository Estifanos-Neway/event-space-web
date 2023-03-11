<template>
    <div class="h-full overflow-auto">
        <h3>Create New Event</h3>
        <br>
        <EventComposer :getId="getId" :submitter="submitter" />
    </div>
</template>

<script setup lang="ts">
import { AddEventMutationRes, AddEventMutationVars } from '~~/graphql/events/add-event.mutation.types';
import { addEventMutation } from "~~/graphql/events"
import { ComposedEvent } from './types';
import { UseMutationReturn } from '@vue/apollo-composable';
import { FetchResult } from '@apollo/client';

function submitter(composedEvent: ComposedEvent): UseMutationReturn<AddEventMutationRes, AddEventMutationVars> {
    const newEvent: AddEventMutationVars = {
        ...composedEvent,
        title: composedEvent.title!,
        date: composedEvent.date!,
        location: [composedEvent.latitude!, composedEvent.longitude!]
    }
    return useMutation<AddEventMutationRes, AddEventMutationVars>(
        addEventMutation,
        {
            variables: newEvent,
            fetchPolicy: "no-cache"
        }
    )
}

function getId(result: FetchResult) {
    return result.data?.insertEventsOne.id
}
</script>