import * as React from 'react';
import {StyleSheet, View, FlatList, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {GoogleSignin} from '@react-native-community/google-signin';

/**
 * Job List page
 */
export default class Calendar extends React.Component {
  static navigationOptions = {
    title: 'Calendar',
  };

  state = {
    jobip: 'http://localhost:5001',
    userip: 'http://localhost:5002',
    jobList: [],
  };

  componentDidMount() {
    this.isUserSignedIn();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.jobList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View>
              <Button
                buttonStyle={styles.buttonStyle}
                titleStyle={styles.titleStyle}
                style={styles.fullWidthButton}
                title={item.customer_name + "'s order"}
                onPress={() => this.jobDetail(item.job_id)}
              />
            </View>
          )}
        />
      </View>
    );
  }

  jobDetail(id) {
    this.props.navigation.navigate('JobDetail', {
      id: id.toString(),
      onGoBack: () => this.isUserSignedIn(),
    });
    // console.log(job);
  }

  getCalendar(loggedInUser) {
    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append('id_token', loggedInUser.idToken);
    fetch(this.state.jobip + '/job/booked/mec', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === undefined) {
          var list = [];
          for (let i = 0; i < responseJson.length; i++) {
            var temp = responseJson[i];
            var job = {
              job_id: temp.job_id,
              job_type_id: temp.job_type_id,
              address: temp.address,
              details: temp.details,
              cus_id: temp.cus_id,
              customer_name: temp.customer_name,
              job_type_name: temp.job_type_name,
            };
            list.push(job);
          }
          this.setState({jobList: list});
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
      this.getCalendar(loggedInUser);
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
  },
  fullWidthButton: {
    backgroundColor: 'grey',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  buttonStyle: {
    backgroundColor: 'rgb(234,236,238)',
    height: 60,
    width: 450,
  },
  titleStyle: {
    color: 'rgb(128,139,150)',
    fontSize: 20,
  },
});
