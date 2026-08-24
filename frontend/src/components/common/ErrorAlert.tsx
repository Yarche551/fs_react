interface ErrorAlertProps {
    message?: string | null;
    onClose?: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
    if (!message) {
        return null;
    }

    return (
        <div className="alert alert-danger alert-dismissible">
            {onClose && (
                <button type="button" className="close" aria-label="Закрыть" onClick={onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            )}
            <h5>
                <i className="icon fas fa-ban" /> Ошибка
            </h5>
            {message}
        </div>
    );
}
