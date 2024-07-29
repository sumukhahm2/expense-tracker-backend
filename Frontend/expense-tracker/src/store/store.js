import {configureStore} from '@reduxjs/toolkit'
import AuthReducer from './authSlice'
import ExpenseReducer from './expenseSlice'
import LeaderboardAction  from './leaderboardSlice'
const store=configureStore({
    reducer:{auth:AuthReducer,expense:ExpenseReducer,leaderboard:LeaderboardAction}
}) 

export default store