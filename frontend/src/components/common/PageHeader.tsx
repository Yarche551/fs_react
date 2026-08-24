import { Link } from 'react-router-dom';

export interface Breadcrumb {
    title: string;
    to?: string;
}

interface PageHeaderProps {
    title: string;
    breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ title, breadcrumbs = [] }: PageHeaderProps) {
    return (
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1>{title}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item">
                                <Link to="/">Главная</Link>
                            </li>
                            {breadcrumbs.map((crumb) => (
                                <li
                                    key={crumb.title}
                                    className={`breadcrumb-item${crumb.to ? '' : ' active'}`}
                                >
                                    {crumb.to ? <Link to={crumb.to}>{crumb.title}</Link> : crumb.title}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
