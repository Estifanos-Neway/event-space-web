import { defineApolloClient } from '@nuxtjs/apollo'

export default defineApolloClient({
    httpEndpoint: 'http://localhost:8000/v1/graphql',
    connectToDevTools: false
})
