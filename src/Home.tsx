import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import routers from './router';

import ThemeSwitch from './components/ThemeSwitch';
import ThemeContext, {useTheme, Theme} from './components/ThemeContext';

import './Home.scss';

export default function Home() {
  const [mode, toggle] = useTheme();
  return (
    <ThemeContext.Provider value={[mode, toggle]}>
      <header>
        <ThemeSwitch
          on={mode === Theme.light}
          toggle={() => {
            toggle(mode);
          }}
        />
      </header>
      <main>
        <Router>
          <Route>
            <Switch>
              {routers.map(r => (
                <Route key={r.path} exact={!!r.exact} path={r.path}>
                  {r.component}
                </Route>
              ))}
            </Switch>
          </Route>
        </Router>
      </main>
    </ThemeContext.Provider>
  );
}
