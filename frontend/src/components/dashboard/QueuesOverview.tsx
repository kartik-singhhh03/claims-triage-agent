import './QueuesOverview.css';

interface Queue {
  id: string;
  name: string;
  count: number;
  avgTriageTime: number;
  severity?: 'high' | 'medium' | 'low';
}

interface QueuesOverviewProps {
  queues: Queue[];
  onQueueClick?: (queueId: string) => void;
  isLoading?: boolean;
}

export default function QueuesOverview({
  queues,
  onQueueClick,
  isLoading = false,
}: QueuesOverviewProps) {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#00ff00';
      default:
        return 'var(--neon-purple)';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  if (isLoading) {
    return (
      <div className="queues-overview">
        <h2 className="queues-title">Queues Overview</h2>
        <div className="queues-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="queue-card glass-effect loading">
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-value"></div>
                <div className="skeleton-bar"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="queues-overview">
      <h2 className="queues-title">Queues Overview</h2>
      <div className="queues-grid">
        {queues.map((queue) => (
          <button
            key={queue.id}
            className="queue-card glass-effect"
            onClick={() => onQueueClick?.(queue.id)}
            title={`${queue.name} - ${queue.count} claims`}
            aria-label={`${queue.name} queue with ${queue.count} claims, average triage time ${formatTime(queue.avgTriageTime)}`}
          >
            <div className="queue-header">
              <h3 className="queue-name">{queue.name}</h3>
              <div className="queue-badge" style={{ backgroundColor: getSeverityColor(queue.severity) }}>
                {queue.count}
              </div>
            </div>
            <div className="queue-stats">
              <div className="stat-item">
                <span className="stat-label">Avg. Triage</span>
                <span className="stat-value">{formatTime(queue.avgTriageTime)}</span>
              </div>
              <div className="activity-bar">
                <div
                  className="activity-fill"
                  style={{
                    width: `${Math.min(100, (queue.count / 50) * 100)}%`,
                    backgroundColor: getSeverityColor(queue.severity),
                  }}
                ></div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
