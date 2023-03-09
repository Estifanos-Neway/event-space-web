export interface GetEventQueryVars {
    id: string
}

export interface GetEventQueryRes {
    eventsByPk:
    {
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
    }
}