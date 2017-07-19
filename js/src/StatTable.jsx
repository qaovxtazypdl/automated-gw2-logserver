import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class StatTable extends React.Component {
  render () {
    return <span>{JSON.stringify(this.props.data)}</span>;
  }
}

StatTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
export default StatTable
