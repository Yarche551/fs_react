import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';

export interface DataTableColumn<T> {
    key: string;
    title: ReactNode;
    render: (row: T, index: number) => ReactNode;
    /** Значение, по которому работает поиск по таблице. */
    searchValue?: (row: T) => string;
    /** Значение, по которому работает сортировка (если не задано — колонка не сортируется). */
    sortValue?: (row: T) => string | number;
    headerStyle?: CSSProperties;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    emptyText?: string;
    pageSizeOptions?: number[];
}

type SortDirection = 'asc' | 'desc';

export function DataTable<T>({
    columns,
    rows,
    rowKey,
    emptyText = 'Записи отсутствуют',
    pageSizeOptions = [10, 25, 50, 100],
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const filteredRows = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return rows;
        }
        return rows.filter((row) =>
            columns.some((column) => column.searchValue?.(row).toLowerCase().includes(query)),
        );
    }, [rows, columns, search]);

    const sortedRows = useMemo(() => {
        const column = columns.find((item) => item.key === sortKey);
        if (!column?.sortValue) {
            return filteredRows;
        }
        const sortValue = column.sortValue;
        return [...filteredRows].sort((a, b) => {
            const aValue = sortValue(a);
            const bValue = sortValue(b);
            let result: number;
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                result = aValue - bValue;
            } else {
                result = String(aValue).localeCompare(String(bValue), 'ru');
            }
            return sortDirection === 'asc' ? result : -result;
        });
    }, [filteredRows, columns, sortKey, sortDirection]);

    const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const offset = (currentPage - 1) * pageSize;
    const pageRows = sortedRows.slice(offset, offset + pageSize);

    function handleSort(column: DataTableColumn<T>) {
        if (!column.sortValue) {
            return;
        }
        if (sortKey === column.key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(column.key);
            setSortDirection('asc');
        }
    }

    return (
        <div className="data-table">
            <div className="row mb-2">
                <div className="col-sm-6">
                    <label className="d-inline-flex align-items-center mb-0">
                        Показывать
                        <select
                            className="form-control form-control-sm mx-2"
                            style={{ width: 'auto' }}
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            {pageSizeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        записей
                    </label>
                </div>
                <div className="col-sm-6">
                    <label className="d-flex align-items-center mb-0 justify-content-sm-end">
                        Фильтр
                        <input
                            type="search"
                            className="form-control form-control-sm ml-2"
                            style={{ maxWidth: '250px' }}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Поиск..."
                        />
                    </label>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{
                                        ...column.headerStyle,
                                        cursor: column.sortValue ? 'pointer' : undefined,
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={() => handleSort(column)}
                                >
                                    {column.title}
                                    {column.sortValue && (
                                        <i
                                            className={`ml-1 fas ${
                                                sortKey === column.key
                                                    ? sortDirection === 'asc'
                                                        ? 'fa-sort-up'
                                                        : 'fa-sort-down'
                                                    : 'fa-sort text-muted'
                                            }`}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center text-muted">
                                    {emptyText}
                                </td>
                            </tr>
                        )}
                        {pageRows.map((row, index) => (
                            <tr key={rowKey(row)}>
                                {columns.map((column) => (
                                    <td key={column.key}>{column.render(row, offset + index)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="row mt-2 align-items-center">
                <div className="col-sm-6 text-muted">
                    Страница {currentPage} из {totalPages} (всего записей: {sortedRows.length})
                </div>
                <div className="col-sm-6">
                    <ul className="pagination pagination-sm float-sm-right mb-0">
                        <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => setPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Назад
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                                (pageNumber) =>
                                    totalPages <= 7 ||
                                    Math.abs(pageNumber - currentPage) <= 2 ||
                                    pageNumber === 1 ||
                                    pageNumber === totalPages,
                            )
                            .map((pageNumber) => (
                                <li
                                    key={pageNumber}
                                    className={`page-item${pageNumber === currentPage ? ' active' : ''}`}
                                >
                                    <button type="button" className="page-link" onClick={() => setPage(pageNumber)}>
                                        {pageNumber}
                                    </button>
                                </li>
                            ))}
                        <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => setPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Вперед
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
