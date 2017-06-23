import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

import SidebarEntry from './SidebarEntry.jsx';

import css from './__style__/MainPage.css'

const BOSSES = {
  "Vale Guardian": "Vale Guardian",
  "Gorseval": "Gorseval the Multifarious",
  "Sabetha": "Sabetha the Saboteur",
  "Slothasor": "Slothasor",
  "Matthias": "Matthias Gabrel",
  "Keep Construct": "Keep Construct",
  "Xera": "Xera",
  "Cairn": "Cairn the Indomitable",
  "Mursaat Overseer": "Mursaat Overseer",
  "Samarog": "Samarog",
  "Deimos": "Deimos",
};

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active_tab: 0,
      active_log: 0,
    };
  }

  render () {
    return (
      <div className="rc-MainPage">
        <nav className="page-header">
          <h2 className="header-title">
            {'KCaScTiVCrMn.6453\'s Automated Log Server'}
          </h2>
          {Object.keys(BOSSES).map(name => (
            <button key={name} className="boss-selector">
              {name}
            </button>
          ))}
        </nav>
        <nav className="page-sidebar">
          <SidebarEntry entry={this.props.data[0]}/>
        </nav>
        <section className="page-log-display">
          {/*<iframe src={`/logs/${this.props.data[0].path}`} />*/}
        </section>
      </div>
    );
  }
}

MainPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
module.exports = MainPage;
