import {StatusBar, Text} from 'react-native';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {RTCView} from 'react-native-webrtc';
import {Director, View as MillicastView} from '@millicast/sdk';
import {Colors} from 'react-native/Libraries/NewAppScreen';


class MillicastWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streamURL: null,
    };

    this.styles = StyleSheet.create({
      video: {
        width: 480,
        height: 320,
      },
    });
    this.subscribe(props.streamName, props.accountID);
  }

  async subscribe(streamName, accountID) {
    console.log(streamName, accountID);
    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName: streamName,
        streamAccountId: accountID,
      });

    // Create a new instance
    const millicastView = new MillicastView(streamName, tokenGenerator, null);

    // Set track event handler to receive streams from Publisher.
    millicastView.on('track', event => {
      console.log(`My event is ${event}`);
      const videoUrl = event.streams[0].toURL();
      if (!videoUrl) {
        return null;
      }

      this.setState({
        streamURL: videoUrl,
      });
    });

    // Start connection to viewer
    try {
      await millicastView.connect();
    } catch (e) {
      console.log('Connection failed. Reason:', e);
    }
  }

  // reconnect = () => {
  //   millicastView.reconnect();
  // };

  render() {
    return (
      <RTCView streamURL={this.state.streamURL} style={this.styles.video} />
    );
  }
}
export default function MainApp() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.darker} />
      <Text>"Streaming Demo"</Text>
      <MillicastWidget streamName="Qamar" accountID="nhUQ2c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

