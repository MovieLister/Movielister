import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutUp } from 'react-native-reanimated';

export default function SignupScreen({navigation} : {navigation: any}) {
    return (
        <View className = "bg-white h-full w-full">
            
            {/* Title and form */}
            <Animated.View className = "h-full w-full flex justify-around pt-40 pb-10">
            
                <View className = "flex items-center mx-4 space-y-4 pb-10">
                    {/* Title */}
                    <Animated.View entering={FadeInUp.duration(800).springify()} className = "flex items-center mb2">
                        <Text className = "text-5xl font-bold text-sky-500 tracking-wider">
                            Sign up
                        </Text>
                    </Animated.View>
                    
                    {/* Form */}
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} className = "bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput placeholder='Username' placeholderTextColor={'gray'} />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} className = "bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput placeholder='Email' placeholderTextColor={'gray'} />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} className = "bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput placeholder='Password' placeholderTextColor={'gray'} secureTextEntry />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} className = "bg-black/5 p-5 rounded-2xl w-full">
                        <TextInput placeholder='Repeat password' placeholderTextColor={'gray'} secureTextEntry />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(500).duration(800).springify()} className = "w-full">
                        <TouchableOpacity className = "bg-sky-400 p-3 rounded-2xl mb-2">
                            <Text className = "text-white text-center font-bold text-xl">Login</Text>
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