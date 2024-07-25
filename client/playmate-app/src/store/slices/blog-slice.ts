// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface for the blog slice
interface BlogState {
    blogs: any[];
    selectedBlog: any | null;
}

// Define the initial state for the blog slice
const initialState: BlogState = {
    blogs: [],
    selectedBlog: null,
};

// Create the blog slice using createSlice
const blogSlice = createSlice({
    name: 'blog',  // Name of the slice
    initialState,  // Initial state
    reducers: {
        // Reducer function to set the blogs in the state
        setBlogs: (state, action: PayloadAction<any[]>) => {
            state.blogs = action.payload;
        },
        // Reducer function to set the selected blog in the state
        setSelectedBlog: (state, action: PayloadAction<any | null>) => {
            state.selectedBlog = action.payload;
        },
    },
});

// Export the setBlogs and setSelectedBlog actions, and the reducer function
export const { setBlogs, setSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;