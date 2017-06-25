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
    const classIconLink = `/icons/${this.props.entry.class}.png`;
    return (
      <button onClick={this.props.onClick} className={classNames(
        'rc-SidebarEntry',
        {'selected': this.props.isActive}
      )}>
        <img className="class-sprite" src={classIconLink} />
        <div className="top-row">
          <span className="date-dmy">{`${this.props.entry.time}`}</span>
          <span className="time-elapsed">{mmssString}</span>
        </div>
        <div className="bottom-row">
          <span className="guild-tag">{`[${this.props.entry.guild}]`}</span>
          <span className="boss-name">{`${this.props.entry.boss}`}</span>
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

/*
<span className={classNames("boss-dps", {
  gold: this.props.entry.rank == 1,
  silver: this.props.entry.rank == 2,
  bronze: this.props.entry.rank == 3,
})}>
  {`DPS: ${this.props.entry.bossdmg}`}
</span>
*/
