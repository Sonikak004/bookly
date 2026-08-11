import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Edit2, Trash2, X, UserCircle, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Staff = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Working days representation: 0=Sun, 1=Mon, etc.
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    status: 'Active',
    workingDays: [1,2,3,4,5,6], 
    startTime: '10:00',
    endTime: '19:00'
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', phone: '', email: '', status: 'Active', workingDays: [1,2,3,4,5,6], startTime: '10:00', endTime: '19:00' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      phone: member.phone,
      email: member.email || '',
      status: member.status,
      workingDays: member.workingDays || [],
      startTime: member.startTime || '10:00',
      endTime: member.endTime || '19:00'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteStaff(id);
      toast.success('Staff member deleted successfully');
    }
  };

  const handleDayToggle = (dayIndex) => {
    setFormData(prev => {
      const isSelected = prev.workingDays.includes(dayIndex);
      return {
        ...prev,
        workingDays: isSelected 
          ? prev.workingDays.filter(d => d !== dayIndex)
          : [...prev.workingDays, dayIndex]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Please fill required fields');
      return;
    }
    
    if (editingId) {
      updateStaff(editingId, formData);
      toast.success('Staff member updated successfully');
    } else {
      addStaff({
        id: `stf_${Date.now()}`,
        ...formData
      });
      toast.success('Staff member added successfully');
    }
    
    setIsModalOpen(false);
  };

  const formatHours = (start, end) => {
    const formatTime = (time24) => {
      if(!time24) return '';
      const [h, m] = time24.split(':');
      let hours = parseInt(h);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${m} ${ampm}`;
    };
    return `${formatTime(start)} – ${formatTime(end)}`;
  };

  const formatDays = (days) => {
    if (!days || days.length === 0) return 'None';
    if (days.length === 7) return 'Everyday';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Check if it's Mon-Sat (1 to 6)
    if (days.length === 6 && !days.includes(0)) return 'Monday – Saturday';
    
    return days.sort().map(d => dayNames[d]).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your team and their availability.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map(member => (
          <div key={member.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <UserCircle size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(member)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 text-sm mb-6 flex-1">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Phone size={16} className="text-slate-400" />
                {member.phone}
              </div>
              {member.email && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Mail size={16} className="text-slate-400" />
                  {member.email}
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Working Hours</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${member.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {member.status}
                </span>
              </div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">{formatDays(member.workingDays)}</p>
              <p className="text-slate-500 text-sm mt-0.5">{formatHours(member.startTime, member.endTime)}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingId ? 'Edit Staff Member' : 'Add Staff Member'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <form id="staff-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role/Title *</label>
                    <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" placeholder="e.g. Senior Stylist" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Availability</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Working Days</label>
                    <div className="flex flex-wrap gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(idx)}
                          className={`w-10 h-10 rounded-full text-xs font-medium transition-colors ${
                            formData.workingDays.includes(idx)
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                      <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                      <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit" form="staff-form" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors">
                {editingId ? 'Save Changes' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
