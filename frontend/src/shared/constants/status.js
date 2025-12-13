export const STATUS_COLORS = {
  Delivered: '#4caf50',
  'In Transit': '#2196f3',
  Processing: '#ff9800',
  default: '#9e9e9e',
};

export const STATUS_ICONS = {
  Delivered: '✓',
  'In Transit': '🚚',
  Processing: '⏳',
  default: '📦',
};

export const getStatusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS.default;
export const getStatusIcon = (status) => STATUS_ICONS[status] || STATUS_ICONS.default;

