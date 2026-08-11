import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const Services = () => {
  const { services, addService, updateService, deleteService } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration: 30,
    price: '',
    status: 'Active'
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', duration: 30, price: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      status: service.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
      toast.success('Service deleted successfully');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Please fill required fields');
      return;
    }
    
    const payload = {
      ...formData,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price)
    };

    if (editingId) {
      updateService(editingId, payload);
      toast.success('Service updated successfully');
    } else {
      addService({
        id: `srv_${Date.now()}`,
        ...payload
      });
      toast.success('Service added successfully');
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your service offerings and pricing.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative group hover:border-violet-300 dark:hover:border-violet-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{service.category}</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${service.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                {service.status}
              </span>
            </div>
            
            <div className="flex justify-between items-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Duration</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{service.duration} mins</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Price</p>
                <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{formatCurrency(service.price)}</p>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => handleOpenEdit(service)} className="p-1.5 bg-white dark:bg-slate-700 rounded text-slate-500 hover:text-violet-600 shadow-sm border border-slate-200 dark:border-slate-600">
                <Edit2 size={14} />
              </button>
              <button onClick={() => handleDelete(service.id)} className="p-1.5 bg-white dark:bg-slate-700 rounded text-slate-500 hover:text-red-600 shadow-sm border border-slate-200 dark:border-slate-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingId ? 'Edit Service' : 'Add Service'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (mins) *</label>
                  <input required type="number" min="5" step="5" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹) *</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
                  {editingId ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
