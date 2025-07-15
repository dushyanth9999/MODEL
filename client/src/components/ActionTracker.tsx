import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Plus, Edit, Trash2, Save, Calendar, CheckCircle, AlertCircle, Clock, User, Settings } from 'lucide-react';

interface ActionTrackerProps {
  onBack: () => void;
}

interface ActionTrackerTemplate {
  id: number;
  role: string;
  title: string;
  description: string | null;
  items: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface DailyActionTracker {
  id: number;
  userId: number;
  templateId: number;
  centerId: string | null;
  date: Date;
  completedItems: string[];
  notes: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: number;
  username: string;
  role: string;
  centerId: string | null;
}

export default function ActionTracker({ onBack }: ActionTrackerProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ActionTrackerTemplate[]>([]);
  const [dailyTrackers, setDailyTrackers] = useState<DailyActionTracker[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ActionTrackerTemplate | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    role: '',
    title: '',
    description: '',
    items: ['']
  });
  const [users, setUsers] = useState<User[]>([]);

  // Mock user data - in real app this would come from auth context
  const mockUser = {
    id: 1,
    username: 'admin',
    role: 'admin',
    centerId: null
  };

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
    fetchDailyTrackers();
    setIsAdmin(mockUser.role === 'admin');
  }, [selectedDate]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/action-tracker-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDailyTrackers = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/daily-action-trackers?userId=${mockUser.id}&date=${dateString}`);
      if (response.ok) {
        const data = await response.json();
        setDailyTrackers(data);
      }
    } catch (error) {
      console.error('Error fetching daily trackers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = async (templateId: number, item: string) => {
    const existingTracker = dailyTrackers.find(t => t.templateId === templateId);
    
    if (existingTracker) {
      const updatedItems = existingTracker.completedItems.includes(item)
        ? existingTracker.completedItems.filter(i => i !== item)
        : [...existingTracker.completedItems, item];
      
      try {
        const response = await fetch(`/api/daily-action-trackers/${existingTracker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedItems: updatedItems })
        });
        
        if (response.ok) {
          const updatedTracker = await response.json();
          setDailyTrackers(prev => prev.map(t => t.id === existingTracker.id ? updatedTracker : t));
        }
      } catch (error) {
        console.error('Error updating tracker:', error);
      }
    } else {
      // Create new tracker
      try {
        const response = await fetch('/api/daily-action-trackers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: mockUser.id,
            templateId,
            centerId: mockUser.centerId,
            date: selectedDate,
            completedItems: [item]
          })
        });
        
        if (response.ok) {
          const newTracker = await response.json();
          setDailyTrackers(prev => [...prev, newTracker]);
        }
      } catch (error) {
        console.error('Error creating tracker:', error);
      }
    }
  };

  const handleNotesUpdate = async (templateId: number, notes: string) => {
    const existingTracker = dailyTrackers.find(t => t.templateId === templateId);
    
    if (existingTracker) {
      try {
        const response = await fetch(`/api/daily-action-trackers/${existingTracker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes })
        });
        
        if (response.ok) {
          const updatedTracker = await response.json();
          setDailyTrackers(prev => prev.map(t => t.id === existingTracker.id ? updatedTracker : t));
        }
      } catch (error) {
        console.error('Error updating notes:', error);
      }
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/action-tracker-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTemplate,
          items: newTemplate.items.filter(item => item.trim() !== '')
        })
      });
      
      if (response.ok) {
        const template = await response.json();
        setTemplates(prev => [...prev, template]);
        setShowTemplateDialog(false);
        setNewTemplate({ role: '', title: '', description: '', items: [''] });
        alert("Template created successfully");
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      const response = await fetch(`/api/action-tracker-templates/${templateId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        alert("Template deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert("Failed to delete template");
    }
  };

  const addNewItem = () => {
    setNewTemplate(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };

  const updateItem = (index: number, value: string) => {
    setNewTemplate(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }));
  };

  const removeItem = (index: number) => {
    setNewTemplate(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const getCompletionPercentage = (template: ActionTrackerTemplate) => {
    const tracker = dailyTrackers.find(t => t.templateId === template.id);
    if (!tracker) return 0;
    return Math.round((tracker.completedItems.length / template.items.length) * 100);
  };

  const getCompletionStatus = (percentage: number) => {
    if (percentage === 100) return { color: 'bg-green-500', icon: CheckCircle, text: 'Completed' };
    if (percentage > 50) return { color: 'bg-yellow-500', icon: Clock, text: 'In Progress' };
    return { color: 'bg-red-500', icon: AlertCircle, text: 'Not Started' };
  };

  const filteredTemplates = templates.filter(template => {
    if (isAdmin) return true;
    return template.role === mockUser.role;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Role-Based Action Tracker
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowTemplateDialog(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Template
            </button>
          )}
        </div>
      </div>

      {/* Template Creation Dialog */}
      {showTemplateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Create New Action Tracker Template
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={newTemplate.role}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select role</option>
                    <option value="cos">Chief of Staff (COS)</option>
                    <option value="pm">Program Manager (PM)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Template title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Template description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Checklist Items
                </label>
                <div className="space-y-2">
                  {newTemplate.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder={`Item ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        onClick={() => removeItem(index)}
                        disabled={newTemplate.items.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addNewItem}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowTemplateDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.role || !newTemplate.title || newTemplate.items.filter(i => i.trim()).length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid gap-6">
        {filteredTemplates.map((template) => {
          const tracker = dailyTrackers.find(t => t.templateId === template.id);
          const completionPercentage = getCompletionPercentage(template);
          const status = getCompletionStatus(completionPercentage);

          return (
            <div key={template.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {template.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 text-xs border border-gray-300 rounded-lg bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                          {template.role.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-lg ${
                          completionPercentage === 100 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {completionPercentage}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <status.icon className="h-4 w-4" />
                      {status.text}
                    </div>
                    
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingTemplate(template)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {template.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                )}
              </div>
              
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  {template.items.map((item, index) => {
                    const isCompleted = tracker?.completedItems.includes(item) || false;
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleItemToggle(template.id, item)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`flex-1 text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={tracker?.notes || ''}
                      onChange={(e) => handleNotesUpdate(template.id, e.target.value)}
                      placeholder="Add notes about your progress..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Action Trackers Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {isAdmin 
              ? "Create your first action tracker template to get started."
              : "No action trackers are configured for your role. Contact your administrator."}
          </p>
        </div>
      )}
    </div>
  );
}