import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchOrders } from '@/features/orders/ordersSlice';
import { OrdersCalendar, type CalendarEvent } from '@/components/dashboard/OrdersCalendar';
import { Loader } from '@/components/common/Loader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { usePageTitle } from '@/hooks/usePageTitle';
import { fullName } from '@/utils/format';
import type { Order } from '@/types';

const COMPLETED_COLOR = 'gray';

function buildEvents(orders: Order[]): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    orders.forEach((order) => {
        const isDone = order.status === 'success';

        if (order.scheduledDate) {
            events.push({
                id: `${order.id}-scheduled`,
                title: `${fullName(order.freelancer)} выполняет заказ ${order.number}`,
                date: new Date(order.scheduledDate),
                color: isDone ? COMPLETED_COLOR : '#00c0ef',
            });
        }

        if (order.deadlineDate) {
            events.push({
                id: `${order.id}-deadline`,
                title: `Дедлайн заказа ${order.number}`,
                date: new Date(order.deadlineDate),
                color: isDone ? COMPLETED_COLOR : '#f39c12',
            });
        }

        if (order.completeDate) {
            events.push({
                id: `${order.id}-complete`,
                title: `Заказ ${order.number} выполнен фрилансером ${order.freelancer?.name ?? ''}`,
                date: new Date(order.completeDate),
                color: isDone ? COMPLETED_COLOR : '#00a65a',
            });
        }
    });

    return events;
}

export function DashboardPage() {
    usePageTitle('Дашборд');

    const dispatch = useAppDispatch();
    const { items: orders, listLoading, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        void dispatch(fetchOrders());
    }, [dispatch]);

    const stats = useMemo(
        () => ({
            total: orders.length,
            done: orders.filter((order) => order.status === 'success').length,
            inProgress: orders.filter((order) => order.status === 'new' || order.status === 'confirmed').length,
            canceled: orders.filter((order) => order.status === 'canceled').length,
        }),
        [orders],
    );

    const events = useMemo(() => buildEvents(orders), [orders]);

    return (
        <div className="dashboard container-fluid">
            <div className="content-header">
                <h1 className="m-0">Дашборд</h1>
            </div>

            <section className="content">
                <ErrorAlert message={error} />

                <div className="row">
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-info">
                            <div className="inner">
                                <h3>{stats.total}</h3>
                                <p>Всего заказов</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-list-ol" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-success">
                            <div className="inner">
                                <h3>{stats.done}</h3>
                                <p>Завершено</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-check" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-warning">
                            <div className="inner">
                                <h3>{stats.inProgress}</h3>
                                <p>В процессе</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-hourglass-half" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-danger">
                            <div className="inner">
                                <h3>{stats.canceled}</h3>
                                <p>Отменено</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-times" />
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="mb-2">Календарь заказов</h3>
                <div className="card card-primary">
                    <div className="card-body p-0">
                        {listLoading ? <Loader /> : <OrdersCalendar events={events} />}
                    </div>
                </div>
            </section>
        </div>
    );
}
