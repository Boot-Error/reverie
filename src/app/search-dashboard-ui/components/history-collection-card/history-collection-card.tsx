import type { HistoryCollectionCard } from '../../../../common/history-collection-card/model';

export interface HistoryCollectionCardProps {
  cardDetails: HistoryCollectionCard;
}

export function HistoryCollectionCardWidget(props: HistoryCollectionCardProps) {
  const cardTitle = props.cardDetails.cardTitle;
  const themeIcon = props.cardDetails.themeIcon;

  const handleJumpBackIn = () => {};
  return (
    <div className="w-full max-w-sm p-6 bg-white border-2 border-purple-700 rounded-2xl font-sans shadow-[4px_4px_0px_theme(colors.purple.700)]">
      {/* Top Section: Icon and Title */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-purple-700 mr-4 shrink-0 flex items-center justify-center">
          <p className="text-lg">{themeIcon}</p>
        </div>
        <h2 className="text-xl font-medium text-slate-900">{cardTitle}</h2>
      </div>

      {/* Middle Section: Links */}
      <div className="pl-12 mb-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <span className="text-base text-slate-600">myntra.com</span>
          <span className="text-base text-slate-600">nykaa.com</span>
          <span className="text-base text-slate-600">tatacliq.com</span>
        </div>
      </div>

      {/* Bottom Section: Button */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 text-sm font-medium text-slate-900 bg-lime-400 border-2 border-lime-600 rounded-lg shadow-[2px_2px_0px_theme(colors.lime.600)] hover:bg-lime-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          onClick={handleJumpBackIn}
        >
          Jump Back -&gt;
        </button>
      </div>
    </div>
  );
}
