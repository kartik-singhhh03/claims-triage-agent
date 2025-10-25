import './Badge.css';

type BadgeVariant = 'severity' | 'fraud' | 'status' | 'default';
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
type StatusType = 'active' | 'inactive' | 'pending' | 'resolved';

interface BadgeProps {
  variant?: BadgeVariant;
  severity?: SeverityLevel;
  status?: StatusType;
  value?: number | string;
  label?: string;
  icon?: string;
  className?: string;
}

export default function Badge({
  variant = 'default',
  severity,
  status,
  value,
  label,
  icon,
  className = '',
}: BadgeProps) {
  const getBackgroundColor = () => {
    if (variant === 'severity' && severity) {
      switch (severity) {
        case 'critical':
          return '#ff0000';
        case 'high':
          return '#ff4444';
        case 'medium':
          return '#ffaa00';
        case 'low':
          return '#00ff00';
      }
    }

    if (variant === 'fraud' && value) {
      const numValue = typeof value === 'number' ? value : parseInt(value);
      if (numValue >= 80) return '#ff0000';
      if (numValue >= 60) return '#ff6600';
      if (numValue >= 40) return '#ffaa00';
      if (numValue >= 20) return '#ffff00';
      return '#00ff00';
    }

    if (variant === 'status' && status) {
      switch (status) {
        case 'active':
          return '#00ff00';
        case 'inactive':
          return '#666666';
        case 'pending':
          return '#ffaa00';
        case 'resolved':
          return '#00d9ff';
      }
    }

    return 'var(--neon-purple)';
  };

  const getText = () => {
    if (label) return label;
    if (variant === 'fraud' && value !== undefined) return `${value}%`;
    if (severity) return severity.charAt(0).toUpperCase() + severity.slice(1);
    if (status) return status.charAt(0).toUpperCase() + status.slice(1);
    return 'Badge';
  };

  const bgColor = getBackgroundColor();

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        backgroundColor: bgColor,
        boxShadow: `0 0 10px ${bgColor}`,
      }}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {getText()}
    </span>
  );
}
