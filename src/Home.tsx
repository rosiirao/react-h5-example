import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";
import FlexBox from "./pages/FlexBox";
import Transform from "./pages/Transform";

export default function Home() {
  return (
    <Router>
      <Route>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/flex-box">
            <FlexBox></FlexBox>
          </Route>
          <Route path="/transform">
            <Transform />
          </Route>
        </Switch>
      </Route>
    </Router>
  );
}
