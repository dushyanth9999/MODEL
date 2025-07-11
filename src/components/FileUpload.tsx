import React, { useState, useCallback } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Filter, 
  Building2,
  Search,
  Calendar,
  Trash2,
  Eye,
  RefreshCw,
  Share2,
  Mail,
  FileText,
  BarChart3,
  Camera,
  Image,
  X,
  Plus,
  AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { centers, reportCategories } from '../data/mockData';
import { ReportItem, DailyReport } from '../types';

interface FileUploadProps {
  onBack: () => void;
}

interface AttentionPhoto {
  id: string;
  file: File;
  preview: string;
  description: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
}

interface ParsedReportData {
  centerId: string;
  area: string;
  items: ReportItem[];
  summary: {
    goingGood: string[];
    goingWrong: string[];
    highRisk: string[];
    immediateAttention: string[];
    progressFromLastDay: string;
  };
  uploadDate: Date;
  fileName: string;
  attentionPhotos: AttentionPhoto[];
}

const reportAreas = [
  'Hygiene & Cleanliness',
  'Infrastructure', 
  'Academics & Operations',
  'Campus Life',
  'Curriculum',
  'Adherence Report',
  'Feedback'
];

export default function FileUpload({ onBack }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedReports, setParsedReports] = useState<ParsedReportData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'upload' | 'history'>('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [attentionPhotos, setAttentionPhotos] = useState<AttentionPhoto[]>([]);
  const [newPhoto, setNewPhoto] = useState<{
    description: string;
    category: string;
    severity: 'high' | 'medium' | 'low';
    location: string;
  }>({
    description: '',
    category: '',
    severity: 'medium',
    location: ''
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const photo: AttentionPhoto = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              file,
              preview: event.target?.result as string,
              description: newPhoto.description,
              category: newPhoto.category,
              severity: newPhoto.severity,
              location: newPhoto.location
            };
            setAttentionPhotos(prev => [...prev, photo]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removePhoto = (photoId: string) => {
    setAttentionPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleFiles = async (files: File[]) => {
    const excelFiles = files.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (excelFiles.length === 0) {
      setErrors(['Please upload Excel files (.xlsx or .xls)']);
      return;
    }

    if (excelFiles.length > 10) {
      setErrors(['Maximum 10 files can be uploaded at once']);
      return;
    }

    setUploadedFiles(prev => [...prev, ...excelFiles]);
    setIsProcessing(true);
    setErrors([]);

    try {
      const reports: ParsedReportData[] = [];
      
      for (const file of excelFiles) {
        const report = await parseExcelFile(file);
        if (report) {
          reports.push(report);
        }
      }
      
      setParsedReports(prev => [...prev, ...reports]);
    } catch (error) {
      setErrors([`Error processing files: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseExcelFile = async (file: File): Promise<ParsedReportData | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const report = parseReportData(jsonData as any[][], file.name);
          resolve(report);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseReportData = (data: any[][], fileName: string): ParsedReportData | null => {
    try {
      const fileNameParts = fileName.replace('.xlsx', '').replace('.xls', '').split('_');
      const centerName = fileNameParts[0] || 'Unknown';
      const areaName = fileNameParts[1] || 'General';
      
      const center = centers.find(c => 
        c.name.toLowerCase().includes(centerName.toLowerCase()) ||
        centerName.toLowerCase().includes(c.name.toLowerCase())
      ) || centers[0];

      const items: ReportItem[] = [];
      let currentCategory = '';
      let currentSubcategory = '';

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        if (row[0] && typeof row[0] === 'string' && !row[1] && !row[2]) {
          currentCategory = row[0].trim();
          continue;
        }

        if (row[1] && typeof row[1] === 'string' && row[2] && row[3]) {
          currentSubcategory = row[1].trim();
          
          const item: ReportItem = {
            id: `${center.id}-${i}-${Date.now()}`,
            category: currentCategory,
            subcategory: currentSubcategory,
            item: row[2]?.toString().trim() || '',
            status: parseStatus(row[3]?.toString().trim()),
            remarks: row[4]?.toString().trim() || '',
            responsiblePerson: row[5]?.toString().trim() || 'Not specified',
            timestamp: new Date(),
            centerId: center.id
          };

          if (item.item) {
            items.push(item);
          }
        }
      }

      const summary = {
        goingGood: ['Data imported from Excel file'],
        goingWrong: items.filter(item => item.status === 'ISSUE').map(item => item.item),
        highRisk: items.filter(item => item.status === 'HIGH_RISK').map(item => item.item),
        immediateAttention: items.filter(item => item.status === 'HIGH_RISK' && item.remarks).map(item => item.item),
        progressFromLastDay: 'Imported from Excel file'
      };

      return {
        centerId: center.id,
        area: areaName,
        items,
        summary,
        uploadDate: new Date(),
        fileName,
        attentionPhotos: []
      };
    } catch (error) {
      console.error('Error parsing report data:', error);
      return null;
    }
  };

  const parseStatus = (statusStr: string): ReportItem['status'] => {
    if (!statusStr) return 'OK';
    const status = statusStr.toUpperCase().trim();
    if (status === 'ISSUE' || status === 'ISSUES') return 'ISSUE';
    if (status === 'HIGH_RISK' || status === 'HIGH RISK' || status === 'HIGHRISK') return 'HIGH_RISK';
    if (status === 'NA' || status === 'N/A') return 'NA';
    return 'OK';
  };

  const handleSubmitReports = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call with photos
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting reports:', parsedReports);
      console.log('Submitting attention photos:', attentionPhotos);
      alert(`Successfully processed ${parsedReports.length} reports with ${attentionPhotos.length} attention photos!`);
      
      setUploadedFiles([]);
      setParsedReports([]);
      setAttentionPhotos([]);
      setErrors([]);
    } catch (error) {
      setErrors(['Failed to submit reports. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = (area?: string) => {
    const templateData = [
      [`Daily Operations Report Template - ${area || 'General'}`],
      [''],
      ['Instructions:'],
      ['1. Fill in the Status column with: OK, ISSUE, HIGH_RISK, or NA'],
      ['2. Add remarks for any issues or high-risk items'],
      ['3. Save the file with format: CenterName_AreaName_Date.xlsx'],
      ['4. Upload photos separately for items requiring immediate attention'],
      [''],
    ];

    if (area && area !== 'all') {
      const areaCategories = reportCategories.filter(cat => 
        area === 'all' || cat.name === area
      );

      areaCategories.forEach(category => {
        templateData.push([category.name]);
        templateData.push(['', 'Subcategory', 'Item', 'Status', 'Remarks', 'Responsible Person']);
        
        category.subcategories.forEach(subcategory => {
          subcategory.items.forEach(item => {
            templateData.push(['', subcategory.name, item, 'OK', '', 'Team Member']);
          });
        });
        templateData.push(['']);
      });
    } else {
      templateData.push(['Category']);
      templateData.push(['', 'Subcategory', 'Item', 'Status', 'Remarks', 'Responsible Person']);
      templateData.push(['', 'Example Subcategory', 'Example Item', 'OK', '', 'Team Member']);
    }

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Report Template');
    
    const filename = area && area !== 'all' 
      ? `daily_report_template_${area.replace(/\s+/g, '_').toLowerCase()}.xlsx`
      : 'daily_report_template_general.xlsx';
    
    XLSX.writeFile(wb, filename);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setParsedReports(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setParsedReports([]);
    setAttentionPhotos([]);
    setErrors([]);
  };

  const exportReportSummary = () => {
    const summaryData = [
      ['Upload Summary Report'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['File Name', 'Center', 'Area', 'Total Items', 'OK Items', 'Issues', 'High Risk', 'Photos', 'Upload Date'],
      ...parsedReports.map(report => {
        const center = centers.find(c => c.id === report.centerId);
        const okItems = report.items.filter(item => item.status === 'OK').length;
        const issueItems = report.items.filter(item => item.status === 'ISSUE').length;
        const highRiskItems = report.items.filter(item => item.status === 'HIGH_RISK').length;
        const photoCount = attentionPhotos.filter(photo => photo.category === report.area).length;
        
        return [
          report.fileName,
          center?.name || 'Unknown',
          report.area,
          report.items.length,
          okItems,
          issueItems,
          highRiskItems,
          photoCount,
          report.uploadDate.toLocaleString()
        ];
      })
    ];

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Upload Summary');
    
    XLSX.writeFile(wb, `upload_summary_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filter reports based on selected filters
  const filteredReports = parsedReports.filter(report => {
    const centerMatch = selectedCenter === 'all' || report.centerId === selectedCenter;
    const areaMatch = selectedArea === 'all' || report.area.toLowerCase().includes(selectedArea.toLowerCase());
    const searchMatch = searchTerm === '' || 
      report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centers.find(c => c.id === report.centerId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return centerMatch && areaMatch && searchMatch;
  });

  const PhotoUploadModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-2xl w-full mx-4 border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Attention Photos</h3>
          <button
            onClick={() => setShowPhotoUpload(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Photo Upload Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newPhoto.category}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Category</option>
                {reportAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Severity Level
              </label>
              <select
                value={newPhoto.severity}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, severity: e.target.value as 'high' | 'medium' | 'low' }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location/Area
              </label>
              <input
                type="text"
                value={newPhoto.location}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Classroom 101, Main Lobby, Cafeteria"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newPhoto.description}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the issue that needs attention..."
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Photo Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload Photos</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Take photos of issues that need immediate attention
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoInput}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Photos</span>
            </label>
          </div>

          {/* Uploaded Photos Grid */}
          {attentionPhotos.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Uploaded Photos ({attentionPhotos.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {attentionPhotos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.preview}
                      alt={photo.description}
                      className="w-full h-32 object-cover rounded-lg border dark:border-gray-600"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        photo.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        photo.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {photo.severity.toUpperCase()}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {photo.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowPhotoUpload(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Daily Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Upload Excel files and photos for comprehensive reporting</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPhotoUpload(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Camera className="h-4 w-4" />
            <span>Add Photos</span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'upload' ? 'history' : 'upload')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            {viewMode === 'upload' ? <FileText className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            <span>{viewMode === 'upload' ? 'View History' : 'Upload Files'}</span>
          </button>
          {parsedReports.length > 0 && (
            <button
              onClick={exportReportSummary}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Export Summary</span>
            </button>
          )}
        </div>
      </div>

      {/* Attention Photos Summary */}
      {attentionPhotos.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">Attention Photos Uploaded</h3>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                {attentionPhotos.length} photos
              </span>
            </div>
            <button
              onClick={() => setShowPhotoUpload(true)}
              className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
            >
              View All Photos
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {attentionPhotos.slice(0, 4).map(photo => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.preview}
                  alt={photo.description}
                  className="w-full h-20 object-cover rounded-lg border dark:border-gray-600"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  photo.severity === 'high' ? 'bg-red-600 text-white' :
                  photo.severity === 'medium' ? 'bg-yellow-600 text-white' :
                  'bg-green-600 text-white'
                }`}>
                  {photo.severity.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
          {attentionPhotos.length > 4 && (
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
              +{attentionPhotos.length - 4} more photos
            </p>
          )}
        </div>
      )}

      {viewMode === 'upload' ? (
        <>
          {/* Template Download Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Download Templates</h3>
              <button
                onClick={() => downloadTemplate(selectedArea)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {reportAreas.map(area => (
                <button
                  key={area}
                  onClick={() => downloadTemplate(area)}
                  className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                >
                  <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800 dark:text-blue-200">{area}</span>
                </button>
              ))}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Enhanced Reporting Process</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>1. Download and fill Excel templates with operational data</p>
                <p>2. Upload photos for any items requiring immediate attention</p>
                <p>3. Submit comprehensive reports with visual evidence</p>
                <p className="font-medium">File naming: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">CenterName_AreaName_Date.xlsx</code></p>
              </div>
            </div>
          </div>

          {/* Enhanced Upload Area */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Upload Excel Files
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your Excel files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Supports .xlsx and .xls files • Maximum 10 files • Up to 10MB each
              </p>
              <input
                type="file"
                multiple
                accept=".xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2 font-medium"
              >
                <Upload className="h-5 w-5" />
                <span>Choose Files</span>
              </label>
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                <div>
                  <span className="text-blue-800 dark:text-blue-200 font-medium">Processing files...</span>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Parsing Excel data and validating content</p>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-800 dark:text-red-200">Upload Errors</h4>
              </div>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <button
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB • Uploaded {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Upload History View */
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload History</h3>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>Upload history feature would be implemented with backend integration</p>
            <p className="text-sm">This would show previously uploaded files and their processing status</p>
          </div>
        </div>
      )}

      {/* Filters for Parsed Reports */}
      {parsedReports.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Reports:</span>
            </div>
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search files..."
                  className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Centers</option>
                {centers.map(center => (
                  <option key={center.id} value={center.id}>{center.name}</option>
                ))}
              </select>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Areas</option>
                {reportAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Parsed Reports Preview */}
      {filteredReports.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Parsed Reports ({filteredReports.length})
            </h3>
            <button
              onClick={handleSubmitReports}
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              <span>{isSubmitting ? 'Submitting...' : `Submit All Reports${attentionPhotos.length > 0 ? ` + ${attentionPhotos.length} Photos` : ''}`}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report, index) => {
              const center = centers.find(c => c.id === report.centerId);
              const okItems = report.items.filter(item => item.status === 'OK').length;
              const issueItems = report.items.filter(item => item.status === 'ISSUE').length;
              const highRiskItems = report.items.filter(item => item.status === 'HIGH_RISK').length;
              const healthScore = report.items.length > 0 ? Math.round((okItems / report.items.length) * 100) : 0;
              const relatedPhotos = attentionPhotos.filter(photo => photo.category === report.area);
              
              return (
                <div key={index} className="border dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {center?.name || 'Unknown Center'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {report.area} • {report.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        healthScore >= 90 ? 'text-green-600' :
                        healthScore >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {healthScore}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Health Score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{okItems}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">OK</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">{issueItems}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">{highRiskItems}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">High Risk</div>
                    </div>
                  </div>

                  {/* Photos Section */}
                  {relatedPhotos.length > 0 && (
                    <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <Camera className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                          {relatedPhotos.length} Attention Photos
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {relatedPhotos.slice(0, 3).map(photo => (
                          <img
                            key={photo.id}
                            src={photo.preview}
                            alt={photo.description}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ))}
                        {relatedPhotos.length > 3 && (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                            +{relatedPhotos.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Total Items: {report.items.length}</span>
                    <span>Categories: {[...new Set(report.items.map(item => item.category))].length}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Uploaded: {report.uploadDate.toLocaleString()}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && <PhotoUploadModal />}
    </div>
  );
}