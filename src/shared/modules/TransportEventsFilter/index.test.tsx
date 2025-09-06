import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { TransportEventsFilter } from './index';
import { Provider } from 'react-redux';
import { configureStore } from 'redux-mock-store';
import { EventStatus } from '../../../core/@types/event.types';
import { filterEvents } from '../../../core/state/events/events.reducer';

export const transportEventsFilterAriaLabelKeys = {
    dialog: 'transport-event-filter-dialog',
    dialogTitle: 'dialog-title',
    openButton: 'open-button',
    cancelButton: 'cancel-button',
    clearButton: 'clear-button',
    applyButton: 'apply-button',
    selectTypes: 'Types',
};

const mockStore = configureStore([]);
const store = mockStore({
    events: { list: [], filteredList: [], status: null, error: null },
});

const mockDispatch = jest.fn();
jest.mock('../../../core/state/store.hooks', () => ({
    useAppDispatch: () => mockDispatch,
}));

describe('TransportEventsFilter', () => {
    beforeEach(() => {
        mockDispatch.mockClear();

        render(
            <Provider store={store}>
                <TransportEventsFilter />
            </Provider>
        );

        const filterButton = screen.getByRole('button', {
            name: /open filter button/i,
        });
        fireEvent.click(filterButton);
    });

    it('should open dialog', () => {
        const dialogTitleElem = screen.getByLabelText(
            transportEventsFilterAriaLabelKeys.dialogTitle
        );
        expect(dialogTitleElem).toBeInTheDocument();
    });

    it('should apply filters', async () => {
        const radio = screen.getByLabelText(EventStatus.RESOLVED);
        fireEvent.click(radio);

        const applyButton = screen.getByRole('button', {
            name: transportEventsFilterAriaLabelKeys.applyButton,
        });

        fireEvent.click(applyButton);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'events/filterEvents',
                    payload: { status: EventStatus.RESOLVED, types: [] },
                })
            );
        });
    });

    it('should close dialog', async () => {
        const cancelBtn = screen.getByRole('button', {
            name: transportEventsFilterAriaLabelKeys.cancelButton,
        });
        fireEvent.click(cancelBtn);

        await waitFor(() => {
            expect(
                screen.queryByRole('dialog', {
                    name: transportEventsFilterAriaLabelKeys.dialog,
                })
            ).not.toBeInTheDocument();
        });
    });

    it('should show "Clear" button only when filters applied', () => {
        expect(
            screen.queryByRole('button', {
                name: transportEventsFilterAriaLabelKeys.clearButton,
            })
        ).not.toBeInTheDocument();

        const activeRadio = screen.getByRole('radio', {
            name: EventStatus.ACTIVE,
        });
        fireEvent.click(activeRadio);

        expect(
            screen.getByRole('button', {
                name: transportEventsFilterAriaLabelKeys.clearButton,
            })
        ).toBeInTheDocument();
    });

    it('should clear filters and dispatch reset', () => {
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[1]);

        const clearBtn = screen.getByRole('button', {
            name: transportEventsFilterAriaLabelKeys.clearButton,
        });
        fireEvent.click(clearBtn);

        expect(mockDispatch).toHaveBeenCalledWith(
            filterEvents({ types: [], status: '' })
        );
    });

    it('should apply selected filters and dispatch them', async () => {
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[1]);

        const applyBtn = screen.getByRole('button', {
            name: transportEventsFilterAriaLabelKeys.applyButton,
        });
        await act(async () => {
            fireEvent.click(applyBtn);
        });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: filterEvents.type,
                })
            );
        });
    });

    it('should allow selecting event types', async () => {
        const select = screen.getByLabelText(
            transportEventsFilterAriaLabelKeys.selectTypes
        );
        fireEvent.mouseDown(select);

        await waitFor(() => {
            const option = screen.getAllByRole('option')[0];
            fireEvent.click(option);

            expect(select).toHaveTextContent(option?.textContent || '');
        });
    });
});
