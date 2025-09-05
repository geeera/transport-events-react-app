import React, { memo, useCallback, useMemo, useState } from 'react';
import {
    Box,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import { IEvent } from '../../../core/@types/event.types';
import moment from 'moment';
import { getSortingComparator, SortingOrder } from '../../utils/sorting';
import { debounce } from 'lodash';

interface RowData {
    id: number;
    title: string;
    type: string;
    status: number;
    createdAt: Date;
}

interface TransportEventsToolbarProps {
    onSearch: (value: string) => void;
}

const TransportEventsToolbar: React.FC<TransportEventsToolbarProps> = (
    props
) => {
    const [value, setValue] = useState('');

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                props.onSearch(query);
            }, 200),
        [props]
    );

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
        debouncedSearch(value);
    };
    return (
        <Box>
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabel
                    htmlFor="input-with-icon"
                    sx={{ marginLeft: '10px' }}
                >
                    Search
                </InputLabel>
                <Input
                    sx={{ padding: '0 10px' }}
                    id="input-with-icon"
                    value={value}
                    onChange={handleValueChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                />
            </FormControl>
        </Box>
    );
};

interface HeadCell {
    disablePadding: boolean;
    id: keyof RowData;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'Title',
    },
    {
        id: 'type',
        numeric: true,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'createdAt',
        numeric: true,
        disablePadding: false,
        label: 'Created at',
    },
];

interface TransportEventsTableHeaderProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof RowData
    ) => void;
    order: SortingOrder;
    orderBy: string | null;
    rowCount: number;
}

const TransportEventsTableHead: React.FC<TransportEventsTableHeaderProps> = (
    props
) => {
    const { order, orderBy, rowCount, onRequestSort } = props;
    const createSortHandler =
        (property: keyof RowData) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="left"
                        padding="normal"
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

interface TransportEventsTableProps {
    events: IEvent[];
}

const TransportEventsTable: React.FC<TransportEventsTableProps> = (props) => {
    const [order, setOrder] = useState<SortingOrder>('asc');
    const [orderBy, setOrderBy] = useState<keyof RowData | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');

    const rows: RowData[] = useMemo(() => {
        return props.events.map((event) => {
            return {
                id: event.id,
                title: event.title,
                type: event.type,
                status: event.status,
                createdAt: event.timestamp,
            } as unknown as RowData;
        });
    }, [props.events]);

    const visibleRows = useMemo(() => {
        const filteredRowsBySearch = rows.filter((row) => {
            return row.title.includes(searchValue);
        });
        if (!orderBy) {
            return filteredRowsBySearch.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            );
        }
        return filteredRowsBySearch
            .sort(getSortingComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [rows, searchValue, order, orderBy, page, rowsPerPage]);

    const formatDate = useCallback((timestamp: Date, format: string) => {
        return moment(timestamp).format(format);
    }, []);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof RowData
    ) => {
        if (orderBy === property) {
            setOrderBy(null);
            return;
        }
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        console.log('Click', id);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box>
            <Paper sx={{ width: '100%', mb: 2, paddingTop: '10px' }}>
                <TransportEventsToolbar onSearch={handleSearchChange} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        size="small"
                        aria-labelledby="tableTitle"
                    >
                        <TransportEventsTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) =>
                                            handleClick(event, row.id)
                                        }
                                        tabIndex={-1}
                                        key={row.id}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell align="left">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.type}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.status}
                                        </TableCell>
                                        <TableCell align="left">
                                            {formatDate(
                                                row.createdAt,
                                                'dddd, MMMM Do YYYY, HH:mm:ss'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 33 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};

export default memo(TransportEventsTable);
