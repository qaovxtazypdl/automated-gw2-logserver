import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import url from 'url';
import request from 'browser-request';

import SidebarEntry from './SidebarEntry.jsx';

import css from './__style__/MainPage.css'

const BOSSES = {
  "All": "All",
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
const GUILDS = [
  'All',
  'LUCK',
  'SKGQ',
  'VIP',
  'KA',
  'VFX',
  // 'bash',
  // 'Heim',
  // 'VI',
  // 'HONK',
]
const API_URL = 'https://logs.xn--jonathan.com/api/logmetadata';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active_guild: 0,
      active_tab: 0,
      active_log: -1,
      data: {},
    };
  }

  requestTab(guildIndex) {
    if (this.state.data && !!this.state.data[guildIndex]) {
      return;
    }

    // if needs to be populated, make the API call.
    const requestUrl = Object.assign({}, url.parse(API_URL), {
      query: {
        fields: 'id,time,path,boss,bosstime,guild,class,bossdmg,rank',
      }
    });
    if (guildIndex !== 0) {
       requestUrl.query.guild = GUILDS[guildIndex];
    }

    request(url.format(requestUrl), (er, res) => {
      if (er) throw er;
      let response = JSON.parse(res.response);
      response.forEach(entry =>
        Object.keys(entry).forEach(key => entry[key] = decodeURIComponent(entry[key]))
      );
      this.setState({
        data: Object.assign(
          {},
          this.state.data,
          {[guildIndex]: response}
        ),
      });
    });
  }

  componentDidMount() {
    this.requestTab(0);
  }

  onGuildClick(guildIndex) {
    this.setState({
      active_guild: guildIndex,
      active_log: -1,
    });
    this.requestTab(guildIndex);
  }

  onTabClick(tabIndex) {
    this.setState({
      active_tab: tabIndex,
      active_log: -1,
    });
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
    const allLogs = this.state.data[this.state.active_guild];
    const filteredLogs = allLogs ?
      (this.state.active_tab === 0 ?
        allLogs :
        allLogs.filter(
          guild_ent => guild_ent.boss === BOSSES[Object.keys(BOSSES)[this.state.active_tab]]
        ))
      : [];
    return (
      <div className="rc-MainPage">
        <nav className="page-header">
          <h2 className="header-title">
            {'KCaScTiVCrMn.6453\'s Automated Log Server'}
          </h2>
          <div>
            {GUILDS.map((name, index) => (
              <button
                key={name}
                onClick={() => this.onGuildClick(index)}
                className={classNames(
                  'guild-selector',
                  {'selected': index === this.state.active_guild}
                )}
              >
                {name}
              </button>
            ))}
          </div>
          <div>
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
          </div>
        </nav>

        <nav className="page-sidebar">
          {filteredLogs.length > 0 ?
            filteredLogs.map((entry, index) =>
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
        <section className="page-log-display">
          {this.state.active_log >= 0 && filteredLogs.length > 0 &&
            <iframe
              className="log-iframe"
              src={`/logs/${filteredLogs[this.state.active_log].path}`}
            />
          }
        </section>
      </div>
    );
  }
}

export default MainPage
