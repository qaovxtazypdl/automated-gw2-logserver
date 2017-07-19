import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'

import PageRoot from './PageRoot.jsx';
import PageNotFound from './PageNotFound.jsx';

import css from './__style__/index.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/404' component={PageNotFound} />

          <Redirect exact from='/stats' to='/stats/Vale Guardian/all' />
          <Route exact path='/stats' component={(props) => {
            const guild = props.match.params.guild;
            return <Redirect to={`/${guild}/all`} />;
          }} />
          <Route exact path='/stats/:boss' component={(props) => {
            const boss = props.match.params.boss;
            return <Redirect to={`/stats/${boss}/all`} />;
          }} />
          <Route exact path='/stats/:boss/:class' component={PageRoot} />

          <Route exact path='/:guild/:boss/:log' component={PageRoot} />
          <Route exact path='/:guild/:boss' component={PageRoot} />
          <Route exact path='/:guild' component={(props) => {
            const guild = props.match.params.guild;
            return <Redirect to={`/${guild}/all`} />;
          }} />
          <Redirect exact from='/' to='/all/all' />

          <Redirect to="/404" />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app_root'));
