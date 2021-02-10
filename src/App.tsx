import logo from "./logo.svg";
import "./App.scss";
import router from './router';
import { Link } from 'react-router-dom';

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
        <nav style={{ textAlign: 'left' }}>
          <ul>
            {
              router.filter(({ path }) => path !== '/').map(({ path, label }) => (
                <li>
                  <Link className="App-link" to={path}>{label ?? path}</Link>
                </li>
              ))
            }
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default App;
