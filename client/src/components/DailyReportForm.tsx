import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Clock, AlertTriangle, Camera, Upload, MapPin, Image, X, Download } from 'lucide-react';
import { centers, reportCategories } from '../data/mockData';
import { ReportItem, DailyReport } from '../types';

interface DailyReportFormProps {
  onBack: () => void;
  selectedCenterId?: string;
}

interface Photo {
  id: string;
  file: File;
  preview: string;
  location: string;
  description: string;
}

export default function DailyReportForm({ onBack, selectedCenterId }: DailyReportFormProps) {
  const [selectedCenter, setSelectedCenter] = useState(selectedCenterId || centers[0].id);
  const [isInitialized, setIsInitialized] = useState(false);
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [summary, setSummary] = useState({
    goingGood: '',
    goingWrong: '',
    highRisk: '',
    immediateAttention: '',
    progressFromLastDay: ''
  });

  const center = centers.find(c => c.id === selectedCenter);

  // Initialize and refresh data on component mount
  useEffect(() => {
    if (!isInitialized) {
      // Reset form state when component mounts
      setReportItems([]);
      setRemarks({});
      setSummary({
        goingGood: '',
        goingWrong: '',
        highRisk: '',
        immediateAttention: '',
        progressFromLastDay: ''
      });
      setPhotos([]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update selected center when prop changes
  useEffect(() => {
    if (selectedCenterId && selectedCenterId !== selectedCenter) {
      setSelectedCenter(selectedCenterId);
    }
  }, [selectedCenterId, selectedCenter]);

  const exportDailyReport = () => {
    const reportData = {
      center: center,
      date: new Date().toISOString().split('T')[0],
      reportItems: reportItems,
      summary: summary,
      photos: photos.map(p => ({ location: p.location, description: p.description })),
      totalItems: reportItems.length,
      statusCounts: {
        OK: reportItems.filter(item => item.status === 'OK').length,
        ISSUE: reportItems.filter(item => item.status === 'ISSUE').length,
        HIGH_RISK: reportItems.filter(item => item.status === 'HIGH_RISK').length,
        NA: reportItems.filter(item => item.status === 'NA').length,
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `daily-report-${center?.name}-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleStatusChange = (categoryIndex: number, subcategoryIndex: number, itemIndex: number, status: ReportItem['status']) => {
    const category = reportCategories[categoryIndex];
    const subcategory = category.subcategories[subcategoryIndex];
    const item = subcategory.items[itemIndex];
    
    const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;
    
    setReportItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === itemId);
      const newItem: ReportItem = {
        id: itemId,
        category: category.name,
        subcategory: subcategory.name,
        item: item,
        status: status,
        remarks: '',
        responsiblePerson: getResponsiblePerson(category.name),
        timestamp: new Date(),
        centerId: selectedCenter
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], status };
        return updated;
      } else {
        return [...prev, newItem];
      }
    });
  };

  const handleRemarksChange = (itemId: string, remarks: string) => {
    setReportItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, remarks } : item
      )
    );
  };

  const getResponsiblePerson = (category: string): string => {
    const assignments: Record<string, string> = {
      'Hygiene & Cleanliness': 'Facility Team - Venkat Sai',
      'Infrastructure': 'Admin Team - Chandrakala',
      'Academics & Operations': 'Academic Team - Abhinav',
      'Campus Life': 'Campus Team - Shivika'
    };
    return assignments[category] || 'General Team';
  };

  const getItemStatus = (categoryIndex: number, subcategoryIndex: number, itemIndex: number): ReportItem['status'] => {
    const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;
    const item = reportItems.find(i => i.id === itemId);
    return item?.status || 'OK';
  };

  const getItemRemarks = (categoryIndex: number, subcategoryIndex: number, itemIndex: number): string => {
    const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;
    const item = reportItems.find(i => i.id === itemId);
    return item?.remarks || '';
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          location: '',
          description: ''
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const updatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, ...updates } : photo
    ));
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleSubmit = () => {
    // Here you would typically submit to your backend
    console.log('Submitting report for center:', selectedCenter);
    console.log('Report items:', reportItems);
    console.log('Summary:', summary);
    console.log('Photos:', photos);
    
    alert('Daily report submitted successfully!');
    onBack();
  };

  const StatusButton = ({ 
    status, 
    currentStatus, 
    onClick, 
    icon: Icon, 
    label,
    color 
  }: {
    status: ReportItem['status'];
    currentStatus: ReportItem['status'];
    onClick: () => void;
    icon: React.ComponentType<any>;
    label: string;
    color: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors
        ${currentStatus === status 
          ? `bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-200 border border-${color}-200 dark:border-${color}-700` 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Operations Report</h1>
          <p className="text-gray-600 dark:text-gray-400">Submit daily operational status for your center</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportDailyReport}
            className="btn-secondary px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Submit Report</span>
          </button>
        </div>
      </div>

      {/* Center Selection */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Center</h3>
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
        >
          {centers.map(center => (
            <option key={center.id} value={center.id}>
              {center.name} - {center.location}
            </option>
          ))}
        </select>
        {center && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">CSO:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{center.cso}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">PM:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{center.pm}</span>
            </div>
          </div>
        )}
      </div>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category, categoryIndex) => (
          <div key={category.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
            </div>
            <div className="p-6 space-y-6">
              {category.subcategories.map((subcategory, subcategoryIndex) => (
                <div key={subcategory.name}>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{subcategory.name}</h4>
                  <div className="space-y-3">
                    {subcategory.items.map((item, itemIndex) => {
                      const currentStatus = getItemStatus(categoryIndex, subcategoryIndex, itemIndex);
                      const currentRemarks = getItemRemarks(categoryIndex, subcategoryIndex, itemIndex);
                      const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;

                      return (
                        <div key={item} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item}</p>
                            <div className="flex space-x-2 mt-2">
                              <StatusButton
                                status="OK"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'OK')}
                                icon={CheckCircle}
                                label="OK"
                                color="green"
                              />
                              <StatusButton
                                status="ISSUE"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'ISSUE')}
                                icon={AlertCircle}
                                label="Issue"
                                color="yellow"
                              />
                              <StatusButton
                                status="HIGH_RISK"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'HIGH_RISK')}
                                icon={AlertTriangle}
                                label="High Risk"
                                color="red"
                              />
                              <StatusButton
                                status="NA"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'NA')}
                                icon={Clock}
                                label="N/A"
                                color="gray"
                              />
                            </div>
                            {(currentStatus === 'ISSUE' || currentStatus === 'HIGH_RISK') && (
                              <textarea
                                placeholder="Enter remarks about this issue..."
                                value={currentRemarks}
                                onChange={(e) => handleRemarksChange(itemId, e.target.value)}
                                className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                rows={3}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-6 flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Location Photos
        </h3>
        
        <div className="mb-6">
          <label className="btn-primary cursor-pointer inline-flex items-center px-4 py-2 rounded-lg">
            <Upload className="h-4 w-4 mr-2" />
            Upload Photos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Upload photos of your location, issues, or progress updates
          </p>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border dark:border-gray-600">
                <div className="relative mb-3">
                  <img
                    src={photo.preview}
                    alt="Location photo"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={photo.location}
                      onChange={(e) => updatePhoto(photo.id, { location: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder="e.g., Main Hall, Library, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={photo.description}
                      onChange={(e) => updatePhoto(photo.id, { description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      rows={2}
                      placeholder="Describe what this photo shows..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-6">Daily Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's going good today?
            </label>
            <textarea
              value={summary.goingGood}
              onChange={(e) => setSummary(prev => ({ ...prev, goingGood: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              rows={3}
              placeholder="List positive highlights..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's going wrong?
            </label>
            <textarea
              value={summary.goingWrong}
              onChange={(e) => setSummary(prev => ({ ...prev, goingWrong: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              rows={3}
              placeholder="List issues and challenges..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's at high risk?
            </label>
            <textarea
              value={summary.highRisk}
              onChange={(e) => setSummary(prev => ({ ...prev, highRisk: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              rows={3}
              placeholder="List high-risk items..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What needs immediate attention?
            </label>
            <textarea
              value={summary.immediateAttention}
              onChange={(e) => setSummary(prev => ({ ...prev, immediateAttention: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              rows={3}
              placeholder="List urgent action items..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Progress from last day
            </label>
            <textarea
              value={summary.progressFromLastDay}
              onChange={(e) => setSummary(prev => ({ ...prev, progressFromLastDay: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              rows={3}
              placeholder="Describe improvements and progress made..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}