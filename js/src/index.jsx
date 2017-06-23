import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    const lol = "blach blah";
    return <div>
      <p>Here are all the logs recorded...</p>
      {`${lol}`}
    </div>;
  }
}

render(<App/>, document.getElementById('app_root'));
