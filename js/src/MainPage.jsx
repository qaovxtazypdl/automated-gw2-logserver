import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import url from 'url';
import request from 'browser-request';

import SidebarEntry from './SidebarEntry.jsx';

import css from './__style__/MainPage.css'

//TODO: what's the cleanest way to handle this?
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
const API_URL = 'https://logs.xn--jonathan.com/api/logmetadata';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active_tab: 0,
      active_log: 0,
      data: {},
    };
  }

  requestTab(tabIndex) {
    if (this.state.data && !!this.state.data[tabIndex]) {
      return;
    }

    // if needs to be populated, make the API call.
    const requestUrl = Object.assign({}, url.parse(API_URL), {
      query: {
        fields: 'id,time,path,boss,bosstime,guild,class,bossdmg,rank',
        boss: BOSSES[Object.keys(BOSSES)[tabIndex]],
      }
    });
    request(url.format(requestUrl), (er, res) => {
      if (er) throw er;
      this.setState({
        data: Object.assign(
          {},
          this.state.data,
          {[tabIndex]: JSON.parse(res.response)}
        ),
      });
    });
  }

  componentDidMount() {
    this.requestTab(0);
  }

  onTabClick(tabIndex) {
    this.setState({
      active_tab: tabIndex,
      active_log: 0,
    });
    this.requestTab(tabIndex);
  }

  onLogClick(logIndex) {
    this.setState({
      active_log: logIndex,
    });
  }

  render () {
    const bossSelectorClassNames = classNames('boss-selector',
      {'selected':true}
    );
    return (
      <div className="rc-MainPage">
        <nav className="page-header">
          <h2 className="header-title">
            {'KCaScTiVCrMn.6453\'s Automated Log Server'}
          </h2>
          {Object.keys(BOSSES).map((name, index) => (
            <button
              key={name}
              onClick={() => this.onTabClick(index)}
              className={classNames(
                'boss-selector',
                {'selected': index === this.state.active_tab}
              )}
            >
              {name}
            </button>
          ))}
        </nav>

        <nav className="page-sidebar">
          {!!this.state.data[this.state.active_tab] && this.state.data[this.state.active_tab].length > 0 ?
            this.state.data[this.state.active_tab].map((entry, index) =>
              <SidebarEntry
                key={entry.id}
                entry={entry}
                onClick={() => this.onLogClick(index)}
                isActive={this.state.active_log == index}
              />
            ) :
            <p>
              {'There\'s nothing here ಠ_ಠ'}
            </p>
          }
        </nav>
        {!!this.state.data[this.state.active_tab] &&
         !!this.state.data[this.state.active_tab][this.state.active_log] ?
          <section className="page-log-display">
            {
              <iframe
                className="log-iframe"
                src={`/logs/${this.state.data[this.state.active_tab][this.state.active_log].path}`}
              />
            }
          </section> :
          <p className="page-log-display">
            {'There\'s nothing here ಠ_ಠ'}
          </p>
        }
      </div>
    );
  }
}

module.exports = MainPage;
