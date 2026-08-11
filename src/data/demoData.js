import { addDays, subDays, setHours, setMinutes, startOfDay } from 'date-fns';

const today = startOfDay(new Date());

export const demoSettings = {
  businessName: 'Glow Studio',
  businessType: 'Beauty & Wellness',
  location: 'Bangalore',
  phone: '+91 9876543210',
  email: 'hello@glowstudio.in',
  defaultDuration: 30,
  theme: 'light',
  businessHours: {
    start: '10:00',
    end: '19:00' // 7:00 PM
  }
};

export const demoServices = [
  { id: 'srv_1', name: 'Haircut', category: 'Hair', duration: 45, price: 500, status: 'Active' },
  { id: 'srv_2', name: 'Hair Styling', category: 'Hair', duration: 60, price: 800, status: 'Active' },
  { id: 'srv_3', name: 'Facial', category: 'Skin', duration: 60, price: 1200, status: 'Active' },
  { id: 'srv_4', name: 'Consultation', category: 'General', duration: 30, price: 800, status: 'Active' },
  { id: 'srv_5', name: 'Follow-up', category: 'General', duration: 20, price: 600, status: 'Active' },
  { id: 'srv_6', name: 'Massage', category: 'Body', duration: 60, price: 1500, status: 'Active' },
  { id: 'srv_7', name: 'Skin Consultation', category: 'Skin', duration: 45, price: 1000, status: 'Active' }
];

export const demoStaff = [
  { id: 'stf_1', name: 'Aisha Khan', role: 'Senior Stylist', phone: '+91 9876500001', email: 'aisha@glowstudio.in', status: 'Active', workingDays: [1,2,3,4,5,6], startTime: '10:00', endTime: '19:00' },
  { id: 'stf_2', name: 'Rahul Mehta', role: 'Consultant', phone: '+91 9876500002', email: 'rahul@glowstudio.in', status: 'Active', workingDays: [1,2,3,4,5,6], startTime: '10:00', endTime: '19:00' },
  { id: 'stf_3', name: 'Priya Nair', role: 'Therapist', phone: '+91 9876500003', email: 'priya@glowstudio.in', status: 'Active', workingDays: [1,2,3,4,5,6], startTime: '10:00', endTime: '19:00' },
  { id: 'stf_4', name: 'Neha Sharma', role: 'Stylist', phone: '+91 9876500004', email: 'neha@glowstudio.in', status: 'Active', workingDays: [1,2,3,4,5,6], startTime: '10:00', endTime: '19:00' }
];

const names = [
  'Aditi Verma', 'Arjun Singh', 'Riya Kapoor', 'Kabir Das', 'Ananya Rao',
  'Vikram Singh', 'Pooja Joshi', 'Rohan Patel', 'Nisha Gupta', 'Karan Malhotra',
  'Meera Reddy', 'Siddharth Bose', 'Sneha Iyer', 'Rajesh Khanna', 'Shruti Desai',
  'Vivek Kumar', 'Kavya Menon', 'Aman Tiwari', 'Rishabh Jain', 'Tanya Agarwal',
  'Sanjay Mishra', 'Priya Sharma', 'Amitabh Roy', 'Ishaan Sengupta', 'Simran Kaur'
];

export const demoCustomers = names.map((name, index) => ({
  id: `cus_${index + 1}`,
  name,
  phone: `+91 9${Math.floor(Math.random() * 899999999 + 100000000)}`,
  email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
  dob: subDays(new Date(), Math.floor(Math.random() * 10000 + 7000)).toISOString(),
  notes: index % 5 === 0 ? 'VIP Customer' : ''
}));

const generateAppointments = () => {
  const appointments = [];
  let idCounter = 1;

  // Helper to create an appointment
  const createApt = (daysOffset, hour, minute, customerIdx, serviceIdx, staffIdx, status, notes = '') => {
    const service = demoServices[serviceIdx];
    const customer = demoCustomers[customerIdx];
    const staff = demoStaff[staffIdx];
    
    const date = addDays(today, daysOffset);
    const start = setMinutes(setHours(date, hour), minute);
    
    appointments.push({
      id: `apt_${idCounter++}`,
      customerId: customer.id,
      serviceId: service.id,
      staffId: staff.id,
      date: start.toISOString(),
      duration: service.duration,
      price: service.price,
      status: status,
      notes: notes
    });
  };

  // Past appointments (Completed / Cancelled)
  createApt(-5, 10, 0, 0, 0, 0, 'Completed');
  createApt(-5, 11, 30, 1, 3, 1, 'Completed');
  createApt(-4, 14, 0, 2, 2, 2, 'Completed');
  createApt(-4, 16, 0, 3, 1, 3, 'Completed');
  createApt(-3, 10, 0, 4, 0, 0, 'Completed');
  createApt(-3, 11, 0, 5, 4, 1, 'Cancelled');
  createApt(-3, 13, 0, 6, 5, 2, 'Completed');
  createApt(-2, 10, 30, 7, 0, 3, 'Completed');
  createApt(-2, 12, 0, 8, 3, 1, 'Completed');
  createApt(-2, 15, 0, 9, 2, 2, 'Completed');
  createApt(-1, 10, 0, 10, 0, 0, 'Completed');
  createApt(-1, 11, 30, 11, 4, 1, 'Completed');
  createApt(-1, 14, 0, 12, 5, 2, 'No-show');
  createApt(-1, 16, 0, 13, 1, 3, 'Completed');

  // Today's appointments
  createApt(0, 10, 0, 21, 0, 0, 'Completed'); // Priya Sharma - Haircut
  createApt(0, 10, 45, 14, 1, 3, 'Confirmed'); 
  createApt(0, 11, 30, 15, 3, 1, 'Confirmed'); // Rahul Kumar - Consultation (Consultant)
  createApt(0, 13, 0, 4, 2, 2, 'Confirmed'); // Ananya Rao - Facial (Therapist)
  createApt(0, 14, 30, 16, 5, 2, 'Confirmed'); 
  createApt(0, 15, 30, 5, 4, 1, 'Confirmed'); // Vikram Singh - Follow-up
  createApt(0, 16, 0, 17, 0, 0, 'Confirmed');
  createApt(0, 17, 0, 18, 6, 1, 'Cancelled'); 
  createApt(0, 18, 0, 19, 1, 3, 'Confirmed');

  // Upcoming appointments (Next 7 days)
  createApt(1, 10, 0, 20, 0, 0, 'Confirmed');
  createApt(1, 11, 30, 22, 3, 1, 'Confirmed');
  createApt(1, 14, 0, 23, 2, 2, 'Confirmed');
  createApt(2, 10, 30, 24, 1, 3, 'Confirmed');
  createApt(2, 12, 0, 0, 4, 1, 'Confirmed');
  createApt(2, 15, 0, 1, 5, 2, 'Confirmed');
  createApt(3, 10, 0, 2, 0, 0, 'Confirmed');
  createApt(3, 11, 30, 3, 3, 1, 'Confirmed');
  createApt(4, 14, 0, 4, 2, 2, 'Confirmed');
  createApt(4, 16, 0, 5, 1, 3, 'Confirmed');
  createApt(5, 10, 0, 6, 0, 0, 'Confirmed');
  createApt(5, 11, 0, 7, 4, 1, 'Confirmed');
  createApt(6, 13, 0, 8, 5, 2, 'Confirmed');
  createApt(6, 15, 30, 9, 3, 1, 'Confirmed');

  return appointments;
};

export const demoAppointments = generateAppointments();
