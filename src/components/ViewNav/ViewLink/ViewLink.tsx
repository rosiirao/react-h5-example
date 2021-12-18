import {Link, useLocation, matchPath} from 'react-router-dom';
import classNames from 'classnames';
import {useEffect, useState} from 'react';

// type PageLocation = ReturnType<typeof useLocation> & {state: {page: number}};

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

  const l = useLocation();

  const [linkTo, setLinkTo] = useState(l);

  useEffect(() => {
    if (
      matchPath({path, end: true, caseSensitive: true}, l.pathname) === null
    ) {
      const state = l.state as {page?: number};
      setLinkTo({
        ...l,
        hash: '#',
        pathname: path,
        state: {...state, page: (state?.page ?? 0) + 1},
      });
    }
  }, [l, path]);

  return (
    <Link
      {...props.others}
      className={classNames('view-link', props.linkClass)}
      to={linkTo}
      state={linkTo.state}
      replace={props.replace ?? false}
    >
      {label ?? path}
    </Link>
  );
}
