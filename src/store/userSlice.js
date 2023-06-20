import { createSlice } from '@reduxjs/toolkit'

let user = createSlice({
    name : 'user',
    initialState : { name : 'Namu', age : 36 },
    reducers : {
        changeName(state) {
            state.name = 'park'
        },
        increase(state, a) {
            state.age += a.payload
        },
    }
})

export let { changeName, increase } = user.actions

export default user