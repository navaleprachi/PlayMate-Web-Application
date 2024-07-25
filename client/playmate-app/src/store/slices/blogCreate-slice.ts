// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface for the blogCreate slice
interface BlogCreateState {
    isCreating: boolean;
    errorMessage: string | null;
}

// Define the initial state for the blogCreate slice
const initialState: BlogCreateState = {
    isCreating: false,
    errorMessage: null,
};

// Create the blogCreate slice using createSlice
const blogCreateSlice = createSlice({
    name: 'blogCreate',  // Name of the slice
    initialState,  // Initial state
    reducers: {
        // Reducer function to set the 'isCreating' property in the state
        setCreating: (state, action: PayloadAction<boolean>) => {
            state.isCreating = action.payload;
        },
        // Reducer function to set the 'errorMessage' property in the state
        setErrorMessage: (state, action: PayloadAction<string | null>) => {
            state.errorMessage = action.payload;
        },
    },
});

// Export the setCreating and setErrorMessage actions, and the reducer function
export const { setCreating, setErrorMessage } = blogCreateSlice.actions;
export default blogCreateSlice.reducer;