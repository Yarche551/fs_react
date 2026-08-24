import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { deleteFreelancer, fetchFreelancers } from '@/features/freelancers/freelancersSlice';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Loader } from '@/components/common/Loader';
import { LevelBadge } from '@/components/common/LevelBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePageTitle } from '@/hooks/usePageTitle';
import { avatarUrl, fullName } from '@/utils/format';
import type { Freelancer } from '@/types';

export function FreelancersListPage() {
    usePageTitle('Фрилансеры');

    const dispatch = useAppDispatch();
    const { items, listLoading, saving, error } = useAppSelector((state) => state.freelancers);
    const [freelancerToDelete, setFreelancerToDelete] = useState<Freelancer | null>(null);

    useEffect(() => {
        void dispatch(fetchFreelancers());
    }, [dispatch]);

    async function handleDelete() {
        if (!freelancerToDelete) {
            return;
        }
        await dispatch(deleteFreelancer(freelancerToDelete.id));
        setFreelancerToDelete(null);
    }

    const columns = useMemo<DataTableColumn<Freelancer>[]>(
        () => [
            {
                key: 'number',
                title: '#',
                headerStyle: { width: '10px' },
                render: (_row, index) => index + 1,
            },
            {
                key: 'avatar',
                title: 'Фото',
                render: (row) => (
                    <img className="freelancer-avatar" src={avatarUrl(row.avatar)} alt={fullName(row)} />
                ),
            },
            {
                key: 'name',
                title: 'ФИО',
                render: (row) => <Link to={`/freelancers/${row.id}`}>{fullName(row)}</Link>,
                searchValue: (row) => fullName(row),
                sortValue: (row) => fullName(row),
            },
            {
                key: 'email',
                title: 'E-mail',
                render: (row) => row.email,
                searchValue: (row) => row.email,
                sortValue: (row) => row.email,
            },
            {
                key: 'level',
                title: 'Уровень',
                render: (row) => <LevelBadge level={row.level} />,
                searchValue: (row) => row.level,
                sortValue: (row) => row.level,
            },
            {
                key: 'education',
                title: 'Образование',
                render: (row) => row.education,
                searchValue: (row) => row.education,
                sortValue: (row) => row.education,
            },
            {
                key: 'location',
                title: 'Локация',
                render: (row) => row.location,
                searchValue: (row) => row.location,
                sortValue: (row) => row.location,
            },
            {
                key: 'skills',
                title: 'Навыки',
                render: (row) => row.skills,
                searchValue: (row) => row.skills,
            },
            {
                key: 'tools',
                title: '',
                render: (row) => (
                    <div className="freelancer-tools">
                        <Link to={`/freelancers/${row.id}`} className="fas fa-eye" title="Просмотр" />
                        <Link to={`/freelancers/${row.id}/edit`} className="fas fa-edit" title="Редактировать" />
                        <button
                            type="button"
                            className="fas fa-trash btn btn-link p-0 text-danger"
                            title="Удалить"
                            onClick={() => setFreelancerToDelete(row)}
                        />
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <div className="freelancers">
            <PageHeader title="Список фрилансеров" breadcrumbs={[{ title: 'Фрилансеры' }]} />

            <section className="content">
                <div className="container-fluid">
                    <ErrorAlert message={error} />

                    <div className="card">
                        <div className="card-header">
                            <Link to="/freelancers/create" className="btn btn-primary">
                                <i className="fas fa-plus" /> Создать фрилансера
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
                                    emptyText="Фрилансеры не найдены"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <ConfirmDialog
                show={Boolean(freelancerToDelete)}
                title="Удаление фрилансера"
                text={`Вы действительно хотите удалить фрилансера ${fullName(freelancerToDelete)}?`}
                loading={saving}
                onConfirm={() => void handleDelete()}
                onCancel={() => setFreelancerToDelete(null)}
            />
        </div>
    );
}
