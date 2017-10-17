import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Home extends Component{
  constructor(props){
    super(props);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(){
    Actions.pop();
  }

  render(){
    return (
      <View>
        <Text>Home Page</Text>
        <Button 
          onPress={this.onLogin}
          title='Back to Login Page'
          />
      </View>
    )
  }
}