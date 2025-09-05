import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IEvent } from '../../@types/event.types';
import type { RootState } from '../store';

export const fetchTransportEventById = createAsyncThunk(
    'events/fetchById',
    async (eventId: string) => {
        const requestUrl = process.env.REACT_APP_API_URL as string;
        const response = await fetch(`${requestUrl}/transport_data.json`);
        const result = await response.json();

        const request = new Promise((resolve, reject) => {
            const foundedEvent = result.find((e: IEvent) => e.id === eventId);
            // setTimeout need only for fake request imitation
            setTimeout(() => {
                if (foundedEvent) {
                    resolve(foundedEvent);
                } else {
                    reject(
                        new Error(
                            `Transport event with ID ${eventId} - not found.`
                        )
                    );
                }
            }, 1000);
        });
        return request;
    }
);

interface EventDetailsState {
    info: IEvent | null;
    status: string | null;
    error: string | null;
}

const initialState: EventDetailsState = {
    info: null,
    status: null,
    error: null,
};

export const eventDetailsSlice = createSlice({
    name: 'eventDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransportEventById.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchTransportEventById.fulfilled, (state, action) => {
                state.info = action.payload as unknown as IEvent;
                state.status = 'fulfilled';
            })
            .addCase(fetchTransportEventById.rejected, (state, action) => {
                state.info = null;
                state.status = 'rejected';
                state.error = action.error.message || 'An error occurred';
            });
    },
});

// export const {} = eventDetailsSlice.actions;

export const selectEventDetailsState = (state: RootState) => state.eventDetails;
export const selectEventDetailsInfo = (state: RootState) =>
    state.eventDetails.info;
export const selectEventDetailsStatus = (state: RootState) =>
    state.eventDetails.status;
export const selectEventDetailsError = (state: RootState) =>
    state.eventDetails.error;

export default eventDetailsSlice.reducer;
