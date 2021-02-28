import App from './App';
import FlexBox from './pages/FlexBox';
import Transform from './pages/Transform';
import WheelScroll from './pages/WheelScroll';

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
];

export default routers;
