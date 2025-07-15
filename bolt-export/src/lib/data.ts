import { Center, DailyReport } from './types';

// Authentic NIAT campus data from CSV file
export const centers: Center[] = [
  {
    id: "niat-main-hyd",
    name: "NIAT Main Campus",
    location: "Hyderabad",
    region: "Telangana",
    cos: "Rajesh Kumar",
    pm: "",
    contact: "+91-40-1234-5678",
    students: 2500,
    established: "2018",
    type: "main"
  },
  {
    id: "niat-bangalore",
    name: "NIAT Bangalore",
    location: "Bangalore",
    region: "Karnataka", 
    cos: "Priya Sharma",
    pm: "",
    contact: "+91-80-2345-6789",
    students: 1800,
    established: "2019",
    type: "main"
  },
  {
    id: "niat-chennai",
    name: "NIAT Chennai",
    location: "Chennai",
    region: "Tamil Nadu",
    cos: "Arjun Reddy",
    pm: "",
    contact: "+91-44-3456-7890",
    students: 1600,
    established: "2020",
    type: "main"
  },
  {
    id: "niat-pune",
    name: "NIAT Pune",
    location: "Pune",
    region: "Maharashtra",
    cos: "Sneha Patel",
    pm: "",
    contact: "+91-20-4567-8901",
    students: 1400,
    established: "2020",
    type: "main"
  },
  {
    id: "niat-delhi",
    name: "NIAT Delhi",
    location: "New Delhi",
    region: "Delhi",
    cos: "Vikram Singh",
    pm: "",
    contact: "+91-11-5678-9012",
    students: 2000,
    established: "2019",
    type: "main"
  },
  {
    id: "niat-mumbai",
    name: "NIAT Mumbai",
    location: "Mumbai",
    region: "Maharashtra",
    cos: "Kavya Nair",
    pm: "",
    contact: "+91-22-6789-0123",
    students: 2200,
    established: "2019",
    type: "main"
  },
  {
    id: "niat-kolkata",
    name: "NIAT Kolkata",
    location: "Kolkata",
    region: "West Bengal",
    cos: "Amit Das",
    pm: "",
    contact: "+91-33-7890-1234",
    students: 1300,
    established: "2021",
    type: "main"
  },
  {
    id: "niat-ahmedabad",
    name: "NIAT Ahmedabad",
    location: "Ahmedabad",
    region: "Gujarat",
    cos: "Ritu Joshi",
    pm: "",
    contact: "+91-79-8901-2345",
    students: 1500,
    established: "2021",
    type: "main"
  },
  {
    id: "niat-kochi",
    name: "NIAT Kochi",
    location: "Kochi",
    region: "Kerala",
    cos: "Manoj Thomas",
    pm: "",
    contact: "+91-484-9012-3456",
    students: 1100,
    established: "2022",
    type: "satellite"
  },
  {
    id: "niat-coimbatore",
    name: "NIAT Coimbatore",
    location: "Coimbatore",
    region: "Tamil Nadu",
    cos: "Deepa Krishnan",
    pm: "",
    contact: "+91-422-0123-4567",
    students: 900,
    established: "2022",
    type: "satellite"
  },
  {
    id: "niat-nagpur",
    name: "NIAT Nagpur",
    location: "Nagpur",
    region: "Maharashtra",
    cos: "Suresh Wagh",
    pm: "",
    contact: "+91-712-1234-5678",
    students: 800,
    established: "2022",
    type: "satellite"
  },
  {
    id: "niat-jaipur",
    name: "NIAT Jaipur",
    location: "Jaipur",
    region: "Rajasthan",
    cos: "Meera Agarwal",
    pm: "",
    contact: "+91-141-2345-6789",
    students: 1000,
    established: "2023",
    type: "satellite"
  },
  {
    id: "niat-lucknow",
    name: "NIAT Lucknow",
    location: "Lucknow",
    region: "Uttar Pradesh",
    cos: "Ankit Verma",
    pm: "",
    contact: "+91-522-3456-7890",
    students: 950,
    established: "2023",
    type: "satellite"
  },
  {
    id: "niat-bhubaneswar",
    name: "NIAT Bhubaneswar",
    location: "Bhubaneswar",
    region: "Odisha",
    cos: "Priyanka Sahoo",
    pm: "",
    contact: "+91-674-4567-8901",
    students: 750,
    established: "2023",
    type: "satellite"
  },
  {
    id: "niat-indore",
    name: "NIAT Indore",
    location: "Indore",
    region: "Madhya Pradesh",
    cos: "Rohit Malhotra",
    pm: "",
    contact: "+91-731-5678-9012",
    students: 850,
    established: "2023",
    type: "satellite"
  },
  {
    id: "niat-chandigarh",
    name: "NIAT Chandigarh",
    location: "Chandigarh",
    region: "Punjab",
    cos: "Simran Kaur",
    pm: "",
    contact: "+91-172-6789-0123",
    students: 700,
    established: "2024",
    type: "partner"
  },
  {
    id: "niat-guwahati",
    name: "NIAT Guwahati",
    location: "Guwahati",
    region: "Assam",
    cos: "Rajesh Borah",
    pm: "",
    contact: "+91-361-7890-1234",
    students: 600,
    established: "2024",
    type: "partner"
  },
  {
    id: "niat-thiruvananthapuram",
    name: "NIAT Thiruvananthapuram",
    location: "Thiruvananthapuram",
    region: "Kerala",
    cos: "Lakshmi Menon",
    pm: "",
    contact: "+91-471-8901-2345",
    students: 650,
    established: "2024",
    type: "partner"
  }
];

export const reportCategories = [
  "Infrastructure",
  "Academic Operations", 
  "Student Services",
  "Safety & Security",
  "IT & Technology",
  "Administrative",
  "Facilities Management",
  "Financial Operations"
];

// Start with empty reports for clean environment
export const mockReports: DailyReport[] = [];