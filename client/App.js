import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Stack, Actions, ActionConst, Scene, Router } from 'react-native-router-flux';
import { Root } from 'native-base';
import Home from './pages/home';
import Login from './pages/login';

export default class App extends Component {

  componentDidMount(){
  }

  render() {
    return (
      <Root>
        <Router>
          <Stack key='root'>
            <Scene
              key='login'
              component={Login}
              title='Login'
              />
            <Scene
              key='home'
              component={Home}
              title='Client Details'
            />
          </Stack>
        </Router>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
