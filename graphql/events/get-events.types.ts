import { Event } from "./event.type"

export type GetEventsVars = {
    offset?: number
    limit?: number
    orderBy?: {
        date: orderBy
        price: orderBy
    } | {}
    cityId?: { _in: Array<string> } | {}
    date?: range<Date> | {}
    price?: range<number> | {}

    // get by search text
    search?: string

    // get by location
    lat?: number
    long?: number
}

export type GetEventsRes = {
    events: Array<Event>
}

export type GetEventsByLocationRes = {
    eventsByLocation: Array<Event>
}
export type GetMyEventsRes = {
    me: {
        events: Array<Event>
    }
}
export type GetSavedEventsRes = {
    me: {
        bookmarks: Array<{
            event: Event
        }>
    }
}

type orderBy = "ASC" | "DESC"
type range<T> = {
    _gte: T
    _lte: T
}