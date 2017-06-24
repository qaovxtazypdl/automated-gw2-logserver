import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './__style__/SidebarEntry.css'

class SidebarEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const seconds = this.props.entry.bosstime;
    const mmssString = `${~~(seconds / 60)}:${seconds % 60}`;
    return (
      <button onClick={this.props.onClick} className={classNames(
        'rc-SidebarEntry',
        {'selected': this.props.isActive}
      )}>
        <div className="class-sprite" />
        <div className="top-row">
          <span className="date-dmy">{`${this.props.entry.time}`}</span>
          <span className="time-elapsed">{mmssString}</span>
        </div>
        <div className="bottom-row">
          <span className="guild-tag">{`[${this.props.entry.guild}]`}</span>
          <span className="boss-dps">{`DPS: ${this.props.entry.bossdmg}`}</span>
        </div>
      </button>
    );
  }
}

SidebarEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};
module.exports = SidebarEntry;
