import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutUp } from 'react-native-reanimated';
import axios, { AxiosError, AxiosResponse } from 'axios';

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
        axios.post("http://192.168.1.26:3000/auth/register", formData).then((result: AxiosResponse) => {
            console.log(result.status)
            navigation.push('HomePage')
        })
        .catch((error: AxiosError) => {
            setErrorText(error.response?.data.message)
            setErrorViewHidden("")
        })
    }

    return (
        <View className = "bg-white h-full w-full">
            <Animated.Image className = "h-full w-full absolute" source={require('../../../assets/background.jpg')} />
            {/* Background image da cambiare */}
            {/* Title and form */}
            <Animated.View className = "h-full w-full flex justify-around pt-40 pb-10">
            
                <View className = "flex items-center mx-4 space-y-4 pb-10">
                    {/* Title */}
                    <Animated.View entering={FadeInUp.duration(800).springify()} className = "flex items-center mb2">
                        <Text className = "text-5xl font-bold text-sky-500 tracking-wider">
                            Sign up
                        </Text>
                    </Animated.View>
                </View>
                <View className = "flex items-center mx-4 space-y-4">
                    {/* Form */}
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} className = "bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor={'gray'}
                            value={formData.username}
                            onChangeText={(text) => setFormData({...formData, username: text})}
                            
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} className = "bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={'gray'}
                            value={formData.email}
                            onChangeText={(text) => setFormData({...formData, email: text})}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} className = "p-5 rounded-2xl w-full bg-black/5 ">
                        <TextInput
                            placeholder='Password'
                            placeholderTextColor={'gray'}
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) => setFormData({...formData, password: text})}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} className = "p-5 rounded-2xl w-full bg-black/5 ">
                        <TextInput
                            placeholder='Confirm password'
                            placeholderTextColor={'gray'}
                            secureTextEntry
                            value={formData.confirmPassword}
                            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                        />
                    </Animated.View>
                    <View className = {"flex-row items-center m-1 " + errorViewHidden} >
                        <Text className = "text-red-500">{errorText}</Text>
                    </View>
                    <Animated.View entering={FadeInDown.delay(500).duration(800).springify()} className = "w-full">
                        <TouchableOpacity className = "bg-sky-400 p-3 rounded-2xl mb-2" onPress={() => {handleSignup()}}>
                            <Text className = "text-white text-center font-bold text-xl">SignUp</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(800).springify()} className = "flex-row items-center mb-10">
                        <Text className = "text-black">Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.push('Login')}>
                            <Text className = "text-sky-500"> Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>
        </View >
    )
}