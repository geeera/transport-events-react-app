// events.reducer.test.ts
import reducer, { filterEvents, fetchTransportEvents } from './events.reducer';
import { StatusType } from '../../@types/status.type';
import { EventStatus, EventTypes, IEvent } from '../../@types/event.types';

const mockBusEvent: IEvent = {
    id: '1',
    type: EventTypes.BUS,
    status: EventStatus.ACTIVE,
    title: 'Bus event',
    lat: 53.2,
    lng: 30.2,
    timestamp: new Date(),
};

const mockTramEvent: IEvent = {
    id: '2',
    type: EventTypes.TRAM,
    status: EventStatus.RESOLVED,
    title: 'Tram event',
    lat: 53.2,
    lng: 30.2,
    timestamp: new Date(),
};

const mockEvents: IEvent[] = [mockBusEvent, mockTramEvent];

describe('events reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, { type: '' })).toEqual({
            list: [],
            filteredList: [],
            status: null,
            error: null,
        });
    });

    it('should handle filterEvents by type', () => {
        const prevState = {
            list: mockEvents,
            filteredList: mockEvents,
            status: null,
            error: null,
        };

        const nextState = reducer(
            prevState,
            filterEvents({ types: [EventTypes.BUS], status: '' })
        );

        expect(nextState.filteredList).toEqual([mockBusEvent]);
    });

    it('should handle filterEvents by status', () => {
        const prevState = {
            list: mockEvents,
            filteredList: mockEvents,
            status: null,
            error: null,
        };

        const nextState = reducer(
            prevState,
            filterEvents({ types: [], status: EventStatus.RESOLVED })
        );

        expect(nextState.filteredList).toEqual([mockTramEvent]);
    });

    it('should handle fetchTransportEvents.pending', () => {
        const nextState = reducer(undefined, {
            type: fetchTransportEvents.pending.type,
        });
        expect(nextState.status).toBe(StatusType.PENDING);
    });

    it('should handle fetchTransportEvents.fulfilled', () => {
        const nextState = reducer(undefined, {
            type: fetchTransportEvents.fulfilled.type,
            payload: mockEvents,
        });
        expect(nextState.list).toEqual(mockEvents);
        expect(nextState.filteredList).toEqual(mockEvents);
        expect(nextState.status).toBe(StatusType.FULFILLED);
    });

    it('should handle fetchTransportEvents.rejected', () => {
        const nextState = reducer(undefined, {
            type: fetchTransportEvents.rejected.type,
            error: { message: 'Network error' },
        });
        expect(nextState.list).toEqual([]);
        expect(nextState.filteredList).toEqual([]);
        expect(nextState.status).toBe(StatusType.REJECTED);
        expect(nextState.error).toBe('Network error');
    });
});
