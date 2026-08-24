import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createFreelancer } from '@/features/freelancers/freelancersSlice';
import { FreelancerForm } from '@/components/freelancers/FreelancerForm';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { FreelancerFormData } from '@/types';

export function FreelancerCreatePage() {
    usePageTitle('Создание фрилансера');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { saving, error } = useAppSelector((state) => state.freelancers);

    async function handleSubmit(data: FreelancerFormData) {
        const result = await dispatch(createFreelancer(data));
        if (createFreelancer.fulfilled.match(result)) {
            navigate(`/freelancers/${result.payload}`);
        }
    }

    return (
        <div className="freelancer-edit">
            <PageHeader
                title="Создать нового фрилансера"
                breadcrumbs={[{ title: 'Фрилансеры', to: '/freelancers' }, { title: 'Создание' }]}
            />

            <section className="content">
                <div className="container-fluid">
                    <ErrorAlert message={error} />
                    <FreelancerForm
                        title="Создание фрилансера"
                        submitText="Сохранить"
                        saving={saving}
                        cancelTo="/freelancers"
                        onSubmit={(data) => void handleSubmit(data)}
                    />
                </div>
            </section>
        </div>
    );
}
