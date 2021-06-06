import {Link, useLocation, matchPath} from 'react-router-dom';
import classNames from 'classnames';

type PageLocation = ReturnType<typeof useLocation> & {state: {page: number}};

export default function ViewLink(props: {
  path: string;
  label: string;
  linkClass?: string | Record<string, boolean> | Array<string>;
  replace?: boolean;
  exact?: boolean;
  strict?: boolean;
  others?: Record<string, unknown>;
}) {
  const {path, label} = props;
  return (
    <Link
      {...props.others}
      className={classNames('view-link', props.linkClass)}
      to={(l: PageLocation) =>
        matchPath(l.pathname, {path, exact: true}) === null
          ? {
              ...l,
              pathname: path,
              state: {...l.state, page: (l.state?.page ?? 0) + 1},
            }
          : l
      }
      replace={props.replace ?? false}
    >
      {label ?? path}
    </Link>
  );
}
