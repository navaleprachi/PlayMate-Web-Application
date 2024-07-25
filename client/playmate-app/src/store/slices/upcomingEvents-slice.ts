
// landingPageSlice.js
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

interface EventSearchState {
    events: any[];
}

const initialState:EventSearchState = {
  events: [],
  // Add other state properties as needed
};

const landingPageSlice = createSlice({
  name: 'upcomingEvents',
  initialState,
  reducers: {
    setEvents: (state, action:PayloadAction<any[]>) => {
      state.events = action.payload;
    },
    
    // Add other reducers for additional state properties
  },
});

export const { setEvents } = landingPageSlice.actions;
export default landingPageSlice.reducer;
