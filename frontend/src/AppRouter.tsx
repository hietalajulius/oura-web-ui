import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const App = lazy(() => import('./App'));
const Success = lazy(() => import('./Success'));
const Error = lazy(() => import('./Error'));

const AppRouter = () => (
    <Router>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/success" component={Success} />
                <Route path="/error" component={Error} />
            </Switch>
        </Suspense>
    </Router>
);

export default AppRouter;