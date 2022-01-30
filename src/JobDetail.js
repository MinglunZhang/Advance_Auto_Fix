import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Button} from 'react-native-elements';
import {GoogleSignin} from '@react-native-community/google-signin';

/**
 * The job detail page
 */
export default class JobDetail extends React.Component {
  static navigationOptions = {
    title: 'Job Details',
  };
  state = {
    jobip: 'http://localhost:5001',
    userip: 'http://localhost:5002',
    loggedInUser: {},
    id: this.props.navigation.getParam('id', ''),
    job: {
      job_id: '',
      job_type_id: '',
      address: '',
      details: '',
      cus_id: '',
      customer_name: '',
      job_type_name: '',
    },
    status: 'undefined',
    link: 'undefined',

    buttonName: '',
  };

  componentDidMount() {
    this.isUserSignedIn();
  }

  render() {
    const {job} = this.state;
    return (
      <View style={{left: 50, top: 80}}>
        <View>
          <Text style={{fontSize: 23}}>Customer Name:</Text>
          <Text style={{fontSize: 22}}>{'\t' + job.customer_name + '\n'}</Text>
          <Text style={{fontSize: 23}}>Location:</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('http://maps.apple.com/?q=' + job.address);
            }}>
            <Text
              style={{
                fontSize: 22,
                color: '#48b2f6',
              }}>
              {'\t' + job.address}
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize: 22}} />
          <Text style={{fontSize: 23}}>Issue:</Text>
          <Text style={{fontSize: 22}}>{'\t' + job.job_type_name + '\n'}</Text>
          <Text style={{fontSize: 23}}>Details:</Text>
          <Text style={{fontSize: 22}}>{'\t' + job.details + '\n'}</Text>
          <Text style={{fontSize: 23}}>Status:</Text>
          <Text style={{fontSize: 22}}>{'\t' + this.state.status}</Text>
          <Text>{'\n'}</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'https://shop.advanceautoparts.com/web/StoreLocatorView?storeId=10151&catalogId=10051&langId=-1',
              );
            }}>
            <Text
              style={{
                left: 25,
                textAlign: 'left',
                fontSize: 16,
                color: '#48b2f6',
                textDecorationLine: 'underline',
              }}>
              {' '}
              Find a nearby Advance Auto Parts Store?{' '}
            </Text>
          </TouchableOpacity>
          <Text />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(this.state.link);
            }}>
            <Text
              style={{
                left: 25,
                textAlign: 'left',
                fontSize: 16,
                color: '#48b2f6',
                textDecorationLine: 'underline',
              }}>
              {' '}
              Have trouble on fixing the car?{' '}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.status === 'Unbooked' && (
          <Button
            buttonStyle={{
              backgroundColor: 'rgb(88,214,141)',
              height: 40,
              width: 80,
              top: 30,
              left: 210,
            }}
            titleStyle={{fontSize: 18, color: 'white'}}
            type="clear"
            title={'Accept'}
            onPress={() => this.acceptJob()}
          />
        )}
        {this.state.status === 'Booked' && (
          <View style={{flexDirection: 'row'}}>
            <Button
              buttonStyle={{
                backgroundColor: 'rgb(88,214,141)',
                height: 40,
                width: 80,
                top: 30,
                left: 210,
              }}
              titleStyle={{fontSize: 18, color: 'white'}}
              type="clear"
              title={'Cancel'}
              onPress={() => this.cancelJob()}
            />
            <Button
              buttonStyle={{
                backgroundColor: 'rgb(88,214,141)',
                height: 40,
                width: 80,
                top: 30,
                right: 50,
              }}
              titleStyle={{fontSize: 18, color: 'white'}}
              type="clear"
              title={'Start'}
              onPress={() => this.updateJob()}
            />
          </View>
        )}
        {(this.state.status === 'Parts Picking Up' ||
          this.state.status === 'Job Started' ||
          this.state.status === 'Job Processing') && (
          <View style={{flexDirection: 'row'}}>
            <Button
              buttonStyle={{
                backgroundColor: 'rgb(88,214,141)',
                height: 40,
                width: 80,
                top: 30,
                left: 210,
              }}
              titleStyle={{fontSize: 18, color: 'white'}}
              type="clear"
              title={'Cancel'}
              onPress={() => this.cancelJob()}
            />
            <Button
              buttonStyle={{
                backgroundColor: 'rgb(88,214,141)',
                height: 40,
                width: 80,
                top: 30,
                right: 50,
              }}
              titleStyle={{fontSize: 18, color: 'white'}}
              type="clear"
              title={'Next'}
              onPress={() => this.updateJob()}
            />
          </View>
        )}
        {this.state.status === 'Repairs Done' && (
          <Button
            buttonStyle={{
              backgroundColor: 'rgb(88,214,141)',
              height: 40,
              width: 80,
              top: 30,
              left: 30,
            }}
            titleStyle={{fontSize: 18, color: 'white'}}
            type="clear"
            title={'Next'}
            onPress={() => this.updateJob()}
          />
        )}
        {this.state.status === 'Parts Returning' && (
          <Button
            buttonStyle={{
              backgroundColor: 'rgb(88,214,141)',
              height: 40,
              width: 80,
              top: 30,
              left: 30,
            }}
            titleStyle={{fontSize: 18, color: 'white'}}
            type="clear"
            title={'Finish'}
            onPress={() => this.finishJob()}
          />
        )}
      </View>
    );
  }

  acceptJob() {
    // console.log(this.state.loggedInUser);
    let formdata = new FormData();
    formdata.append('user_name', this.state.loggedInUser.user.email);
    formdata.append('id_token', this.state.loggedInUser.idToken);
    formdata.append('job_id', this.state.job.job_id.toString());
    formdata.append('store_id', '1');
    fetch(this.state.jobip + '/job/book', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status !== undefined) {
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        }
      })
      .catch(err => console.log(err));
  }

  _cancelJob() {
    let formdata = new FormData();
    formdata.append('user_name', this.state.loggedInUser.user.email);
    formdata.append('id_token', this.state.loggedInUser.idToken);
    formdata.append('job_id', this.state.job.job_id.toString());
    fetch(this.state.jobip + '/job/unbook', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status !== undefined) {
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        }
      })
      .catch(err => console.log(err));
  }
  cancelJob() {
    Alert.alert('Cancelation', 'Are you sure to cancel this job?', [
      {text: 'Keep canceling', onPress: () => this._cancelJob()},
      {text: 'Wait for later', onPress: () => {}},
    ]);
  }

  updateJob() {
    let formdata = new FormData();
    formdata.append('user_name', this.state.loggedInUser.user.email);
    formdata.append('id_token', this.state.loggedInUser.idToken);
    formdata.append('job_id', this.state.job.job_id.toString());
    var status = '';
    if (this.state.status === 'Unbooked') {
      status = 'Booked';
    } else if (this.state.status === 'Booked') {
      status = 'Parts Picking Up';
    } else if (this.state.status === 'Parts Picking Up') {
      status = 'Job Started';
    } else if (this.state.status === 'Job Started') {
      status = 'Job Processing';
    } else if (this.state.status === 'Job Processing') {
      status = 'Repairs Done';
    } else if (this.state.status === 'Repairs Done') {
      status = 'Parts Returning';
    } else if (this.state.status === 'Parts Returning') {
      status = 'Job Finished';
    }
    formdata.append('description', status);
    fetch(this.state.jobip + '/job/status/update', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'OK') {
          this.setStatus(responseJson.response);
        } else {
          Alert.alert('Error', responseJson.response);
        }
      })
      .catch(err => console.log(err));
  }

  setStatus(status_id) {
    if (
      status_id === 8 ||
      status_id === 9 ||
      status_id === 10 ||
      status_id === '0'
    ) {
      this.setState({status: 'Unbooked'});
    } else if (status_id === 1) {
      this.setState({status: 'Booked'});
    } else if (status_id === 2) {
      this.setState({status: 'Parts Picking Up'});
    } else if (status_id === 3) {
      this.setState({status: 'Job Started'});
    } else if (status_id === 4) {
      this.setState({status: 'Job Processing'});
    } else if (status_id === 5) {
      this.setState({status: 'Repairs Done'});
    } else if (status_id === 6) {
      this.setState({status: 'Parts Returning'});
    } else if (status_id === 7) {
      this.setState({status: 'Job Finished'});
    }
  }

  finishJob() {
    this.updateJob();
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  }

  initialization(loggedInUser) {
    this.getJobById(loggedInUser);
    this.getCurrentStatus(loggedInUser);
    // console.log(this.state.id);
  }

  getCurrentStatus(loggedInUser) {
    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append('id_token', loggedInUser.idToken);
    formdata.append('job_id', this.state.id);
    fetch(this.state.jobip + '/job/status/current', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'OK') {
          this.setStatus(responseJson.current_status);
        } else {
          Alert.alert('Error', responseJson.response);
        }
      })
      .catch(err => console.log(err));
  }

  getJobById(loggedInUser) {
    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append('id_token', loggedInUser.idToken);
    formdata.append('job_id', this.state.id);
    fetch(this.state.jobip + '/job/single', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'OK') {
          // console.log(responseJson);
          var temp = responseJson;
          var job = {
            job_id: temp.job_id,
            job_type_id: temp.job_type_id,
            address: temp.address,
            details: temp.details,
            cus_id: temp.cus_id,
            customer_name: temp.cus_name,
            job_type_name: temp.job_type_name,
          };
          // console.log(job);
          this.setState({job: job});
          this.getVideoLink(loggedInUser);
          // console.log(this.state.job);
        } else {
          Alert.alert('Error', temp.response);
        }
      })
      .catch(err => console.log(err));
  }

  getVideoLink(loggedInUser) {
    this.setState({loggedInUser: loggedInUser});
    let formdata = new FormData();
    formdata.append('user_name', loggedInUser.user.email);
    formdata.append('id_token', loggedInUser.idToken);
    fetch(this.state.jobip + '/job/vediolink', {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === undefined) {
          for (let i = 0; i < responseJson.length; i++) {
            if (responseJson[i][0] === this.state.job.job_type_id) {
              this.setState({link: responseJson[i][2]});
              // console.log(this.state.link);
              // this.setState({link: 'https://video.advanceautoparts.com/'});
              break;
            }
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
      this.initialization(loggedInUser);
    } catch (error) {
      this.setState({
        loggedInUser: {},
        idToken: '',
        accessToken: '',
      });
    }
  };
}
