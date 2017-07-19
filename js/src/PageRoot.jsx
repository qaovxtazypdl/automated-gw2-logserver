import React from 'react';
import {render} from 'react-dom';
import classNames from 'classnames';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';

import MainPage from './MainPage.jsx';
import StatsPage from './StatsPage.jsx';

import css from './__style__/PageRoot.css';

class PageRoot extends React.Component {
  render () {
    const onStatsPage = this.props.location.pathname.startsWith('/stats');
    return (
      <div>
        <h2 className="header-title">
          {'KCaScTiVCrMn.6453\'s Automated Log Server'}
          <nav className="header-nav">
            <Link
              to={`/`}
              className={classNames(
                'header-nav-link',
                {'selected': !onStatsPage},
              )}
            >
              {'Logs'}
            </Link>
            <span className="header-nav-separator">
              {'|'}
            </span>
            <Link
              to={`/stats`}
              className={classNames(
                'header-nav-link',
                {'selected': onStatsPage},
              )}
            >
              {'Stats'}
            </Link>
          </nav>
        </h2>
        {onStatsPage ?
          <StatsPage {...this.props} /> :
          <MainPage {...this.props} />
        }
      </div>
    );
  }
}

MainPage.propTypes = {
  location: PropTypes.object.isRequired,
};
export default PageRoot
