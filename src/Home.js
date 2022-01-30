/**
 * The Google Sign-in
 * Environment settings and functional classes following
 * https://medium.com/fullstack-with-react-native-aws-serverless-and/google-sign-in-for-react-native-ios-c7197add640b
 * @author Bharat Tiwari
 *
 * The log in view for Advance AutoFix
 * @author Minglun Zhang
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  View,
  ImageBackground,
  Linking,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {Button} from 'react-native-elements';
import CameraRoll from '@react-native-community/cameraroll';

export default class Home extends Component {
  state = {
    jobip: 'http://localhost:5001',
    userip: 'http://localhost:5002',
    isUserSignedIn: false,
    loggedInUser: {},
    checkingSignedInStatus: true,
    accessToken: '',
    idToken: '',

    isRegistered: false,

    // field for camera roll
    lsn: '',
    photos: [],
    image: '',
    cameraRoll: false,
    submitted: false,

    //
    checked: false,
  };

  constructor() {
    super();
    GoogleSignin.configure();
  }

  componentDidMount() {
    this.isUserSignedIn();
  }

  render() {
    const {
      isSigninInProgress,
      checkingSignedInStatus,
      isUserSignedIn,
      loggedInUser,
    } = this.state;

    if (checkingSignedInStatus) {
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }

    if (
      isUserSignedIn &&
      loggedInUser &&
      loggedInUser.user &&
      this.state.isRegistered
    ) {
      return (
        <View style={styles.container}>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 35,
            }}>
            Welcome, {loggedInUser.user.givenName}!
          </Text>
          <Image
            style={{width: 20, height: 20}}
            source={{uri: loggedInUser.user.picture}}
          />
          <Text>{'\n\n\n\n\n\n\n\n'}</Text>
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            title={'Profile\t\t\t\t\t\t\t\t\t\t\t\t\t>'}
            onPress={() =>
              this.props.navigation.navigate('ProfileAndPreferences')
            }
          />
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            title={'Job Search\t\t\t\t\t\t\t\t\t\t>'}
            onPress={() => this.props.navigation.navigate('jobSearch')}
          />
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            title={'Processing Job\t\t\t\t\t\t\t\t\t>'}
            onPress={() => this.goProcessing()}
          />
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            title={'Booking List\t\t\t\t\t\t\t\t\t\t\t>'}
            onPress={() => this.props.navigation.navigate('Calendar')}
          />
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            title={'Status Tracking\t\t\t\t\t\t\t\t\t\t\t>'}
            onPress={() => this.props.navigation.navigate('jobHistory')}
          />
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            title={'Knowledge Videos\t\t\t\t\t\t\t>'}
            onPress={() =>
              Linking.openURL('https://video.advanceautoparts.com/')
            }
          />
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.titleStyle}
            title={'Log Out\t\t\t\t\t\t\t\t\t\t\t\t>'}
            onPress={this.signOut}
          />
        </View>
      );
    }
    if (
      isUserSignedIn &&
      loggedInUser &&
      loggedInUser.user &&
      // this.checkRegistered(this.state.loggedInUser) &&
      !this.state.isRegistered
    ) {
      if (this.state.submitted) {
        return (
          <View style={styles.container}>
            <Image
              style={{width: 200, height: 200, bottom: 100}}
              source={require('./pics/check.png')}
            />
            <Text style={{fontSize: 35, bottom: 50}}>Register Successful!</Text>
            <Button
              buttonStyle={{
                backgroundColor: 'rgb(88,214,141)',
                height: 40,
                width: 80,
              }}
              titleStyle={{fontSize: 18, color: 'white'}}
              type="clear"
              title="Sign In"
              onPress={() =>
                this.setState({isRegistered: true, submitted: false})
              }
            />
          </View>
        );
      }
      if (this.state.cameraRoll) {
        return (
          <View style={styles.container}>
            <ScrollView>
              {this.state.photos.map((p, i) => {
                return (
                  <TouchableHighlight
                    style={{flexDirection: 'row'}}
                    key={i}
                    onPress={() =>
                      this.setState({
                        image: p.node.image.uri,
                        cameraRoll: false,
                      })
                    }>
                    <Image
                      style={{
                        top: 20 * i,
                        width: 400,
                        height: 400,
                      }}
                      source={{uri: p.node.image.uri}}
                    />
                  </TouchableHighlight>
                );
              })}
            </ScrollView>
          </View>
        );
      } else if (this.state.image) {
        return (
          <View style={{top: 40, left: 40}}>
            <Text style={{fontSize: 20}}>{'License Serial Number\n'}</Text>
            <TextInput
              placeholder="  LSN"
              value={this.state.lsn}
              style={styles.textInputStyle}
              onChangeText={input => this.setState({lsn: input})}
            />
            <Text style={{fontSize: 20}}>{'\nLicense Photo Upload\n'}</Text>
            <Image
              style={{width: 200, height: 200, left: 70, top: 20}}
              source={{uri: this.state.image}}
            />
            <Text>{'\n\n\n\n'}</Text>
            <View style={{flexDirection: 'row'}}>
              <Button
                buttonStyle={{
                  backgroundColor: 'rgb(88,214,141)',
                  height: 40,
                  width: 80,
                  left: 40,
                }}
                titleStyle={{fontSize: 18, color: 'white'}}
                type="clear"
                title="Choose"
                onPress={() => this.getPhotos()}
              />
              {/* <Text>{'\n\n\n\n\n\n\n\n\n\n\n'}</Text> */}
              <Button
                buttonStyle={{
                  backgroundColor: 'rgb(88,214,141)',
                  height: 40,
                  width: 80,
                  left: 130,
                }}
                titleStyle={{fontSize: 18, color: 'white'}}
                type="clear"
                title="Submit"
                onPress={() => this.onSignUp()}
              />
            </View>
          </View>
        );
      } else {
        return (
          <View style={{top: 40, left: 40}}>
            <Text style={{fontSize: 20}}>{'License Serial Number\n'}</Text>
            <TextInput
              placeholder="  LSN"
              value={this.state.lsn}
              style={styles.textInputStyle}
              onChangeText={input => this.setState({lsn: input})}
            />
            <Text style={{fontSize: 20}}>{'\nLicense Photo Upload\n'}</Text>
            <Image
              style={{width: 200, height: 200, left: 70, top: 20}}
              source={require('./pics/default.png')}
            />
            <Text>{'\n\n\n\n'}</Text>

            <Button
              buttonStyle={{
                backgroundColor: 'rgb(88,214,141)',
                height: 40,
                width: 80,
                left: 40,
              }}
              titleStyle={{fontSize: 18, color: 'white'}}
              type="clear"
              title="Choose"
              onPress={() => this.getPhotos()}
            />
            <Text>{'\n\n\n\n\n\n\n\n\n\n'}</Text>
          </View>
        );
      }
    }

    return (
      <View style={styles.container}>
        <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{
            position: 'absolute',
            width: '95%',
            height: '65%',
            bottom: 125,
            left: 50,
            opacity: 0.05,
          }}
          source={require('./pics/logo.png')}
        />
        <Text style={styles.title}> Advance AutoFix </Text>
        <Text style={styles.subtitle}> for mechanic </Text>
        <Text />
        <GoogleSigninButton
          style={{
            width: 200,
            height: 48,
          }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.onSignInPress}
          disabled={isSigninInProgress}
        />
      </View>
    );
  }

  goProcessing() {
    const {loggedInUser} = this.state;
    let formData = new FormData();
    formData.append('user_name', loggedInUser.user.email);
    formData.append('id_token', loggedInUser.idToken);
    fetch(this.state.jobip + '/job/current', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (
          responseJson.status === 'OK' &&
          responseJson.response === undefined
        ) {
          this.props.navigation.navigate('JobDetail', {
            id: responseJson.job_id.toString(),
            onGoBack: () => this.isUserSignedIn(),
          });
        } else {
          Alert.alert('Error', responseJson.response);
        }
      })
      .catch(err => console.log(err.data));
  }

  getPhotos() {
    this.setState({image: '', cameraRoll: true, photos: []});
    CameraRoll.getPhotos({
      first: 20,
    })
      .then(r => {
        // console.log(r.edges);
        // console.log(r);
        this.setState({photos: r.edges});
      })
      .catch(err => console.log(err));
  }

  checkRegistered(loggedInUser) {
    if (
      loggedInUser &&
      loggedInUser.user &&
      loggedInUser.user.email &&
      loggedInUser.idToken
    ) {
      let status = '';
      let formData = new FormData();
      formData.append('user_name', loggedInUser.user.email);
      formData.append('id_token', loggedInUser.idToken);
      fetch(this.state.userip + '/login', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(responseJson => {
          status = responseJson.status;
          if (status === 'Found') {
            this.setState({isRegistered: true});
          } else if (status === 'Not_Found') {
            this.setState({isRegistered: false});
          } else {
            console.log(responseJson.response);
          }
        })
        .catch(err => console.log(err.data));
    }
  }
  /**
   * @name onSignInPress
   */
  onSignInPress = async () => {
    try {
      this.setState({isSigninInProgress: true});
      await GoogleSignin.hasPlayServices();
      const loggedInUser = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      this.setState({
        loggedInUser,
        isUserSignedIn: true,
        isSigninInProgress: false,
        isRegistered: false,
        accessToken: tokens.accessToken,
        idToken: tokens.idToken,
      });
      this.checkRegistered(loggedInUser);
    } catch (error) {
      this.handleSignInError(error);
    }
  };

  /**
   * @name isUserSignedIn
   */
  isUserSignedIn = async () => {
    this.setState({
      isUserSignedIn: false,
      checkingSignedInStatus: true,
    });
    const isUserSignedIn = await GoogleSignin.isSignedIn();
    if (isUserSignedIn) {
      await this.getCurrentUserInfo();
    }

    this.setState({
      isUserSignedIn,
      checkingSignedInStatus: false,
    });
  };

  /**
   * @name getCurrentUserInfo
   */
  getCurrentUserInfo = async () => {
    try {
      const loggedInUser = await GoogleSignin.signInSilently();
      const tokens = await GoogleSignin.getTokens();
      this.setState({
        loggedInUser,
        idToken: tokens.idToken,
        accessToken: tokens.accessToken,
      });
      this.checkRegistered(loggedInUser);
    } catch (error) {
      this.setState({
        loggedInUser: {},
        idToken: '',
        accessToken: '',
      });
    }
  };

  /**
   * @name signOut
   */
  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({
        isRegistered: false,
        isUserSignedIn: false,
        loggedInUser: null,
        idToken: '',
        accessToken: '',
      });
    } catch (error) {
      this.handleSignInError(error);
    }
  };

  /**
   * @name handleSignInError
   * @param error the SignIn error object
   */
  handleSignInError = async error => {
    if (error.code) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.showSignInError('User cancelled the login flow.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.showSignInError('Sign in is in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        await this.getGooglePlayServices();
      } else {
        this.showSignInError(JSON.stringify(error));
      }
    } else {
      this.showSignInError(JSON.stringify(error));
    }
    this.setState({isSigninInProgress: false});
  };

  /**
   * @name getGooglePlayServices
   */
  getGooglePlayServices = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // google services are available
    } catch (err) {
      this.showSignInError('play services are not available');
    }
  };

  /**
   * @name showSignInError
   * @param alertMessage - message to be shown on alert box
   */
  showSignInError = alertMessage => {
    Alert.alert(
      'Google Signin Error',
      alertMessage,
      [
        {
          text: 'OK',
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  onSignUp() {
    const {loggedInUser, image, lsn} = this.state;
    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append(
      'full_name',
      loggedInUser.user.givenName + ' ' + loggedInUser.user.familyName,
    );
    formdata.append('address', '');
    formdata.append('bio', '');
    formdata.append('paypal_info', '');
    formdata.append('ASECert_id', lsn);
    formdata.append('ASECert_pic', image);
    formdata.append('id_token', loggedInUser.idToken);
    fetch(this.state.userip + '/signup', {
      method: 'POST',
      body: formdata,
    }).then(() => this.setState({submitted: true, image: '', lsn: ''}));
  }
}

/**
 * Styles for the whole app
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 35,
    bottom: 130,
  },
  subtitle: {
    color: 'black',
    fontSize: 20,
    bottom: 110,
    left: 100,
  },
  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#1E6738',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  textInputStyle: {
    fontSize: 20,
    left: 25,
    width: 250,
    height: 30,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(234,236,238)',
  },
  buttonStyle: {
    backgroundColor: 'rgb(234,236,238)',
    height: 60,
    width: 450,
  },
  saveAndNextButton: {
    backgroundColor: 'rgb(88,214,141)',
    right: -240,
    top: 30,
    height: 40,
    width: 80,
  },
  titleStyle: {
    color: 'rgb(128,139,150)',
    fontSize: 20,
  },
  checkBoxContainer: {
    backgroundColor: 'white',
    borderWidth: 0,
  },
});
