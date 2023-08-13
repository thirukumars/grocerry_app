import React, { useState } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native'

const { height, width } = Dimensions.get('window')
function ImageSlider() {
    const [data, setata] = useState([1, 1, 1, 1])
    const [currentindex, setCurrentIndex] = useState(0)
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: height / 2 + 100, justifyContent: 'center', alignItems: 'center' }}>
                <FlatList data={data}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    onScroll={e => {
                        const x = e.nativeEvent.contentOffset.x
                        setCurrentIndex((x / width).toFixed(0))
                    }}
                    renderItem={({ item, index }) => {

                        return (
                            <View style={{ width: width, height: currentindex == index ? (height / 2 + 50) : height / 2, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity disabled={true}
                                    style={{
                                        width: '90%', height: '90%', backgroundColor: 'green',
                                        borderRadius: 10
                                    }}>
                                </TouchableOpacity>
                            </View>
                        )
                    }}

                />

            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: width, justifyContent: 'center', alignItems: 'center' }}>
                {
                    data.map((item, index) => {
                        return (
                            <View style={{
                                width: currentindex == index ? 30 : 8, height: currentindex == index ? 10 : 8, borderRadius: currentindex == index ? 5 : 4, backgroundColor:
                                    currentindex == index ? 'green' : 'grey', marginLeft: 5
                            }}>

                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

export default ImageSlider
