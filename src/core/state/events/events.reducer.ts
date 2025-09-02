import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Event } from '../../@types/event.types';

interface EventsState {
    list: Event[];
    filteredList: Event[];
    status: string | null;
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
        const response = await fetch('/assets/transport_data.json');
        const result = await response.json();

        const request = new Promise((resolve, reject) => {
            // setTimeout need only for fake request imitation
            setTimeout(() => {
                resolve(result);
            }, 3000);
        });
        return request;
    }
);

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransportEvents.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchTransportEvents.fulfilled, (state, action) => {
                state.list = action.payload as unknown as Event[];
                state.filteredList = action.payload as unknown as Event[];
                state.status = 'fulfilled';
            })
            .addCase(fetchTransportEvents.rejected, (state, action) => {
                state.list = [];
                state.filteredList = [];
                state.status = 'rejected';
                state.error = action.error.message || 'An error occurred';
            });
    },
});

// export const {} = eventsSlice.actions;

export const selectEventsState = (state: RootState) => state.events;
export const selectEventsList = (state: RootState) => state.events.list;
export const selectEventsFilterList = (state: RootState) =>
    state.events.filteredList;
export const selectEventsListStatus = (state: RootState) => state.events.status;
export const selectEventsListError = (state: RootState) => state.events.error;

export default eventsSlice.reducer;
