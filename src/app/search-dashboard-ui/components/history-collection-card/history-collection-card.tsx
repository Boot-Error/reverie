import { useDispatch } from 'react-redux';
import type { HistoryCollectionCard } from '../../../../common/history-collection-card/model';
import { historyCollectionBoardSagaActions } from '../../middleware/history-collection-board/history-collection-board.saga';
import { HistoryCollectionCardIcon } from '../history-collection-card-icon/history-collection-card-icon';

export interface HistoryCollectionCardProps {
  cardDetails: HistoryCollectionCard;
}

export function HistoryCollectionCardWidget(props: HistoryCollectionCardProps) {
  const cardTitle = props.cardDetails.cardTitle;
  const webPageDetails = props.cardDetails.webPageDetails;

  const themeIcon = props.cardDetails.theme.themeIcon;
  const primaryColor = props.cardDetails.theme.primaryColor;
  const accentColor = props.cardDetails.theme.accentColor;
  const textColor = props.cardDetails.theme.textColor;

  const dispatch = useDispatch();

  const links = webPageDetails
    .reduce(
      (acc, webPage): Array<[string, number]> => {
        const [_, count] = acc.find(
          ([domain, _]) => domain === webPage.domain,
        ) || [webPage.domain, 0];
        const rest = acc.filter(([domain, count]) => domain !== webPage.domain);
        return [...rest, [webPage.domain, count + 1]];
      },
      [] as Array<[string, number]>,
    )
    .map(([domain, count]) => (
      <span className="text-base text-slate-600">
        {count > 1 ? `${domain} +${count}` : `${domain}`}
      </span>
    ));

  const handleJumpBackIn = (collectionCard: string) => {
    dispatch(
      historyCollectionBoardSagaActions.openCollectionInTabGroup({
        collectionCard,
      }),
    );
  };
  return (
    <div
      className="w-full max-w-sm p-6 rounded-2xl font-sans"
      style={{
        backgroundColor: accentColor,
        borderColor: primaryColor,
        color: primaryColor,
        boxShadow: `4px 4px 0px ${primaryColor}`,
      }}
    >
      {/* Top Section: Icon and Title */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12  mr-4 shrink-0 flex items-center justify-center">
          <HistoryCollectionCardIcon
            iconName={themeIcon}
            iconColor={primaryColor}
          />
        </div>
        <h2 className="text-3xl font-medium" style={{ color: textColor }}>
          {cardTitle}
        </h2>
      </div>

      {/* Middle Section: Links */}
      <div className="pl-12 mb-10">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2">{links}</div>
      </div>

      {/* Bottom Section: Button */}
      <div className="flex justify-end">
        <button
          // className="px-4 py-2 text-sm font-medium text-slate-900 bg-lime-400 border-2 border-lime-600 rounded-lg shadow-[2px_2px_0px_theme(colors.lime.600)] hover:bg-lime-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          className="px-4 py-2 text-sm font-medium"
          style={{
            color: textColor,
            backgroundColor: accentColor,
            borderColor: primaryColor,
          }}
          onClick={() => handleJumpBackIn(cardTitle)}
        >
          Jump Back -&gt;
        </button>
      </div>
    </div>
  );
}
