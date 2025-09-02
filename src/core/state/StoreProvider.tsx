import { Provider } from 'react-redux';
import React, { PropsWithChildren } from 'react';
import { store } from './store';

export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};
