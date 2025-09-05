import { FC } from 'react';
import { Paper, Stack, styled, Typography } from '@mui/material';

interface ErrorViewProps {
    title?: string;
    message?: string | null;
}

const defaultErrorMessage = 'Ops. Something went wrong';

const StylePaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: '2rem',
    width: 'max-content',
    minWidth: 375,
    height: 'auto',
}));

export const ErrorView: FC<ErrorViewProps> = (props) => {
    return (
        <Stack
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <StylePaper>
                <Stack direction="column">
                    <Typography variant="h5" component="h2" color="error">
                        {props.title || 'Error'}
                    </Typography>
                    <Typography component="p" color="error">
                        {props.message || defaultErrorMessage}
                    </Typography>
                </Stack>
                <Paper elevation={3} />
            </StylePaper>
        </Stack>
    );
};
