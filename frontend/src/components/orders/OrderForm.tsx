import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { ORDER_STATUSES } from '@/config/config';
import { isNotEmpty } from '@/utils/validation';
import { fullName } from '@/utils/format';
import { orderStatuses, type Freelancer, type Order, type OrderFormData, type OrderStatus } from '@/types';

registerLocale('ru', ru);

export interface OrderSubmitData extends OrderFormData {
    completeDate: string | null;
}

interface OrderFormProps {
    title: string;
    submitText: string;
    saving: boolean;
    freelancers: Freelancer[];
    order?: Order | null;
    cancelTo: string;
    onSubmit: (data: OrderSubmitData) => void;
}

export function OrderForm({
    title,
    submitText,
    saving,
    freelancers,
    order,
    cancelTo,
    onSubmit,
}: OrderFormProps) {
    const [amount, setAmount] = useState<string>(order ? String(order.amount) : '');
    const [description, setDescription] = useState(order?.description ?? '');
    const [status, setStatus] = useState<OrderStatus>(order?.status ?? 'new');
    const [freelancerId, setFreelancerId] = useState<string>(order?.freelancer?.id ?? freelancers[0]?.id ?? '');
    const [scheduledDate, setScheduledDate] = useState<Date | null>(
        order?.scheduledDate ? new Date(order.scheduledDate) : null,
    );
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(
        order?.deadlineDate ? new Date(order.deadlineDate) : null,
    );
    const [completeDate, setCompleteDate] = useState<Date | null>(
        order?.completeDate ? new Date(order.completeDate) : null,
    );
    const [touched, setTouched] = useState(false);

    const validity = {
        amount: isNotEmpty(amount) && Number.isInteger(Number(amount)) && Number(amount) > 0,
        description: isNotEmpty(description),
        freelancer: isNotEmpty(freelancerId),
        scheduledDate: Boolean(scheduledDate),
        deadlineDate: Boolean(deadlineDate),
    };

    function invalidClass(isValid: boolean): string {
        return touched && !isValid ? ' is-invalid' : '';
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setTouched(true);

        if (!Object.values(validity).every(Boolean) || !scheduledDate || !deadlineDate) {
            return;
        }

        onSubmit({
            amount: Number(amount),
            description,
            status,
            freelancer: freelancerId,
            scheduledDate: scheduledDate.toISOString(),
            deadlineDate: deadlineDate.toISOString(),
            completeDate: completeDate ? completeDate.toISOString() : null,
        });
    }

    return (
        <form className="card card-primary" onSubmit={handleSubmit} noValidate>
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
            </div>

            <div className="card-body">
                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="amountInput" className="col-form-label">
                            Сумма
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <input
                            type="number"
                            id="amountInput"
                            className={`form-control${invalidClass(validity.amount)}`}
                            placeholder="Сумма"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="error invalid-feedback">Укажите сумму заказа (целое число)</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="descriptionInput" className="col-form-label">
                            Описание
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <textarea
                            id="descriptionInput"
                            className={`form-control${invalidClass(validity.description)}`}
                            placeholder="Описание"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <span className="error invalid-feedback">Заполните поле</span>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="statusSelect" className="col-form-label">
                            Статус
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <select
                            id="statusSelect"
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as OrderStatus)}
                        >
                            {orderStatuses.map((item) => (
                                <option key={item} value={item}>
                                    {ORDER_STATUSES[item].label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-3">
                        <label htmlFor="freelancerSelect" className="col-form-label">
                            Исполнитель
                        </label>
                    </div>
                    <div className="col-sm-9">
                        <select
                            id="freelancerSelect"
                            className={`form-control${invalidClass(validity.freelancer)}`}
                            value={freelancerId}
                            onChange={(e) => setFreelancerId(e.target.value)}
                        >
                            <option value="">Выберите исполнителя</option>
                            {freelancers.map((freelancer) => (
                                <option key={freelancer.id} value={freelancer.id}>
                                    {fullName(freelancer)}
                                </option>
                            ))}
                        </select>
                        <span className="error invalid-feedback">Выберите исполнителя</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-12 mb-3">
                        <div className="card bg-gradient-info mb-0">
                            <div className="card-header border-0">
                                <h3 className="card-title">
                                    <i className="far fa-calendar-alt" /> Запланированная дата выполнения
                                </h3>
                            </div>
                            <div className="card-body pt-0 d-flex justify-content-center">
                                <DatePicker
                                    selected={scheduledDate}
                                    onChange={(date: Date | null) => setScheduledDate(date)}
                                    locale="ru"
                                    dateFormat="dd.MM.yyyy"
                                    inline
                                />
                            </div>
                        </div>
                        {touched && !validity.scheduledDate && (
                            <span className="error invalid-feedback d-block text-center">Выберите дату</span>
                        )}
                    </div>

                    <div className="col-lg-4 col-md-12 mb-3">
                        <div className="card bg-gradient-success mb-0">
                            <div className="card-header border-0">
                                <h3 className="card-title">
                                    <i className="far fa-calendar-alt" /> Дата исполнения (необязательно)
                                </h3>
                            </div>
                            <div className="card-body pt-0 d-flex flex-column align-items-center">
                                <DatePicker
                                    selected={completeDate}
                                    onChange={(date: Date | null) => setCompleteDate(date)}
                                    locale="ru"
                                    dateFormat="dd.MM.yyyy"
                                    inline
                                />
                                {completeDate && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-default mt-2"
                                        onClick={() => setCompleteDate(null)}
                                    >
                                        Очистить дату
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-12 mb-3">
                        <div className="card bg-gradient-warning mb-0">
                            <div className="card-header border-0">
                                <h3 className="card-title">
                                    <i className="far fa-calendar-alt" /> Дата дедлайна
                                </h3>
                            </div>
                            <div className="card-body pt-0 d-flex justify-content-center">
                                <DatePicker
                                    selected={deadlineDate}
                                    onChange={(date: Date | null) => setDeadlineDate(date)}
                                    locale="ru"
                                    dateFormat="dd.MM.yyyy"
                                    inline
                                />
                            </div>
                        </div>
                        {touched && !validity.deadlineDate && (
                            <span className="error invalid-feedback d-block text-center">Выберите дату</span>
                        )}
                    </div>
                </div>

                <div className="form-group row mb-0">
                    <div className="w-100 text-center">
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
