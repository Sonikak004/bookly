import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, AlertTriangle, Moon, Sun, Store, Clock, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, setSettings, resetDemoData } = useAppContext();
  
  const [businessName, setBusinessName] = useState(settings.businessName || '');
  const [businessType, setBusinessType] = useState(settings.businessType || '');
  const [location, setLocation] = useState(settings.location || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [email, setEmail] = useState(settings.email || '');
  
  const [theme, setTheme] = useState(settings.theme || 'light');
  const [defaultDuration, setDefaultDuration] = useState(settings.defaultDuration || 30);
  
  const [startTime, setStartTime] = useState(settings.businessHours?.start || '10:00');
  const [endTime, setEndTime] = useState(settings.businessHours?.end || '19:00');

  const handleSaveInfo = (e) => {
    e.preventDefault();
    setSettings({
      ...settings,
      businessName,
      businessType,
      location,
      phone,
      email,
      theme,
      defaultDuration: parseInt(defaultDuration),
      businessHours: { start: startTime, end: endTime }
    });
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    if (window.confirm('Reset Bookly Demo?\n\nThis will remove your current changes and restore the original sample data.')) {
      resetDemoData();
      
      // Update local state to match restored demo settings
      setTimeout(() => {
        const newSettings = JSON.parse(localStorage.getItem('bookly_settings'));
        if (newSettings) {
          setBusinessName(newSettings.businessName);
          setBusinessType(newSettings.businessType);
          setLocation(newSettings.location);
          setPhone(newSettings.phone);
          setEmail(newSettings.email);
          setTheme(newSettings.theme);
          setDefaultDuration(newSettings.defaultDuration);
          setStartTime(newSettings.businessHours?.start);
          setEndTime(newSettings.businessHours?.end);
        }
      }, 100);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your business profile and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveInfo} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 dark:border-slate-700 p-5 flex items-center gap-3">
              <Store size={20} className="text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Business Information</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Type</label>
                  <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 dark:border-slate-700 p-5 flex items-center gap-3">
              <Clock size={20} className="text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Business Hours</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center text-sm mb-2 text-slate-600 dark:text-slate-300">
                <span className="font-medium">Monday–Saturday</span>
                <span>Open</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Start</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">End</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
              </div>
              <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <span className="font-medium">Sunday</span>
                <span className="text-red-500 font-medium">Closed</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 dark:border-slate-700 p-5 flex items-center gap-3">
              <SettingsIcon size={20} className="text-rose-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Preferences</h2>
            </div>
            <div className="p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Appt. Duration (mins)</label>
                <select value={defaultDuration} onChange={e => setDefaultDuration(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Appearance</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${theme === 'light' ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-rose-300'}`}>
                    <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} className="sr-only" />
                    <Sun size={20} className={`mb-1.5 ${theme === 'light' ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-medium ${theme === 'light' ? 'text-rose-900 dark:text-rose-300' : 'text-slate-600 dark:text-slate-400'}`}>Light</span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-rose-300'}`}>
                    <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="sr-only" />
                    <Moon size={20} className={`mb-1.5 ${theme === 'dark' ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-rose-900 dark:text-rose-300' : 'text-slate-600 dark:text-slate-400'}`}>Dark</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 overflow-hidden mt-8">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle size={20} />
              Reset Demo Data
            </h2>
            <p className="text-sm text-red-600 dark:text-red-300/80 mt-1 max-w-xl">
              This will permanently delete all your changes, newly added appointments, customers, and staff, restoring Bookly to its initial sample state.
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
