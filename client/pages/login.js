import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Login extends Component{
  constructor(props){
    super(props);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(){
    Actions.home();
  }

  render(){
    return (
      <View>
        <Text>Login Page</Text>
        <Button 
          onPress={this.onLogin}
          title='Go to Home page'
          />
      </View>
    )
  }
}