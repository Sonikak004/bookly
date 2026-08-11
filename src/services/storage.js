import { demoSettings, demoServices, demoStaff, demoCustomers, demoAppointments } from '../data/demoData';

const PREFIX = 'bookly_';

export const KEYS = {
  APPOINTMENTS: `${PREFIX}appointments`,
  CUSTOMERS: `${PREFIX}customers`,
  SERVICES: `${PREFIX}services`,
  STAFF: `${PREFIX}staff`,
  SETTINGS: `${PREFIX}settings`,
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage`, error);
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  initializeDemoData: () => {
    storage.set(KEYS.APPOINTMENTS, demoAppointments);
    storage.set(KEYS.CUSTOMERS, demoCustomers);
    storage.set(KEYS.SERVICES, demoServices);
    storage.set(KEYS.STAFF, demoStaff);
    storage.set(KEYS.SETTINGS, demoSettings);
  },

  checkAndInit: () => {
    const hasData = localStorage.getItem(KEYS.SETTINGS);
    if (!hasData) {
      storage.initializeDemoData();
    }
  }
};
