import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { createStore, Store } from "redux";
import rootReducer, { RootState } from "./reducers";

const App = lazy(() => import("./App"));
const Success = lazy(() => import("./Success"));

class AppRouter extends React.PureComponent<{}> {
  public readonly store: Store<RootState>;
  constructor(props: any) {
    super(props);
    const devTools =
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__({
        name: "Health App"
      });
    this.store = createStore(rootReducer, devTools);
  }
  render() {
    return (
      <Provider store={this.store}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/" component={App} extraProp={true} />
              <Route path="/success" component={Success} />
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    );
  }
}

export default AppRouter;
