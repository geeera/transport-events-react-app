import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IEvent } from '../../@types/event.types';
import { StatusType } from '../../@types/status.type';
import { isArray, isEmpty, isObject } from 'lodash';

interface EventsState {
    list: IEvent[];
    filteredList: IEvent[];
    status: StatusType | null;
    error: string | null;
}

const initialState: EventsState = {
    list: [],
    filteredList: [],
    status: null,
    error: null,
};

export const fetchTransportEvents = createAsyncThunk(
    'events/fetchList',
    async () => {
        const requestUrl = process.env.REACT_APP_API_URL as string;
        const response = await fetch(`${requestUrl}/transport_data.json`);
        const result = await response.json();

        const request = new Promise((resolve, reject) => {
            // setTimeout need only for fake request imitation
            setTimeout(() => {
                resolve(result);
            }, 5000);
        });
        return request;
    }
);

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        filterEvents(state, action) {
            const { types, status } = action.payload;
            const filterKeys = Object.entries(action.payload)
                .filter(([_, v]) => {
                    if (isArray(v)) {
                        return !!v.length;
                    }

                    if (isObject(v)) {
                        return !isEmpty(v);
                    }

                    return !!v;
                })
                .map(([key]) => key);

            const filteredEvents = state.list.filter((event) => {
                const hasNeededType = types.includes(event.type);
                const hasNeededStatus = event.status === status;
                const filtersMap = {
                    types: hasNeededType,
                    status: hasNeededStatus,
                };

                const isValid = filterKeys.reduce((total, filterKey) => {
                    return (
                        total &&
                        filtersMap[filterKey as keyof typeof filtersMap]
                    );
                }, true);
                return isValid;
            });

            state.filteredList = filteredEvents;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransportEvents.pending, (state, action) => {
                console.log('pending');
                state.status = StatusType.PENDING;
            })
            .addCase(fetchTransportEvents.fulfilled, (state, action) => {
                state.list = action.payload as unknown as IEvent[];
                state.filteredList = action.payload as unknown as IEvent[];
                console.log('fulfilled');
                state.status = StatusType.FULFILLED;
            })
            .addCase(fetchTransportEvents.rejected, (state, action) => {
                state.list = [];
                state.filteredList = [];
                state.status = StatusType.REJECTED;
                state.error = action.error.message || 'An error occurred';
            });
    },
});

export const { filterEvents } = eventsSlice.actions;

export const selectEventsState = (state: RootState) => state.events;
export const selectEventsList = (state: RootState) => state.events.list;
export const selectEventsFilterList = (state: RootState) =>
    state.events.filteredList;
export const selectEventsListStatus = (state: RootState) => state.events.status;
export const selectEventsListError = (state: RootState) => state.events.error;

export default eventsSlice.reducer;
