import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { LevelBadge } from '@/components/common/LevelBadge';
import { convertFileToBase64 } from '@/utils/file';
import { avatarUrl } from '@/utils/format';
import { isEmail, isNotEmpty } from '@/utils/validation';
import { freelancerLevels, type Freelancer, type FreelancerFormData, type FreelancerLevel } from '@/types';
import { FREELANCER_LEVELS } from '@/config/config';

interface FreelancerFormProps {
    title: string;
    submitText: string;
    saving: boolean;
    freelancer?: Freelancer | null;
    cancelTo: string;
    onSubmit: (data: FreelancerFormData) => void;
}

interface FormState {
    name: string;
    lastName: string;
    email: string;
    education: string;
    location: string;
    skills: string;
    info: string;
    level: FreelancerLevel;
}

function initialState(freelancer?: Freelancer | null): FormState {
    return {
        name: freelancer?.name ?? '',
        lastName: freelancer?.lastName ?? '',
        email: freelancer?.email ?? '',
        education: freelancer?.education ?? '',
        location: freelancer?.location ?? '',
        skills: freelancer?.skills ?? '',
        info: freelancer?.info ?? '',
        level: freelancer?.level ?? 'junior',
    };
}

export function FreelancerForm({
    title,
    submitText,
    saving,
    freelancer,
    cancelTo,
    onSubmit,
}: FreelancerFormProps) {
    const [form, setForm] = useState<FormState>(() => initialState(freelancer));
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [touched, setTouched] = useState(false);

    function update<K extends keyof FormState>(field: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const validity = {
        name: isNotEmpty(form.name),
        lastName: isNotEmpty(form.lastName),
        email: isEmail(form.email),
        education: isNotEmpty(form.education),
        location: isNotEmpty(form.location),
        skills: isNotEmpty(form.skills),
        info: isNotEmpty(form.info),
    };

    function invalidClass(isValid: boolean): string {
        return touched && !isValid ? ' is-invalid' : '';
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setTouched(true);

        if (!Object.values(validity).every(Boolean)) {
            return;
        }

        const data: FreelancerFormData = { ...form };
        if (avatarFile) {
            data.avatarBase64 = await convertFileToBase64(avatarFile);
        }
        onSubmit(data);
    }

    return (
        <form className="card card-primary" onSubmit={handleSubmit} noValidate>
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
            </div>

            <div className="card-body">
                {freelancer && (
                    <div className="form-group row align-items-center">
                        <div className="col-sm-3 text-center">
                            <img
                                className="profile-user-img img-fluid img-circle"
                                src={avatarUrl(freelancer.avatar)}
                                alt="Аватар фрилансера"
                            />
                        </div>
                        <div className="col-sm-9">
                            <LevelBadge level={freelancer.level} />
                        </div>
                    </div>
                )}

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="nameInput" className="col-form-label">
                            Имя
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            id="nameInput"
                            className={`form-control${invalidClass(validity.name)}`}
                            placeholder="Имя"
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                        />
                        <span className="error invalid-feedback">Заполните поле</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="lastNameInput" className="col-form-label">
                            Фамилия
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            id="lastNameInput"
                            className={`form-control${invalidClass(validity.lastName)}`}
                            placeholder="Фамилия"
                            value={form.lastName}
                            onChange={(e) => update('lastName', e.target.value)}
                        />
                        <span className="error invalid-feedback">Заполните поле</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="emailInput" className="col-form-label">
                            E-mail
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            type="email"
                            id="emailInput"
                            className={`form-control${invalidClass(validity.email)}`}
                            placeholder="E-mail"
                            value={form.email}
                            onChange={(e) => update('email', e.target.value)}
                        />
                        <span className="error invalid-feedback">Введите корректный email</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="educationInput" className="col-form-label">
                            Образование
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            id="educationInput"
                            className={`form-control${invalidClass(validity.education)}`}
                            placeholder="Образование"
                            value={form.education}
                            onChange={(e) => update('education', e.target.value)}
                        />
                        <span className="error invalid-feedback">Заполните поле</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="locationInput" className="col-form-label">
                            Местонахождение
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            id="locationInput"
                            className={`form-control${invalidClass(validity.location)}`}
                            placeholder="Местонахождение"
                            value={form.location}
                            onChange={(e) => update('location', e.target.value)}
                        />
                        <span className="error invalid-feedback">Заполните поле</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="skillsInput" className="col-form-label">
                            Навыки
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            type="text"
                            id="skillsInput"
                            className={`form-control${invalidClass(validity.skills)}`}
                            placeholder="Навыки"
                            value={form.skills}
                            onChange={(e) => update('skills', e.target.value)}
                        />
                        <span className="error invalid-feedback">Заполните поле</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="infoInput" className="col-form-label">
                            Информация
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <textarea
                            id="infoInput"
                            className={`form-control${invalidClass(validity.info)}`}
                            placeholder="Информация"
                            rows={4}
                            value={form.info}
                            onChange={(e) => update('info', e.target.value)}
                        />
                        <span className="error invalid-feedback">Заполните поле</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="levelSelect" className="col-form-label">
                            Уровень
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <select
                            id="levelSelect"
                            className="form-control"
                            value={form.level}
                            onChange={(e) => update('level', e.target.value as FreelancerLevel)}
                        >
                            {freelancerLevels.map((level) => (
                                <option key={level} value={level}>
                                    {FREELANCER_LEVELS[level].label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="avatarInput" className="col-form-label">
                            {freelancer ? 'Новый аватар' : 'Аватар'}
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <div className="custom-file">
                            <input
                                type="file"
                                id="avatarInput"
                                className="custom-file-input"
                                accept="image/*"
                                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                            />
                            <label className="custom-file-label" htmlFor="avatarInput">
                                {avatarFile ? avatarFile.name : 'Выберите файл'}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-group row mb-0">
                    <div className="offset-sm-3 col-sm-9">
                        <button type="submit" className="btn btn-danger" disabled={saving}>
                            {saving ? 'Сохранение...' : submitText}
                        </button>
                        <Link to={cancelTo} className="btn btn-default ml-2">
                            Отмена
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
