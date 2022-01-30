import * as React from 'react';
import {StyleSheet, View, TextInput, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {GoogleSignin} from '@react-native-community/google-signin';

/**
 * Name page
 */
export default class Bio extends React.Component {
  static navigationOptions = {
    title: 'Biography',
  };
  state = {
    jobip: 'http://localhost:5001',
    userip: 'http://localhost:5002',

    isUserSignedIn: false,
    loggedInUser: null,
    checkingSignedInStatus: true,
    isRegistered: true,
    accessToken: '',
    idToken: '',

    first: '',
    last: '',
    address: '',
    bio: '',
    payPal: '',
    userID: '',
  };

  componentDidMount() {
    this.isUserSignedIn();
  }

  render() {
    return (
      <View style={styles.container} style={{top: 50, left: 45}}>
        <TextInput
          placeholder="  Biography"
          value={this.state.bio}
          style={styles.textInputStyle}
          multiline={true}
          onChangeText={input => this.setState({bio: input})}
        />
        <Button
          buttonStyle={styles.saveAndNextButton}
          titleStyle={{color: 'white', fontSize: 18}}
          type="clear"
          title="Save"
          onPress={() => this.setBio()}
        />
      </View>
    );
  }

  getBio(loggedInUser) {
    // console.log(loggedInUser);

    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append('id_token', loggedInUser.idToken);
    fetch(this.state.userip + '/profile', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        var name = responseJson.full_name;
        const names = name.split(' ');
        this.setState({
          first: names[0],
          last: names[1],
          bio: responseJson.bio,
          address: responseJson.address,
          payPal: responseJson.paypal_info,
          userID: responseJson.user_id,
        });
      })
      .catch(err => console.log(err));
  }

  setBio() {
    const {
      loggedInUser,
      first,
      last,
      address,
      bio,
      payPal,
      userID,
    } = this.state;
    if (bio.length > 5000) {
      Alert.alert(
        'Invalid Input',
        'Length should be less than 5000 characters',
      );
    } else {
      let formdata = new FormData();
      formdata.append('user_name', loggedInUser.user.email);
      formdata.append('full_name', first + ' ' + last);
      formdata.append('address', address);
      formdata.append('paypal_info', payPal);
      formdata.append('bio', bio);
      formdata.append('user_id', userID);
      formdata.append('id_token', loggedInUser.idToken);
      fetch(this.state.userip + '/profile', {
        method: 'PUT',
        body: formdata,
      })
        .then(response => this.props.navigation.goBack())
        .catch(err => console.log(err));
    }
  }

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
      this.getBio(loggedInUser);
    } catch (error) {
      this.setState({
        loggedInUser: {},
        idToken: '',
        accessToken: '',
      });
    }
  };
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
  saveAndNextButton: {
    backgroundColor: 'rgb(88,214,141)',
    right: -240,
    top: 30,
    height: 40,
    width: 80,
  },
  textInputStyle: {
    fontSize: 20,
    width: 320,
    height: 320,
    borderWidth: 1,
    borderColor: 'rgb(234,236,238)',
  },
});
