import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Dimensions,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
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

  componentDidMount(){
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
      Actions.home({ tokenId: user.idToken, type: ActionConst.REPLACE });
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  render(){
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <GoogleSigninButton
          style={{width: Dimensions.get('window').width, height: 70}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.onLogin}/>
      </View>
    )
  }
}