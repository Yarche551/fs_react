import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearAuthError, login } from '@/features/auth/authSlice';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { isEmail, isNotEmpty } from '@/utils/validation';

export function LoginPage() {
    usePageTitle('Авторизация');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    const emailValid = isEmail(email);
    const passwordValid = isNotEmpty(password);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setTouched(true);

        if (!emailValid || !passwordValid) {
            return;
        }

        const result = await dispatch(login({ email, password, rememberMe }));
        if (login.fulfilled.match(result)) {
            navigate('/', { replace: true });
        }
    }

    return (
        <AuthLayout bodyClass="login-page">
            <div className="login-box">
                <div className="login-logo">
                    <span>Freelance Studio</span>
                </div>
                <div className="card">
                    <div className="card-body login-card-body">
                        <p className="login-box-msg">Войдите, чтобы воспользоваться платформой</p>

                        {error && (
                            <div className="error invalid-feedback text-center mb-3 d-block">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="input-group mb-3">
                                <input
                                    type="email"
                                    className={`form-control${touched && !emailValid ? ' is-invalid' : ''}`}
                                    placeholder="Email"
                                    id="email"
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
                                    className={`form-control${touched && !passwordValid ? ' is-invalid' : ''}`}
                                    placeholder="Пароль"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                                <span className="error invalid-feedback">Заполните пароль</span>
                            </div>

                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="icheck-primary">
                                        <input
                                            type="checkbox"
                                            id="remember-me"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="remember-me">Запомнить меня</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                        {loading ? 'Вход...' : 'Войти'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="social-auth-links text-center mb-3">
                    <p>- ИЛИ -</p>
                    <Link to="/sign-up" className="btn btn-block btn-warning">
                        Зарегистрироваться
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
