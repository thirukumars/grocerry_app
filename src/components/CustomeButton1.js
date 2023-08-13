import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const CustomeButton1 = props => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.container, props?.btnStyle]}
        onPress={props?.navigationPath}
        disabled={props?.disabled}
        >
        <Text style={[styles.title, props?.btnText]}>{props?.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

let styles = StyleSheet.create({
  title: {
    color: '#12352F',
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    width: '100%',
    height: 40,
    backgroundColor: '#FEBF22',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default CustomeButton1;
