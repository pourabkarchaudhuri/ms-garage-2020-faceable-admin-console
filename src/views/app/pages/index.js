import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';


const ThumbList = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './thumb-list')
);

const EventList = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './events')
);

const ApproveDeny = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './approveDeny')
);

const Pages = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/wfh`} />
      <Route
        path={`${match.url}/wfh`}
        render={props => <ThumbList {...props} />}
      />
      <Route
        path={`${match.url}/events`}
        render={props => <EventList {...props} />}
      />
      <Route
        path={`${match.url}/approvedeny`}
        render={props => <ApproveDeny {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Pages;
