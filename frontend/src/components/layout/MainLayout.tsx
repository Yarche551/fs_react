import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { useBodyClass } from '@/hooks/useBodyClass';

const MENU_ITEMS = [
    { to: '/', title: 'Дашборд', icon: 'fas fa-tachometer-alt', end: true },
    { to: '/orders', title: 'Заказы', icon: 'fas fa-list-ol', end: false },
    { to: '/freelancers', title: 'Фрилансеры', icon: 'fas fa-users', end: false },
];

export function MainLayout() {
    useBodyClass(['sidebar-mini', 'layout-fixed']);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    function toggleSidebar() {
        document.body.classList.toggle('sidebar-collapse');
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            void document.exitFullscreen();
        } else {
            void document.documentElement.requestFullscreen();
        }
    }

    async function handleLogout() {
        await dispatch(logout());
        navigate('/login', { replace: true });
    }

    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button type="button" className="nav-link btn btn-link" onClick={toggleSidebar}>
                            <i className="fas fa-bars" />
                        </button>
                    </li>
                </ul>

                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <button type="button" className="nav-link btn btn-link" onClick={toggleFullscreen}>
                            <i className="fas fa-expand-arrows-alt" />
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className="nav-link btn btn-link"
                            title="Выйти"
                            onClick={() => void handleLogout()}
                        >
                            <i className="fas fa-sign-out-alt" />
                        </button>
                    </li>
                </ul>
            </nav>

            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <Link to="/" className="brand-link">
                    <img
                        src="/logo.png"
                        alt="Freelance Studio Logo"
                        className="brand-image img-circle elevation-3"
                        style={{ opacity: 0.8 }}
                    />
                    <span className="brand-text font-weight-light">Freelance Studio</span>
                </Link>

                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <i className="fa fa-user-circle" />
                        </div>
                        <div className="info">
                            <span className="d-block text-white" id="profile-name">
                                {user?.name ?? ''}
                            </span>
                        </div>
                    </div>

                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
                            {MENU_ITEMS.map((item) => (
                                <li className="nav-item" key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                                    >
                                        <i className={`nav-icon ${item.icon}`} />
                                        <p>{item.title}</p>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>

            <div className="content-wrapper">
                <Outlet />
            </div>

            <footer className="main-footer">
                <strong>Freelance Studio &copy; </strong>
                Все права защищены.
            </footer>
        </div>
    );
}
