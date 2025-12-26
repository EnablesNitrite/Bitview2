import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';
import type { VolatilityPoint } from '../../types/core';

interface Props {
  data: VolatilityPoint[];
}

export const VolatilityChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v) =>
            new Date(v).toLocaleDateString(undefined, {
              day: '2-digit',
              month: 'short'
            })
          }
          stroke="#64748b"
          fontSize={10}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          stroke="#64748b"
          fontSize={10}
        />
        <ReTooltip
          labelFormatter={(v) =>
            new Date(v).toLocaleDateString(undefined, {
              weekday: 'short',
              day: '2-digit',
              month: 'short'
            })
          }
          formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
          contentStyle={{
            background: '#020617',
            borderRadius: 12,
            border: '1px solid #1e293b',
            padding: 10
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="realizedVol"
          name="Realized volatility"
          stroke="#38bdf8"
          dot={false}
          strokeWidth={1.7}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
