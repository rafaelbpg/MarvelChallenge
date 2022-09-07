import { useCallback, useEffect, useState } from "react"
import { retrieveUserFromStorage, logout } from "../../services/authService"
import { Alert } from 'react-native'
import { useNavigation } from "@react-navigation/native"

type HeaderComponentControllerReturn = {
    completeName : string,
    logoutAlert : Function
}

function HeaderComponentController() : HeaderComponentControllerReturn {
    const [completeName, setCompleteName] = useState('')
    const navigation = useNavigation()
    const logoutAlert = useCallback(() => {
        Alert.alert(
            'Warning!!!', 
            "Do you really want to close your session?",
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        logout()
                        navigation.navigate('Login')
                    }
                },
            ]
        )
    }, [logout, Alert])
    useEffect(() => {
        retrieveUserFromStorage().then(response => {
            const {name, lastName} = response
            setCompleteName(`${name} ${lastName}`)
        })
    }, [setCompleteName])
    return {
        completeName,
        logoutAlert
    };
}

export default HeaderComponentController