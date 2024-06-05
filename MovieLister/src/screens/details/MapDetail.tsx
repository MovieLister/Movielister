import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import React, { useEffect } from 'react';
import { Cinema } from '../../../../server/src/db/schema';
import { api } from '../../helpers/api';
import { Media } from '../HomePage/pages/Search';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Image } from 'react-native-elements';

export default function MapDetail({ route, navigation }: { route: any, navigation: any}) {
    const [location, setLocation] = React.useState<GeolocationCoordinates>();
    const [cinemas, setCinemas] = React.useState<Cinema[]>([]);
    const [media, setMedia] = React.useState<Media>(route.params.media);
    const [releasDate, setReleaseDate] = React.useState<Date>(new Date(route.params.media.releaseDate));

    const loadCinemas = async () => {
        const response = await api.post('/cinemas/getCinemas')
        setCinemas(response.data)
    }

    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            setLocation(info.coords);
        });
        loadCinemas()
    }, []);

    useEffect(() => {
        console.log(releasDate);
    }, [releasDate]);
    return (
        <SafeAreaView className='bg-neutral-900 flex pb-1 min-h-full'>
            <View className = "absolute z-20 w-full flex-row items-center px-4 mt-3">
                <TouchableOpacity className = "rounded-xl p-1" onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-left"
                        color={"orange"}
                        size={25}
                    />
                </TouchableOpacity>
            </View>
            {location && cinemas ? (
                <MapView
                    provider={'google'}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: location?.latitude || 37.78825,
                        longitude: location?.longitude || -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                    showsCompass={false}
                    rotateEnabled={true}
                >
                    {cinemas.map((cinema) => (
                        <Marker
                            key={cinema.id}
                            coordinate={{
                                latitude: parseFloat(cinema.latitude),
                                longitude: parseFloat(cinema.longitude),
                            }}
                            title={cinema.name}
                            description={
                                `Available till ${media.releaseDate? (new Date(releasDate?.getTime() + (120 + Math.random() * 5) * 24 * 60 * 60 * 1000).toLocaleDateString()) : null}`
                            }
                        >
                            <Image
                                source={require('../../../assets/cinemaPin.png')}
                                style={{ width: 50, height: 50 }}
                                tintColor={'#d66c02'}
                            />
                        </Marker>
                    ))
                    }
                </MapView>
            ) : null}
        </SafeAreaView>
    );
}