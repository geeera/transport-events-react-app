import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../core/state/store.hooks';
import {
    fetchTransportEventById,
    selectEventDetailsState,
} from '../../core/state/event-details/event-details.reducer';
import { useEffect } from 'react';
export const useEventDetailsByRouteParams = () => {
    const { eventId } = useParams();
    const dispatch = useAppDispatch();
    const selector = useAppSelector(selectEventDetailsState);

    useEffect(() => {
        if (eventId) {
            dispatch(fetchTransportEventById(eventId));
        }
    }, [eventId, dispatch]);

    return selector;
};
