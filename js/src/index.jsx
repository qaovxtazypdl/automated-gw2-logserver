import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'

import MainPage from './MainPage.jsx';
import PageNotFound from './PageNotFound.jsx';

import css from './__style__/index.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/404' component={PageNotFound} />
          <Route exact path='/:guild/:boss/:log' component={MainPage} />
          <Route exact path='/:guild/:boss' component={MainPage} />

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
