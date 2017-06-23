import React from 'react';
import {render} from 'react-dom';
import request from 'browser-request';

const API_URL = 'https://logs.xn--jonathan.com/api/logmetadata';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {response: false};
  }

  componentWillMount() {
    request(API_URL, (er, res) => {
      if (er) throw er;
      this.setState({response: JSON.parse(res.response)});
    });
  }
  render () {
    if (!this.state.response) return null;
    return <div>
      <p>Here are all the logs recorded...</p>
      {JSON.stringify(this.state.response)}
    </div>;
  }
}

render(<App/>, document.getElementById('app_root'));
