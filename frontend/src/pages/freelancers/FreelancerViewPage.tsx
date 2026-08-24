import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { deleteFreelancer, fetchFreelancer } from '@/features/freelancers/freelancersSlice';
import { PageHeader } from '@/components/common/PageHeader';
import { Loader } from '@/components/common/Loader';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { LevelBadge } from '@/components/common/LevelBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePageTitle } from '@/hooks/usePageTitle';
import { avatarUrl, formatDateTime, fullName } from '@/utils/format';

export function FreelancerViewPage() {
    usePageTitle('Фрилансер');

    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { current, itemLoading, saving, error } = useAppSelector((state) => state.freelancers);
    const [confirmVisible, setConfirmVisible] = useState(false);

    useEffect(() => {
        if (id) {
            void dispatch(fetchFreelancer(id));
        }
    }, [dispatch, id]);

    async function handleDelete() {
        if (!id) {
            return;
        }
        const result = await dispatch(deleteFreelancer(id));
        setConfirmVisible(false);
        if (deleteFreelancer.fulfilled.match(result)) {
            navigate('/freelancers');
        }
    }

    return (
        <div className="freelancer">
            <PageHeader
                title="Профиль фрилансера"
                breadcrumbs={[{ title: 'Фрилансеры', to: '/freelancers' }, { title: 'Профиль фрилансера' }]}
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
                                        <div className="text-center">
                                            <img
                                                className="profile-user-img img-fluid img-circle"
                                                src={avatarUrl(current.avatar)}
                                                alt={fullName(current)}
                                            />
                                        </div>

                                        <h3 className="profile-username text-center">{fullName(current)}</h3>

                                        <p className="text-muted text-center">Фрилансер</p>

                                        <p className="text-muted text-center level">
                                            <LevelBadge level={current.level} />
                                        </p>
                                    </div>
                                </div>
                                <Link to={`/freelancers/${current.id}/edit`} className="btn btn-warning w-100">
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
                                <div className="card card-primary">
                                    <div className="card-header">
                                        <h3 className="card-title">О фрилансере</h3>
                                    </div>
                                    <div className="card-body">
                                        <strong>
                                            <i className="fas fa-envelope mr-1" /> E-mail
                                        </strong>
                                        <p className="text-muted">{current.email}</p>
                                        <hr />

                                        <strong>
                                            <i className="fas fa-book mr-1" /> Образование
                                        </strong>
                                        <p className="text-muted">{current.education}</p>
                                        <hr />

                                        <strong>
                                            <i className="fas fa-map-marker-alt mr-1" /> Местонахождение
                                        </strong>
                                        <p className="text-muted">{current.location}</p>
                                        <hr />

                                        <strong>
                                            <i className="fas fa-pencil-alt mr-1" /> Навыки
                                        </strong>
                                        <p className="text-muted">{current.skills}</p>
                                        <hr />

                                        <strong>
                                            <i className="fas fa-file-alt mr-1" /> Информация
                                        </strong>
                                        <p className="text-muted">{current.info}</p>
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
                title="Удаление фрилансера"
                text={`Вы действительно хотите удалить фрилансера ${fullName(current)}?`}
                loading={saving}
                onConfirm={() => void handleDelete()}
                onCancel={() => setConfirmVisible(false)}
            />
        </div>
    );
}
