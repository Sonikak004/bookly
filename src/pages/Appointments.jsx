import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, Calendar as CalendarIcon, Clock, Filter, X, Edit2, Trash2, CheckCircle, Ban } from 'lucide-react';
import { formatCurrency, formatTime, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { addMinutes, format, isFuture, isToday } from 'date-fns';

const Appointments = () => {
  const { appointments, customers, services, staff, checkAvailability, addAppointment, updateAppointment, deleteAppointment } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [currentApt, setCurrentApt] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    serviceId: '',
    staffId: '',
    date: '',
    time: '',
    notes: '',
    status: 'Confirmed'
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const customer = customers.find(c => c.id === apt.customerId);
      const service = services.find(s => s.id === apt.serviceId);
      const staffMember = staff.find(s => s.id === apt.staffId);
      
      // Search
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        (customer?.name || '').toLowerCase().includes(term) ||
        (service?.name || '').toLowerCase().includes(term) ||
        (staffMember?.name || '').toLowerCase().includes(term);
      
      // Status
      let matchesStatus = true;
      const aptDate = new Date(apt.date);
      if (statusFilter === 'Today') matchesStatus = isToday(aptDate);
      else if (statusFilter === 'Upcoming') matchesStatus = isFuture(aptDate) && apt.status === 'Confirmed';
      else if (statusFilter !== 'All') matchesStatus = apt.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments, customers, services, staff, searchTerm, statusFilter]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ customerId: '', serviceId: '', staffId: '', date: format(new Date(), 'yyyy-MM-dd'), time: '10:00', notes: '', status: 'Confirmed' });
    setIsModalOpen(true);
  };

  const handleOpenView = (apt) => {
    setCurrentApt(apt);
    setModalMode('view');
    const d = new Date(apt.date);
    setFormData({
      customerId: apt.customerId,
      serviceId: apt.serviceId,
      staffId: apt.staffId,
      date: format(d, 'yyyy-MM-dd'),
      time: format(d, 'HH:mm'),
      notes: apt.notes || '',
      status: apt.status
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => setModalMode('edit');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.serviceId || !formData.staffId || !formData.date || !formData.time) {
      toast.error('Please fill all required fields');
      return;
    }

    const service = services.find(s => s.id === formData.serviceId);
    
    // Construct Date
    const [year, month, day] = formData.date.split('-');
    const [hours, minutes] = formData.time.split(':');
    const aptDate = new Date(year, month - 1, day, hours, minutes);

    // Validate Availability
    // Only check if creating or if staff/time changed during edit
    if (modalMode === 'create' || (modalMode === 'edit' && (currentApt.staffId !== formData.staffId || new Date(currentApt.date).getTime() !== aptDate.getTime()))) {
      const availability = checkAvailability(formData.staffId, aptDate.toISOString(), service.duration);
      if (!availability.available) {
        toast.error(availability.reason);
        return;
      }
    }

    if (modalMode === 'create') {
      addAppointment({
        id: `apt_${Date.now()}`,
        customerId: formData.customerId,
        serviceId: formData.serviceId,
        staffId: formData.staffId,
        date: aptDate.toISOString(),
        duration: service.duration,
        price: service.price,
        status: formData.status,
        notes: formData.notes
      });
      toast.success('Appointment booked successfully');
    } else {
      updateAppointment(currentApt.id, {
        customerId: formData.customerId,
        serviceId: formData.serviceId,
        staffId: formData.staffId,
        date: aptDate.toISOString(),
        duration: service.duration,
        price: service.price,
        status: formData.status,
        notes: formData.notes
      });
      toast.success('Appointment updated successfully');
    }
    
    setIsModalOpen(false);
  };

  const handleStatusChange = (newStatus) => {
    updateAppointment(currentApt.id, { status: newStatus });
    toast.success(`Appointment marked as ${newStatus}`);
    setIsModalOpen(false);
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage every booking from one place.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Search customer, service or staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <select
            className="border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Appointments</option>
            <option value="Today">Today</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Staff</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => {
                  const customer = customers.find(c => c.id === apt.customerId);
                  const service = services.find(s => s.id === apt.serviceId);
                  const staffMember = staff.find(s => s.id === apt.staffId);
                  
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => handleOpenView(apt)}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{formatDate(apt.date)}</div>
                        <div className="text-slate-500 text-xs font-medium">{formatTime(apt.date)}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{customer?.name}</td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{service?.name}</td>
                      <td className="px-6 py-4 font-medium text-slate-500">{staffMember?.name}</td>
                      <td className="px-6 py-4 font-bold text-rose-600 dark:text-rose-400">{formatCurrency(apt.price)}</td>
                      <td className="px-6 py-4">{getStatusBadge(apt.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-rose-600 hover:text-rose-700 font-bold text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 px-4 py-2 rounded-xl transition-all active:scale-95 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleOpenView(apt); }}>
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <CalendarIcon size={32} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">No appointments found</p>
                      <p className="text-sm mt-1">Try changing your filters or create a new appointment.</p>
                      <button onClick={handleOpenCreate} className="mt-6 bg-rose-50 text-rose-700 px-5 py-2.5 rounded-full font-bold hover:bg-rose-100 transition-colors active:scale-95">
                        + New Appointment
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col p-4 gap-4 bg-slate-50 dark:bg-slate-950/50">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => {
              const customer = customers.find(c => c.id === apt.customerId);
              const service = services.find(s => s.id === apt.serviceId);
              const staffMember = staff.find(s => s.id === apt.staffId);

              return (
                <div key={apt.id} onClick={() => handleOpenView(apt)} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{customer?.name}</h4>
                      <p className="text-sm font-medium text-slate-500">{service?.name}</p>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 font-medium">
                      <CalendarIcon size={16} className="text-rose-500" />
                      {formatDate(apt.date)}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={16} className="text-rose-500" />
                      {formatTime(apt.date)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">
                        {staffMember?.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{staffMember?.name}</span>
                    </div>
                    <span className="font-black text-rose-600 dark:text-rose-400">{formatCurrency(apt.price)}</span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <CalendarIcon size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="font-bold text-slate-900 dark:text-white">No appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {modalMode === 'create' ? 'Book Appointment' : modalMode === 'edit' ? 'Edit Appointment' : 'Appointment Details'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              {modalMode === 'view' && currentApt ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                      {getStatusBadge(currentApt.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(currentApt.price)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer</span>
                      <span className="font-medium text-slate-900 dark:text-white">{customers.find(c => c.id === currentApt.customerId)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service</span>
                      <span className="font-medium text-slate-900 dark:text-white">{services.find(s => s.id === currentApt.serviceId)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Staff</span>
                      <span className="font-medium text-slate-900 dark:text-white">{staff.find(s => s.id === currentApt.staffId)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Time</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formatDate(currentApt.date)} at {formatTime(currentApt.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-medium text-slate-900 dark:text-white">{currentApt.duration} mins</span>
                    </div>
                    {currentApt.notes && (
                      <div className="pt-2">
                        <span className="text-slate-500 block mb-1">Notes</span>
                        <p className="text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-100 dark:border-slate-700">{currentApt.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form id="apt-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer *</label>
                    <select required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                      <option value="">Select Customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service *</label>
                    <select required value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                      <option value="">Select Service</option>
                      {services.filter(s => s.status === 'Active').map(s => <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.price)} - {s.duration}m)</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Staff *</label>
                    <select required value={formData.staffId} onChange={e => setFormData({...formData, staffId: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                      <option value="">Select Staff</option>
                      {staff.filter(s => s.status === 'Active').map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                      <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time *</label>
                      <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                    <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Optional notes..."></textarea>
                  </div>
                  
                  {modalMode === 'edit' && (
                     <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                       <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                         <option value="Confirmed">Confirmed</option>
                         <option value="Completed">Completed</option>
                         <option value="Cancelled">Cancelled</option>
                         <option value="No-show">No-show</option>
                       </select>
                     </div>
                  )}

                  {formData.serviceId && (
                    <div className="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-lg flex justify-between items-center mt-2">
                      <span className="font-medium text-rose-800 dark:text-rose-300">
                        {services.find(s => s.id === formData.serviceId)?.duration} mins
                      </span>
                      <span className="text-xl font-bold text-rose-700 dark:text-rose-400">
                        {formatCurrency(services.find(s => s.id === formData.serviceId)?.price)}
                      </span>
                    </div>
                  )}
                </form>
              )}
            </div>
            
            <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-between shrink-0">
              {modalMode === 'view' ? (
                <>
                  <div className="flex gap-2">
                    {currentApt.status === 'Confirmed' && (
                      <>
                        <button onClick={() => handleStatusChange('Completed')} className="px-3 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg font-medium transition-colors flex items-center gap-1.5" title="Mark Completed">
                          <CheckCircle size={18} /> <span className="hidden sm:inline">Complete</span>
                        </button>
                        <button onClick={() => handleStatusChange('Cancelled')} className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors flex items-center gap-1.5" title="Cancel">
                          <Ban size={18} /> <span className="hidden sm:inline">Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleOpenEdit} className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Edit2 size={18} /> Edit / Reschedule
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Cancel</button>
                  <button type="submit" form="apt-form" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors">
                    {modalMode === 'create' ? 'Book Appointment' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
