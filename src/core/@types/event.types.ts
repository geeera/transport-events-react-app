export enum EventTypes {
    BUS = 'bus',
    TRAM = 'tram',
    METRO = 'metro',
}

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export enum EventStatus {
    ACTIVE = 'active',
    RESOLVED = 'resolved',
}

export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];

export interface Event {
    id: string;
    type: EventType;
    title: string;
    status: EventStatusType;
    lat: number;
    lng: number;
    timestamp: Date;
}
