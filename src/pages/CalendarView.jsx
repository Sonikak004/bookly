import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enIN from 'date-fns/locale/en-IN';
import { useNavigate } from 'react-router-dom';

const locales = {
  'en-IN': enIN,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarView = () => {
  const { appointments, customers, services } = useAppContext();
  const navigate = useNavigate();

  const events = useMemo(() => {
    return appointments
      .filter(apt => apt.status !== 'Cancelled')
      .map(apt => {
        const customer = customers.find(c => c.id === apt.customerId);
        const service = services.find(s => s.id === apt.serviceId);
        
        const start = new Date(apt.date);
        const end = new Date(start.getTime() + apt.duration * 60000);
        
        return {
          id: apt.id,
          title: `${customer?.name || 'Unknown'} - ${service?.name || 'Unknown'}`,
          start,
          end,
          resource: apt
        };
      });
  }, [appointments, customers, services]);

  const handleSelectEvent = (event) => {
    // Instead of duplicating the huge modal here, just navigate to appointments
    // Alternatively, I could put the modal in AppContext, but navigating works for now.
    // To make it simple, we can navigate to appointments page which could handle it.
    // For now, let's just show a toast or navigate.
    navigate('/appointments');
  };

  const handleSelectSlot = (slotInfo) => {
    navigate('/appointments');
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your schedule and view upcoming appointments.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1 min-h-[600px] flex flex-col">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          step={15}
          timeslots={2}
          min={new Date(2000, 0, 1, 8, 0, 0)}
          max={new Date(2000, 0, 1, 21, 0, 0)}
          className="flex-1 text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
};

export default CalendarView;
