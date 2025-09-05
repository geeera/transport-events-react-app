import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import type { RouteProps } from 'react-router';
import App from '../App';
import { Loader } from '../shared/components/Loader';

const LazyHome = lazy(() => import('./Home'));
const LazyEventDetails = lazy(() => import('./EventDetails'));

const appRoutes: RouteProps[] = [
    {
        index: true,
        element: <LazyHome />,
    },
    {
        path: 'event/:eventId',
        element: <LazyEventDetails />,
    },
];

export const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<App />}>
                    {appRoutes.map((route: RouteProps, idx) => (
                        <Route key={'identify-route-' + idx} {...route} />
                    ))}
                </Route>
            </Routes>
        </Suspense>
    );
};
