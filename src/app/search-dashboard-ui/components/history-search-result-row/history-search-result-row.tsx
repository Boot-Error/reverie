import type { HistorySearchResult } from '../../middleware/history-search/history-search.model';

export interface HistorySearchResultRowProps {
  searchResult: HistorySearchResult;
}

export function HistorySearchResultRow(props: HistorySearchResultRowProps) {
  const title = props.searchResult.navigateUrl;
  const url = props.searchResult.navigateUrl;
  const description = props.searchResult.contentSummary;
  const boldText = props.searchResult.highlightText;

  // highlight the boldText if it exists
  const renderDescription = () => {
    if (!boldText || !description.includes(boldText)) return description;

    const [before, after] = description.split(boldText);
    return (
      <>
        {before}
        <span className="font-semibold text-gray-800 ">{boldText}</span>
        {after}
      </>
    );
  };

  return (
    <div className="flex items-center justify-between w-full p-8 border-b border-gray-200  hover:bg-gray-50  transition-colors duration-200">
      <div className="flex flex-col">
        <a
          className="text-lg font-semibold text-gray-400  mb-1"
          target="_blank"
          href={title}
        >
          {title}
        </a>
        <p className=" text-sm text-gray-700 wrap-break-word whitespace-pre-wrap ">
          {renderDescription()}
        </p>
      </div>
      <button
        onClick={() => window.open(url, '_blank')}
        className="p-2 rounded-full  hover:bg-gray-300 transition-colors duration-200"
        aria-label="Open link"
      >
        <BaselineArrowOutward className="w-5 h-5 text-gray-600 mx-3" />
      </button>
    </div>
  );
}

export function BaselineArrowOutward(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6 6v2h8.59L5 17.59L6.41 19L16 9.41V18h2V6z"
      ></path>
    </svg>
  );
}
