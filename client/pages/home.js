// React
import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  BackHandler,
  ScrollView,
} from 'react-native';

// Router
import { Actions } from 'react-native-router-flux';

// Google
import { GoogleSignin } from 'react-native-google-signin';

// Native Base
import {
  Container,
  Content,
  Button,
  Label,
  Item,
  Icon,
  Text,
  Toast,
  Spinner,
} from 'native-base';

// Camera
import Camera from 'react-native-camera';

// Api end point
import { API_URL, USER_NAME, PASSWORD } from 'react-native-dotenv';

//other imports
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import moment from 'moment';
import base64 from 'base-64';
import RNExitApp from 'react-native-exit-app';
import RNFS from 'react-native-fs';

//Form component
import t from 'tcomb-form-native';
const Form = t.form.Form;

const $ = {}
$.height = Dimensions.get('window').height - 20;
$.width = Dimensions.get('window').width;

const options = {
  fields: {
    shop_name: {
        label: 'Shop Name*',
        underlineColorAndroid: 'transparent',
        error: 'Please enter the shop name',
        autoCapitalize: 'words',
    },
    is_new_shop: {
      label: 'Is it an existing dealer?*',
      underlineColorAndroid: 'transparent',
      error: 'Please select yes/no',
      autoCapitalize: 'words',
    },
    is_new_info: {
      label: 'Is there any change in information?*',
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
      error: 'Please enter the total selling capacity of the shop. Must be an integer',
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
      label: 'Have you visited the shop before?*',
      underlineColorAndroid: 'transparent',
      error: 'Please select yes/no',
      autoCapitalize: 'words',
    },
    latitude: {
      label: 'Latitude*',
      underlineColorAndroid: 'transparent',
      error: 'Please take photo of the shop. Device location must be turned on.',
      autoCapitalize: 'words',
      editable: false,
      hidden: true,
    },
    longitude: {
      label: 'Longitude*',
      underlineColorAndroid: 'transparent',
      error: 'Please take photo of the shop. Device location must be turned on.',
      autoCapitalize: 'words',
      editable: false,
      hidden: true
    },
    comments: {
      label: 'Comments',
      error: 'try again.',
      multiline: true,
      numberOfRows: 4,
      blurOnSubmit: false,
      stylesheet: {
        ...Form.stylesheet,
        textbox: {
          ...Form.stylesheet.textbox,
          normal: {
            ...Form.stylesheet.textbox.normal,
            height: 100
          },
          error: {
            ...Form.stylesheet.textbox.error,
            height: 100
          }
        }
      }
    },
  }
};

const placeholderValues = {
  phone: 'NA',
  addr_street: 'NA',
  addr_line2: '',
  city: 'NA',
  distr: 'NA',
  currently_selling_brands: 'NA',
  selling_cap: 0,
  percent_of_ev: 'NA',
  preferred_payment_system: 'NA',
  is_new_visit: 'NA',
  is_new_info: 'NA',
}

export default class Home extends Component{
  constructor(props){
    super(props);
    this.state= {
      loading: false,
      value: {},
      showCamera: false,
      showSuccessModal: false,
      imagePath: '',
      showCompletedForm: false,
      showFullFinalForm: false,
      type: this.getType({}),
      enableCaptureButton: true,
    };
    this.renderForm = this.renderForm.bind(this);
    this.renderCamera = this.renderCamera.bind(this);
    this.renderSpinner = this.renderSpinner.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openCamera = this.openCamera.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.checkIsLocation = this.checkIsLocation.bind(this);
    this.getType = this.getType.bind(this);
    this.onConfirmSubmit = this.onConfirmSubmit.bind(this);
    this.cancelSubmit = this.cancelSubmit.bind(this);

    BackHandler.addEventListener('hardwareBackPress', () => {
       LocationServicesDialogBox.forceCloseDialog();
    });
  }

  static navigationOptions = {
		headerLeft:null
	}

  componentDidMount(){
    this.checkIsLocation().then(r => console.log(r));
  }

  getType(value){
    const options = {
      shop_name: t.String,
      is_new_shop: t.enums({no: 'Yes', yes: 'No'}), //the answers r reversed because of the nature of the question posed
      latitude: t.Number,
      longitude: t.Number,
    };

    const extraQuestions = {
      phone: t.String,
      addr_street: t.String,
      addr_line2: t.maybe(t.String),
      city: t.String,
      distr: t.String,
      currently_selling_brands: t.String,
      selling_cap: t.Integer,
      percent_of_ev: t.String,
      preferred_payment_system: t.enums({cash: 'Cash', partial_payment: 'Partial Payment', credit: 'Credit'}),
    }


    if(!!value){
      this.setState({
        showFullFinalForm: false,
      });
      if(value.is_new_shop === 'yes'){
         options.is_new_visit = t.enums({no: 'Yes', yes: 'No'}); //the answers r reversed because of the nature of the question posed
      } else if (value.is_new_shop === 'no') {
        value.is_new_visit = 'NA';
        console.log(value);
      }

      if (value.is_new_visit === 'yes') {
        Object.assign(options, extraQuestions);
        this.setState({
          showFullFinalForm: true,
        });
      } else if (value.is_new_visit === 'no') {
        options.is_new_info = t.enums({yes: 'Yes', no: 'No'});
      }

      if (value.is_new_info === 'yes') {
        Object.assign(options, extraQuestions);
        this.setState({
          showFullFinalForm: true,
        });
      }
     }

    options.comments = t.maybe(t.String);
    return t.struct(options);
  }

  async checkIsLocation() {
    let err = '';
    let check = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "Use Location ?",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true // false => Directly catch method is called if location services are turned off
    }).catch(error => err = error);
    if(!!err) {
      Toast.show({
        text: 'Location must be enabled!',
        position: 'bottom',
        buttonText: 'Okay'
      })
      return false;
    }
    return true;
  }

  async openCamera(){
    const isLocationEnabled = await this.checkIsLocation();
    if(isLocationEnabled){
      this.setState({
        showCamera: true
      });
    }
  }

  onChange(val){
    this.setState({
      value: Object.assign({}, this.state.value, val),
      error: '',
      type: this.getType(val),
    });
  }

  onSubmit(){
    const isValid = this._form.validate().isValid();
    if(isValid){
      const cal = Object.assign({}, placeholderValues, this.state.value);
      this.setState({ showCompletedForm: true, value: cal });
    }
  }

  async onConfirmSubmit(){
    const {value} = this.state;
    const username = USER_NAME;
    const pw = PASSWORD;
    const url = API_URL;
    const auth = 'Basic '+ base64.encode(`${username}:${pw}`);

    let data = value;
    if(value.is_new_info === 'no'){
      data = Object.assign(value, placeholderValues);
    }

    // delete data.is_new_info;
    console.log(338, data);

    const imageData = await RNFS.readFile(this.state.imagePath.substring(7), 'base64');
    data.picture = imageData;
    // send post request
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
      body: JSON.stringify(data)
    }).then(res => {
      if(res.status === 201){
        this.setState({
          value: {},
          showCompletedForm: false,
          showSuccessModal: true,
        })
        setTimeout(()=>{
          this.setState({showSuccessModal: false});
          RNExitApp.exitApp();
        }, 1500);
      } else {
        console.log(JSON.stringify(res));
        Toast.show({
          text: 'Error occured! Please try again!',
          position: 'bottom',
          buttonText: 'Okay'
        });
        this.setState({
          showCompletedForm: false,
        });
      }
    }).catch(err => {
      console.log('err', err);
    })
  }

  cancelSubmit(){
    this.setState({
      showCompletedForm: false,
    })
  }

  onLogout(){
    GoogleSignin.signOut()
      .then(() => {
        console.log('logged out Successfully');
        Actions.replace('login');
      })
  }

  takePicture() {
    const options = {};
    this.setState({
      enableCaptureButton: false,
    })
    this.camera.capture({metadata: options}).then(data => {
      this.setState({
        imagePath: data.path,
        showCamera: false,
        enableCaptureButton: true,
      })
    })
    let lat, lng;
    navigator.geolocation.getCurrentPosition( position => {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      this.setState({
        value: Object.assign({
          longitude: lng,
          latitude: lat,
          time_of_visit: moment(this.state.value.time_of_visit).format('YYYY-MM-DD hh:mm:ss'),
          user_email: GoogleSignin.currentUser().email, 
        }, this.state.value)
      });
    });
  renderSpinner() {
    return(
      <Modal
        transparent={true}
        visible={true}
        animationType='fade'
        onRequestClose={() => console.log('loading done')}>
        <View style={{
          justifyContent: 'space-around',
          backgroundColor: 'rgba(255,255,255,0.4)',
          flex: 1,
          }}>
          <Spinner color='teal'/>
        </View>
      </Modal>
    )
  }

  renderCamera() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          captureQuality={'low'}
          playSoundOnCapture={true}
          captureTarget={Camera.constants.CaptureTarget.temp}
          type={Camera.constants.Type.back}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={() => { this.state.enableCaptureButton ? this.takePicture() : null }}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }

  renderForm() {
    return (
      <Container>
        <Content style={{ padding: 20 }} keyboardShouldPersistTaps={'always'}>
          <Form
            ref={f => this._form = f}
            type={this.state.type}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
            />
          <View style={{ paddingVertical: 20 }}>
            <Label>Add Photo</Label>
            {!!this.state.imagePath ?
              <Image source={{uri: this.state.imagePath}} style={{ margin: 10, height: 100, width: 100 }}/>
              : null}
            <Item>
            <Button
              iconLeft
              bordered
              primary
              onPress={this.openCamera}
              >
              <Icon name='camera' />
              <Text>Take Photo</Text>
            </Button>
            </Item>
          </View>
          <Button
            full
            success
            onPress={this.onSubmit}>
            <Text>Next</Text>
          </Button>
          <Button
            full
            danger
            onPress={this.onLogout}
            style={{marginBottom: 40}}
            >
            <Text>Log Out</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  renderCompletedForm(){
    const { value, showFullFinalForm } = this.state;
    return (
      <View style={{ position: 'relative', height: $.height }}>
        <Text style={{ padding: 20, fontSize: 20, fontWeight: 'bold' }}>Details: </Text>
        <Image source={{uri: this.state.imagePath}} style={{ margin: 10, height: 200, width: 200, alignSelf: 'center' }}/>
        <ScrollView style={{ paddingLeft: 20 }}>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Shop Name:</Text>    {value.shop_name}
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Is it an existing dealer?:</Text>   {value.is_new_shop === 'no' ? 'yes' : 'no'}
          </Text>
          {value.is_new_info !== 'NA' ?
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Have you visited the shop before?:</Text>   {value.is_new_visit === 'no' ? 'yes' : 'no'}
            </Text> : null}
          {value.is_new_info !== 'NA' ?
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Is there any change in information?:</Text>   {value.is_new_info}
            </Text> : null}
          { showFullFinalForm ?
            <View>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Phone:</Text>    {value.phone}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Street Address:</Text> {value.addr_street}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Address Line 2:</Text>   {value.addr_line2}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>City:</Text>   {value.city}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>District:</Text>   {value.distr}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Brands Currently being sold:</Text>    {value.currently_selling_brands}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Total Selling Capacity:</Text>   {value.selling_cap}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Percent of EV + Easybike:</Text>   {value.percent_of_ev}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Preferred Payment System:</Text>   {value.preferred_payment_system}
              </Text>
            </View> : null
          }
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Comments:{`${'\n'}`}</Text>
            {value.comments}
          </Text>
        </ScrollView>
        <View style={{}}>
          <View style={{ paddingTop : 10 }}>
            <Button
              full
              success
              onPress={this.onConfirmSubmit}
              >
              <Text>Submit</Text>
            </Button>
            <Button
              full
              primary
              onPress={this.cancelSubmit}
              >
                <Text>Back</Text>
              </Button>
          </View>
        </View>
      </View>
    )
  }

  render(){
    return (
      <View style={{ flex: 1 }}>
        {this.renderForm()}
        {/* the camera */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showCamera}
          onRequestClose={() => {this.setState({showCamera: false})}}
          >
         <View style={{flex: 1}}>
          {this.renderCamera()}
         </View>
        </Modal>
        {/* the completed form */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showCompletedForm}
          onRequestClose={() => {this.setState({showCompletedForm: false})}}
          >
         <View style={{flex: 1}}>
          {this.renderCompletedForm()}
         </View>
        </Modal>
        {/* the success modal */}
        <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.showSuccessModal}
        onRequestClose={() => {this.setState({showSuccessModal: false})}}
        >
          <View style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.4)',
            marginTop: 0,
            flex: 1,
            paddingVertical: 20,
            marginTop: 0,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(240,245,238,1)',
                width: $.width * 0.8,
                borderRadius: 20,
                paddingHorizontal: 30,
                paddingVertical: 20,
                alignItems: 'center'
              }}>
              <Text style={{
                textAlign: 'center'
              }}>Submitted Successfully!</Text>
              <Text style={{
                textAlign: 'center'
              }}>App will close now.</Text>
            </View>
          </View>
        </Modal>
        {this.state.loading ? this.renderSpinner() : null}
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
