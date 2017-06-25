import React, { Component } from 'react'
import {render} from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

import MainPage from './MainPage.jsx'

import css from './__style__/index.css'

class App extends React.Component {
  render () {
    return <MainPage />;
  }
}

render(<App/>, document.getElementById('app_root'));
