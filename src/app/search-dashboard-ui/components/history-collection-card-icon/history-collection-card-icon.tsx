import { _ as lo } from 'lodash';
import {
  BaselineChat,
  BaselineCollectionsBookmark,
  BaselineMovieFilter,
  BaselineSchool,
  BaselineShoppingCart,
  BaselineWork,
  RoundPalette,
  TwotoneManageSearch,
} from './card-icons';

export interface HistoryCollectionCardIconProps {
  iconName: string;
  iconColor: string;
}

export function HistoryCollectionCardIcon(
  props: HistoryCollectionCardIconProps,
) {
  const iconName = props.iconName;
  const iconColor = props.iconColor;
  const defaultIcon = icons['default'];
  const iconComponent = lo.get(icons, [iconName], defaultIcon);

  return <div style={{ color: iconColor }}>{iconComponent}</div>;
}

const icons = {
  search: <TwotoneManageSearch />,
  movie: <BaselineMovieFilter />,
  shopping_cart: <BaselineShoppingCart />,
  chat: <BaselineChat />,
  school: <BaselineSchool />,
  work: <BaselineWork />,
  palette: <RoundPalette />,
  default: <BaselineCollectionsBookmark />,
};
