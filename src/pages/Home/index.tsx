import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../core/state/store.hooks';
import {
    fetchTransportEvents,
    selectEventsState,
} from '../../core/state/events/events.reducer';

import Box from '@mui/material/Box';
import Tab, { TabProps } from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TransportEventsMap from '../../shared/modules/TransportEventsMap';
import TransportEventsTable from '../../shared/modules/TransportEventsTable';
import { StatusType } from '../../core/@types/status.type';
import { TransportEventsFilter } from '../../shared/modules/TransportEventsFilter';
import { ErrorView } from '../../shared/components/ErrorView';
import { Loader } from '../../shared/components/Loader';

enum HOME_TABS {
    MAP,
    TABLE,
}

const HOME_TABS_CONFIG: Record<HOME_TABS, TabProps> = {
    [HOME_TABS.MAP]: {
        label: 'Map',
        value: HOME_TABS.MAP,
    },
    [HOME_TABS.TABLE]: {
        label: 'Table',
        value: HOME_TABS.TABLE,
    },
};

const HOME_TABS_ARR = Object.values(HOME_TABS_CONFIG);

const Home: React.FC = () => {
    const [currentView, setCurrentView] = useState(HOME_TABS.MAP);
    const dispatch = useAppDispatch();
    const transportEvents = useAppSelector(selectEventsState);

    useEffect(() => {
        dispatch(fetchTransportEvents());
    }, [dispatch]);

    if (transportEvents.status === StatusType.PENDING) {
        return <Loader />;
    } else if (transportEvents.status === StatusType.REJECTED) {
        return <ErrorView message={transportEvents.error} />;
    }

    const handleChange = (e: SyntheticEvent, view: number) => {
        setCurrentView(view);
    };

    return (
        <Box sx={{ height: '100%', overflow: 'hidden' }}>
            <TabContext value={currentView}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        {HOME_TABS_ARR.map((tabProps, idx) => (
                            <Tab
                                key={'home-tab-identifier-' + idx}
                                {...tabProps}
                            />
                        ))}
                    </TabList>
                </Box>
                <TabPanel
                    value={HOME_TABS.MAP}
                    sx={{ padding: 0, height: '100%' }}
                >
                    <TransportEventsMap events={transportEvents.filteredList} />
                </TabPanel>
                <TabPanel
                    value={HOME_TABS.TABLE}
                    sx={{ padding: 0, height: '100%' }}
                >
                    <TransportEventsTable
                        events={transportEvents.filteredList}
                    />
                </TabPanel>
            </TabContext>
            <Box sx={{ position: 'fixed', right: '1rem', bottom: '1rem' }}>
                <TransportEventsFilter />
            </Box>
        </Box>
    );
};

export default Home;
