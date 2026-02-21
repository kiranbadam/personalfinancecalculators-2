import { ChartTheme } from '@/types';

export const chartTheme: ChartTheme = {
  gold: '#D4A853',
  green: '#4ADE80',
  red: '#F87171',
  blue: '#60A5FA',
  purple: '#C084FC',
  muted: '#52525B',
  grid: 'rgba(255, 255, 255, 0.04)',
  text: '#71717A',
};

export const chartColors = {
  principal: '#D4A853',
  interest: '#60A5FA',
  tax: '#C084FC',
  insurance: '#4ADE80',
  pmi: '#F87171',
  hoa: '#FB923C',
  contributions: '#60A5FA',
  earnings: '#D4A853',
  accumulation: '#4ADE80',
  retirement: '#D4A853',
  profit: '#4ADE80',
  loss: '#F87171',
};

export const defaultTooltipStyle = {
  contentStyle: {
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#FAFAFA',
    backdropFilter: 'blur(8px)',
  },
  itemStyle: {
    color: '#A1A1AA',
    fontSize: '11px',
    padding: '1px 0',
  },
  labelStyle: {
    color: '#FAFAFA',
    fontWeight: 600,
    fontSize: '12px',
    marginBottom: '4px',
  },
};
