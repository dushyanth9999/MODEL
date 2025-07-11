import React, { useState, useEffect } from 'react';
import { 
  X, 
  Link, 
  QrCode, 
  Mail, 
  MessageSquare, 
  Copy, 
  Download,
  Settings,
  Clock,
  Shield,
  Users,
  Eye,
  Share2
} from 'lucide-react';
import { SharingService } from '../utils/sharing';
import { ShareLink } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'report' | 'dashboard' | 'analysis';
  resourceId: string;
  title: string;
  createdBy: string;
}

export default function ShareModal({ 
  isOpen, 
  onClose, 
  type, 
  resourceId, 
  title, 
  createdBy 
}: ShareModalProps) {
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState({
    expiresIn: 24, // hours
    maxAccess: 0, // 0 = unlimited
    password: '',
    requirePassword: false
  });
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    if (isOpen && !shareLink) {
      generateShareLink();
    }
  }, [isOpen]);

  const generateShareLink = async () => {
    setIsGenerating(true);
    try {
      const link = await SharingService.generateShareLink(type, resourceId, {
        expiresIn: options.expiresIn,
        maxAccess: options.maxAccess || undefined,
        password: options.requirePassword ? options.password : undefined,
        createdBy
      });
      setShareLink(link);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;
    
    const success = await SharingService.copyToClipboard(shareLink.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!shareLink) return;
    SharingService.downloadQRCode(shareLink.qrCode, `${type}-qr-${shareLink.id}.png`);
  };

  const handleEmailShare = () => {
    if (!shareLink || !emailRecipients) return;
    
    const recipients = emailRecipients.split(',').map(email => email.trim());
    SharingService.shareViaEmail(shareLink, recipients, emailMessage);
  };

  const handleWhatsAppShare = () => {
    if (!shareLink) return;
    SharingService.shareViaWhatsApp(shareLink, `Check out this ${type}: ${title}`);
  };

  const regenerateLink = () => {
    setShareLink(null);
    generateShareLink();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Share {type}</h3>
            <p className="text-gray-600 text-sm mt-1">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isGenerating ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating share link...</p>
          </div>
        ) : shareLink ? (
          <div className="space-y-6">
            {/* Share Link Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>Share Link</span>
                </h4>
                <button
                  onClick={regenerateLink}
                  className="text-maroon-600 hover:text-maroon-700 text-sm font-medium"
                >
                  Regenerate
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={shareLink.url}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    copied 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-maroon-600 text-white hover:bg-maroon-700'
                  }`}
                >
                  {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{shareLink.accessCount} views</span>
                </div>
                {shareLink.expiresAt && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Expires {shareLink.expiresAt.toLocaleDateString()}</span>
                  </div>
                )}
                {shareLink.password && (
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Password protected</span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </h4>
              <div className="flex items-center space-x-4">
                <img 
                  src={shareLink.qrCode} 
                  alt="QR Code" 
                  className="w-24 h-24 border border-gray-200 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    Scan this QR code to quickly access the shared content on mobile devices.
                  </p>
                  <button
                    onClick={handleDownloadQR}
                    className="bg-maroon-600 text-white px-4 py-2 rounded text-sm hover:bg-maroon-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download QR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Share Options */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Quick Share</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Email Share Section */}
            {showAdvanced && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Email Share</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipients (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      placeholder="email1@example.com, email2@example.com"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (optional)
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Add a personal message..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={handleEmailShare}
                    disabled={!emailRecipients.trim()}
                    className="w-full bg-maroon-600 text-white py-2 px-4 rounded hover:bg-maroon-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Advanced Settings</span>
                </h4>
                <span className="text-gray-400">
                  {showAdvanced ? '−' : '+'}
                </span>
              </button>
              
              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires in (hours)
                    </label>
                    <select
                      value={options.expiresIn}
                      onChange={(e) => setOptions(prev => ({ ...prev, expiresIn: Number(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value={1}>1 hour</option>
                      <option value={24}>24 hours</option>
                      <option value={168}>1 week</option>
                      <option value={720}>1 month</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum access count (0 = unlimited)
                    </label>
                    <input
                      type="number"
                      value={options.maxAccess}
                      onChange={(e) => setOptions(prev => ({ ...prev, maxAccess: Number(e.target.value) }))}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={options.requirePassword}
                        onChange={(e) => setOptions(prev => ({ ...prev, requirePassword: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">Require password</span>
                    </label>
                    {options.requirePassword && (
                      <input
                        type="password"
                        value={options.password}
                        onChange={(e) => setOptions(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        className="w-full p-2 border border-gray-300 rounded text-sm mt-2"
                      />
                    )}
                  </div>
                  
                  <button
                    onClick={regenerateLink}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                  >
                    Apply Settings & Regenerate
                  </button>
                </div>
              )}
            </div>

            {/* Embed Code */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Embed Code</h4>
              <textarea
                value={SharingService.generateEmbedCode(shareLink)}
                readOnly
                rows={3}
                className="w-full p-2 border border-gray-300 rounded text-sm bg-white font-mono"
              />
              <p className="text-xs text-gray-600 mt-2">
                Copy this code to embed the shared content in your website or application.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Failed to generate share link. Please try again.</p>
            <button
              onClick={generateShareLink}
              className="mt-4 bg-maroon-600 text-white px-4 py-2 rounded hover:bg-maroon-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}