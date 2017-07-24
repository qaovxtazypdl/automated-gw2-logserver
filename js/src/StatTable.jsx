import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactTable from 'react-table'

import 'react-table/react-table.css'

class StatTable extends React.Component {
  render () {
    const columns = [
      {
        Header: 'Class',
        accessor: 'class',
        Cell: row => (
          <img className="class-sprite-small" src={`/icons/${row.value}.png`} />
        ),
        minWidth: 50,
      },
      {
        Header: 'Account Name',
        accessor: 'accountname',
      },
      {
        Header: 'Boss DPS',
        accessor: 'bossdps',
      },
      {
        id: 'cleave',
        Header: 'Cleave DPS',
        accessor: data => (data.cleavedps - data.bossdps),
      },
      {
        Header: 'Total DPS',
        accessor: 'cleavedps',
      },
      {
        Header: 'Kill Time',
        accessor: 'bosstime',
      },
      {
        Header: 'Date',
        accessor: 'time',
      },
      {
        Header: 'Link',
        accessor: 'path',
        Cell: row => (
          <a href={`/logs/${row.value}`} >{`click`}</a>
        ),
      },
    ];

    return (
      <ReactTable
        className={"-striped -highlight"}
        data={this.props.data}
        columns={columns}
        style={{
          padding: '0 10px 0 0',
          'font-family': 'arial',
        }}
        minRows={20}
      />
    );
  }
}

StatTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
export default StatTable
