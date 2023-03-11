export type EventPreview = {
    id: string
    title: string
    description: string
    date: Date
    bookmarks_count: number
    images: string
    city: {
        name: string
        id: string
    }
    price: number
    bookmarked_by_user?: string
    followed_by_user?: string
}
