import { DailyReport, Center, Analytics } from '../types';

export class AnalyticsService {
  static calculateHealthScore(report: DailyReport): number {
    if (!report.items.length) return 100;
    
    const weights = {
      OK: 1,
      ISSUE: 0.7,
      HIGH_RISK: 0.3,
      NA: 0.9
    };

    const totalWeight = report.items.reduce((sum, item) => {
      return sum + weights[item.status];
    }, 0);

    return Math.round((totalWeight / report.items.length) * 100);
  }

  static calculateTrend(currentScore: number, previousScore: number): 'IMPROVING' | 'DECLINING' | 'STABLE' {
    const difference = currentScore - previousScore;
    if (difference > 5) return 'IMPROVING';
    if (difference < -5) return 'DECLINING';
    return 'STABLE';
  }

  static calculateRiskLevel(report: DailyReport): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const highRiskCount = report.items.filter(item => item.status === 'HIGH_RISK').length;
    const issueCount = report.items.filter(item => item.status === 'ISSUE').length;
    const totalItems = report.items.length;

    if (totalItems === 0) return 'LOW';

    const riskRatio = (highRiskCount * 2 + issueCount) / totalItems;

    if (riskRatio > 0.5) return 'CRITICAL';
    if (riskRatio > 0.3) return 'HIGH';
    if (riskRatio > 0.1) return 'MEDIUM';
    return 'LOW';
  }

  static generatePredictions(reports: DailyReport[]): Analytics['predictions'] {
    // Simple prediction algorithm based on trends
    const recentReports = reports.slice(-7); // Last 7 reports
    const avgIssues = recentReports.reduce((sum, report) => {
      return sum + report.items.filter(item => item.status === 'ISSUE' || item.status === 'HIGH_RISK').length;
    }, 0) / recentReports.length;

    const maintenanceItems = recentReports.flatMap(report => 
      report.items.filter(item => 
        item.category === 'Infrastructure' && 
        (item.status === 'ISSUE' || item.status === 'HIGH_RISK')
      ).map(item => item.item)
    );

    const uniqueMaintenanceItems = [...new Set(maintenanceItems)];

    return {
      nextWeekIssues: Math.ceil(avgIssues * 1.1), // 10% increase prediction
      maintenanceNeeded: uniqueMaintenanceItems.slice(0, 5),
      riskAreas: this.identifyRiskAreas(recentReports)
    };
  }

  private static identifyRiskAreas(reports: DailyReport[]): string[] {
    const categoryIssues: Record<string, number> = {};

    reports.forEach(report => {
      report.items.forEach(item => {
        if (item.status === 'ISSUE' || item.status === 'HIGH_RISK') {
          categoryIssues[item.category] = (categoryIssues[item.category] || 0) + 1;
        }
      });
    });

    return Object.entries(categoryIssues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  static calculateEfficiency(report: DailyReport): number {
    const totalItems = report.items.length;
    const completedItems = report.items.filter(item => item.status === 'OK').length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;
  }

  static calculateCompliance(report: DailyReport): number {
    // Compliance based on critical areas being OK
    const criticalCategories = ['Hygiene & Cleanliness', 'Infrastructure'];
    const criticalItems = report.items.filter(item => 
      criticalCategories.includes(item.category)
    );
    
    if (criticalItems.length === 0) return 100;
    
    const compliantItems = criticalItems.filter(item => 
      item.status === 'OK' || item.status === 'NA'
    );
    
    return Math.round((compliantItems.length / criticalItems.length) * 100);
  }

  static generateBenchmarks(): Analytics['benchmarks'] {
    // Industry benchmarks (would come from external data in production)
    return {
      industryAverage: 78,
      topPerformer: 95,
      improvement: 12 // Percentage improvement over last quarter
    };
  }

  static exportAnalytics(analytics: Analytics, format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(analytics, null, 2);
    }

    // CSV format
    const csvData = [
      ['Center ID', 'Health Score', 'Trend', 'Risk Level', 'Efficiency', 'Compliance'],
      ...analytics.centerPerformance.map(center => [
        center.centerId,
        center.healthScore.toString(),
        center.trend,
        center.riskLevel,
        center.efficiency.toString(),
        center.compliance.toString()
      ])
    ];

    return csvData.map(row => row.join(',')).join('\n');
  }

  static calculateROI(improvements: number, costs: number): number {
    if (costs === 0) return 0;
    return Math.round(((improvements - costs) / costs) * 100);
  }

  static generateInsights(analytics: Analytics): string[] {
    const insights: string[] = [];

    // Performance insights
    const avgHealth = analytics.centerPerformance.reduce((sum, center) => 
      sum + center.healthScore, 0) / analytics.centerPerformance.length;

    if (avgHealth > 90) {
      insights.push('Excellent overall performance across all centers');
    } else if (avgHealth > 75) {
      insights.push('Good performance with room for improvement');
    } else {
      insights.push('Performance needs attention - consider immediate action');
    }

    // Risk insights
    const highRiskCenters = analytics.centerPerformance.filter(center => 
      center.riskLevel === 'HIGH' || center.riskLevel === 'CRITICAL'
    ).length;

    if (highRiskCenters > 0) {
      insights.push(`${highRiskCenters} center(s) require immediate attention`);
    }

    // Trend insights
    const improvingCenters = analytics.centerPerformance.filter(center => 
      center.trend === 'IMPROVING'
    ).length;

    if (improvingCenters > analytics.centerPerformance.length / 2) {
      insights.push('Positive trend - majority of centers are improving');
    }

    return insights;
  }
}