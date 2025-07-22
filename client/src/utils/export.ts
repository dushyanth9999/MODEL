import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DailyReport, WeeklyReport, ExportOptions, Center } from '../types';

export class ExportService {
  static async exportToExcel(
    data: DailyReport[] | WeeklyReport[],
    centers: Center[],
    options: ExportOptions
  ): Promise<void> {
    const wb = XLSX.utils.book_new();

    // Enhanced Excel export with multiple sheets and formatting
    if (data.length > 0 && 'items' in data[0]) {
      // Daily reports
      this.addDailyReportsToWorkbook(wb, data as DailyReport[], centers, options);
    } else {
      // Weekly reports
      this.addWeeklyReportsToWorkbook(wb, data as WeeklyReport[], centers, options);
    }

    // Add metadata sheet
    this.addMetadataSheet(wb, options);

    const filename = `operations_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  private static addMetadataSheet(wb: XLSX.WorkBook, options: ExportOptions): void {
    const metadataData = [
      ['NIAT Operations Report - Export Metadata'],
      [''],
      ['Export Details'],
      ['Generated On', new Date().toLocaleString()],
      ['Export Format', options.format],
      ['Include Charts', options.includeCharts ? 'Yes' : 'No'],
      ['Include Photos', options.includePhotos ? 'Yes' : 'No'],
      [''],
      ['System Information'],
      ['Application Version', '2.0.0'],
      ['Database', 'PostgreSQL'],
      ['Export Engine', 'SheetJS + jsPDF'],
      [''],
      ['Contact Information'],
      ['Support Email', 'support@niat.edu'],
      ['Dashboard URL', window.location.origin]
    ];

    const metadataWS = XLSX.utils.aoa_to_sheet(metadataData);
    XLSX.utils.book_append_sheet(wb, metadataWS, 'Metadata');
  }

  // Enhanced PDF export with better formatting
  static async exportToPDF(
    elementId: string,
    filename: string,
    options: {
      orientation?: 'portrait' | 'landscape';
      format?: 'a4' | 'letter';
      includeCharts?: boolean;
      includeHeader?: boolean;
      includeFooter?: boolean;
    } = {}
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Enhanced PDF generation with better quality
    const canvas = await html2canvas(element, {
      scale: 3, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    // Add header if requested
    if (options.includeHeader !== false) {
      pdf.setFontSize(16);
      pdf.setTextColor(185, 28, 28); // NIAT red
      pdf.text('NIAT Operations Dashboard', 20, 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${new Date().toLocaleString()}`, 20, 30);
    }

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = options.includeHeader !== false ? 40 : 0; // Account for header

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      
      // Add header to subsequent pages
      if (options.includeHeader !== false) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('NIAT Operations Dashboard', 20, 15);
      }
      
      pdf.addImage(imgData, 'PNG', 0, position + (options.includeHeader !== false ? 20 : 0), imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Add footer if requested
    if (options.includeFooter !== false) {
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${pageCount}`, 190, 285);
        pdf.text('NIAT Operations Dashboard', 20, 285);
      }
    }

    pdf.save(filename);
  }

  // Enhanced CSV export with better formatting
  static exportToCSV(data: any[], filename: string, options?: { 
    includeTimestamp?: boolean;
    customHeaders?: string[];
  }): void {
    if (data.length === 0) return;

    let headers = options?.customHeaders || Object.keys(data[0]);
    
    // Add timestamp column if requested
    if (options?.includeTimestamp) {
      headers.push('Export Timestamp');
      data = data.map(row => ({
        ...row,
        'Export Timestamp': new Date().toISOString()
      }));
    }

    const csvContent = [
      // Add header row with NIAT branding
      ['NIAT Operations Dashboard - Data Export'],
      [`Generated: ${new Date().toLocaleString()}`],
      [''],
      headers,
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        })
      )
    ].map(row => Array.isArray(row) ? row.join(',') : row).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // New: Export to multiple formats simultaneously
  static async exportToMultipleFormats(
    data: any,
    baseName: string,
    formats: ('excel' | 'pdf' | 'csv' | 'json')[]
  ): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0];
    
    for (const format of formats) {
      const filename = `${baseName}_${timestamp}.${format === 'excel' ? 'xlsx' : format}`;
      
      switch (format) {
        case 'excel':
          if (Array.isArray(data)) {
            await this.exportToExcel(data, [], { format: 'excel', includeCharts: true, includePhotos: false });
          }
          break;
        case 'csv':
          if (Array.isArray(data)) {
            this.exportToCSV(data, filename, { includeTimestamp: true });
          }
          break;
        case 'json':
          this.exportToJSON(data, filename);
          break;
        case 'pdf':
          // Would need element ID for PDF export
          console.log('PDF export requires element ID');
          break;
      }
    }
  }

    centers: Center[],
    options: ExportOptions
  ): Promise<void> {
    const wb = XLSX.utils.book_new();

    if (data.length > 0 && 'items' in data[0]) {
      // Daily reports
      this.addDailyReportsToWorkbook(wb, data as DailyReport[], centers, options);
    } else {
      // Weekly reports
      this.addWeeklyReportsToWorkbook(wb, data as WeeklyReport[], centers, options);
    }

    const filename = `operations_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  private static addDailyReportsToWorkbook(
    wb: XLSX.WorkBook,
    reports: DailyReport[],
    centers: Center[],
    options: ExportOptions
  ): void {
    // Summary sheet
    const summaryData = [
      ['Daily Operations Report Summary'],
      [`Generated: ${new Date().toLocaleString()}`],
      [''],
      ['Center', 'Date', 'Status', 'Health Score', 'Issues', 'High Risk', 'Submitted By'],
      ...reports.map(report => {
        const center = centers.find(c => c.id === report.centerId);
        const healthScore = this.calculateHealthScore(report);
        const issues = report.items.filter(item => item.status === 'ISSUE').length;
        const highRisk = report.items.filter(item => item.status === 'HIGH_RISK').length;
        
        return [
          center?.name || 'Unknown',
          report.date.toLocaleDateString(),
          report.status,
          `${healthScore}%`,
          issues,
          highRisk,
          report.submittedBy
        ];
      })
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');

    // Detailed items sheet
    const itemsData = [
      ['Detailed Items Report'],
      [''],
      ['Center', 'Date', 'Category', 'Subcategory', 'Item', 'Status', 'Remarks', 'Responsible Person']
    ];

    reports.forEach(report => {
      const center = centers.find(c => c.id === report.centerId);
      report.items.forEach(item => {
        itemsData.push([
          center?.name || 'Unknown',
          report.date.toLocaleDateString(),
          item.category,
          item.subcategory,
          item.item,
          item.status,
          item.remarks,
          item.responsiblePerson
        ]);
      });
    });

    const itemsWS = XLSX.utils.aoa_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(wb, itemsWS, 'Detailed Items');

    // Issues analysis sheet
    this.addIssuesAnalysisSheet(wb, reports, centers);
  }

  private static addWeeklyReportsToWorkbook(
    wb: XLSX.WorkBook,
    reports: WeeklyReport[],
    centers: Center[],
    options: ExportOptions
  ): void {
    // Weekly summary
    const weeklyData = [
      ['Weekly Operations Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [''],
      ['Week Start', 'Week End', 'Centers', 'Total Items', 'OK Items', 'Issues', 'High Risk'],
      ...reports.map(report => [
        report.weekStart.toLocaleDateString(),
        report.weekEnd.toLocaleDateString(),
        report.centers.length,
        report.aggregatedData.totalItems,
        report.aggregatedData.okItems,
        report.aggregatedData.issueItems,
        report.aggregatedData.highRiskItems
      ])
    ];

    const weeklyWS = XLSX.utils.aoa_to_sheet(weeklyData);
    XLSX.utils.book_append_sheet(wb, weeklyWS, 'Weekly Summary');

    // Trends analysis
    const trendsData = [
      ['Trends Analysis'],
      [''],
      ['Trend Type', 'Items'],
      ['Improving', reports[0]?.trends.improving.join(', ') || ''],
      ['Declining', reports[0]?.trends.declining.join(', ') || ''],
      ['Stable', reports[0]?.trends.stable.join(', ') || '']
    ];

    const trendsWS = XLSX.utils.aoa_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(wb, trendsWS, 'Trends');
  }

  private static addIssuesAnalysisSheet(
    wb: XLSX.WorkBook,
    reports: DailyReport[],
    centers: Center[]
  ): void {
    const issuesData = [
      ['Issues Analysis'],
      [''],
      ['Category', 'Total Issues', 'High Risk', 'Most Affected Center', 'Trend']
    ];

    const categoryAnalysis = this.analyzeIssuesByCategory(reports, centers);
    
    Object.entries(categoryAnalysis).forEach(([category, analysis]) => {
      issuesData.push([
        category,
        analysis.totalIssues,
        analysis.highRisk,
        analysis.mostAffectedCenter,
        analysis.trend
      ]);
    });

    const issuesWS = XLSX.utils.aoa_to_sheet(issuesData);
    XLSX.utils.book_append_sheet(wb, issuesWS, 'Issues Analysis');
  }

  static async exportToPDF(
    elementId: string,
    filename: string,
    options: {
      orientation?: 'portrait' | 'landscape';
      format?: 'a4' | 'letter';
      includeCharts?: boolean;
    } = {}
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  }

  static exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static exportToJSON(data: any, filename: string): void {
    // Enhanced JSON export with metadata
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '2.0.0',
        source: 'NIAT Operations Dashboard',
        recordCount: Array.isArray(data) ? data.length : 1
      },
      data: data
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static calculateHealthScore(report: DailyReport): number {
    if (!report.items.length) return 100;
    
    const okItems = report.items.filter(item => item.status === 'OK').length;
    return Math.round((okItems / report.items.length) * 100);
  }

  private static analyzeIssuesByCategory(
    reports: DailyReport[],
    centers: Center[]
  ): Record<string, any> {
    const analysis: Record<string, any> = {};

    reports.forEach(report => {
      report.items.forEach(item => {
        if (item.status === 'ISSUE' || item.status === 'HIGH_RISK') {
          if (!analysis[item.category]) {
            analysis[item.category] = {
              totalIssues: 0,
              highRisk: 0,
              centerCounts: {},
              trend: 'STABLE'
            };
          }

          analysis[item.category].totalIssues++;
          if (item.status === 'HIGH_RISK') {
            analysis[item.category].highRisk++;
          }

          const center = centers.find(c => c.id === report.centerId);
          if (center) {
            analysis[item.category].centerCounts[center.name] = 
              (analysis[item.category].centerCounts[center.name] || 0) + 1;
          }
        }
      });
    });

    // Find most affected center for each category
    Object.keys(analysis).forEach(category => {
      const centerCounts = analysis[category].centerCounts;
      const mostAffected = Object.entries(centerCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0];
      
      analysis[category].mostAffectedCenter = mostAffected ? mostAffected[0] : 'N/A';
    });

    return analysis;
  }

  static async generateReportPreview(
    data: DailyReport[] | WeeklyReport[],
    centers: Center[]
  ): Promise<string> {
    // Generate HTML preview for reports
    const isDaily = data.length > 0 && 'items' in data[0];
    
    if (isDaily) {
      return this.generateDailyReportPreview(data as DailyReport[], centers);
    } else {
      return this.generateWeeklyReportPreview(data as WeeklyReport[], centers);
    }
  }

  private static generateDailyReportPreview(
    reports: DailyReport[],
    centers: Center[]
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #7F1D1D;">Daily Operations Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        
        <h2>Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 8px;">Center</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Health Score</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Issues</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(report => {
              const center = centers.find(c => c.id === report.centerId);
              const healthScore = this.calculateHealthScore(report);
              const issues = report.items.filter(item => item.status === 'ISSUE' || item.status === 'HIGH_RISK').length;
              
              return `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${center?.name || 'Unknown'}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${healthScore}%</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${issues}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private static generateWeeklyReportPreview(
    reports: WeeklyReport[],
    centers: Center[]
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #7F1D1D;">Weekly Operations Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        
        <h2>Weekly Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 8px;">Week</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Centers</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Total Items</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Health %</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(report => {
              const healthPercent = report.aggregatedData.totalItems > 0 
                ? Math.round((report.aggregatedData.okItems / report.aggregatedData.totalItems) * 100)
                : 100;
              
              return `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    ${report.weekStart.toLocaleDateString()} - ${report.weekEnd.toLocaleDateString()}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.centers.length}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.aggregatedData.totalItems}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${healthPercent}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}