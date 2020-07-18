import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  Clipboard,
} from 'react-native';
import { Header, Input, Icon } from 'react-native-elements';

const checkError = (msg) => {
  return msg.indexOf('Error: ') > -1;
};

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [text, setText] = useState('');

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center', // Centered horizontally
      justifyContent: 'center',
      flex: 1,
    },
  });
  useEffect(() => {
    if (text.length === 5) {
      fetch(`http://uni.hys.cz/includes/get-api?user=${text}`)
        .then((response) => response.text())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [text]);

  return (
    <View>
      <Header
        containerStyle={{
          backgroundColor: '#333333',
          justifyContent: 'space-around',
        }}>
        <Icon
          onPress={() => {
            alert('QR code more like bruh-r code');
          }}
          type="font-awesome"
          name="qrcode"
          color="#fff"
        />

        <Text style={{ color: 'white', fontSize: 30 }}>Interclip</Text>
      </Header>

      <View>
        <Input
          style={styles.container}
          placeholder="Your code here"
          maxLength={5}
          inputStyle={{ fontSize: 50 }}
          autoCorrect={false}
          returnKeyType={'go'}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          errorStyle={{ color: 'red' }}
          autoCapitalize="none"
          autoFocus={true}
          value={text.replace(' ', '').toLowerCase()}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            !isLoading
              ? Linking.openURL(data)
              : alert(
                  'No URL set yet, make sure your code is 5 characters long!'
                );
          }}
        />

        <View style={{ padding: 24 }}>
          <Text>{text}</Text>
        </View>
        <View style={{ padding: 24 }}>
          {isLoading ? (
            <Text></Text>
          ) : (
            <Text
              onPress={() => {
                Clipboard.setString(data);
                alert('Copied to Clipboard!');
              }}
              style={{
                color: checkError(data) ? 'red' : 'black',
                fontSize: 20,
              }}>
              {checkError(data) ? "This code doesn't seem to exist 🤔" : data}
            </Text>
          )}
        </View>
        <StatusBar style="light" />
      </View>
    </View>
  );
}
