import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Modal, TouchableOpacity } from "react-native";
import { Button, Divider } from "react-native-elements";
import Animated, { FadeInDown, FadeOutDown, ZoomIn } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";
import {User} from "../../../../../server/src/db/schema";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../helpers/api";
import { AxiosError } from "axios";

enum FORMDATAFIELDS {
    EMAIL = "Email",
    USERNAME = "Username",
    PASSWORD = "Password"
}

export default function Account({navigation} : {navigation: any}) {

    const [user, setUser] = React.useState<User>()
    const [modalVisible, setModalVisible] = React.useState(false)
    const [formData, setFormData] = React.useState({
        email: '',
        username: '',
        password: ''
    })
    const [fieldToChange, setFieldToChange] = React.useState<FORMDATAFIELDS>()

    function getProfile() {
        //TODO: Sostituire l'email con quella che verrà passata tramite sessione o jwt o quel che è 
        api.post("/users/getSelfUser").then((result: AxiosResponse) => {
            console.log("data:", result.data)
            setUser(result.data)
            setFormData({email: "", username: "", password: ""})
        })
        .catch((error: AxiosError) => {
            console.log(error)
        })
    }

    function updateFormData(field: FORMDATAFIELDS, text: string) {
        console.log(field)
        switch(field){
            case FORMDATAFIELDS.EMAIL:
                setFormData({email: text, username: "", password: ""})
                break
            case FORMDATAFIELDS.USERNAME:
                setFormData({email: "", username: text, password: ""})
                break
            case FORMDATAFIELDS.PASSWORD:
                setFormData({email: "", username: "", password: text})
                break
        }
    }

    function changeUserData() {
        //TODO: Sostituire l'email con quella che verrà passata tramite sessione o jwt o quel che è 
        axios.post("http://192.168.116.8:3000/users/changeUsername", {email:"a", newUsername: formData.username, newPassword: formData.password, newEmail: formData.email}).then((result: AxiosResponse) => {
            console.log(result.data)
            setUser(result.data.user)
            setModalVisible(false)
        })
    }

    function logout() {
        api.defaults.headers.common['Authorization'] = ""
        navigation.push("Login")
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <View className = "h-full w-full absolute bg-neutral-800 items-center">
            <SafeAreaView className = "z-20 w-full flex-row items-center px-4 mt-3">
                <TouchableOpacity className = " w-1/6  rounded-xl p-1" onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-left"
                        color={"orange"}
                        size={25}
                    />
                </TouchableOpacity>
                <View className="w-4/6 items-center">
                    <Text className="text-white font-bold text-2xl">Account</Text>
                </View>
                <TouchableOpacity className = "w-1/6 items-end pr-1" onPress={() => logout()}>
                    <Icon
                        name="sign-out"
                        color={"white"}
                        size={25}
                    />
                </TouchableOpacity>
            </SafeAreaView>
            <View className = "items-center mt-7 w-1/6">
                <Animated.Image className = " h-32 w-32 rounded-full" entering={ZoomIn.duration(300).springify()} source={require('../../../../assets/profile.jpg')} />
            </View>
            <View className = "flex items-center mt-3">
                <Text className = "text-white text-lg">{user?.username}</Text>
            </View>
            <View className = "flex items-center mt-4 p-7 bg-neutral-600 rounded-2xl w-80">
                    {/* Form */}
                    <Text className = "text-white w-full text-left font-bold mb-2">Username</Text>
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} exiting={FadeOutDown.delay(100).duration(800)} className = " flex flex-row bg-neutral-700 rounded-2xl w-full">
                        <TextInput
                            value= {user?.username}
                            editable={false}
                            className = "w-4/5 my-1 ml-3 text-white"
                        />
                    </Animated.View>
                    <Text className = "text-white w-full text-left font-bold mt-5 mb-2">Email</Text>
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} exiting={FadeOutDown.delay(100).duration(800)} className = " flex flex-row bg-neutral-700 rounded-2xl w-full">
                        <TextInput
                            value= {user?.email}
                            editable={false}
                            className = "w-4/5 my-1 ml-3 text-white"
                        />
                    </Animated.View>
                </View>
        </View>
    )
}
