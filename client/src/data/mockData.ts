import { Center, DailyReport, ReportItem } from '../types';

export const centers: Center[] = [
  { id: '1', name: 'Annamacharya University', location: 'Rajampet', cso: 'Shivaram Pranay', pm: '' },
  { id: '2', name: 'Chalapathi Institute of Technology', location: 'Guntur', cso: 'Arlaiah', pm: '' },
  { id: '3', name: 'Chalapathi Institute of Engineering & Technology', location: 'Guntur', cso: 'Arlaiah', pm: '' },
  { id: '4', name: 'NRI', location: 'Vijayawada', cso: 'Manoj', pm: '' },
  { id: '5', name: 'NSRIT', location: 'Vizag', cso: 'Satya', pm: '' },
  { id: '6', name: 'Aurora Deemed University', location: 'Hyderabad', cso: 'Shadeep', pm: '' },
  { id: '7', name: 'Malla Reddy University', location: 'Hyderabad', cso: 'Manideep Reddy Irupaka', pm: '' },
  { id: '8', name: 'Chaitanya Deemed University (CDU)', location: 'Hyderabad', cso: 'Shanthan Singam', pm: '' },
  { id: '9', name: 'Takshashila University', location: 'Pondicherry', cso: 'Ashwath', pm: '' },
  { id: '10', name: 'Crescent University', location: 'Chennai', cso: 'Krishnaja', pm: '' },
  { id: '11', name: 'AMET University', location: 'Chennai', cso: 'Harishma cs', pm: '' },
  { id: '12', name: 'Sharda University', location: 'Noida', cso: 'Manoj Machineni', pm: '' },
  { id: '13', name: 'Noida International University', location: 'Noida', cso: 'Gaurav Singh', pm: '' },
  { id: '14', name: 'Ajeenkya D.Y. Patil University', location: 'Pune', cso: 'Kavya Achar', pm: '' },
  { id: '15', name: 'Sanjay Ghodawat University', location: 'Kolhapur', cso: 'Vijay', pm: '' },
  { id: '16', name: 'S-Vyasa', location: 'Bengaluru', cso: 'Varsha Mahesh', pm: '' },
  { id: '17', name: 'Yenepoya University', location: 'Mangalore', cso: 'Nawaz', pm: '' },
  { id: '18', name: 'Vivekananda Global University', location: 'Jaipur', cso: 'Jatin', pm: '' },
];

export const reportCategories = [
  {
    name: 'Hygiene & Cleanliness',
    subcategories: [
      { name: 'Classrooms', items: ['Cleaned daily', 'Dust-free surfaces', 'Well-ventilated'] },
      { name: 'Lobby', items: ['Clean floor', 'No clutter', 'Proper signage'] },
      { name: 'Recreation', items: ['Tidy equipment', 'No trash', 'Well-lit'] },
      { name: 'Workstation', items: ['Organized desks', 'Clean surfaces'] },
      { name: 'Washrooms', items: ['Sanitized', 'Stocked with supplies', 'No foul smell'] },
      { name: 'Cafeteria', items: ['Clean tables', 'No leftovers', 'Bins cleared'] },
      { name: 'Lift Lobby', items: ['Clean floors', 'Walls free of posters/marks'] },
    ]
  },
  {
    name: 'Infrastructure',
    subcategories: [
      { name: 'Buses', items: ['On-time', 'Clean', 'Fuel check done'] },
      { name: 'AC', items: ['Working condition', 'Filter cleaned'] },
      { name: 'Network', items: ['LAN active', 'WiFi accessible', 'Firewall rules set', 'Authorized logins secure'] },
      { name: 'TV', items: ['Functional', 'Proper channels'] },
      { name: 'AV', items: ['Speakers working', 'Mic functioning'] },
      { name: 'Lighting', items: ['All lights functional', 'No flickering'] },
      { name: 'Lifts', items: ['Operational', 'Emergency button works'] },
      { name: 'CCTV Monitoring', items: ['Live feed working', 'Recording enabled'] },
      { name: 'Internet', items: ['Bandwidth optimal', 'Speed test passed'] },
      { name: 'Power sockets', items: ['Safe', 'Working', 'No exposed wires'] },
      { name: 'Water dispensers', items: ['Filled', 'Clean', 'No leaks'] },
    ]
  },
  {
    name: 'Academics & Operations',
    subcategories: [
      { name: 'Content development', items: ['Lesson plans', 'Assignments', 'Presentations ready'] },
      { name: 'Learning platform', items: ['No glitches', 'Login access', 'Tracking enabled'] },
      { name: 'Scheduling', items: ['Daily timetable shared', 'Faculty assigned'] },
      { name: '1:1s', items: ['Held as per schedule', 'Feedback collected'] },
      { name: 'Attendance', items: ['Students marked', 'Instructors on time', 'Mentors reported', 'Success coaches noted'] },
      { name: 'Learning analytics', items: ['Classroom quiz scores', 'Daily quiz completion', 'Practice tracking', 'Assignment submission'] },
    ]
  },
  {
    name: 'Campus Life',
    subcategories: [
      { name: 'Vibe', items: ['Positive energy', 'Peer engagement'] },
      { name: 'Recreation', items: ['Activity board updated', 'Games working'] },
      { name: 'Hostel Issues', items: ['Cleanliness', 'Maintenance', 'Safety'] },
      { name: 'Alignment', items: ['Instructors aligned', 'Mentors aligned', 'Coaches synced', 'PMs involved'] },
      { name: 'Health', items: ['First-aid ready', 'Doctor visits scheduled'] },
      { name: 'Fire Safety', items: ['Extinguishers checked', 'Exits marked'] },
    ]
  }
];

// Mock data for current reports
export const mockReports: DailyReport[] = centers.slice(0, 8).map((center, index) => ({
  id: `report-${center.id}`,
  centerId: center.id,
  date: new Date(),
  items: generateMockReportItems(center.id),
  summary: {
    goingGood: ['All infrastructure working smoothly', 'High student engagement', 'Clean facilities'],
    goingWrong: index % 3 === 0 ? ['Network connectivity issues', 'Late bus arrivals'] : [],
    highRisk: index % 5 === 0 ? ['AC maintenance needed urgently'] : [],
    immediateAttention: index % 4 === 0 ? ['Fire safety equipment check'] : [],
    progressFromLastDay: 'Improved attendance by 15%, resolved cafeteria cleaning issues'
  },
  submittedBy: center.cso,
  submittedAt: new Date(),
  version: 1,
  status: 'SUBMITTED'
}));

function generateMockReportItems(centerId: string): ReportItem[] {
  const items: ReportItem[] = [];
  const statuses: ReportItem['status'][] = ['OK', 'ISSUE', 'HIGH_RISK', 'NA'];
  
  reportCategories.forEach((category, catIndex) => {
    category.subcategories.forEach((subcategory, subIndex) => {
      subcategory.items.forEach((item, itemIndex) => {
        // Generate realistic status distribution
        let status: ReportItem['status'];
        const rand = Math.random();
        if (rand < 0.75) status = 'OK';
        else if (rand < 0.9) status = 'ISSUE';
        else if (rand < 0.95) status = 'HIGH_RISK';
        else status = 'NA';

        items.push({
          id: `${centerId}-${catIndex}-${subIndex}-${itemIndex}`,
          category: category.name,
          subcategory: subcategory.name,
          item: item,
          status: status,
          remarks: status === 'ISSUE' ? 'Minor issue, being addressed' : 
                   status === 'HIGH_RISK' ? 'Requires immediate attention' : '',
          responsiblePerson: getResponsiblePerson(category.name),
          timestamp: new Date(),
          centerId: centerId
        });
      });
    });
  });
  
  return items;
}

function getResponsiblePerson(category: string): string {
  const assignments: Record<string, string> = {
    'Hygiene & Cleanliness': 'Facility Team - Venkat Sai',
    'Infrastructure': 'Admin Team - Chandrakala',
    'Academics & Operations': 'Academic Team - Abhinav',
    'Campus Life': 'Campus Team - Shivika'
  };
  return assignments[category] || 'General Team';
}