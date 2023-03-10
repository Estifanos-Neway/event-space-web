// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/apollo'
    ],
    apollo: {
        clients: {
            default: {
                httpEndpoint: 'http://localhost:8000/v1/graphql',
                connectToDevTools: false,
            }
        },
    },
    buildModules: [
        'nuxt-vite'
    ],
    vite: {
        ssr: true,
        build: true
    }
})
