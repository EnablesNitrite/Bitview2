import { Tooltip } from '../ui/Tooltip';

export const InfoTooltip = ({ text }: { text: string }) => (
  <Tooltip
    content={<p className="leading-snug text-slate-200">{text}</p>}
  >
    <button
      type="button"
      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-600 text-[0.6rem] text-slate-300 bg-slate-900/60"
    >
      ?
    </button>
  </Tooltip>
);
