import { useSelector } from 'react-redux';
import { appSliceSelectors } from '../../middleware/app/app.slice';
import { AppPages } from '../../constants/app-pages.constant';
import { HomePage } from '../home-page/home-page';

export interface PageManagerProps {}

export function PageManagerWidget(props: PageManagerProps) {
  const currentPage = useSelector(appSliceSelectors.getCurrentPage);

  return <div>{currentPage === AppPages.HOME && <HomePage />}</div>;
}
