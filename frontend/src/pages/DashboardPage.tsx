import { useState, useEffect } from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import QueuesOverview from '../components/dashboard/QueuesOverview';
import LiveFeed from '../components/dashboard/LiveFeed';
import ClaimDetailSection from '../components/claims/ClaimDetailSection';
import { useClaims } from '../hooks/useClaims';
import { useToast } from '../contexts/ToastContext';
import './DashboardPage.css';

interface KpiMetrics {
  totalClaims: number;
  inProgress: number;
  highSeverity: number;
  fraudAlerts: number;
}

interface Queue {
  id: string;
  name: string;
  count: number;
  avgTriageTime: number;
  severity?: 'high' | 'medium' | 'low';
}

interface FeedEvent {
  id: string;
  type: 'claim_created' | 'claim_updated' | 'claim_resolved' | 'fraud_detected' | 'reassigned';
  title: string;
  description?: string;
  timestamp: Date;
  claimId?: string;
  severity?: 'high' | 'medium' | 'low';
}

interface DashboardPageProps {
  claimId?: string;
}

export default function DashboardPage({ claimId }: DashboardPageProps) {
  const { fetchClaimDetails, isLoading: isClaimLoading, claimData } = useClaims();
  const { addToast } = useToast();
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

  const [metrics, setMetrics] = useState<KpiMetrics>({
    totalClaims: 2451,
    inProgress: 185,
    highSeverity: 12,
    fraudAlerts: 8,
  });

  useEffect(() => {
    if (claimId) {
      fetchClaimDetails(claimId).then((data) => {
        if (data) {
          setSelectedClaim(data);
          addToast('Claim details loaded successfully', 'success');
        } else {
          addToast('Failed to load claim details', 'error');
        }
      });
    }
  }, [claimId, fetchClaimDetails, addToast]);

  const [queues, setQueues] = useState<Queue[]>([
    {
      id: 'urgent',
      name: 'Urgent',
      count: 12,
      avgTriageTime: 120,
      severity: 'high',
    },
    {
      id: 'standard',
      name: 'Standard',
      count: 98,
      avgTriageTime: 600,
      severity: 'medium',
    },
    {
      id: 'auto-approved',
      name: 'Auto-Approved',
      count: 75,
      avgTriageTime: 30,
      severity: 'low',
    },
    {
      id: 'review',
      name: 'Under Review',
      count: 23,
      avgTriageTime: 1800,
      severity: 'high',
    },
  ]);

  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([
    {
      id: '1',
      type: 'fraud_detected',
      title: 'Fraud Alert: Claim #2451',
      description: 'Duplicate claim detected',
      timestamp: new Date(Date.now() - 2 * 60000),
      claimId: '2451',
      severity: 'high',
    },
    {
      id: '2',
      type: 'claim_created',
      title: 'New Claim: Vehicle Damage',
      description: 'Submitted by A. Sharma',
      timestamp: new Date(Date.now() - 5 * 60000),
      claimId: '2450',
      severity: 'medium',
    },
    {
      id: '3',
      type: 'claim_resolved',
      title: 'Claim #2449 Resolved',
      description: 'Approved for payment',
      timestamp: new Date(Date.now() - 12 * 60000),
      claimId: '2449',
      severity: 'low',
    },
    {
      id: '4',
      type: 'reassigned',
      title: 'Claim #2448 Reassigned',
      description: 'Routed to senior adjuster',
      timestamp: new Date(Date.now() - 25 * 60000),
      claimId: '2448',
      severity: 'high',
    },
    {
      id: '5',
      type: 'claim_updated',
      title: 'Claim #2447 Updated',
      description: 'Additional documents received',
      timestamp: new Date(Date.now() - 45 * 60000),
      claimId: '2447',
      severity: 'medium',
    },
  ]);

  const [isLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        totalClaims: prev.totalClaims + Math.floor(Math.random() * 5),
        inProgress: Math.max(
          0,
          prev.inProgress + Math.floor(Math.random() * 3 - 1)
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleKpiClick = (kpiType: string) => {
    console.log(`Navigating to claims with filter: ${kpiType}`);
  };

  const handleQueueClick = (queueId: string) => {
    console.log(`Navigating to queue: ${queueId}`);
  };

  const handleFeedClick = (claimId: string) => {
    console.log(`Opening claim detail: ${claimId}`);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="time-selector">
          <button
            className={`time-btn ${timeRange === 'today' ? 'active' : ''}`}
            onClick={() => setTimeRange('today')}
          >
            Today
          </button>
          <button
            className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button
            className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Claims"
          value={metrics.totalClaims}
          icon="��"
          colorTheme="purple"
          onClick={() => handleKpiClick('total')}
          isLoading={isLoading}
          delta="+12 today"
        />
        <KpiCard
          title="In Progress"
          value={metrics.inProgress}
          icon="⏳"
          colorTheme="blue"
          onClick={() => handleKpiClick('inProgress')}
          isLoading={isLoading}
          delta="+3 from yesterday"
        />
        <KpiCard
          title="High Severity"
          value={metrics.highSeverity}
          icon="🚨"
          colorTheme="pink"
          onClick={() => handleKpiClick('highSeverity')}
          isLoading={isLoading}
          delta="2 new"
        />
        <KpiCard
          title="Fraud Alerts"
          value={metrics.fraudAlerts}
          icon="🛡️"
          colorTheme="green"
          onClick={() => handleKpiClick('fraudAlerts')}
          isLoading={isLoading}
          delta="+1 this hour"
        />
      </div>

      {/* Queues and Live Feed Section */}
      <div className="dashboard-content">
        <div className="content-left">
          <QueuesOverview
            queues={queues}
            onQueueClick={handleQueueClick}
            isLoading={isLoading}
          />
        </div>
        <div className="content-right">
          <LiveFeed
            events={feedEvents}
            onEventClick={handleFeedClick}
            isLoading={isLoading}
            maxItems={10}
          />
        </div>
      </div>
    </div>
  );
}
