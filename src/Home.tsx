import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import routes from './router';

import ThemeSwitch from './components/ThemeSwitch';
import ThemeContext, {useTheme, Theme} from './components/ThemeContext';

// import ViewTransition from './components/ViewTransition';
import Nav from './components/ViewNav';

import './Home.scss';
import {useEffect} from 'react';

export default function Home() {
  const [mode, toggle] = useTheme();
  useEffect(() => {
    const currentScheme = document.body.getAttribute('color-scheme');
    if (mode === Theme[currentScheme as keyof typeof Theme]) return;
    if (mode === undefined) {
      document.body.removeAttribute('color-scheme');
      return;
    }
    document.body.setAttribute('color-scheme', Theme[mode]);
  }, [mode]);

  const theme = mode !== undefined ? Theme[mode] : 'auto';
  return (
    <ThemeContext.Provider value={[mode, toggle]}>
      <Router basename={process.env.PUBLIC_URL}>
        <header color-scheme="dark">
          <Nav horizontal={true} routes={routes}>
            <ThemeSwitch
              theme={theme}
              toggle={() => {
                toggle(mode);
              }}
            />
          </Nav>
        </header>
        <main>
          <Routes>
            {routes.map(r => (
              <Route
                key={r.path}
                {...(r.exact ? {caseSensitive: true} : {})}
                path={r.path}
                // element={
                //   <ViewTransition
                //     viewClass="view-root"
                //     backAnimate={true}
                //     path={r.path}
                //   >
                //     {typeof r.component === 'function' ? (
                //       <r.component />
                //     ) : (
                //       r.component
                //     )}
                //   </ViewTransition>
                // }
                element={
                  typeof r.component === 'function' ? (
                    <r.component />
                  ) : (
                    r.component
                  )
                }
              ></Route>
            ))}
          </Routes>
        </main>
      </Router>
    </ThemeContext.Provider>
  );
}
