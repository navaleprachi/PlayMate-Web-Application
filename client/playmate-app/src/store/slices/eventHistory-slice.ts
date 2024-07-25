
// landingPageSlice.js
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

interface EventSearchState {
    eventHistory: any[];
}

const initialState:EventSearchState = {
  eventHistory: [],
  // Add other state properties as needed
};

const eventHistorySlice = createSlice({
  name: 'eventHistory',
  initialState,
  reducers: {
    setEventHistory: (state, action:PayloadAction<any[]>) => {
      state.eventHistory = action.payload;
    },
    
    // Add other reducers for additional state properties
  },
});

export const { setEventHistory } = eventHistorySlice.actions;
export default eventHistorySlice.reducer;
