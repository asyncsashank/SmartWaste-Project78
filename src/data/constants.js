// Centralized constants used across the demo data layer and UI.
// All data in this project is illustrative demo data and is NOT from real devices.

export const CITY = {
  name: 'Visakhapatnam',
  state: 'Andhra Pradesh',
  country: 'India',
  center: [17.6868, 83.2185],
  zoom: 12,
};

export const FILL_THRESHOLDS = {
  normal: 50, // below 50
  medium: 80, // 50-79
  high: 80, // 80+
};

export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const COLLECTION_STATUS = {
  PENDING: 'Pending',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue',
};

export const SENSOR_STATUS = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  WEAK: 'Weak Signal',
};

export const VEHICLE_STATUS = {
  ACTIVE: 'Active',
  IDLE: 'Idle',
  MAINTENANCE: 'Maintenance',
  OFFLINE: 'Offline',
};

// Fill-level helpers
export function fillBucket(pct) {
  if (pct >= FILL_THRESHOLDS.high) return 'high';
  if (pct >= FILL_THRESHOLDS.normal) return 'medium';
  return 'normal';
}

export function fillColor(pct) {
  const b = fillBucket(pct);
  if (b === 'high') return { bg: '#ef4444', text: 'text-danger-700', soft: 'bg-danger-50' };
  if (b === 'medium') return { bg: '#f97316', text: 'text-accent-700', soft: 'bg-accent-50' };
  return { bg: '#10b981', text: 'text-brand-700', soft: 'bg-brand-50' };
}

export function priorityColor(priority) {
  switch (priority) {
    case PRIORITY.CRITICAL:
      return { bg: '#dc2626', text: 'text-danger-700', soft: 'bg-danger-50' };
    case PRIORITY.HIGH:
      return { bg: '#ef4444', text: 'text-danger-700', soft: 'bg-danger-50' };
    case PRIORITY.MEDIUM:
      return { bg: '#f97316', text: 'text-accent-700', soft: 'bg-accent-50' };
    default:
      return { bg: '#10b981', text: 'text-brand-700', soft: 'bg-brand-50' };
  }
}
