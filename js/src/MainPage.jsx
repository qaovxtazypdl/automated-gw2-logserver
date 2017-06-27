import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import url from 'url';
import {Link} from 'react-router-dom'
import request from 'browser-request';

import SidebarEntry from './SidebarEntry.jsx';

import css from './__style__/MainPage.css';

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
  //'VIP',
  //'KA',
  // 'VFX',
  // 'bash',
  // 'Heim',
  // 'VI',
  // 'HONK',
]
const API_URL = 'https://logs.xn--jonathan.com/api/logmetadata';

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    const {guild, boss} = this.props.match.params;
    if (this.getActiveGuildIndex(guild) === -1 || this.getActiveTabIndex(boss) === -1) {
      this.props.history.push('/404');
    }

    this.state = {
      data: {},
    };
  }

  getFilteredLogs() {
    const allLogs = this.state.data[this.getActiveGuildIndex()];
    return allLogs ?
      (this.getActiveTabIndex() === 0 ?
        allLogs :
        allLogs.filter(
          guild_entry => guild_entry.boss === BOSSES[Object.keys(BOSSES)[this.getActiveTabIndex()]]
        ))
      : [];
  }

  getActiveGuildIndex() {
    return GUILDS.map(g => g.toLowerCase()).indexOf(this.props.match.params.guild.toLowerCase());
  }

  getActiveTabIndex() {
    return Object.keys(BOSSES).map(b => b.toLowerCase()).indexOf(this.props.match.params.boss.toLowerCase());
  }

  getActiveLogIndex() {
    if (!this.props.match.params.log || !this.state.data || !this.state.data[this.getActiveGuildIndex()]) {
      return -1;
    }

    return this.getFilteredLogs().findIndex(entry =>
      entry.path.split('.')[0].toLowerCase() == this.props.match.params.log.toLowerCase()
    )
  }

  requestTab(guildIndex) {
    if (this.isRequesting || (this.state.data && this.state.data[guildIndex])) {
      return;
    }

    this.isRequesting = true;

    // if needs to be populated, make the API call.
    const requestUrl = Object.assign({}, url.parse(API_URL), {
      query: {
        fields: 'id,time,path,boss,bosstime,guild,class,bossdmg,rank,success',
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
      this.isRequesting = false;
    });
  }

  componentDidMount() {
    this.requestTab(this.getActiveGuildIndex());
  }

  render () {
    this.requestTab(this.getActiveGuildIndex());
    const filteredLogs = this.getFilteredLogs();
    return (
      <div className="rc-MainPage">
        <nav className="page-header">
          <h2 className="header-title">
            {'KCaScTiVCrMn.6453\'s Automated Log Server'}
          </h2>
          <a
            href="https://github.com/qaovxtazypdl/automated-gw2-logserver"
            className="github-link"
          >
            {'github'}
          </a>
          <div className="guild-row">
            {GUILDS.map((name, index) => (
              <Link
                key={name}
                to={`/${GUILDS[index]}/${this.props.match.params.boss}`}
                className={classNames(
                  'guild-selector',
                  'link-as-button',
                  {'selected': index === this.getActiveGuildIndex()}
                )}
              >
                {name}
              </Link>
            ))}
          </div>
          <div>
            {Object.keys(BOSSES).map((name, index) => (
              <Link
                key={name}
                to={`/${this.props.match.params.guild}/${Object.keys(BOSSES)[index]}`}
                className={classNames(
                  'boss-selector',
                  'link-as-button',
                  {'selected': index === this.getActiveTabIndex()}
                )}
              >
                {name}
              </Link>
            ))}
          </div>
        </nav>

        <nav className="page-sidebar">
          {filteredLogs.length > 0 ?
            filteredLogs.map((entry, index) =>
              <SidebarEntry
                key={entry.id}
                entry={entry}
                linkto={`/${this.props.match.params.guild}/${this.props.match.params.boss}/${filteredLogs[index].path.split('.')[0]}`}
                isActive={this.getActiveLogIndex() == index}
              />
            ) :
            <p>
              {'There\'s nothing here ಠ_ಠ'}
            </p>
          }
        </nav>
        <section className="page-log-display">
          {this.getActiveLogIndex() >= 0 && filteredLogs.length > 0 &&
            <iframe
              className="log-iframe"
              src={`/logs/${filteredLogs[this.getActiveLogIndex()].path}`}
            />
          }
        </section>
      </div>
    );
  }
}

MainPage.propTypes = {
  match: PropTypes.object.isRequired,
};
export default MainPage
