interface ConfirmDialogProps {
    show: boolean;
    title: string;
    text: string;
    confirmText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    show,
    title,
    text,
    confirmText = 'Удалить',
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="close" aria-label="Закрыть" onClick={onCancel}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="mb-0">{text}</p>
                    </div>
                    <div className="modal-footer justify-content-between">
                        <button type="button" className="btn btn-default" onClick={onCancel} disabled={loading}>
                            Отмена
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                            {loading ? 'Удаление...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
