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
import type { FundingPoint } from '../../types/core';
import { formatPercent } from '../../utils/formatters';

interface Props {
  data: FundingPoint[];
  showCumulative?: boolean;
}

export const FundingLineChart = ({ data, showCumulative }: Props) => {
  const transformed = showCumulative
    ? data.map((d, idx) => ({
        ...d,
        cumulative: data.slice(0, idx + 1).reduce((acc, p) => acc + p.rate, 0)
      }))
    : data;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={transformed}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v) =>
            new Date(v).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
          stroke="#64748b"
          fontSize={10}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={(v) => formatPercent(v, 3)}
          stroke="#64748b"
          fontSize={10}
        />
        <ReTooltip
          formatter={(value: number) => formatPercent(value, 4)}
          labelFormatter={(v) =>
            new Date(v).toLocaleString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: 'short'
            })
          }
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
          dataKey={showCumulative ? 'cumulative' : 'rate'}
          name={showCumulative ? 'Cumulative funding' : 'Funding rate'}
          stroke="#22c55e"
          dot={false}
          strokeWidth={1.7}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
