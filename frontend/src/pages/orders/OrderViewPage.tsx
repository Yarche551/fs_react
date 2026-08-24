import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { deleteOrder, fetchOrder } from '@/features/orders/ordersSlice';
import { PageHeader } from '@/components/common/PageHeader';
import { Loader } from '@/components/common/Loader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { LevelBadge } from '@/components/common/LevelBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ORDER_STATUSES } from '@/config/config';
import { avatarUrl, formatDate, formatDateTime, fullName } from '@/utils/format';

export function OrderViewPage() {
    usePageTitle('Заказ');

    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { current, itemLoading, saving, error } = useAppSelector((state) => state.orders);
    const [confirmVisible, setConfirmVisible] = useState(false);

    useEffect(() => {
        if (id) {
            void dispatch(fetchOrder(id));
        }
    }, [dispatch, id]);

    async function handleDelete() {
        if (!id) {
            return;
        }
        const result = await dispatch(deleteOrder(id));
        setConfirmVisible(false);
        if (deleteOrder.fulfilled.match(result)) {
            navigate('/orders');
        }
    }

    const statusInfo = current ? ORDER_STATUSES[current.status] : null;

    return (
        <div className="order">
            <PageHeader
                title="Детали заказа"
                breadcrumbs={[{ title: 'Заказы', to: '/orders' }, { title: 'Детали заказа' }]}
            />

            <section className="content">
                <div className="container-fluid">
                    <ErrorAlert message={error} />

                    {itemLoading && <Loader />}

                    {!itemLoading && current && (
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card card-primary card-outline">
                                    <div className="card-body box-profile">
                                        <div className={`info-box mb-0 bg-${statusInfo?.color ?? 'secondary'}`}>
                                            <span className="info-box-icon">
                                                <i className={`fas fa-${statusInfo?.icon ?? 'times'}`} />
                                            </span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Статус</span>
                                                <span className="info-box-number">{statusInfo?.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card card-primary card-outline">
                                    <div className="card-header text-center">Исполнитель</div>
                                    <div className="card-body box-profile">
                                        <div className="text-center">
                                            <img
                                                className="profile-user-img img-fluid img-circle"
                                                src={avatarUrl(current.freelancer?.avatar)}
                                                alt={fullName(current.freelancer)}
                                            />
                                        </div>

                                        <h3 className="profile-username text-center">
                                            {current.freelancer && (
                                                <Link to={`/freelancers/${current.freelancer.id}`}>
                                                    {fullName(current.freelancer)}
                                                </Link>
                                            )}
                                        </h3>

                                        <p className="text-muted text-center">Фрилансер</p>

                                        <p className="text-muted text-center level">
                                            {current.freelancer && <LevelBadge level={current.freelancer.level} />}
                                        </p>
                                    </div>
                                </div>

                                <Link to={`/orders/${current.id}/edit`} className="btn btn-warning w-100">
                                    Редактировать
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-danger mt-2 w-100"
                                    onClick={() => setConfirmVisible(true)}
                                >
                                    Удалить
                                </button>
                            </div>

                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="info-box">
                                            <span className="info-box-icon bg-info">
                                                <i className="far fa-calendar" />
                                            </span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">План выполнения</span>
                                                <span className="info-box-number">
                                                    {formatDate(current.scheduledDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="info-box">
                                            <span className="info-box-icon bg-success">
                                                <i className="far fa-calendar" />
                                            </span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Дата выполнения</span>
                                                <span className="info-box-number">
                                                    {current.completeDate
                                                        ? formatDate(current.completeDate)
                                                        : '(Заказ не выполнен)'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="info-box">
                                            <span className="info-box-icon bg-warning">
                                                <i className="far fa-calendar" />
                                            </span>
                                            <div className="info-box-content">
                                                <span className="info-box-text">Дедлайн</span>
                                                <span className="info-box-number">
                                                    {formatDate(current.deadlineDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card card-primary">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            Подробности заказа № <strong>{current.number}</strong>
                                        </h3>
                                    </div>
                                    <div className="card-body">
                                        <strong>
                                            <i className="fas fa-list mr-1" /> Описание
                                        </strong>
                                        <p className="text-muted">{current.description}</p>
                                        <hr />

                                        <strong>
                                            <i className="fas fa-user mr-1" /> Заказ создал
                                        </strong>
                                        <p className="text-muted">{fullName(current.owner)}</p>
                                        <hr />

                                        <strong>
                                            <i className="fas fa-dollar-sign mr-1" /> Сумма заказа
                                        </strong>
                                        <p className="text-muted">{current.amount}</p>
                                        <hr />

                                        <strong>
                                            <i className="fas fa-clock mr-1" /> Добавлен на платформу
                                        </strong>
                                        <p className="text-muted">{formatDateTime(current.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <ConfirmDialog
                show={confirmVisible}
                title="Удаление заказа"
                text={`Вы действительно хотите удалить заказ № ${current?.number ?? ''}?`}
                loading={saving}
                onConfirm={() => void handleDelete()}
                onCancel={() => setConfirmVisible(false)}
            />
        </div>
    );
}
