interface LoaderProps {
    text?: string;
}

export function Loader({ text = 'Загрузка...' }: LoaderProps) {
    return (
        <div className="text-center p-4 text-muted">
            <i className="fas fa-spinner fa-spin fa-2x mb-2" />
            <div>{text}</div>
        </div>
    );
}
