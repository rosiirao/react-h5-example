import App from './App';
import FlexBox from './pages/FlexBox';
import Transform from './pages/Transform';
import WheelScroll from './pages/WheelScroll';
import DragToSort from './pages/DragToSort';
import ErrorHandle from './pages/ErrorHandle';
import Toast from './pages/Toast';

const routers = [
  {
    exact: true,
    path: '/',
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
];

export default routers;
