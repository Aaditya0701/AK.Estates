import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'
export const store = configureStore({
    reducer: {user: userReducer},
    //must to add this middleware so the browser will not throw error for not serialiazing the variables
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});