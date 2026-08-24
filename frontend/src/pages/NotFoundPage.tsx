import { Link } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

export function NotFoundPage() {
    usePageTitle('Страница не найдена');

    return (
        <div className="error-page mt-5">
            <h2 className="headline text-warning">404</h2>

            <div className="error-content">
                <h3>
                    <i className="fas fa-exclamation-triangle text-warning" /> Ой! Страница не найдена.
                </h3>

                <p>
                    Мы не нашли страницу, которую вы искали. Попробуйте вернуться в <Link to="/">Дашборд</Link>
                </p>
            </div>
        </div>
    );
}
