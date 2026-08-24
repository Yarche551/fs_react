import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { deleteOrder, fetchOrders } from '@/features/orders/ordersSlice';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Loader } from '@/components/common/Loader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePageTitle } from '@/hooks/usePageTitle';
import { formatDateTime, fullName } from '@/utils/format';
import type { Order } from '@/types';

export function OrdersListPage() {
    usePageTitle('Заказы');

    const dispatch = useAppDispatch();
    const { items, listLoading, saving, error } = useAppSelector((state) => state.orders);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    useEffect(() => {
        void dispatch(fetchOrders());
    }, [dispatch]);

    async function handleDelete() {
        if (!orderToDelete) {
            return;
        }
        await dispatch(deleteOrder(orderToDelete.id));
        setOrderToDelete(null);
    }

    const columns = useMemo<DataTableColumn<Order>[]>(
        () => [
            {
                key: 'number',
                title: '№',
                headerStyle: { width: '10px' },
                render: (row) => <Link to={`/orders/${row.id}`}>{row.number}</Link>,
                searchValue: (row) => String(row.number),
                sortValue: (row) => row.number,
            },
            {
                key: 'owner',
                title: 'Автор',
                render: (row) => fullName(row.owner),
                searchValue: (row) => fullName(row.owner),
                sortValue: (row) => fullName(row.owner),
            },
            {
                key: 'freelancer',
                title: 'Исполнитель',
                render: (row) =>
                    row.freelancer ? (
                        <Link to={`/freelancers/${row.freelancer.id}`}>{fullName(row.freelancer)}</Link>
                    ) : (
                        ''
                    ),
                searchValue: (row) => fullName(row.freelancer),
                sortValue: (row) => fullName(row.freelancer),
            },
            {
                key: 'scheduledDate',
                title: 'Запланировано на',
                render: (row) => formatDateTime(row.scheduledDate),
                sortValue: (row) => new Date(row.scheduledDate).getTime(),
            },
            {
                key: 'deadlineDate',
                title: 'Дедлайн',
                render: (row) => formatDateTime(row.deadlineDate),
                sortValue: (row) => new Date(row.deadlineDate).getTime(),
            },
            {
                key: 'status',
                title: 'Статус',
                render: (row) => <StatusBadge status={row.status} />,
                searchValue: (row) => row.status,
                sortValue: (row) => row.status,
            },
            {
                key: 'completeDate',
                title: 'Дата выполнения',
                render: (row) => formatDateTime(row.completeDate),
                sortValue: (row) => (row.completeDate ? new Date(row.completeDate).getTime() : 0),
            },
            {
                key: 'tools',
                title: '',
                render: (row) => (
                    <div className="order-tools">
                        <Link to={`/orders/${row.id}`} className="fas fa-eye" title="Просмотр" />
                        <Link to={`/orders/${row.id}/edit`} className="fas fa-edit" title="Редактировать" />
                        <button
                            type="button"
                            className="fas fa-trash btn btn-link p-0 text-danger"
                            title="Удалить"
                            onClick={() => setOrderToDelete(row)}
                        />
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <div className="orders">
            <PageHeader title="Список заказов" breadcrumbs={[{ title: 'Заказы' }]} />

            <section className="content">
                <div className="container-fluid">
                    <ErrorAlert message={error} />

                    <div className="card">
                        <div className="card-header">
                            <Link to="/orders/create" className="btn btn-primary">
                                <i className="fas fa-plus" /> Создать заказ
                            </Link>
                        </div>
                        <div className="card-body">
                            {listLoading ? (
                                <Loader />
                            ) : (
                                <DataTable
                                    columns={columns}
                                    rows={items}
                                    rowKey={(row) => row.id}
                                    emptyText="Заказы не найдены"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <ConfirmDialog
                show={Boolean(orderToDelete)}
                title="Удаление заказа"
                text={`Вы действительно хотите удалить заказ № ${orderToDelete?.number ?? ''}?`}
                loading={saving}
                onConfirm={() => void handleDelete()}
                onCancel={() => setOrderToDelete(null)}
            />
        </div>
    );
}
