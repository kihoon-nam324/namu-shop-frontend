import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/userSlice.js'

let cart = createSlice({
    name : 'cart',
    initialState : [
        
    ],
    reducers : {
        addCount(state, action){
            //let no = state.findIndex((a) => { return a.no === action.payload })
            let no = state.findIndex((a) => { return a.no === action.payload.no })

            if(state[no].stock > action.payload.count){
                state[no].count++
                state[no].price = calculatePrice(state[no].count, state[no].unitPrice) 
            }
        },
        addItem(state, action){
            let no = state.findIndex((a) => { return a.no === action.payload.no })
            if(state[no]) {
                //state[no].count = parseInt(state[no].count) + parseInt(action.payload.count);
                state[no].count = state[no].count + action.payload.count;
                state[no].price = calculatePrice(state[no].count, state[no].unitPrice)
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
                state[no].price = calculatePrice(state[no].count, state[no].unitPrice) 
            }
        },
        clearState(state){
            return [];
        }
    }
}) 


function calculatePrice(count, unitPrice) {
    return count * unitPrice;
}

export let { addCount, addItem, removeItem, subtractCount, clearState } = cart.actions

export default configureStore({
    reducer: {
        user : user.reducer,
        cart : cart.reducer
    }
})