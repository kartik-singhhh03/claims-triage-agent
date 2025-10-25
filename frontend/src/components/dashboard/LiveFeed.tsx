import './LiveFeed.css';

interface FeedEvent {
  id: string;
  type: 'claim_created' | 'claim_updated' | 'claim_resolved' | 'fraud_detected' | 'reassigned';
  title: string;
  description?: string;
  timestamp: Date;
  claimId?: string;
  severity?: 'high' | 'medium' | 'low';
}

interface LiveFeedProps {
  events: FeedEvent[];
  onEventClick?: (claimId: string) => void;
  isLoading?: boolean;
  maxItems?: number;
}

export default function LiveFeed({
  events,
  onEventClick,
  isLoading = false,
  maxItems = 10,
}: LiveFeedProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'claim_created':
        return '✨';
      case 'claim_updated':
        return '📝';
      case 'claim_resolved':
        return '✅';
      case 'fraud_detected':
        return '🚨';
      case 'reassigned':
        return '👤';
      default:
        return '📌';
    }
  };

  const getEventColor = (severity?: string) => {
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

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const visibleEvents = events.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className="live-feed">
        <h2 className="feed-title">Live Feed</h2>
        <div className="feed-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="feed-item loading">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-time"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="live-feed">
      <h2 className="feed-title">Live Feed</h2>
      {visibleEvents.length === 0 ? (
        <div className="feed-empty">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No events yet</div>
        </div>
      ) : (
        <div className="feed-list">
          {visibleEvents.map((event, index) => (
            <button
              key={event.id}
              className={`feed-item ${event.claimId ? 'clickable' : ''}`}
              onClick={() => event.claimId && onEventClick?.(event.claimId)}
              title={event.description}
              aria-label={`${event.title} - ${formatTime(event.timestamp)}`}
            >
              <div
                className="feed-icon"
                style={{ color: getEventColor(event.severity) }}
              >
                {getEventIcon(event.type)}
              </div>
              <div className="feed-content">
                <div className="feed-item-title">{event.title}</div>
                {event.description && (
                  <div className="feed-description">{event.description}</div>
                )}
                <div className="feed-time">{formatTime(event.timestamp)}</div>
              </div>
              {index === 0 && <div className="feed-new-badge">NEW</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
