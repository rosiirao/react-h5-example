import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";
import FlexBox from "./pages/FlexBox";

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
        </Switch>
      </Route>
    </Router>
  );
}
