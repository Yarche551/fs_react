import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchOrder, updateOrder } from '@/features/orders/ordersSlice';
import { fetchFreelancers } from '@/features/freelancers/freelancersSlice';
import { OrderForm, type OrderSubmitData } from '@/components/orders/OrderForm';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Loader } from '@/components/common/Loader';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { Order, OrderFormData } from '@/types';

/** Отправляем на backend только реально изменённые поля. */
function getChangedFields(original: Order, data: OrderSubmitData): Partial<OrderFormData> {
    const changed: Partial<OrderFormData> = {};

    if (data.amount !== original.amount) {
        changed.amount = data.amount;
    }
    if (data.description !== original.description) {
        changed.description = data.description;
    }
    if (data.status !== original.status) {
        changed.status = data.status;
    }
    if (data.freelancer !== original.freelancer?.id) {
        changed.freelancer = data.freelancer;
    }
    if (new Date(data.scheduledDate).getTime() !== new Date(original.scheduledDate).getTime()) {
        changed.scheduledDate = data.scheduledDate;
    }
    if (new Date(data.deadlineDate).getTime() !== new Date(original.deadlineDate).getTime()) {
        changed.deadlineDate = data.deadlineDate;
    }

    const originalComplete = original.completeDate ? new Date(original.completeDate).getTime() : null;
    const newComplete = data.completeDate ? new Date(data.completeDate).getTime() : null;
    if (originalComplete !== newComplete) {
        changed.completeDate = data.completeDate;
    }

    return changed;
}

export function OrderEditPage() {
    usePageTitle('Редактирование заказа');

    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { current, itemLoading, saving, error } = useAppSelector((state) => state.orders);
    const { items: freelancers, listLoading, error: freelancersError } = useAppSelector(
        (state) => state.freelancers,
    );

    useEffect(() => {
        if (id) {
            void dispatch(fetchOrder(id));
        }
        void dispatch(fetchFreelancers());
    }, [dispatch, id]);

    async function handleSubmit(data: OrderSubmitData) {
        if (!current) {
            return;
        }

        const changed = getChangedFields(current, data);
        if (Object.keys(changed).length === 0) {
            navigate(`/orders/${current.id}`);
            return;
        }

        const result = await dispatch(updateOrder({ id: current.id, data: changed }));
        if (updateOrder.fulfilled.match(result)) {
            navigate(`/orders/${current.id}`);
        }
    }

    const loading = itemLoading || listLoading;

    return (
        <div className="order-edit order-form">
            <PageHeader
                title="Редактирование заказа"
                breadcrumbs={[
                    { title: 'Заказы', to: '/orders' },
                    ...(current ? [{ title: `№ ${current.number}`, to: `/orders/${current.id}` }] : []),
                    { title: 'Редактирование' },
                ]}
            />

            <section className="content">
                <div className="container-fluid">
                    <ErrorAlert message={error ?? freelancersError} />

                    {loading && <Loader />}

                    {!loading && current && (
                        <OrderForm
                            key={current.id}
                            title={`Редактирование заказа № ${current.number}`}
                            submitText="Сохранить"
                            saving={saving}
                            freelancers={freelancers}
                            order={current}
                            cancelTo={`/orders/${current.id}`}
                            onSubmit={(data) => void handleSubmit(data)}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}
