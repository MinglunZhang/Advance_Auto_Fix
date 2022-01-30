import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';

/**
 * profile and preferences page
 */
export default class ProfileAndPreferences extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };
  render() {
    return (
      <View style={styles.container}>
        <Button
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          title={'First Name\t\t\t\t\t\t\t\t\t>'}
          onPress={() => this.props.navigation.navigate('firstName')}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          title={'Last Name\t\t\t\t\t\t\t\t\t>'}
          onPress={() => this.props.navigation.navigate('lastName')}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          title={'Address\t\t\t\t\t\t\t\t\t\t>'}
          onPress={() => this.props.navigation.navigate('Address')}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          title={'Biography\t\t\t\t\t\t\t\t\t>'}
          onPress={() => this.props.navigation.navigate('Bio')}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          title={'PayPal\t\t\t\t\t\t\t\t\t\t\t>'}
          onPress={() => this.props.navigation.navigate('PayPal')}
        />
      </View>
    );
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
    justifyContent: 'flex-start',
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
