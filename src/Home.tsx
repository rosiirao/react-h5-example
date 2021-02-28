import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import routers from './router';

export default function Home() {
  return (
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
  );
}
