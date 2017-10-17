import React from 'react';

import {
  StackNavigator,
} from 'react-navigation';

// pages
import Login from './pages/login';
import Home from './pages/home';

const Navigation = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      title: 'Welcome',
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home',
    },
  },
});

export default class App extends React.Component {
  render() {
    return (
      <Navigation />
    );
  }
}
