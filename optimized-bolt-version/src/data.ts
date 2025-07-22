// NIAT Centers Data - Real University Campuses
import { Center, User, ReportItem, DailyReport } from './types';

export const centers: Center[] = [
  { id: 'niat-hyd-main', name: 'NIAT Hyderabad Main Campus', location: 'Hyderabad', region: 'South', cos: 'Dr. Rajesh Kumar', pm: '', contact: '+91-40-1234567', established: '2020', capacity: 500, currentStrength: 450 },
  { id: 'niat-hyd-sec', name: 'NIAT Hyderabad Secundrabad', location: 'Secundrabad', region: 'South', cos: 'Ms. Priya Sharma', pm: '', contact: '+91-40-2345678', established: '2021', capacity: 300, currentStrength: 280 },
  { id: 'niat-bang-main', name: 'NIAT Bangalore Electronic City', location: 'Bangalore', region: 'South', cos: 'Mr. Arun Reddy', pm: '', contact: '+91-80-3456789', established: '2021', capacity: 400, currentStrength: 375 },
  { id: 'niat-bang-wht', name: 'NIAT Bangalore Whitefield', location: 'Whitefield', region: 'South', cos: 'Ms. Kavitha Nair', pm: '', contact: '+91-80-4567890', established: '2022', capacity: 350, currentStrength: 320 },
  { id: 'niat-chen-main', name: 'NIAT Chennai OMR', location: 'Chennai', region: 'South', cos: 'Dr. Suresh Babu', pm: '', contact: '+91-44-5678901', established: '2022', capacity: 380, currentStrength: 360 },
  { id: 'niat-chen-tam', name: 'NIAT Chennai Tambaram', location: 'Tambaram', region: 'South', cos: 'Ms. Deepika Rao', pm: '', contact: '+91-44-6789012', established: '2023', capacity: 250, currentStrength: 230 },
  { id: 'niat-pune-main', name: 'NIAT Pune Hinjewadi', location: 'Pune', region: 'West', cos: 'Mr. Vikram Patil', pm: '', contact: '+91-20-7890123', established: '2021', capacity: 420, currentStrength: 400 },
  { id: 'niat-pune-wak', name: 'NIAT Pune Wakad', location: 'Wakad', region: 'West', cos: 'Ms. Neha Joshi', pm: '', contact: '+91-20-8901234', established: '2022', capacity: 300, currentStrength: 285 },
  { id: 'niat-mum-main', name: 'NIAT Mumbai Powai', location: 'Mumbai', region: 'West', cos: 'Dr. Rohit Shah', pm: '', contact: '+91-22-9012345', established: '2022', capacity: 450, currentStrength: 425 },
  { id: 'niat-mum-and', name: 'NIAT Mumbai Andheri', location: 'Andheri', region: 'West', cos: 'Ms. Shruti Mehta', pm: '', contact: '+91-22-0123456', established: '2023', capacity: 320, currentStrength: 300 },
  { id: 'niat-del-main', name: 'NIAT Delhi Connaught Place', location: 'Delhi', region: 'North', cos: 'Mr. Arjun Singh', pm: '', contact: '+91-11-1234567', established: '2020', capacity: 400, currentStrength: 380 },
  { id: 'niat-del-gur', name: 'NIAT Delhi Gurgaon', location: 'Gurgaon', region: 'North', cos: 'Ms. Pooja Gupta', pm: '', contact: '+91-124-2345678', established: '2021', capacity: 380, currentStrength: 350 },
  { id: 'niat-noi-main', name: 'NIAT Noida Sector 62', location: 'Noida', region: 'North', cos: 'Dr. Amit Verma', pm: '', contact: '+91-120-3456789', established: '2021', capacity: 350, currentStrength: 330 },
  { id: 'niat-jaipur', name: 'NIAT Jaipur Malviya Nagar', location: 'Jaipur', region: 'North', cos: 'Ms. Ritu Agarwal', pm: '', contact: '+91-141-4567890', established: '2022', capacity: 280, currentStrength: 260 },
  { id: 'niat-kol-main', name: 'NIAT Kolkata Salt Lake', location: 'Kolkata', region: 'East', cos: 'Mr. Debasis Roy', pm: '', contact: '+91-33-5678901', established: '2021', capacity: 320, currentStrength: 300 },
  { id: 'niat-kol-new', name: 'NIAT Kolkata New Town', location: 'New Town', region: 'East', cos: 'Ms. Ananya Das', pm: '', contact: '+91-33-6789012', established: '2022', capacity: 280, currentStrength: 265 },
  { id: 'niat-bhu-main', name: 'NIAT Bhubaneswar Patia', location: 'Bhubaneswar', region: 'East', cos: 'Dr. Prasad Mohanty', pm: '', contact: '+91-674-7890123', established: '2022', capacity: 250, currentStrength: 235 },
  { id: 'niat-aha-main', name: 'NIAT Ahmedabad Bopal', location: 'Ahmedabad', region: 'West', cos: 'Mr. Kiran Patel', pm: '', contact: '+91-79-8901234', established: '2023', capacity: 300, currentStrength: 280 }
];

export const users: User[] = [
  { id: 1, username: 'admin', email: 'admin@niat.edu', role: 'admin' },
  { id: 2, username: 'pavan_dharma', email: 'pavan@niat.edu', role: 'head_of_niat' },
  { id: 3, username: 'cos_user', email: 'cos@niat.edu', role: 'cos', centerId: 'niat-hyd-main' },
  { id: 4, username: 'pm_user', email: 'pm@niat.edu', role: 'pm', centerId: 'niat-hyd-main' }
];

export const reportCategories = [
  {
    name: 'Infrastructure & Facilities',
    items: ['Classroom Condition', 'Lab Equipment Status', 'Internet Connectivity', 'Power Supply', 'Air Conditioning', 'Furniture Condition', 'Safety Equipment', 'Parking Facilities']
  },
  {
    name: 'Academic Operations', 
    items: ['Faculty Attendance', 'Class Schedule Adherence', 'Curriculum Progress', 'Student Attendance', 'Assignment Submissions', 'Exam Preparations', 'Library Resources', 'Study Materials']
  },
  {
    name: 'Student Services',
    items: ['Admission Process', 'Fee Collection', 'Student Grievances', 'Counseling Services', 'Placement Activities', 'Internship Coordination', 'Alumni Relations', 'Student Events']
  },
  {
    name: 'Technology & Systems',
    items: ['LMS Platform', 'Video Conferencing', 'Student Portal', 'Faculty Portal', 'IT Support', 'Software Licenses', 'Hardware Maintenance', 'Data Backup']
  },
  {
    name: 'Administrative',
    items: ['Staff Attendance', 'Document Management', 'Compliance Records', 'Financial Records', 'Vendor Relations', 'Maintenance Contracts', 'Security Systems', 'Cleaning Services']
  }
];

// Mock reports for demonstration
export const mockReports: DailyReport[] = [
  {
    id: '1',
    centerId: 'niat-hyd-main',
    centerName: 'NIAT Hyderabad Main Campus',
    date: new Date().toISOString().split('T')[0],
    submittedBy: 'Dr. Rajesh Kumar',
    items: [
      { id: '1', category: 'Infrastructure', item: 'Classroom Condition', status: 'OK', priority: 'Low', description: 'All classrooms in good condition' },
      { id: '2', category: 'Technology', item: 'Internet Connectivity', status: 'ISSUE', priority: 'High', description: 'Slow internet in Lab 2', actionRequired: 'Contact ISP' }
    ],
    summary: {
      goingGood: 'Good student attendance and faculty engagement',
      goingWrong: 'Internet connectivity issues in some labs',
      highRisk: 'None',
      immediateAttention: 'Internet connectivity in Lab 2',
      progressFromLastDay: 'Resolved AC issues in Block A'
    },
    status: 'submitted',
    submittedAt: new Date()
  }
];

export const actionItems = [
  { id: '1', title: 'Morning Campus Check', description: 'Inspect all facilities before classes start', category: 'Infrastructure', completed: false, priority: 'High' as const },
  { id: '2', title: 'Faculty Attendance Review', description: 'Check and record faculty attendance', category: 'Academic', completed: true, priority: 'Medium' as const },
  { id: '3', title: 'Student Feedback Collection', description: 'Gather feedback from students', category: 'Student Services', completed: false, priority: 'Medium' as const },
  { id: '4', title: 'IT Systems Check', description: 'Verify all systems are operational', category: 'Technology', completed: false, priority: 'High' as const },
  { id: '5', title: 'Administrative Tasks', description: 'Complete daily administrative work', category: 'Administrative', completed: false, priority: 'Low' as const }
];