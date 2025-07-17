import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Settings, 
  Database, 
  Activity,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Building2,
  Plus,
  MapPin
} from 'lucide-react';
import { User, Center } from '../types';
import { centers as initialCenters } from '../data/mockData';
import { getRoleDisplayName, getRoleBadgeColor } from '../utils/rbac';

interface AdminPanelProps {
  onBack: () => void;
}

// Updated users data to match NIAT system
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@niat.edu',
    name: 'System Administrator',
    role: 'head_of_niat',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'cos@niat.edu',
    name: 'Chief of Staff',
    role: 'cos',
    centerId: 'niat-hyderabad',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:15:00'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    email: 'pm@niat.edu',
    name: 'Program Manager',
    role: 'pm',
    centerId: 'niat-hyderabad',
    isActive: true,
    lastLogin: new Date('2024-01-14T16:45:00'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    email: 'head@niat.edu',
    name: 'Dr. Rajesh Kumar',
    role: 'head_of_niat',
    isActive: true,
    lastLogin: new Date('2024-01-10T14:30:00'),
    createdAt: new Date('2024-01-05')
  }
];

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'centers' | 'security' | 'system'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [centers, setCenters] = useState<Center[]>(initialCenters);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'viewer' as User['role'],
    centerId: '',
    password: '',
    confirmPassword: ''
  });

  const [newCenter, setNewCenter] = useState({
    name: '',
    location: '',
    cos: '',
    pm: ''
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const apiUsers = await response.json();
        // Transform API users to match frontend User type
        const transformedUsers: User[] = apiUsers.map((user: any) => ({
          id: user.id.toString(),
          email: user.email,
          name: user.username === 'admin' ? 'System Administrator' : 
                user.username === 'cos' ? 'Chief of Staff' :
                user.username === 'pm' ? 'Program Manager' :
                user.username || user.email.split('@')[0],
          role: user.role,
          centerId: user.centerId,
          isActive: user.emailVerified,
          lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
          createdAt: new Date(user.createdAt)
        }));
        setUsers(transformedUsers);
      } else {
        // Fallback to mock data if API fails
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback to mock data
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      centerId: newUser.centerId || undefined,
      isActive: true,
      createdAt: new Date()
    };

    setUsers([...users, user]);
    setShowUserModal(false);
    setNewUser({
      email: '',
      name: '',
      role: 'viewer',
      centerId: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleCreateCenter = () => {
    const center: Center = {
      id: Date.now().toString(),
      name: newCenter.name,
      location: newCenter.location,
      cos: newCenter.cos,
      pm: newCenter.pm
    };

    setCenters([...centers, center]);
    setShowCenterModal(false);
    setNewCenter({
      name: '',
      location: '',
      cos: '',
      pm: ''
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      name: user.name,
      role: user.role,
      centerId: user.centerId || '',
      password: '',
      confirmPassword: ''
    });
    setShowUserModal(true);
  };

  const handleEditCenter = (center: Center) => {
    setEditingCenter(center);
    setNewCenter({
      name: center.name,
      location: center.location,
      cos: center.cos,
      pm: center.pm
    });
    setShowCenterModal(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const updatedUser: User = {
      ...editingUser,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      centerId: newUser.centerId || undefined
    };

    setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
    setShowUserModal(false);
    setEditingUser(null);
    setNewUser({
      email: '',
      name: '',
      role: 'viewer',
      centerId: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleUpdateCenter = () => {
    if (!editingCenter) return;

    const updatedCenter: Center = {
      ...editingCenter,
      name: newCenter.name,
      location: newCenter.location,
      cos: newCenter.cos,
      pm: newCenter.pm
    };

    setCenters(centers.map(c => c.id === editingCenter.id ? updatedCenter : c));
    setShowCenterModal(false);
    setEditingCenter(null);
    setNewCenter({
      name: '',
      location: '',
      cos: '',
      pm: ''
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleDeleteCenter = (centerId: string) => {
    if (confirm('Are you sure you want to delete this center? This will affect all associated users.')) {
      setCenters(centers.filter(c => c.id !== centerId));
      // Also remove center association from users
      setUsers(users.map(u => u.centerId === centerId ? { ...u, centerId: undefined } : u));
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  // Using imported getRoleBadgeColor function from rbac utils

  const UserModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h3>
          <button
            onClick={() => {
              setShowUserModal(false);
              setEditingUser(null);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="viewer">Viewer</option>
              <option value="pm">Project Manager</option>
              <option value="cos">Chief of Staff</option>
              <option value="admin">Admin</option>
              <option value="head_of_niat">Head of NIAT</option>
            </select>
          </div>

          {(newUser.role === 'cos' || newUser.role === 'pm') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Center
              </label>
              <select
                value={newUser.centerId}
                onChange={(e) => setNewUser({ ...newUser, centerId: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Center</option>
                {centers.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.name} - {center.location}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!editingUser && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={editingUser ? handleUpdateUser : handleCreateUser}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <Save className="h-4 w-4" />
            <span>{editingUser ? 'Update' : 'Create'}</span>
          </button>
          <button
            onClick={() => {
              setShowUserModal(false);
              setEditingUser(null);
            }}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const CenterModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingCenter ? 'Edit Center' : 'Add New Center'}
          </h3>
          <button
            onClick={() => {
              setShowCenterModal(false);
              setEditingCenter(null);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Center Name
            </label>
            <input
              type="text"
              value={newCenter.name}
              onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Mumbai Central"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={newCenter.location}
              onChange={(e) => setNewCenter({ ...newCenter, location: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Mumbai"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chief of Staff (COS)
            </label>
            <input
              type="text"
              value={newCenter.cos}
              onChange={(e) => setNewCenter({ ...newCenter, cos: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Shivika"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Manager (PM)
            </label>
            <input
              type="text"
              value={newCenter.pm}
              onChange={(e) => setNewCenter({ ...newCenter, pm: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Anurag"
              required
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={editingCenter ? handleUpdateCenter : handleCreateCenter}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <Save className="h-4 w-4" />
            <span>{editingCenter ? 'Update' : 'Create'}</span>
          </button>
          <button
            onClick={() => {
              setShowCenterModal(false);
              setEditingCenter(null);
            }}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-nxtwave-red hover:text-nxtwave-red-dark transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-nxtwave-red">NIAT Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">System administration and management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'centers', label: 'Centers', icon: Building2 },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'system', label: 'System', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => {
                      const center = centers.find(c => c.id === user.centerId);
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                              {getRoleDisplayName(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {center ? `${center.name}` : 'All Centers'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                user.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30'
                              }`}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'centers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Centers Management</h3>
                <button
                  onClick={() => setShowCenterModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Center</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {centers.map((center) => (
                  <div key={center.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border dark:border-gray-600 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{center.name}</h4>
                          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            <span>{center.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCenter(center)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCenter(center.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">COS:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{center.cos}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">PM:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{center.pm}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Password Policy</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Minimum 8 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>At least one uppercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>At least one number</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Password expires every 90 days</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Session Management</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Session timeout: 8 hours</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Auto-logout on inactivity</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Single sign-on enabled</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Remember me: 30 days</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Access Control</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Role-based permissions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Center-specific access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Admin approval required</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Audit trail enabled</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Data Protection</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>End-to-end encryption</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Regular backups</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>GDPR compliant</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Data retention: 7 years</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <Database className="h-6 w-6 text-blue-600" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Database</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="text-green-600 font-medium flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Online</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Version:</span>
                      <span className="text-gray-900 dark:text-white">PostgreSQL 14.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Size:</span>
                      <span className="text-gray-900 dark:text-white">2.4 GB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="h-6 w-6 text-green-600" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Performance</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                      <span className="text-gray-900 dark:text-white">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                      <span className="text-gray-900 dark:text-white">120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Users:</span>
                      <span className="text-gray-900 dark:text-white">24</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3">Maintenance Schedule</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Next scheduled maintenance: Sunday, January 21, 2024 at 2:00 AM UTC
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUserModal && <UserModal />}
      {showCenterModal && <CenterModal />}
    </div>
  );
}