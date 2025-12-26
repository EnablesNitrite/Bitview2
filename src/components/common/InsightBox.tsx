import type { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface Props {
  title: string;
  children: ReactNode;
}

export const InsightBox = ({ title, children }: Props) => (
  <Card className="bg-slate-900/80 border-emerald-500/20">
    <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-300 mb-1.5">
      {title}
    </h4>
    <p className="text-xs text-slate-300 leading-relaxed">{children}</p>
  </Card>
);
