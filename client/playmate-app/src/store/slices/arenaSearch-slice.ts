// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface for arena search
interface ArenaSearchState {
    arenas: any[];
}

// Define the initial state for the arena search slice
const initialState: ArenaSearchState = {
    arenas: [],
};

// Create the arena search slice using createSlice
const arenaSearchSlice = createSlice({
    name: 'arenaSearch',  // Name of the slice
    initialState,         // Initial state
    reducers: {
        // Reducer function to set the arenas in the state
        setArenas: (state, action: PayloadAction<any[]>) => {
            state.arenas = action.payload;
        },
    },
});

// Export the setArenas action and the reducer function
export const { setArenas } = arenaSearchSlice.actions;
export default arenaSearchSlice.reducer;