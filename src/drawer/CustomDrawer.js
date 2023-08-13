import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React from 'react';
import CommonCard from '../common/CommonCard';
const data = [
    {
        title: 'Starred',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
    {
        title: 'Snoozed',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
    {
        title: 'Important',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
    {
        title: 'Sent',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
    {
        title: 'Scheduled',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
    {
        title: 'Outbox',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
    {
        title: 'Drafts',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
    {
        title: 'Archieved',
        icon: require('../assets/img/discount.png'),
        isNew: false,
        count: 2,
    },
];
const CustomDrawer = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <Text
                    style={{
                        color: 'gold',
                        fontSize: 27,
                        //fontWeight: '700',
                        marginLeft: 20,
                    }}>
                    Hibee
                </Text>
                <View
                    style={{
                        width: '100%',
                        marginTop: 20,
                        height: 70,
                        borderTopWidth: 0.2,
                        borderBottomWidth: 0.2,
                        borderBottomColor: '#C7C7C7',
                        borderTopColor: '#C7C7C7',
                    }}>
                    <CommonCard
                        icon={require('../assets/img/discount.png')}
                        count={''}
                        title={'Menu'}
                        onClick={() => {
                            navigation.closeDrawer();
                        }}
                    />
                </View>
                <CommonCard
                    icon={require('../assets/img/discount.png')}
                    title={'Home'}
                    onClick={() => {
                        navigation.closeDrawer();
                    }}
                />
                <CommonCard
                    icon={require('../assets/img/discount.png')}
                    newColor={'green'}
                    isNew={true}
                    title={'MyAccount'}
                    onClick={() => {
                        navigation.closeDrawer();
                    }}
                />
                <CommonCard
                    icon={require('../assets/img/discount.png')}

                    newColor={'blue'}
                    isNew={true}
                    title={'Promotions'}
                    onClick={() => {
                        navigation.closeDrawer();


                    }}
                />


            </View>
        </SafeAreaView>
    );
};

export default CustomDrawer;