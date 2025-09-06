import { FC, forwardRef, ReactElement, useMemo, useState } from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    Slide,
    Stack,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { EventStatus, EventTypes } from '../../../core/@types/event.types';
import { TransitionProps } from '@mui/material/transitions';
import { useAppDispatch } from '../../../core/state/store.hooks';
import { filterEvents } from '../../../core/state/events/events.reducer';
import { isEmpty, isEqual } from 'lodash';
import { transportEventsFilterAriaLabelKeys } from './index.test';

type Inputs = {
    types: EventTypes[];
    status: EventStatus | string;
};

const eventTypes = Object.values(EventTypes);
const eventStatuses = Object.values(EventStatus);

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
    types: [],
    status: '',
};

export const TransportEventsFilter: FC = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const {
        handleSubmit,
        formState: { errors, dirtyFields },
        getValues,
        control,
        reset,
        watch,
    } = useForm<Inputs>({
        defaultValues: defaultValues,
    });
    const values = watch();
    const isShowClearButton = useMemo(() => {
        return !isEqual(defaultValues, values);
    }, [values]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClear = () => {
        reset();
        dispatch(filterEvents(getValues()));
    };

    const submit: SubmitHandler<Inputs> = (data) => {
        dispatch(filterEvents(data));
        handleClose();
    };

    return (
        <>
            <IconButton
                aria-label="open filter button"
                onClick={handleClickOpen}
                sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                }}
            >
                <FilterAltIcon sx={{ color: 'white' }} />
            </IconButton>
            <Dialog
                aria-label={transportEventsFilterAriaLabelKeys.dialog}
                open={open}
                onClose={handleClose}
                slots={{
                    transition: Transition,
                }}
                keepMounted
            >
                <DialogTitle
                    aria-label={transportEventsFilterAriaLabelKeys.dialogTitle}
                >
                    Transport events filter
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <DialogContentText>
                            To filter transport events, please choose one or
                            many types and/or status here.
                        </DialogContentText>
                        <form
                            onSubmit={handleSubmit(submit)}
                            id="transport-events-filter-form"
                        >
                            <Stack spacing={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-types">
                                        Types
                                    </InputLabel>
                                    <Controller
                                        name="types"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field }) => {
                                            return (
                                                <Select
                                                    {...field}
                                                    multiple
                                                    labelId="label-types"
                                                    input={
                                                        <OutlinedInput
                                                            label={
                                                                transportEventsFilterAriaLabelKeys.selectTypes
                                                            }
                                                        />
                                                    }
                                                    renderValue={(
                                                        selected: string[]
                                                    ) => selected.join(', ')}
                                                >
                                                    {eventTypes.map(
                                                        (eventTypeValue) => (
                                                            <MenuItem
                                                                key={
                                                                    eventTypeValue
                                                                }
                                                                value={
                                                                    eventTypeValue
                                                                }
                                                            >
                                                                <Checkbox
                                                                    checked={getValues().types?.includes(
                                                                        eventTypeValue
                                                                    )}
                                                                />
                                                                <ListItemText
                                                                    primary={
                                                                        eventTypeValue
                                                                    }
                                                                />
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            );
                                        }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">
                                        Status
                                    </FormLabel>
                                    <Controller
                                        name="status"
                                        control={control}
                                        defaultValue={eventStatuses[0]}
                                        render={({ field }) => {
                                            return (
                                                <RadioGroup {...field}>
                                                    <FormControlLabel
                                                        value=""
                                                        control={<Radio />}
                                                        label="No include"
                                                    />
                                                    {eventStatuses.map(
                                                        (status) => (
                                                            <FormControlLabel
                                                                key={status}
                                                                value={status}
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label={status}
                                                            />
                                                        )
                                                    )}
                                                </RadioGroup>
                                            );
                                        }}
                                    />
                                </FormControl>
                            </Stack>
                        </form>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="error"
                        aria-label={
                            transportEventsFilterAriaLabelKeys.cancelButton
                        }
                    >
                        Cancel
                    </Button>
                    {isShowClearButton && (
                        <Button
                            onClick={handleClear}
                            color="warning"
                            aria-label={
                                transportEventsFilterAriaLabelKeys.clearButton
                            }
                        >
                            Clear
                        </Button>
                    )}
                    <Button
                        type="submit"
                        onClick={handleSubmit(submit)}
                        color="primary"
                        variant="contained"
                        aria-label={
                            transportEventsFilterAriaLabelKeys.applyButton
                        }
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
