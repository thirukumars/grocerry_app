import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const CustomeButton2 = props => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.container, props?.btnStyle]}
        disabled={props?.disabled}
        onPress={props?.navigationPath}>
        <Text style={[styles.title, props?.btnText]}>{props?.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

let styles = StyleSheet.create({
  title: {
    color: '#FEBF22',
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    width: '100%',
    height: 40,
    backgroundColor: '#12352F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default CustomeButton2;
