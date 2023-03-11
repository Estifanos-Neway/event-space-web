export type SelectedImage = {
    id: number
    b64: string | ArrayBuffer
    isThumbnail: boolean,
    extension:string
}

export type ComposedEvent = {
    title?: string
    description?: string
    tags?: Array<string>
    images?: Array<string>
    date?: Date
    price?: number
    cityId?: string
    latitude?: number
    longitude?: number
    specificAddress?: string
}