/// Import necessary functions and slices from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';
// Import individual reducers for different parts of your application state
import blogReducer from './slices/blog-slice';
import blogCreateReducer from './slices/blogCreate-slice';
import arenaSearchReducer from './slices/arenaSearch-slice';
import signInReducer from './slices/signIn-slice';
import signUpReducer from './slices/signUp-slice';
import forgotPasswordReducer from './slices/forgotPassword-slice';
import resetPasswordReducer from './slices/resetPassword-slice';
import personalizationProfileReducer from './slices/personalizationProfile-slice';
import eventHistoryReducer from './slices/eventHistory-slice';

// Configure the Redux store by combining all the reducers
const store = configureStore({
    reducer: {
        // Assign each slice of the state to its corresponding reducer
        blog: blogReducer,
        blogCreate: blogCreateReducer,
        arenaSearch: arenaSearchReducer,
        signIn: signInReducer,
        signUp: signUpReducer,
        forgotPassword: forgotPasswordReducer,
        resetPassword: resetPasswordReducer,
        createProfile: personalizationProfileReducer,
        userBookings: eventHistoryReducer,
    },
});

// Export the configured Redux store for use in the application
export default store;