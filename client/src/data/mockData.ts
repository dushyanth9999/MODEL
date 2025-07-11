import { Center, DailyReport, ReportItem } from '../types';

export const centers: Center[] = [
  { id: '1', name: 'Hyderabad Main', location: 'Hyderabad', cso: 'Shivika', pm: 'Anurag' },
  { id: '2', name: 'Bangalore Tech', location: 'Bangalore', cso: 'Abhinav', pm: 'Guruprasad' },
  { id: '3', name: 'Chennai Hub', location: 'Chennai', cso: 'Manoj', pm: 'Bhagyalakshmi' },
  { id: '4', name: 'Mumbai Central', location: 'Mumbai', cso: 'Venkat Sai', pm: 'Chandrakala' },
  { id: '5', name: 'Pune Campus', location: 'Pune', cso: 'Dharani', pm: 'Namita' },
  { id: '6', name: 'Delhi NCR', location: 'Delhi', cso: 'Mukram', pm: 'Arun' },
  { id: '7', name: 'Kolkata Center', location: 'Kolkata', cso: 'Shivika', pm: 'Anurag' },
  { id: '8', name: 'Ahmedabad Hub', location: 'Ahmedabad', cso: 'Abhinav', pm: 'Guruprasad' },
  { id: '9', name: 'Coimbatore', location: 'Coimbatore', cso: 'Manoj', pm: 'Bhagyalakshmi' },
  { id: '10', name: 'Kochi Tech', location: 'Kochi', cso: 'Venkat Sai', pm: 'Chandrakala' },
  { id: '11', name: 'Indore Campus', location: 'Indore', cso: 'Dharani', pm: 'Namita' },
  { id: '12', name: 'Lucknow Center', location: 'Lucknow', cso: 'Mukram', pm: 'Arun' },
  { id: '13', name: 'Jaipur Hub', location: 'Jaipur', cso: 'Shivika', pm: 'Anurag' },
  { id: '14', name: 'Bhubaneswar', location: 'Bhubaneswar', cso: 'Abhinav', pm: 'Guruprasad' },
  { id: '15', name: 'Chandigarh', location: 'Chandigarh', cso: 'Manoj', pm: 'Bhagyalakshmi' },
  { id: '16', name: 'Nagpur Campus', location: 'Nagpur', cso: 'Venkat Sai', pm: 'Chandrakala' },
  { id: '17', name: 'Visakhapatnam', location: 'Visakhapatnam', cso: 'Dharani', pm: 'Namita' },
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