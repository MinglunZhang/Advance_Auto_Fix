import * as React from 'react';
import {StyleSheet, Text, Alert, TextInput, View} from 'react-native';
import Select from 'react-native-select-plus';
import {Button} from 'react-native-elements';
import {GoogleSignin} from '@react-native-community/google-signin';
import Geolocation from 'react-native-geolocation-service';
import Slider from '@react-native-community/slider';

/**
 * the job type page
 */
export default class jobSearch extends React.Component {
  static navigationOptions = {
    title: 'Job Search',
  };
  state = {
    jobip: 'http://localhost:5001',
    userip: 'http://localhost:5002',
    loggedInUser: '',

    typeSelected: {key: '', label: ''},
    typeList: [],
    distance: 0,
    longitude: '',
    latitude: '',
  };

  componentDidMount() {
    this.getAddress();
    this.isUserSignedIn();
  }

  render() {
    const {typeList} = this.state;
    return (
      <View
        style={{
          top: 30,
          left: 50,
          flex: 1,
        }}>
        <Text style={{fontSize: 20}}>{'Coordinate'}</Text>
        <View style={{flexDirection: 'row', left: 50, top: 15}}>
          <TextInput
            placeholder="  Latitude"
            value={this.state.latitude}
            style={styles.textInputStyle}
            keyboardType={'numeric'}
            onChangeText={input => this.setState({latitude: input})}
          />
          <Text style={{top: 5, fontSize: 25}}> {',\t'}</Text>
          <TextInput
            placeholder="  Longitude"
            value={this.state.longitude}
            style={styles.textInputStyle}
            keyboardType={'numeric'}
            onChangeText={input => this.setState({longitude: input})}
          />
        </View>
        <Text style={{top: 15, fontSize: 20}}>{'\nRange'}</Text>
        <Slider
          style={{width: 230, height: 40, left: 40, top: 20}}
          value={this.state.distance}
          minimumValue={0}
          maximumValue={99999}
          minimumTrackTintColor="green"
          maximumTrackTintColor="grey"
          onValueChange={input => this.setState({distance: input})}
        />
        <Text style={{top: 15, left: 230}}>
          {parseFloat(this.state.distance)
            .toFixed(2)
            .toString() + ' miles'}
        </Text>
        <Text style={{top: -5, fontSize: 20}}>{'\nJob Type'}</Text>

        <Select
          style={{left: 50, top: 10}}
          data={typeList}
          width={220}
          placeholder="Choose a job type"
          onSelect={this.onSelectedItemsChange.bind(this)}
          search={true}
        />
        <View style={{flexDirection: 'row', bottom: -30, left: -200}}>
          <Button
            buttonStyle={styles.saveAndNextButton}
            titleStyle={{color: 'white', fontSize: 18}}
            type="clear"
            title="Reset"
            onPress={() => this.reset()}
          />
          <Text>{'\t\t\t'}</Text>
          <Button
            buttonStyle={styles.saveAndNextButton}
            titleStyle={{color: 'white', fontSize: 18}}
            type="clear"
            title="Search"
            onPress={() =>
              this.props.navigation.navigate('JobList', {
                loggedInUser: this.state.loggedInUser,
                preference: this.state.typeSelected.key,
                distance: this.state.distance.toFixed(0).toString(),
                longitude: this.state.longitude,
                latitude: this.state.latitude,
              })
            }
          />
        </View>
      </View>
    );
  }

  onSelectedItemsChange = (key, label) => {
    this.setState({typeSelected: {key: key.toString(), label: label}});
  };

  getAddress() {
    Geolocation.getCurrentPosition(
      position => {
        // const location = JSON.stringify(position);
        this.setState({
          latitude: position.coords.latitude.toFixed(3).toString(),
          longitude: position.coords.longitude.toFixed(3).toString(),
        });
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000},
    );
  }

  reset() {
    this.getAddress();
    this.setState({distance: 0});
  }

  getQualifications(loggedInUser) {
    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append('id_token', loggedInUser.idToken);
    fetch(this.state.jobip + '/job/qualification', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === undefined) {
          var types = [];
          for (let i = 0; i < responseJson.length; i++) {
            types.push({key: responseJson[i][0], label: responseJson[i][1]});
          }
          this.setState({loggedInUser: loggedInUser, typeList: types});
        } else {
          Alert.alert('Error', responseJson.response);
        }
      })
      .catch(err => console.log(err));
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
        loggedInUser: loggedInUser,
        idToken: tokens.idToken,
        accessToken: tokens.accessToken,
      });
      this.getQualifications(loggedInUser);
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
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 35,
    bottom: 120,
    left: 0,
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
    fontSize: 18,
    width: 100,
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
