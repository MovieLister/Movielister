import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Modal } from "react-native";
import { Button, Divider } from "react-native-elements";
import Animated, { FadeInDown, FadeOutDown, ZoomIn } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";
import {User} from "../../../../../server/src/db/schema";

enum FORMDATAFIELDS {
    EMAIL = "Email",
    USERNAME = "Username",
    PASSWORD = "Password"
}

export default function Account() {

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
        axios.post("http://192.168.1.98:3000/users/getUser", {email: "a"}).then((result: AxiosResponse) => {
            setUser(result.data.user)
            setFormData({email: "", username: "", password: ""})
        })
        .catch((error) => {
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
        axios.post("http://192.168.1.98:3000/users/changeUsername", {email:"a", newUsername: formData.username, newPassword: formData.password, newEmail: formData.email}).then((result: AxiosResponse) => {
            console.log(result.data)
            setUser(result.data.user)
            setModalVisible(false)
        })
    }

    //TODO: Funzioni per cambiare username, email e password con possibilmente un modal che si apre

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <View className = "h-full w-full absolute bg-neutral-800 items-center">
            {/* Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className = "w-full h-full flex justify-center items-center" style = {{backgroundColor : "rgba(0,0,0,0.8)"}} >
                    <View className = "w-4/5 h-1/5 bg-neutral-800 rounded-2xl">
                        <View className = "flex flex-row items-center">
                            <Text className = "text-black text-2xl mt-3 text-white ml-3 w-5/6">Change {fieldToChange}</Text>
                            <View className = "flex justify-center items-center w-1/6 mr-2 mt-3">
                                <Icon
                                    name="times"
                                    size={20}
                                    color="white"
                                    onPress={() => setModalVisible(false)}
                                />
                            </View>
                        </View>
                        <Divider className = "w-full bg-neutral-200 mt-1"/>
                        <TextInput
                            placeholder={"New " + fieldToChange}
                            className = "w-4/5 h-10 m-3 rounded-2xl bg-neutral-200"
                            onChangeText={(text) => {updateFormData(fieldToChange!, text)}}
                        />
                        <Button
                            buttonStyle = {
                                {
                                    backgroundColor: "orange",
                                    borderRadius: 20,
                                    width: 100,
                                    alignSelf: "center"
                                }
                            }
                            onPress={() => changeUserData()}
                            title="Change"
                        />
                    </View>
                </View>
            </Modal>


            <Text className="text-white text-2xl mt-2">Account</Text>
            <View className = "items-center mt-10">
                <Animated.Image className = " h-40 w-40 rounded-full" entering={ZoomIn.duration(300).springify()} source={require('../../../../assets/profile.jpg')} />
            </View>
            <View className = "flex items-center mt-5">
                <Text className = "text-white text-lg">{user?.username}</Text>
            </View>
            <View className = "flex items-center mt-7 p-7 bg-neutral-600 rounded-2xl w-80">
                    {/* Form */}
                    <Text className = "text-white w-full text-left font-bold mt-5 mb-2">Username</Text>
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} exiting={FadeOutDown.delay(100).duration(800)} className = " flex flex-row bg-neutral-700 rounded-2xl w-full">
                        <TextInput
                            value= {user?.username}
                            editable={false}
                            className = "w-4/5 my-3 ml-3 text-white"
                        />
                        <View className = " ml-1 flex justify-center items-center">
                            <Button
                                icon={
                                    <Icon
                                    name="pencil"
                                    size={15}
                                    color="white"
                                    
                                    />
                                }
                                onPress={() => {
                                    setModalVisible(true)
                                    setFieldToChange(FORMDATAFIELDS.USERNAME)
                                }}
                                type="clear"
                            />
                        </View>
                    </Animated.View>
                    <Text className = "text-white w-full text-left font-bold mt-5 mb-2">Email</Text>
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} exiting={FadeOutDown.delay(100).duration(800)} className = " flex flex-row bg-neutral-700 rounded-2xl w-full">
                        <TextInput
                            value= {user?.email}
                            editable={false}
                            className = "w-4/5 my-3 ml-3 text-white"
                        />
                        <View className = " ml-1 flex justify-center items-center">
                            <Button
                                icon={
                                    <Icon
                                    name="pencil"
                                    size={15}
                                    color="white"
                                    
                                    />
                                }
                                onPress={() => {
                                    setModalVisible(true)
                                    setFieldToChange(FORMDATAFIELDS.EMAIL)
                                }}
                                type="clear"
                            />
                        </View>
                    </Animated.View>
                    <Text className = "text-white w-full text-left font-bold mt-5 mb-2">Password</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} exiting={FadeOutDown.delay(200).duration(800)} className = "flex flex-row bg-neutral-700 rounded-2xl w-full">
                        <TextInput
                            value={user?.password}
                            editable={false}
                            secureTextEntry
                            className = "w-4/5 my-3 ml-3 text-white"
                        />
                         <View className = " ml-1 flex justify-center items-center">
                            <Button
                                icon={
                                    <Icon
                                    name="pencil"
                                    size={15}
                                    color="white"
                                    
                                    />
                                }
                                onPress={() => {
                                    setModalVisible(true)
                                    setFieldToChange(FORMDATAFIELDS.PASSWORD)
                                }}
                                type="clear"
                            />
                        </View>
                    </Animated.View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    }
})