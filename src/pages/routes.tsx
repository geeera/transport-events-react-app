import React from 'react';
import { Route, RouteProps, Routes } from 'react-router';
import App from '../App';
import { Home } from './Home';
import { EventDetails } from './EventDetails';

const appRoutes: RouteProps[] = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: 'event/:id',
        element: <EventDetails />,
    },
];

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                {appRoutes.map((route: RouteProps, idx) => (
                    <Route key={'identify-route-' + idx} {...route} />
                ))}
            </Route>
        </Routes>
    );
};
