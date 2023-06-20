import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/userSlice.js'

let cart = createSlice({
    name : 'cart',
    initialState : [
        
    ],
    reducers : {
        addCount(state, action){
            let no = state.findIndex((a) => { return a.no === action.payload })
            state[no].count++
        },
        addItem(state, action){
            let no = state.findIndex((a) => { return a.no === action.payload.no })
            if(state[no]) {
                state[no].count = parseInt(state[no].count) + parseInt(action.payload.count);
            } else {
                state.push(action.payload);
            }
        },
        removeItem(state, action){
            let copy = state.filter((a) => { 
                return a.no !== action.payload
            })

            return copy;
        },
        subtractCount(state, action){
            let no = state.findIndex((a) => { return a.no === action.payload })
            if(state[no].count > 1){
                state[no].count--;
            }
        },
    }
}) 

export let { addCount, addItem, removeItem, subtractCount } = cart.actions

export default configureStore({
    reducer: {
        user : user.reducer,
        cart : cart.reducer
    }
})