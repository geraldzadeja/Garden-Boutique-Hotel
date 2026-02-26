interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusClassMap: Record<string, string> = {
  confirmed: 'status-confirmed',
  pending: 'status-pending',
  cancelled: 'status-cancelled',
  'checked-in': 'status-checked-in',
  'checked-out': 'status-checked-out',
  completed: 'status-checked-out',
  no_show: 'status-cancelled',
  available: 'status-available',
  occupied: 'status-occupied',
  maintenance: 'status-maintenance',
  published: 'status-published',
  draft: 'status-draft',
  unread: 'status-unread',
  read: 'status-read',
  active: 'status-confirmed',
  inactive: 'status-draft',
  current: 'status-checked-in',
  upcoming: 'status-pending',
  past: 'status-draft',
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/[\s_]+/g, '-');
  const statusClass = statusClassMap[normalizedStatus] || statusClassMap[status.toLowerCase()] || 'status-draft';

  const displayLabel = status
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`status-badge ${statusClass} ${className}`}>
      {displayLabel}
    </span>
  );
}
