export type Event = {
    location: [number, number]
    bookmarks_count: number
    city: {
        name: string
        id: string
    }
    date: Date
    description: string
    id: string
    images: Array<string>
    price: number
    specificAddress: string
    tags: Array<string>
    title: string
    user: {
        avatarUrl: string
        description: string
        email: string
        followers_count: number
        id: string
        name: string
    }
    bookmarked_by_user?: string
    followed_by_user?: string
}