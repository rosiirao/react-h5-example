import logo from './logo.svg';
import routes from './router';
import {Link} from 'react-router-dom';

import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <h2>Demo list</h2>
        <ul style={{textAlign: 'left'}}>
          {routes
            .filter(({path}) => path !== '/')
            .map(({path, label}) => (
              <li key={path}>
                <Link to={path}>{label ?? path}</Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
