import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './events/events.reducer';
import eventDetailsReducer from './event-details/event-details.reducer';
// ...

export const store = configureStore({
    reducer: {
        events: eventsReducer,
        eventDetails: eventDetailsReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
