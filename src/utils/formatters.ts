export const formatPercent = (value: number, digits = 2): string =>
  `${(value * 100).toFixed(digits)}%`;

export const formatSignedPercent = (value: number, digits = 2): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(digits)}%`;
};

export const formatNumber = (value: number, digits = 0): string =>
  value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  });
