import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import styles from '../components/base.scss';
import Scanner from '../components/scanner';

class App extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section>
        <Scanner />
      </section>
    );
  }
}

ReactDOM.render(
    <App />,
    document.querySelector('#content')
);
