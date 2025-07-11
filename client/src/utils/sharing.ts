import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { ShareLink } from '../types';

export class SharingService {
  private static baseUrl = window.location.origin;

  static async generateShareLink(
    type: 'report' | 'dashboard' | 'analysis',
    resourceId: string,
    options: {
      expiresIn?: number; // hours
      maxAccess?: number;
      password?: string;
      createdBy: string;
    }
  ): Promise<ShareLink> {
    const shareId = uuidv4();
    const url = `${this.baseUrl}/shared/${type}/${shareId}`;
    
    const expiresAt = options.expiresIn 
      ? new Date(Date.now() + options.expiresIn * 60 * 60 * 1000)
      : undefined;

    const qrCode = await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#7F1D1D', // Maroon color
        light: '#FFFFFF'
      }
    });

    const shareLink: ShareLink = {
      id: shareId,
      url,
      qrCode,
      expiresAt,
      accessCount: 0,
      maxAccess: options.maxAccess,
      password: options.password,
      createdBy: options.createdBy,
      createdAt: new Date(),
      type
    };

    // Store in localStorage for demo (in production, this would be stored in backend)
    const existingLinks = this.getStoredLinks();
    existingLinks.push(shareLink);
    localStorage.setItem('shareLinks', JSON.stringify(existingLinks));

    return shareLink;
  }

  static getStoredLinks(): ShareLink[] {
    const stored = localStorage.getItem('shareLinks');
    return stored ? JSON.parse(stored) : [];
  }

  static validateShareLink(shareId: string, password?: string): ShareLink | null {
    const links = this.getStoredLinks();
    const link = links.find(l => l.id === shareId);

    if (!link) return null;

    // Check expiration
    if (link.expiresAt && new Date() > link.expiresAt) {
      return null;
    }

    // Check access limit
    if (link.maxAccess && link.accessCount >= link.maxAccess) {
      return null;
    }

    // Check password
    if (link.password && link.password !== password) {
      return null;
    }

    // Increment access count
    link.accessCount++;
    const updatedLinks = links.map(l => l.id === shareId ? link : l);
    localStorage.setItem('shareLinks', JSON.stringify(updatedLinks));

    return link;
  }

  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  static downloadQRCode(qrCode: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static shareViaEmail(shareLink: ShareLink, recipients: string[], message?: string): void {
    const subject = encodeURIComponent(`Shared ${shareLink.type} - NxtWave Operations`);
    const body = encodeURIComponent(`
${message || 'Please find the shared report below:'}

Access Link: ${shareLink.url}

${shareLink.password ? `Password: ${shareLink.password}` : ''}
${shareLink.expiresAt ? `Expires: ${shareLink.expiresAt.toLocaleString()}` : ''}

Best regards,
NxtWave Operations Team
    `);

    const mailtoUrl = `mailto:${recipients.join(',')}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  }

  static shareViaSMS(shareLink: ShareLink, phoneNumber: string): void {
    const message = encodeURIComponent(`NxtWave Operations Report: ${shareLink.url}`);
    const smsUrl = `sms:${phoneNumber}?body=${message}`;
    window.open(smsUrl);
  }

  static shareViaWhatsApp(shareLink: ShareLink, message?: string): void {
    const text = encodeURIComponent(`
${message || 'NxtWave Operations Report'}

${shareLink.url}

${shareLink.password ? `Password: ${shareLink.password}` : ''}
    `);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  }

  static generateEmbedCode(shareLink: ShareLink, width = 800, height = 600): string {
    return `<iframe src="${shareLink.url}" width="${width}" height="${height}" frameborder="0"></iframe>`;
  }
}