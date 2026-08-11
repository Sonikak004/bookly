import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, KEYS } from '../services/storage';
import toast from 'react-hot-toast';
import { addMinutes, isBefore, isAfter, isEqual } from 'date-fns';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    storage.checkAndInit();
    setAppointments(storage.get(KEYS.APPOINTMENTS) || []);
    setCustomers(storage.get(KEYS.CUSTOMERS) || []);
    setServices(storage.get(KEYS.SERVICES) || []);
    setStaff(storage.get(KEYS.STAFF) || []);
    setSettings(storage.get(KEYS.SETTINGS) || {});
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) storage.set(KEYS.APPOINTMENTS, appointments); }, [appointments, isLoaded]);
  useEffect(() => { if (isLoaded) storage.set(KEYS.CUSTOMERS, customers); }, [customers, isLoaded]);
  useEffect(() => { if (isLoaded) storage.set(KEYS.SERVICES, services); }, [services, isLoaded]);
  useEffect(() => { if (isLoaded) storage.set(KEYS.STAFF, staff); }, [staff, isLoaded]);
  useEffect(() => { 
    if (isLoaded) {
      storage.set(KEYS.SETTINGS, settings); 
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings, isLoaded]);

  const resetDemoData = () => {
    storage.initializeDemoData();
    setAppointments(storage.get(KEYS.APPOINTMENTS) || []);
    setCustomers(storage.get(KEYS.CUSTOMERS) || []);
    setServices(storage.get(KEYS.SERVICES) || []);
    setStaff(storage.get(KEYS.STAFF) || []);
    setSettings(storage.get(KEYS.SETTINGS) || {});
    toast.success('Demo data restored successfully.');
  };

  const checkAvailability = (staffId, dateStr, duration) => {
    const requestedStart = new Date(dateStr);
    const requestedEnd = addMinutes(requestedStart, duration);
    
    // Check staff working hours first
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      const dayOfWeek = requestedStart.getDay(); // 0 is Sunday
      // Note: mapping 1-6 to Mon-Sat, 0 to Sunday
      if (!staffMember.workingDays.includes(dayOfWeek)) {
         return { available: false, reason: 'Staff member does not work on this day.' };
      }
      
      const [startHour, startMin] = staffMember.startTime.split(':').map(Number);
      const [endHour, endMin] = staffMember.endTime.split(':').map(Number);
      
      const staffStart = new Date(requestedStart);
      staffStart.setHours(startHour, startMin, 0);
      
      const staffEnd = new Date(requestedStart);
      staffEnd.setHours(endHour, endMin, 0);

      if (isBefore(requestedStart, staffStart) || isAfter(requestedEnd, staffEnd)) {
        return { available: false, reason: 'Outside of staff working hours.' };
      }
    }
    
    // Check overlapping appointments for this staff
    const hasConflict = appointments.some(apt => {
      if (apt.staffId !== staffId) return false;
      if (apt.status === 'Cancelled') return false; // Cancelled appointments don't block
      
      const aptStart = new Date(apt.date);
      const aptEnd = addMinutes(aptStart, apt.duration);
      
      return (
        (isAfter(requestedStart, aptStart) || isEqual(requestedStart, aptStart)) && isBefore(requestedStart, aptEnd) ||
        isAfter(requestedEnd, aptStart) && (isBefore(requestedEnd, aptEnd) || isEqual(requestedEnd, aptEnd)) ||
        (isBefore(requestedStart, aptStart) || isEqual(requestedStart, aptStart)) && (isAfter(requestedEnd, aptEnd) || isEqual(requestedEnd, aptEnd))
      );
    });

    if (hasConflict) {
      return { available: false, reason: 'This staff member is already booked at this time.' };
    }

    return { available: true };
  };

  const addAppointment = (appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };
  const updateAppointment = (id, data) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const deleteAppointment = (id) => setAppointments(prev => prev.filter(a => a.id !== id));

  const addCustomer = (customer) => setCustomers(prev => [...prev, customer]);
  const updateCustomer = (id, data) => setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteCustomer = (id) => setCustomers(prev => prev.filter(c => c.id !== id));

  const addService = (service) => setServices(prev => [...prev, service]);
  const updateService = (id, data) => setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteService = (id) => setServices(prev => prev.filter(s => s.id !== id));

  const addStaff = (member) => setStaff(prev => [...prev, member]);
  const updateStaff = (id, data) => setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteStaff = (id) => setStaff(prev => prev.filter(s => s.id !== id));

  return (
    <AppContext.Provider value={{
      appointments, customers, services, staff, settings,
      setSettings, resetDemoData, checkAvailability,
      addAppointment, updateAppointment, deleteAppointment,
      addCustomer, updateCustomer, deleteCustomer,
      addService, updateService, deleteService,
      addStaff, updateStaff, deleteStaff,
      isLoaded
    }}>
      {isLoaded ? children : null}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
