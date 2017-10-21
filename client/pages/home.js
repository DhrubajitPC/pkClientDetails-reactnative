import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { GoogleSignin } from 'react-native-google-signin';

//Form component
import t from 'tcomb-form-native';
const Form = t.form.Form;

import {
  Container,
  Content,
} from 'native-base';

const test = t.struct({
  name: t.String,
  age: t.String,
});
const ClientDetails = t.struct({
  shop_name: t.String,
  is_new_shop: t.enums({yes: 'Yes', no: 'No'}),
  phone: t.String,
  addr_street: t.String,
  addr_line2: t.maybe(t.String),
  city: t.String,
  distr: t.String,
  currently_selling_brands: t.String,
  selling_cap: t.String,
  percent_of_ev: t.String,
  preferred_payment_system: t.enums({cash: 'Cash', partial_payment: 'Partial Payment', credit: 'Credit'}),
  is_new_visit: t.enums({yes: 'Yes', no: 'No'}),
});
const options2 = {};
const options = {
  fields: {
    shop_name: {
        label: 'Shop Name*',
        underlineColorAndroid: 'transparent',
        error: 'Please enter the shop name',
        autoCapitalize: 'words',
    },
    is_new_shop: {
      label: 'Is The Shop New?*',
      underlineColorAndroid: 'transparent',
      error: 'Please select yes/no',
      autoCapitalize: 'words',
    },
    phone: {
      label: 'Phone*',
      underlineColorAndroid: 'transparent',
      error: 'Enter valid phone number',
      autoCapitalize: 'words',
    },
    addr_street: {
      label: 'Street Address*',
      underlineColorAndroid: 'transparent',
      error: 'Please enter the shop adress',
      autoCapitalize: 'words',
    },
    addr_line2: {
      label: 'Address Line 2',
      underlineColorAndroid: 'transparent',
      error: 'try again',
      autoCapitalize: 'words',
    },
    city: {
      label: 'City*',
      underlineColorAndroid: 'transparent',
      error: 'Please enter the City',
      autoCapitalize: 'words',
    },
    distr: {
      label: 'District*',
      underlineColorAndroid: 'transparent',
      error: 'Please enter the district',
      autoCapitalize: 'words',
    },
    currently_selling_brands: {
      label: 'Brands currently being sold*',
      underlineColorAndroid: 'transparent',
      error: 'Please enter brands the store is currently selling',
      autoCapitalize: 'words',
    },
    selling_cap: {
      label: 'Total Selling Capacity*',
      underlineColorAndroid: 'transparent',
      error: 'Please enter the total selling capacity of the shop',
      autoCapitalize: 'words',
    },
    percent_of_ev: {
      label: 'Percentage of EV + Easybike*',
      underlineColorAndroid: 'transparent',
      error: 'Please enter details',
      autoCapitalize: 'words',
    },
    preferred_payment_system: {
      label: 'Preferred Payment System*',
      underlineColorAndroid: 'transparent',
      error: 'Please select the preferred payment system',
      autoCapitalize: 'words',
    },
    is_new_visit: {
      label: 'Previously Visited*',
      underlineColorAndroid: 'transparent',
      error: 'Please select yes/no',
      autoCapitalize: 'words',
    },
  }
};

export default class Home extends Component{
  constructor(props){
    super(props);
    this.state= {
      tokenId: '',
      values: {
        is_new_shop: 'yes',
        is_new_visit: 'yes',
        preferred_payment_system: 'cash'
      },
      errors: {},
    };
    this.onLogout = this.onLogout.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }
  static navigationOptions = {
		headerLeft:null
	}

  componentDidMount(){
    this.setState({
      tokenId: this.props.tokenId,
    })
  }

  onLogout(){
    GoogleSignin.signOut()
      .then(() => {
        console.log('logged out Successfully');
        Actions.pop();
      })
  }

  onValueChange2(val){
    console.log(val)
  }

  onSubmit(){
    console.log(this._form);
    console.log(this.state.values)

  }

  renderForm() {
    return (
      <Container>
        <Content style={{ padding: 20 }}>
          <Form 
            ref={f => this._form = f}
            type={ClientDetails}
            options={options}
            />
        </Content>
      </Container>
    );
  }

  render(){
    return (
      <View style={{ flex: 1 }}>
        {this.renderForm()}
      </View>
      
    )
  }
}