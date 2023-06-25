import { createSlice } from '@reduxjs/toolkit'

let products = createSlice({
    name : 'products',
    initialState : [],
    reducers : {
        getProducts(state, action) {
          
        },
    }
})

export let { getProducts } = products.actions

export default products