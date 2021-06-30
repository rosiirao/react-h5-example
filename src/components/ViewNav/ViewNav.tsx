import classNames from 'classnames';
import {matchPath, useLocation} from 'react-router-dom';
import ViewLink from './ViewLink';

import './ViewNav.scss';

/**
 * set location.state.page number, and ViewTransition determine animating next page by the number
 */
export default function ViewNav(props: {
  horizontal?: boolean;
  routes: {path: string; label?: string}[];
  navClass?: string | Array<string> | Record<string, boolean>;
  linkClass?: string | Array<string> | Record<string, boolean>;
  linkOthers?: Record<string, unknown>;
}) {
  const {horizontal = false, routes} = props;
  const location = useLocation();

  return (
    <nav
      className={classNames(
        'view-nav',
        {'view-nav--horizontal': horizontal},
        props.navClass
      )}
    >
      <ul>
        {routes
          .filter(({path}) => path !== '/')
          .map(({path, label}) => (
            <li key={path}>
              <ViewLink
                others={{
                  ...props.linkOthers,
                }}
                replace={
                  matchPath(location.pathname, {path, exact: true}) !== null
                }
                linkClass={props.linkClass}
                path={path}
                label={label ?? path.replace(/^\//, '')}
              ></ViewLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
