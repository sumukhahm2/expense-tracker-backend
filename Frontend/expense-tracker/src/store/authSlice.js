import store from "./store";

import { createSlice } from "@reduxjs/toolkit";

const defaultValue={
    username:'',
    email:'',
    password:'',
    isLogin:false,
    token:null,
    isPremium:false
}


const AuthSlice=createSlice({
    name:'auth',
    initialState:defaultValue,
    reducers:{
        signup(state,action){
            console.log(action)
            state.username=action.payload.username
            state.email=action.payload.email
            state.password=action.payload.password
        },
        login(state,action){
            localStorage.setItem('email',action.payload.email)
            localStorage.setItem('username',action.payload.username)
            console.log(action.payload.token)
            localStorage.setItem('token',action.payload.token)
            console.log(action.payload.token)
            state.isLogin=true
            state.email=action.payload.email
            state.password=action.payload.password
            state.token=action.payload.token
        },
        stayLogin(state){
            state.isLogin=true
        },
        setPremium(state,action){
            localStorage.setItem('premium',true)
            state.isPremium=true
            console.log(action.payload.token)
            localStorage.setItem('token',action.payload.token)
            state.token=action.payload.token
        }
    }
})

export const authAction=AuthSlice.actions

export default AuthSlice.reducer