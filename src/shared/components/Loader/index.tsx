import { CircularProgress, Stack } from '@mui/material';
import { FC } from 'react';

export const Loader: FC = () => {
    return (
        <Stack
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <CircularProgress />
        </Stack>
    );
};
