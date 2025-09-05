export function descendingSortingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export type SortingOrder = 'asc' | 'desc';

export function getSortingComparator<T, Key extends keyof T>(
    order: SortingOrder,
    orderBy: Key
): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingSortingComparator(a, b, orderBy)
        : (a, b) => -descendingSortingComparator(a, b, orderBy);
}
