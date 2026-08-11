import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CalendarCheck, Ban, CheckCircle, IndianRupee, Download, FileText, UserCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format, isToday, isThisWeek, isThisMonth, isSameMonth, parseISO } from 'date-fns';

const Reports = () => {
  const { appointments, services, staff } = useAppContext();
  const [dateFilter, setDateFilter] = useState('This Month');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const date = parseISO(apt.date);
      if (dateFilter === 'Today') return isToday(date);
      if (dateFilter === 'This Week') return isThisWeek(date, { weekStartsOn: 1 });
      if (dateFilter === 'This Month') return isThisMonth(date);
      return true; // All time
    });
  }, [appointments, dateFilter]);

  const stats = useMemo(() => {
    let completedCount = 0;
    let cancelledCount = 0;
    let noShowCount = 0;
    let totalRevenue = 0;

    filteredAppointments.forEach(apt => {
      if (apt.status === 'Completed') {
        completedCount++;
        totalRevenue += apt.price;
      }
      if (apt.status === 'Cancelled') cancelledCount++;
      if (apt.status === 'No-show') noShowCount++;
    });

    const avgBookingValue = completedCount > 0 ? totalRevenue / completedCount : 0;

    return {
      totalAppointments: filteredAppointments.length,
      completedCount,
      cancelledCount,
      noShowCount,
      totalRevenue,
      avgBookingValue
    };
  }, [filteredAppointments]);

  const servicePerformance = useMemo(() => {
    const performance = {};
    
    filteredAppointments.forEach(apt => {
      if (!performance[apt.serviceId]) {
        performance[apt.serviceId] = { id: apt.serviceId, appointments: 0, completed: 0, revenue: 0 };
      }
      
      performance[apt.serviceId].appointments++;
      if (apt.status === 'Completed') {
        performance[apt.serviceId].completed++;
        performance[apt.serviceId].revenue += apt.price;
      }
    });

    return Object.values(performance)
      .map(p => {
        const service = services.find(s => s.id === p.id);
        return { ...p, name: service?.name || 'Unknown' };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredAppointments, services]);

  const staffPerformance = useMemo(() => {
    const performance = {};
    
    filteredAppointments.forEach(apt => {
      if (!performance[apt.staffId]) {
        performance[apt.staffId] = { id: apt.staffId, appointments: 0, completed: 0, revenue: 0 };
      }
      
      performance[apt.staffId].appointments++;
      if (apt.status === 'Completed') {
        performance[apt.staffId].completed++;
        performance[apt.staffId].revenue += apt.price;
      }
    });

    return Object.values(performance)
      .map(p => {
        const staffMember = staff.find(s => s.id === p.id);
        return { ...p, name: staffMember?.name || 'Unknown' };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredAppointments, staff]);

  // For the chart, we'll group by whatever makes sense. Let's do daily revenue for the filtered period.
  const chartData = useMemo(() => {
    const dataMap = {};
    filteredAppointments.filter(a => a.status === 'Completed').forEach(apt => {
      const dateKey = format(parseISO(apt.date), dateFilter === 'All Time' ? 'MMM yyyy' : 'MMM dd');
      if (!dataMap[dateKey]) dataMap[dateKey] = { name: dateKey, revenue: 0, appointments: 0 };
      dataMap[dateKey].revenue += apt.price;
      dataMap[dateKey].appointments++;
    });
    
    // Sort chronologically
    return Object.values(dataMap);
  }, [filteredAppointments, dateFilter]);

  const exportCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Appointments', stats.totalAppointments],
      ['Completed', stats.completedCount],
      ['Cancelled', stats.cancelledCount],
      ['No-show', stats.noShowCount],
      ['Total Revenue', stats.totalRevenue],
      ['Average Booking Value', stats.avgBookingValue]
    ];
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Bookly_Report_${dateFilter.replace(' ', '_')}.csv`;
    link.click();
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Analyze your business performance and revenue.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="flex-1 sm:flex-none border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
          <button 
            onClick={exportCSV}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Appointments" value={stats.totalAppointments} icon={CalendarCheck} colorClass="bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400" />
        <StatCard title="Completed" value={stats.completedCount} icon={CheckCircle} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" />
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={IndianRupee} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" />
        <StatCard title="Cancelled" value={stats.cancelledCount} icon={Ban} colorClass="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400" />
        <StatCard title="No-show" value={stats.noShowCount} icon={FileText} colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" />
        <StatCard title="Avg. Booking Value" value={formatCurrency(stats.avgBookingValue)} icon={IndianRupee} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" />
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{payload[0].payload.name}</p>
                        <p className="font-bold text-violet-600 dark:text-violet-400 mb-1">{formatCurrency(payload[0].value)}</p>
                        <p className="text-xs text-slate-500">{payload[0].payload.appointments} appointments</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Sparkles size={20} className="text-violet-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Service Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Booked</th>
                  <th className="px-5 py-3 font-medium">Completed</th>
                  <th className="px-5 py-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {servicePerformance.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{service.name}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{service.appointments}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{service.completed}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-right">{formatCurrency(service.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <UserCircle size={20} className="text-violet-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Staff Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Staff</th>
                  <th className="px-5 py-3 font-medium">Booked</th>
                  <th className="px-5 py-3 font-medium">Completed</th>
                  <th className="px-5 py-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {staffPerformance.map((staffMember) => (
                  <tr key={staffMember.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{staffMember.name}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{staffMember.appointments}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{staffMember.completed}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-right">{formatCurrency(staffMember.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
