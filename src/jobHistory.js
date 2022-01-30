import * as React from 'react';
import {StyleSheet, Text, FlatList, View} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';

/**
 * the job type page
 */
export default class jobHistory extends React.Component {
  static navigationOptions = {
    title: 'Status Tracking',
  };
  state = {
    jobip: 'http://localhost:5001',
    userip: 'http://localhost:5002',
    loggedInUser: '',
    list: [],
    message: 'There is no record on file.',
  };

  componentDidMount() {
    this.isUserSignedIn();
  }

  render() {
    if (this.state.list.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20}}>{this.state.message}</Text>
        </View>
      );
    } else {
      return (
        <View style={{alignSelf: 'flex-start'}}>
          <FlatList
            data={this.state.list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View>
                <Text>
                  {'Name: ' +
                    item.name +
                    '\n' +
                    'Issue: ' +
                    item.issue +
                    '\n' +
                    'Status: ' +
                    item.status +
                    '\n' +
                    'Time: ' +
                    item.time +
                    '\n'}
                </Text>
              </View>
            )}
          />
        </View>
      );
    }
  }

  getHistory(loggedInUser) {
    // console.log(loggedInUser);
    // var list = [
    //   {name: 'Mocked data 1', status: 'finished', time: '1:00'},
    //   {name: 'Mocked data 2', status: 'canceled', time: '2:00'},
    //   {name: 'Mocked data 3', status: 'finished', time: '3:00'},
    // ];
    // this.setState({list: list});
    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append('id_token', loggedInUser.idToken);
    fetch(this.state.jobip + '/job/history', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === undefined) {
          if (responseJson.length > 0) {
            // console.log(responseJson[0]);
            var list = [];
            for (let i = 0; i < responseJson.length; i++) {
              var job = {
                name: responseJson[i][3],
                status: responseJson[i][1],
                time: responseJson[i][2],
                issue: responseJson[i][4],
              };
              list.push(job);
            }
            this.setState({list: list});
            // console.log(this.state.list);
          }
        }
        // console.log(this.state.link);
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
      this.getHistory(loggedInUser);
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
