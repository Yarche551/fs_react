import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createOrder } from '@/features/orders/ordersSlice';
import { fetchFreelancers } from '@/features/freelancers/freelancersSlice';
import { OrderForm, type OrderSubmitData } from '@/components/orders/OrderForm';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Loader } from '@/components/common/Loader';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { OrderFormData } from '@/types';

export function OrderCreatePage() {
    usePageTitle('Создание заказа');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { saving, error } = useAppSelector((state) => state.orders);
    const { items: freelancers, listLoading, error: freelancersError } = useAppSelector(
        (state) => state.freelancers,
    );

    useEffect(() => {
        void dispatch(fetchFreelancers());
    }, [dispatch]);

    async function handleSubmit(data: OrderSubmitData) {
        const payload: OrderFormData = { ...data };
        if (!data.completeDate) {
            delete payload.completeDate;
        }

        const result = await dispatch(createOrder(payload));
        if (createOrder.fulfilled.match(result)) {
            navigate(`/orders/${result.payload}`);
        }
    }

    return (
        <div className="order-create order-form">
            <PageHeader
                title="Создать новый заказ"
                breadcrumbs={[{ title: 'Заказы', to: '/orders' }, { title: 'Создание' }]}
            />

            <section className="content">
                <div className="container-fluid">
                    <ErrorAlert message={error ?? freelancersError} />

                    {listLoading ? (
                        <Loader />
                    ) : (
                        <OrderForm
                            key={freelancers.length}
                            title="Создание нового заказа"
                            submitText="Сохранить"
                            saving={saving}
                            freelancers={freelancers}
                            cancelTo="/orders"
                            onSubmit={(data) => void handleSubmit(data)}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}
