import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Button,
  View,
} from 'react-native';
import Expo from 'expo';

require('dotenv').config();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.signInWithGoogleAsync = this.signInWithGoogleAsync.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: process.env.CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        console.log(result);
        return result.accessToken;
      }
      return { cancelled: true };
    } catch (e) {
      return { error: true };
    }
  }

  async onLogin() {
    const { navigate } = this.props.navigation;
    console.log('login pressed');
    const token = await this.signInWithGoogleAsync();
    console.log(token);
    if (token.hasProperty('cancelled') || token.hasProperty('error')) {
      navigate('Home');
    }
  }

  render() {
    return (
      <View>
        <Text>Hello, Navigation!</Text>
        <Button
          onPress={this.onLogin}
          title="Login"
        />
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
