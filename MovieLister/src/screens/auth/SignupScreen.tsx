import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AxiosError, AxiosResponse } from 'axios';
import { api } from "../../helpers/api"
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SignupScreen({navigation} : {navigation: any}) {
    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errorViewHidden, setErrorViewHidden] = React.useState("hidden")
    const [errorText, setErrorText] = React.useState('')

    const handleSignup = async () => {
        if(formData.password !== formData.confirmPassword){
            setErrorText("Passwords do not match")
            setErrorViewHidden("")
            return
        }
        api.post("/auth/register", formData).then((result: AxiosResponse) => {
            console.log(result.status)
            api.defaults.headers.common['Authorization'] = `Bearer ${result.data.data.jwt}`
            navigation.push('HomePage')
        })
        .catch((error: AxiosError<{error: string}>) => { 
            setErrorText(error.response?.data.error ?? "")
            setErrorViewHidden("")
        })
    }

    return (
        <View className = "bg-white h-full w-full">
            <Animated.Image className = "h-full w-full absolute" source={require('../../../assets/background2.jpg')} />
            {/* Background image da cambiare */}
            {/* Title and form */}
            <Animated.View className = "h-full w-full flex justify-around pb-10">
            
                <View className = "flex items-start" style={{height: height * 0.4}}>
                    {/* Title */}
                    <Animated.View entering={FadeInUp.duration(800).springify()} className = " mt-20 mx-4 flex">
                        <Text className = "text-5xl font-bold text-amber-600 tracking-wider">
                            Sign up
                        </Text>
                    </Animated.View>
                </View>
                <View className = "flex items-center mx-4 space-y-3" style={{height: height * 0.57}}>
                    {/* Form */}
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} className = "bg-black/40 p-2 rounded-2xl w-full">
                        <TextInput
                            placeholder='Username'
                            placeholderTextColor={'black'}
                            value={formData.username}
                            onChangeText={(text) => setFormData({...formData, username: text})}

                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} className = "bg-black/40 p-2 rounded-2xl w-full">
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={'black'}
                            value={formData.email}
                            onChangeText={(text) => setFormData({...formData, email: text})}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} className = "bg-black/40 p-2 rounded-2xl w-full ">
                        <TextInput
                            placeholder='Password'
                            placeholderTextColor={'black'}
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) => setFormData({...formData, password: text})}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} className = "bg-black/40 p-2 rounded-2xl w-full ">
                        <TextInput
                            placeholder='Confirm password'
                            placeholderTextColor={'black'}
                            secureTextEntry
                            value={formData.confirmPassword}
                            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                        />
                    </Animated.View>
                    <View className = {"flex-row items-center bg-white " + errorViewHidden} >
                        <Text className = "text-red-600 font-bold">{errorText}</Text>
                    </View>
                    <Animated.View entering={FadeInDown.delay(500).duration(800).springify()} className = "w-full">
                        <TouchableOpacity className = "bg-neutral-700 p-3 rounded-2xl" onPress={() => {handleSignup()}}>
                            <Text className = "text-neutral-200 text-center font-bold text-xl">SignUp</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(800).springify()} className = "flex-row items-center">
                        <Text className = "text-black">Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.push('Login')}>
                            <Text className = "text-neutral-200"> Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>
        </View >
    )
}
