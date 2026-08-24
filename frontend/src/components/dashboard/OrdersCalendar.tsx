import { useMemo, useState } from 'react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    color: string;
}

interface OrdersCalendarProps {
    events: CalendarEvent[];
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function OrdersCalendar({ events }: OrdersCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    function eventsForDay(day: Date): CalendarEvent[] {
        return events.filter((event) => isSameDay(event.date, day));
    }

    return (
        <div className="orders-calendar">
            <div className="orders-calendar__toolbar">
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-default btn-sm"
                        onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                    >
                        <i className="fas fa-chevron-left" />
                    </button>
                    <button
                        type="button"
                        className="btn btn-default btn-sm"
                        onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                    >
                        <i className="fas fa-chevron-right" />
                    </button>
                    <button
                        type="button"
                        className="btn btn-default btn-sm"
                        onClick={() => setCurrentMonth(startOfMonth(new Date()))}
                    >
                        Сегодня
                    </button>
                </div>
                <h4 className="orders-calendar__title mb-0">
                    {format(currentMonth, 'LLLL yyyy', { locale: ru })}
                </h4>
                <div style={{ width: '150px' }} />
            </div>

            <div className="orders-calendar__grid orders-calendar__grid--head">
                {WEEK_DAYS.map((day) => (
                    <div key={day} className="orders-calendar__weekday">
                        {day}
                    </div>
                ))}
            </div>

            <div className="orders-calendar__grid">
                {days.map((day) => {
                    const dayEvents = eventsForDay(day);
                    const classes = [
                        'orders-calendar__day',
                        isSameMonth(day, currentMonth) ? '' : 'orders-calendar__day--muted',
                        isToday(day) ? 'orders-calendar__day--today' : '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <div key={day.toISOString()} className={classes}>
                            <div className="orders-calendar__day-number">{format(day, 'd')}</div>
                            <div className="orders-calendar__events">
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="orders-calendar__event"
                                        style={{ backgroundColor: event.color, borderColor: event.color }}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
