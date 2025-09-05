import React, { useCallback } from 'react';
import { useEventDetailsByRouteParams } from '../../shared/hooks/useEventDetailsByRouteParams';
import { StatusType } from '../../core/@types/status.type';
import {
    IconButton,
    Typography,
    CardContent,
    Card,
    Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment/moment';
import { Loader } from '../../shared/components/Loader';
import { ErrorView } from '../../shared/components/ErrorView';
import { NavLink } from 'react-router';

const EventDetails: React.FC = () => {
    const eventDetailsState = useEventDetailsByRouteParams();
    const formatDate = useCallback((timestamp: Date, format: string) => {
        return moment(timestamp).format(format);
    }, []);

    if (eventDetailsState.status === StatusType.PENDING) {
        return <Loader />;
    }

    if (eventDetailsState.status === StatusType.REJECTED) {
        return <ErrorView message={eventDetailsState.error} />;
    }

    return (
        <Stack direction="column" spacing={2} sx={{ padding: '2rem 1rem' }}>
            <NavLink to="/">
                <IconButton>
                    <ArrowBackIcon />
                </IconButton>
            </NavLink>

            {eventDetailsState.info && (
                <Card sx={{ minWidth: 275, width: 'max-content' }}>
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >
                            {eventDetailsState.info.title}
                        </Typography>
                        <Typography>
                            Type: {eventDetailsState.info.type}
                        </Typography>
                        <Typography>
                            Status: {eventDetailsState.info.status}
                        </Typography>
                        <Typography>
                            Created at:{' '}
                            {formatDate(
                                eventDetailsState.info.timestamp,
                                'dddd, MMMM Do YYYY, HH:mm:ss'
                            )}
                        </Typography>
                        <Typography>
                            latitude: {eventDetailsState.info.lat}
                        </Typography>
                        <Typography>
                            longitude: {eventDetailsState.info.lng}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
};

export default EventDetails;
