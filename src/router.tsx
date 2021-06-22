import App from './App';
import FlexBox from './pages/FlexBox';
import Transform from './pages/Transform';
import WheelScroll from './pages/WheelScroll';
import DragToSort from './pages/DragToSort';
import ErrorHandle from './pages/ErrorHandle';
import Toast from './pages/Toast';
import TouchPtrBox from './pages/TouchPtrBox';
import QRUtil from './pages/QRUtil';

const routers = [
  {
    exact: true,
    path: '/',
    component: () => <App />,
  },
  {
    exact: true,
    path: '/index.html',
    component: () => <App />,
  },
  {
    path: '/flex-box',
    label: '/flex-box',
    component: <FlexBox />,
  },
  {
    path: '/transform',
    component: <Transform />,
  },
  {
    path: '/wheel-scroll',
    component: <WheelScroll />,
  },
  {
    path: '/drag-to-sort',
    component: <DragToSort />,
  },
  {
    path: '/error-handle',
    component: () => <ErrorHandle />,
  },
  {
    path: '/toast',
    component: () => <Toast />,
  },
  {
    path: '/qr',
    component: () => <QRUtil />,
  },
  {
    path: '/touch-pull-to-refresh',
    component: () => <TouchPtrBox />,
  },
];

export default routers;
