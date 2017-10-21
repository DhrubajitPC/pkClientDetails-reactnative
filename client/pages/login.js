import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { CLIENT_ID, WEB_ID } from 'react-native-dotenv';

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      user: null
    };
    this.onLogin = this.onLogin.bind(this);
    this._setupGoogleSignin = this._setupGoogleSignin.bind(this);
  }

  componentDidMOunt(){
    this._setupGoogleSignin();
  }
  
  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: WEB_ID,
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log(user);
      this.setState({user});
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  async onLogin(){
    await this._setupGoogleSignin();
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      this.setState({user: user});
      Actions.home({ tokenId: user.idToken });
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  render(){
    return (
      <View>
        <Text>Login Page</Text>
        <Button 
          onPress={this.onLogin}
          title='Go to Home page'
          />
        <GoogleSigninButton
          style={{width: 48, height: 48}}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.onLogin}/>
      </View>
    )
  }
}