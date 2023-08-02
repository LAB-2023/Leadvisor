import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
export default function TermsOfUse() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'black',
          fontFamily: 'NotoSansKR-Regular',
        }}>
        이용약관 입니다.{'\n'}
        이용약관 입니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
