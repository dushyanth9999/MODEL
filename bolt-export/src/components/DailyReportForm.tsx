import React, { useState } from 'react';
import { ArrowLeft, Plus, Camera, Save, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DailyReportFormProps {
  onBack: () => void;
  selectedCenterId?: string;
}

export default function DailyReportForm({ onBack, selectedCenterId }: DailyReportFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    centerId: selectedCenterId || user?.centerId || '',
    goingGood: '',
    goingWrong: '',
    highRisk: '',
    immediateAttention: '',
    progressFromLastDay: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Daily report submitted successfully!');
    setIsSubmitting(false);
    onBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Daily Report</h1>
              <p className="text-muted-foreground">
                Submit your daily operational report
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Report Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Center
                </label>
                <select
                  value={formData.centerId}
                  onChange={(e) => handleInputChange('centerId', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-maroon-500"
                  required
                >
                  <option value="">Select a center</option>
                  <option value="niat-main-hyd">NIAT Main Campus - Hyderabad</option>
                  <option value="niat-bangalore">NIAT Bangalore</option>
                  <option value="niat-chennai">NIAT Chennai</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  readOnly
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Summary Sections */}
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Daily Summary</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  What's Going Good?
                </label>
                <textarea
                  value={formData.goingGood}
                  onChange={(e) => handleInputChange('goingGood', e.target.value)}
                  placeholder="Describe positive developments, achievements, and things working well..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-green-500 h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-700 dark:text-orange-400 mb-2">
                  What's Going Wrong?
                </label>
                <textarea
                  value={formData.goingWrong}
                  onChange={(e) => handleInputChange('goingWrong', e.target.value)}
                  placeholder="Describe issues, problems, or areas that need improvement..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  High Risk Items
                </label>
                <textarea
                  value={formData.highRisk}
                  onChange={(e) => handleInputChange('highRisk', e.target.value)}
                  placeholder="Critical issues that need immediate escalation or attention..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-red-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                  Immediate Attention Required
                </label>
                <textarea
                  value={formData.immediateAttention}
                  onChange={(e) => handleInputChange('immediateAttention', e.target.value)}
                  placeholder="Items that need urgent action within 24 hours..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                  Progress Since Yesterday
                </label>
                <textarea
                  value={formData.progressFromLastDay}
                  onChange={(e) => handleInputChange('progressFromLastDay', e.target.value)}
                  placeholder="Updates on issues from previous reports, progress made, items resolved..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any additional information, observations, or context..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-maroon-500 h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Photo Documentation</h2>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Upload photos related to your report</p>
              <button
                type="button"
                className="px-4 py-2 bg-maroon-700 text-cream-50 rounded-lg hover:bg-maroon-600 transition-colors"
              >
                Choose Files
              </button>
              <p className="text-sm text-muted-foreground mt-2">
                JPG, PNG up to 10MB each
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-maroon-700 text-cream-50 rounded-lg hover:bg-maroon-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="niat-spinner w-4 h-4"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}