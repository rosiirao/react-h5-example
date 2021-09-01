import classNames from 'classnames';
import {matchPath, useLocation} from 'react-router-dom';
import ViewLink from './ViewLink';

import './ViewNav.scss';

/**
 * set location.state.page number, and ViewTransition determine animating next page by the number
 */
export default function ViewNav(
  props: React.PropsWithChildren<{
    horizontal?: boolean;
    routes: {path: string; label?: string}[];
    navClass?: string | Array<string> | Record<string, boolean>;
    linkClass?: string | Array<string> | Record<string, boolean>;
    linkOthers?: Record<string, unknown>;
  }>
) {
  const {horizontal = false, routes, children} = props;
  const location = useLocation();

  return (
    <nav
      id="view-nav"
      className={classNames(
        'view-nav',
        {'view-nav--horizontal': horizontal},
        props.navClass
      )}
    >
      {children}
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
      <button
        className="view-nav__collapse"
        onClick={() => document.location.assign(location.pathname + '#')}
      ></button>
      {/* <a href="#" className="view-nav__collapse"></a> */}
      <a href="#view-nav" className="view-nav__more">
        ...
      </a>
    </nav>
  );
}
