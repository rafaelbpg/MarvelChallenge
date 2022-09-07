import { useState } from "react"
import { retrieveData, storeData } from "./storage"
import { TokenModel } from "../models/TokenModel"
import { UserModel } from "../models/UserModel"
import UserList from "../mocked/UserList"
import { toBase64 } from "./encoding"
const wrongUsernameAndOrPassword = new Error('Wrong username and/or password. Verify your entried data and try again...')

async function login(username: string, password: string): Promise<UserModel> {
    const encryptedPassword = toBase64(password)
    const signedUser = UserList.find((user: UserModel) => user.username === username)
    if (signedUser === undefined || !signedUser?.id || !isAValidPassword(signedUser.password, encryptedPassword)){
        throw wrongUsernameAndOrPassword
    }
    const token = generateToken(signedUser)
    saveToken(token)
    saveUserInStorage(signedUser)
    return signedUser
}

function isAValidPassword($originalPassword: string, $compareWith: string){
    //Write a code if there is an algorithm with multiple values for encryptedPassword
    //In this case will be only 1 result for encryption
    return $originalPassword === $compareWith

}

function generateToken({id} : UserModel): TokenModel{
    //Here the logic to create a token for an user
    const token : TokenModel = {
        id_user : id,
        token_type : 'bearer',
        token : Math.random().toString()
    }
    return token
}

async function saveToken($token: TokenModel) : Promise<void> {
    storeData('token', JSON.stringify($token))
}

async function saveUserInStorage($user : UserModel): Promise<void>{
    storeData('user', JSON.stringify($user))
}

async function retrieveUserFromStorage() : Promise<UserModel> {
    const user = await retrieveData('user')
    if (user === '' || user === null || user === undefined){
        throw new Error('User is not logged')
    }
    return JSON.parse(user)
}

async function retrieveToken() : Promise<TokenModel | undefined> {
    const token = await retrieveData('token')
    if (token === '' || token === null || token === undefined){
        return undefined
    }
    return JSON.parse(token)
}

async function logout() : Promise<void> {
    storeData('token', '')
    storeData('user', '')
}

export {
    login,
    logout,
    saveToken,
    retrieveToken,
    generateToken,
    retrieveUserFromStorage,
    wrongUsernameAndOrPassword
}