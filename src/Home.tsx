import {BrowserRouter as Router, Route} from 'react-router-dom';
import routes from './router';

import ThemeSwitch from './components/ThemeSwitch';
import ThemeContext, {useTheme, Theme} from './components/ThemeContext';

import ViewTransition from './components/ViewTransition';
import Nav from './components/ViewNav';

import './Home.scss';

export default function Home() {
  const [mode, toggle] = useTheme();
  return (
    <ThemeContext.Provider value={[mode, toggle]}>
      <Router>
        <header>
          <ThemeSwitch
            on={mode === Theme.light}
            toggle={() => {
              toggle(mode);
            }}
          />
          <Nav horizontal={true} routes={routes} />
        </header>
        <main>
          {routes.map(r => (
            <Route key={r.path} exact={r.exact ?? false} path={r.path}>
              {({match}) => (
                <ViewTransition
                  match={match}
                  viewClass="view-root"
                  backAnimate={true}
                >
                  {typeof r.component === 'function' ? (
                    <r.component />
                  ) : (
                    r.component
                  )}
                </ViewTransition>
              )}
            </Route>
          ))}
        </main>
      </Router>
    </ThemeContext.Provider>
  );
}
