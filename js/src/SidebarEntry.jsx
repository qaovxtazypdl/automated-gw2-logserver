import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router-dom'

import css from './__style__/SidebarEntry.css';

class SidebarEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const seconds = this.props.entry.bosstime;
    const mmssString = `${~~(seconds / 60)}:${(seconds % 60 < 10 ? '0' : '') + seconds % 60}`;
    const classIconLink = `/icons/${this.props.entry.class}.png`;
    return (
      <Link to={this.props.linkto} className={classNames(
        'rc-SidebarEntry',
        'link-as-button',
        {'selected': this.props.isActive}
      )}>
        <img className="class-sprite" src={classIconLink} />
        <div className="top-row">
          <span className="date-dmy">{`${this.props.entry.time}`}</span>
          <span className="time-elapsed">{mmssString}</span>
        </div>
        <div className="bottom-row">
          <span className="guild-tag">{`[${this.props.entry.guild}]`}</span>
          <span className={classNames(
            'boss-name',
            {'success': this.props.entry.success === "1"}
          )}>{`${this.props.entry.boss}`}</span>
        </div>
      </Link>
    );
  }
}

SidebarEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  linkto: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default SidebarEntry

/*
<span className={classNames("boss-dps", {
  gold: this.props.entry.rank == 1,
  silver: this.props.entry.rank == 2,
  bronze: this.props.entry.rank == 3,
})}>
  {`DPS: ${this.props.entry.bossdmg}`}
</span>
*/
