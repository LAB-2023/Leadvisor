import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
export default function VersionInfo() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'black',
          fontFamily: 'NotoSansKR-Regular',
        }}>
        버전 정보 입니다.{'\n'}
        버전 정보 입니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
