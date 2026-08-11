import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, User, Phone, Mail, Calendar, FileText, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const Customers = () => {
  const { customers, appointments, services, staff, addCustomer } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    notes: ''
  });

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.phone.includes(term) || 
      c.email.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  const customerStats = useMemo(() => {
    if (!selectedCustomer) return null;
    
    const customerApts = appointments.filter(a => a.customerId === selectedCustomer.id);
    const completedApts = customerApts.filter(a => a.status === 'Completed');
    const cancelledApts = customerApts.filter(a => a.status === 'Cancelled');
    
    const totalSpent = completedApts.reduce((sum, a) => sum + a.price, 0);
    const lastVisit = completedApts.length > 0 
      ? completedApts.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date 
      : null;

    return {
      totalAppointments: customerApts.length,
      completed: completedApts.length,
      cancelled: cancelledApts.length,
      totalSpent,
      lastVisit,
      history: customerApts.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
  }, [selectedCustomer, appointments]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Name and Phone are required');
      return;
    }
    
    const newCustomer = {
      id: `cus_${Date.now()}`,
      ...formData
    };
    
    addCustomer(newCustomer);
    toast.success('Customer added successfully');
    setIsAddMode(false);
    setFormData({ name: '', phone: '', email: '', dob: '', notes: '' });
  };

  if (selectedCustomer && customerStats) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedCustomer(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Customers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
                {selectedCustomer.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-6">{selectedCustomer.name}</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Phone size={18} className="text-slate-400" />
                  {selectedCustomer.phone}
                </div>
                {selectedCustomer.email && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Mail size={18} className="text-slate-400" />
                    {selectedCustomer.email}
                  </div>
                )}
                {selectedCustomer.dob && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Calendar size={18} className="text-slate-400" />
                    DOB: {formatDate(selectedCustomer.dob)}
                  </div>
                )}
                {selectedCustomer.notes && (
                  <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <FileText size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="whitespace-pre-wrap">{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Spent</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(customerStats.totalSpent)}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Visits</p>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{customerStats.totalAppointments}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Completed</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{customerStats.completed}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Cancelled</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{customerStats.cancelled}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Appointment History</h3>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Service</th>
                      <th className="px-5 py-3 font-medium">Staff</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {customerStats.history.length > 0 ? (
                      customerStats.history.map((apt) => {
                        const service = services.find(s => s.id === apt.serviceId);
                        const staffMember = staff.find(s => s.id === apt.staffId);
                        
                        return (
                          <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-5 py-4">{formatDate(apt.date)}</td>
                            <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{service?.name}</td>
                            <td className="px-5 py-4 text-slate-500">{staffMember?.name}</td>
                            <td className="px-5 py-4 font-medium">{formatCurrency(apt.price)}</td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                apt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                                apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-slate-500">No appointment history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAddMode) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsAddMode(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Customer</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Create a new customer profile.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
              <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
              <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Any preferences, allergies, or special notes..."></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddMode(false)} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors">Add Customer</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Keep customer information organized.</p>
        </div>
        <button 
          onClick={() => setIsAddMode(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Search customers by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Appointments</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const customerApts = appointments.filter(a => a.customerId === customer.id);
                  return (
                    <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => setSelectedCustomer(customer)}>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold shrink-0 shadow-sm">
                          {customer.name.charAt(0)}
                        </div>
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{customer.phone}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {customerApts.length} bookings
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-rose-600 hover:text-rose-700 font-bold text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 px-4 py-2 rounded-xl transition-all active:scale-95 opacity-0 group-hover:opacity-100">
                          Profile
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <User size={32} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">No customers found</p>
                      <p className="text-sm mt-1">Try a different search term or add a new customer.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col p-4 gap-4 bg-slate-50 dark:bg-slate-950/50">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => {
              const customerApts = appointments.filter(a => a.customerId === customer.id);
              return (
                <div key={customer.id} onClick={() => setSelectedCustomer(customer)} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-lg shrink-0 shadow-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{customer.name}</h4>
                      <p className="text-sm font-medium text-slate-500 mb-1">{customer.phone}</p>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                        {customerApts.length} bookings
                      </span>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    <ArrowLeft size={20} className="rotate-180" />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <User size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="font-bold text-slate-900 dark:text-white">No customers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
