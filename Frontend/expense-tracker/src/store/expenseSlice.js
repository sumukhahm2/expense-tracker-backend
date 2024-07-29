import store from "./store";

import { createSlice } from "@reduxjs/toolkit";

const defaultValue={
   expenses:[],

}


const ExpenseSlice=createSlice({
    name:'expense',
    initialState:defaultValue,
    reducers:{
       addExpense(state,action){
        //console.log(action.payload)
          state.expenses=state.expenses.concat(action.payload)
          console.log(state.expenses)
       },
       deleteExpense(state,action){
        console.log(action.payload)
         state.expenses=state.expenses.filter(expense=>expense.id!=action.payload)
       }
    }
})

export const expenseAction=ExpenseSlice.actions

export default ExpenseSlice.reducer