import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
                    ) : freelancers.length === 0 ? (
                        <div className="callout callout-warning">
                            <h5>Нет ни одного фрилансера</h5>
                            <p className="mb-2">
                                Заказ создаётся на конкретного исполнителя, поэтому сначала нужно
                                добавить фрилансера.
                            </p>
                            <Link to="/freelancers/create" className="btn btn-primary">
                                <i className="fas fa-plus" /> Создать фрилансера
                            </Link>
                        </div>
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
