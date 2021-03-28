import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import routers from './router';

import ThemeSwitch from './components/ThemeSwitch';
import ThemeContext, {Theme, toggle} from './components/ThemeContext';
import {useContext, useState} from 'react';

export default function Home() {
  const t = useContext(ThemeContext);
  const [mode, setMode] = useState(t);
  return (
    <ThemeContext.Provider value={t}>
      <ThemeSwitch
        on={mode === Theme.light}
        toggle={() => {
          setMode(prevMode => toggle(prevMode));
        }}
      />
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
    </ThemeContext.Provider>
  );
}
