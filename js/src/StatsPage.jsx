import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import url from 'url';
import {Link} from 'react-router-dom'
import request from 'browser-request';

import StatTable from './StatTable.jsx';

import css from './__style__/StatsPage.css';

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
const CLASSES = [
  'elementalist', 'mesmer', 'necromancer',
  'ranger', 'engineer', 'thief',
  'revenant', 'guardian', 'warrior',
];
const HoT_CLASSES = [
  'tempest', 'chronomancer', 'reaper',
  'druid', 'scrapper', 'daredevil',
  'herald', 'dragonhunter', 'berserker',
];

const API_URL = 'https://logs.xn--jonathan.com/api/dpsdata';

class StatsPage extends React.Component {
  constructor(props) {
    super(props);

    //this.props.match.params;
    const activeClass = this.getActiveClass().toLowerCase();
    if (activeClass != 'all' && !CLASSES.includes(activeClass) && !HoT_CLASSES.includes(activeClass)) {
      this.props.history.push('/404');
    }

    if (this.getActiveTabIndex() < 0) {
      this.props.history.push('/404');
    }

    this.state = {
      data: {},
    };
  }

  getActiveClass() {
    if (!this.props.match.params.class) return 'all';
    return this.props.match.params.class.toLowerCase();
  }

  getActiveTabIndex() {
    if (!this.props.match.params.boss) return -1;
    return Object.keys(BOSSES).map(b => b.toLowerCase()).indexOf(this.props.match.params.boss.toLowerCase());
  }

  requestData() {
    const boss = BOSSES[Object.keys(BOSSES)[this.getActiveTabIndex()]];
    const classname = this.getActiveClass();

    if (this.isRequesting ||
      (this.state.data && this.state.data[boss] && this.state.data[boss][classname])
    ) {
      return;
    }

    this.isRequesting = true;

    // if needs to be populated, make the API call.
    const requestUrl = Object.assign({}, url.parse(API_URL), {
      query: {
        boss: boss,
        class: classname,
      }
    });

    request(url.format(requestUrl), (er, res) => {
      if (er) throw er;
      let response = JSON.parse(res.response);
      response.forEach(entry =>
        Object.keys(entry).forEach(key => entry[key] = decodeURIComponent(entry[key]))
      );

      const newdata = this.state.data;
      if (!newdata[boss]) newdata[boss] = {};
      newdata[boss][classname] = response;
      this.setState({data: newdata});

      this.isRequesting = false;
    });
  }

  componentDidMount() {
    this.requestData();
  }

  render () {
    this.requestData();
    const boss = BOSSES[Object.keys(BOSSES)[this.getActiveTabIndex()]];
    const classname = this.getActiveClass();

    return (
      <div className="rc-StatsPage">
        <nav className="stats-page-header">
          <a
            href="https://github.com/qaovxtazypdl/automated-gw2-logserver"
            className="github-link"
          >
            {'github'}
          </a>
          <div className="boss-row">
            {Object.keys(BOSSES).map((name, index) => (
              <Link
                key={name}
                to={`/stats/${name}/${this.getActiveClass()}`}
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
          <div>
            <Link
              key={name}
              to={`/stats/${this.props.match.params.boss}/all`}
              className={classNames(
                'class-selector',
                'link-as-button',
                {'selected': 'all' === this.getActiveClass()}
              )}
            >
              <img className="class-sprite" src={`/icons/icon_all.png`} />
            </Link>
            {HoT_CLASSES.map((name, index) => (
              <Link
                key={name}
                to={`/stats/${this.props.match.params.boss}/${HoT_CLASSES[index]}`}
                className={classNames(
                  'class-selector',
                  'link-as-button',
                  {'selected': name === this.getActiveClass()},
                  {'left-separator': index === 0}
                )}
              >
                <img className="class-sprite" src={`/icons/${name}.png`} />
              </Link>
            ))}
            <span className="class-separator" />
            {CLASSES.map((name, index) => (
              <Link
                key={name}
                to={`/stats/${this.props.match.params.boss}/${CLASSES[index]}`}
                className={classNames(
                  'class-selector',
                  'link-as-button',
                  {'selected': name === this.getActiveClass()},
                  {'left-separator': index === 0}
                )}
              >
                <img className="class-sprite" src={`/icons/${name}.png`} />
              </Link>
            ))}
          </div>
        </nav>
        <section className="stats-section">
          <StatTable data={this.state.data && this.state.data[boss] && this.state.data[boss][classname]} />
        </section>
      </div>
    );
  }
}

StatsPage.propTypes = {
  match: PropTypes.object.isRequired,
};
export default StatsPage
