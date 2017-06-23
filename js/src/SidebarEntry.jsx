import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

import css from './__style__/SidebarEntry.css'

class SidebarEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render () {
    return (
      <button className="rc-SidebarEntry">
        <div className="class-sprite" />
        <div className="top-row">
          <span className="boss-dps">12345</span>
          <span className="time-elapsed">10:00</span>
        </div>
        <div className="bottom-row">
          <span className="guild-tag">{'[LUCK]'}</span>
          <span className="date-dmy">{'23/11/2017'}</span>
        </div>
      </button>
    );
  }
}

SidebarEntry.propTypes = {
  entry: PropTypes.object.isRequired,
};
module.exports = SidebarEntry;
