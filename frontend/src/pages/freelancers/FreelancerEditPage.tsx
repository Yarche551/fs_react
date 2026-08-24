import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchFreelancer, updateFreelancer } from '@/features/freelancers/freelancersSlice';
import { FreelancerForm } from '@/components/freelancers/FreelancerForm';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Loader } from '@/components/common/Loader';
import { usePageTitle } from '@/hooks/usePageTitle';
import { fullName } from '@/utils/format';
import type { Freelancer, FreelancerFormData } from '@/types';

/** Отправляем на backend только реально изменённые поля. */
function getChangedFields(original: Freelancer, data: FreelancerFormData): Partial<FreelancerFormData> {
    const changed: Partial<FreelancerFormData> = {};
    const fields: (keyof Omit<FreelancerFormData, 'avatarBase64'>)[] = [
        'name',
        'lastName',
        'email',
        'education',
        'location',
        'skills',
        'info',
        'level',
    ];

    fields.forEach((field) => {
        if (data[field] !== original[field]) {
            Object.assign(changed, { [field]: data[field] });
        }
    });

    if (data.avatarBase64) {
        changed.avatarBase64 = data.avatarBase64;
    }

    return changed;
}

export function FreelancerEditPage() {
    usePageTitle('Редактирование фрилансера');

    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { current, itemLoading, saving, error } = useAppSelector((state) => state.freelancers);

    useEffect(() => {
        if (id) {
            void dispatch(fetchFreelancer(id));
        }
    }, [dispatch, id]);

    async function handleSubmit(data: FreelancerFormData) {
        if (!current) {
            return;
        }

        const changed = getChangedFields(current, data);
        if (Object.keys(changed).length === 0) {
            navigate(`/freelancers/${current.id}`);
            return;
        }

        const result = await dispatch(updateFreelancer({ id: current.id, data: changed }));
        if (updateFreelancer.fulfilled.match(result)) {
            navigate(`/freelancers/${current.id}`);
        }
    }

    return (
        <div className="freelancer-edit">
            <PageHeader
                title="Редактирование фрилансера"
                breadcrumbs={[
                    { title: 'Фрилансеры', to: '/freelancers' },
                    ...(current ? [{ title: fullName(current), to: `/freelancers/${current.id}` }] : []),
                    { title: 'Редактирование' },
                ]}
            />

            <section className="content">
                <div className="container-fluid">
                    <ErrorAlert message={error} />

                    {itemLoading && <Loader />}

                    {!itemLoading && current && (
                        <FreelancerForm
                            key={current.id}
                            title="Редактирование фрилансера"
                            submitText="Сохранить"
                            saving={saving}
                            freelancer={current}
                            cancelTo={`/freelancers/${current.id}`}
                            onSubmit={(data) => void handleSubmit(data)}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}
