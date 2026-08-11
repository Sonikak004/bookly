import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CalendarCheck, CalendarClock, CheckCircle, IndianRupee, ArrowRight, User } from 'lucide-react';
import { formatCurrency, formatTime, formatDate } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { isToday, isFuture, startOfWeek, addDays, format, isSameDay } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { appointments, customers, services, staff } = useAppContext();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    let todaysCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;
    let todaysRevenue = 0;

    appointments.forEach(apt => {
      const date = new Date(apt.date);
      if (isToday(date) && apt.status !== 'Cancelled') {
        todaysCount++;
      }
      if (isFuture(date) && apt.status === 'Confirmed') {
        upcomingCount++;
      }
      if (apt.status === 'Completed') {
        completedCount++;
        if (isToday(date)) {
          todaysRevenue += apt.price;
        }
      }
    });

    return { todaysCount, upcomingCount, completedCount, todaysRevenue };
  }, [appointments]);

  const weekData = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    const data = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(start, i);
      const dayAppts = appointments.filter(a => isSameDay(new Date(a.date), currentDate) && a.status !== 'Cancelled');
      
      const revenue = dayAppts.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.price, 0);
      
      data.push({
        name: format(currentDate, 'EEE'),
        fullDate: format(currentDate, 'MMM d, yyyy'),
        appointments: dayAppts.length,
        revenue
      });
    }
    return data;
  }, [appointments]);

  const todaysSchedule = useMemo(() => {
    return appointments
      .filter(a => isToday(new Date(a.date)))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(a => isFuture(new Date(a.date)) && a.status === 'Confirmed')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [appointments]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">Confirmed</span>;
      case 'Completed': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Completed</span>;
      case 'Cancelled': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">Cancelled</span>;
      case 'No-show': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">No-show</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good morning 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your business today, {format(new Date(), 'EEEE, MMMM d')}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Today's Appointments" 
          value={stats.todaysCount} 
          icon={CalendarCheck} 
          colorClass="bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
        />
        <StatCard 
          title="Upcoming" 
          value={stats.upcomingCount} 
          icon={CalendarClock} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <StatCard 
          title="Completed" 
          value={stats.completedCount} 
          icon={CheckCircle} 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        />
        <StatCard 
          title="Today's Revenue" 
          value={formatCurrency(stats.todaysRevenue)} 
          icon={IndianRupee} 
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Today's Schedule</h3>
          </div>
          <div className="p-5 overflow-y-auto max-h-[400px]">
            {todaysSchedule.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700">
                {todaysSchedule.map((apt) => {
                  const customer = customers.find(c => c.id === apt.customerId);
                  const service = services.find(s => s.id === apt.serviceId);
                  
                  return (
                    <div key={apt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <User size={14} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 transition-colors" onClick={() => navigate('/appointments')}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">{formatTime(apt.date)}</span>
                          {getStatusBadge(apt.status)}
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{customer?.name}</p>
                        <div className="flex justify-between items-center mt-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>{service?.name}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(apt.price)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <CalendarCheck size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p>No appointments scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
          {/* Appointments Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Appointments This Week</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{payload[0].payload.fullDate}</p>
                            <p className="font-bold text-violet-600 dark:text-violet-400">{payload[0].value} appointments</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="appointments" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue This Week</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{payload[0].payload.fullDate}</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(payload[0].value)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Appointments</h3>
          <Link to="/calendar" className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 flex items-center gap-1">
            View Calendar <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Staff</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt) => {
                  const customer = customers.find(c => c.id === apt.customerId);
                  const service = services.find(s => s.id === apt.serviceId);
                  const staffMember = staff.find(s => s.id === apt.staffId);
                  
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => navigate('/appointments')}>
                      <td className="px-5 py-3 text-slate-500">{formatDate(apt.date)}</td>
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{formatTime(apt.date)}</td>
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{customer?.name}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{service?.name}</td>
                      <td className="px-5 py-3 text-slate-500">{staffMember?.name}</td>
                      <td className="px-5 py-3 font-medium">{formatCurrency(apt.price)}</td>
                      <td className="px-5 py-3">{getStatusBadge(apt.status)}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500">No upcoming appointments scheduled.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
