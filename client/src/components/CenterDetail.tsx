import React from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, AlertCircle, Clock, User, MapPin } from 'lucide-react';
import { centers, mockReports } from '../data/mockData';

interface CenterDetailProps {
  centerId: string;
  onBack: () => void;
}

export default function CenterDetail({ centerId, onBack }: CenterDetailProps) {
  const center = centers.find(c => c.id === centerId);
  const report = mockReports.find(r => r.centerId === centerId);

  if (!center) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Center not found</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ISSUE':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'HIGH_RISK':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'NA':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ISSUE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH_RISK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NA':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Group items by category
  const itemsByCategory = report?.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {};
    }
    if (!acc[item.category][item.subcategory]) {
      acc[item.category][item.subcategory] = [];
    }
    acc[item.category][item.subcategory].push(item);
    return acc;
  }, {} as Record<string, Record<string, any[]>>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{center.name}</h1>
          <div className="flex items-center space-x-4 text-gray-600 mt-1">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{center.location}</span>
            </div>
            {report && (
              <div className="text-sm">
                Last updated: {report.submittedAt.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Chief of Staff (COS)</p>
              <p className="font-medium text-gray-900">{center.cos}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Project Manager</p>
              <p className="font-medium text-gray-900">{center.pm}</p>
            </div>
          </div>
        </div>
      </div>

      {!report ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Submitted</h3>
          <p className="text-gray-600">This center hasn't submitted today's report yet.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          {(report.summary.immediateAttention.length > 0 || report.summary.highRisk.length > 0 || report.summary.goingWrong.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.summary.immediateAttention.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Immediate Attention</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {report.summary.immediateAttention.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {report.summary.highRisk.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">High Risk</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {report.summary.highRisk.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {report.summary.goingWrong.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Issues</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {report.summary.goingWrong.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Positive Updates */}
          {(report.summary.goingGood.length > 0 || report.summary.progressFromLastDay) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-medium text-green-800 mb-4">Positive Updates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.summary.goingGood.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-green-700 mb-2">Going Well</h5>
                    <ul className="text-sm text-green-600 space-y-1">
                      {report.summary.goingGood.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {report.summary.progressFromLastDay && (
                  <div>
                    <h5 className="text-sm font-medium text-green-700 mb-2">Progress Made</h5>
                    <p className="text-sm text-green-600">{report.summary.progressFromLastDay}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Report Items */}
          <div className="space-y-6">
            {Object.entries(itemsByCategory).map(([category, subcategories]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                </div>
                <div className="p-6 space-y-6">
                  {Object.entries(subcategories).map(([subcategory, items]) => (
                    <div key={subcategory}>
                      <h4 className="font-medium text-gray-800 mb-3">{subcategory}</h4>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(item.status)}
                                <span className="text-sm font-medium text-gray-900">{item.item}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                  {item.status === 'HIGH_RISK' ? 'High Risk' : 
                                   item.status === 'ISSUE' ? 'Issue' :
                                   item.status === 'NA' ? 'N/A' : 'OK'}
                                </span>
                              </div>
                              {item.remarks && (
                                <p className="text-sm text-gray-600 mt-2 ml-6">{item.remarks}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1 ml-6">
                                Responsible: {item.responsiblePerson}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}