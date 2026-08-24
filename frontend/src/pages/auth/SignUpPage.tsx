import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearAuthError, signUp } from '@/features/auth/authSlice';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { isEmail, isNotEmpty, isStrongPassword } from '@/utils/validation';

export function SignUpPage() {
    usePageTitle('Регистрация');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [agree, setAgree] = useState(false);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    const validity = {
        name: isNotEmpty(name),
        lastName: isNotEmpty(lastName),
        email: isEmail(email),
        password: isStrongPassword(password),
        passwordRepeat: isNotEmpty(passwordRepeat) && password === passwordRepeat,
        agree,
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setTouched(true);

        if (!Object.values(validity).every(Boolean)) {
            return;
        }

        const result = await dispatch(signUp({ name, lastName, email, password }));
        if (signUp.fulfilled.match(result)) {
            navigate('/', { replace: true });
        }
    }

    function invalidClass(isValid: boolean): string {
        return touched && !isValid ? ' is-invalid' : '';
    }

    return (
        <AuthLayout bodyClass="register-page">
            <div className="register-box">
                <div className="register-logo">
                    <span>Freelance Studio</span>
                </div>
                <div className="card">
                    <div className="card-body register-card-body">
                        <p className="login-box-msg">Зарегистрировать нового пользователя</p>

                        {error && <div className="error invalid-feedback text-center mb-3 d-block">{error}</div>}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className={`form-control${invalidClass(validity.name)}`}
                                    placeholder="Имя"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user" />
                                    </div>
                                </div>
                                <span className="error invalid-feedback">Заполните имя</span>
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className={`form-control${invalidClass(validity.lastName)}`}
                                    placeholder="Фамилия"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user" />
                                    </div>
                                </div>
                                <span className="error invalid-feedback">Заполните фамилию</span>
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="email"
                                    className={`form-control${invalidClass(validity.email)}`}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope" />
                                    </div>
                                </div>
                                <span className="error invalid-feedback">Введите корректный email</span>
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    className={`form-control${invalidClass(validity.password)}`}
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                                <span className="error invalid-feedback">
                                    Минимум 8 символов, заглавная и строчная буквы, цифра
                                </span>
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    className={`form-control${invalidClass(validity.passwordRepeat)}`}
                                    placeholder="Повторите пароль"
                                    value={passwordRepeat}
                                    onChange={(e) => setPasswordRepeat(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                                <span className="error invalid-feedback">Пароли должны совпадать</span>
                            </div>

                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="icheck-primary">
                                        <input
                                            type="checkbox"
                                            id="agree"
                                            className={invalidClass(validity.agree).trim()}
                                            checked={agree}
                                            onChange={(e) => setAgree(e.target.checked)}
                                        />
                                        <label htmlFor="agree">
                                            Я согласен <span className="text-primary">с условиями</span>
                                        </label>
                                        <span className="error invalid-feedback">
                                            Вам необходимо согласиться с условиями
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="social-auth-links text-center mb-3">
                    <p>- ИЛИ -</p>
                    <Link to="/login" className="btn btn-block btn-warning">
                        Войти в систему
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
