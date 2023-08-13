import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomeButton4 = props => {
    return (
        <View>
            <TouchableOpacity
                style={[styles.container, props?.btnStyle]}
                onPress={props?.navigationPath}>
                <Text style={[styles.title, props?.btnText]}>{props?.title}</Text>
            </TouchableOpacity>
        </View>
    );
};

let styles = StyleSheet.create({
    title: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
        height: 13,
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 10,
        /* identical to box height */
        textAlign: 'center',
        color: '#3C5F58'
    },
    container: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
        width: '80%',
        height: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 25,
        border: 4,
        borderColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
        marginTop: -80

    },
});

export default CustomeButton4;
