import { clsx } from 'clsx';

const statusStyles = {
  verified: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  unverified: 'bg-red-100 text-red-800',
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 font-medium';
  const sizeStyles = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <span className={clsx(
      baseStyles,
      sizeStyles,
      statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
    )}>
      {status}
    </span>
  );
} 