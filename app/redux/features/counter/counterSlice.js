"use client"
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    score: {
        
    },
}
export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment : (state) =>{
            state.value += 1
        },
        decrement : (state) =>{
            state.value -= 1
        },
        initializeCounter: (state, action) => {
            state.value = action.payload; // Set the counter value to the payload value
        },
    }
})

export const { counter, increment, decrement, initializeCounter } = counterSlice.actions

export default counterSlice.reducer