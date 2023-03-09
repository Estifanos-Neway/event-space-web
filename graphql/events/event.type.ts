export type Event = {
    location: string
    bookmarks_count: number
    city: {
        name: string
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
    bookmarked_by_user?:string
    followed_by_user?:string
}