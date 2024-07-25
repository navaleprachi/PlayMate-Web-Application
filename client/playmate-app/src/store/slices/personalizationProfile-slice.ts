import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreateProfileState {
  userProfile: {
    first_name: string;
    last_name: string;
    sports_entries: {
      sports_interest: string;
      skill_level: string;
      play_frequency: string;
    }[];
  };
  isProfileCreated: boolean;
}

const initialState: CreateProfileState = {
  userProfile: {
    first_name: '',
    last_name: '',
    sports_entries: [],
  },
  isProfileCreated: false,
};

const createProfileSlice = createSlice({
  name: 'createProfile',
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.userProfile.first_name = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.userProfile.last_name = action.payload;
    },
    addSportEntry: (
      state,
      action: PayloadAction<{
        sports_interest: string;
        skill_level: string;
        play_frequency: string;
      }>
    ) => {
      state.userProfile.sports_entries.push(action.payload);
    },
    clearUserProfile: (state) => {
      state.userProfile = initialState.userProfile;
    },
    setProfileCreated: (state) => {
      state.isProfileCreated = true;
    },
    clearProfileCreated: (state) => {
      state.isProfileCreated = false;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  addSportEntry,
  clearUserProfile,
  setProfileCreated,
  clearProfileCreated,
} = createProfileSlice.actions;
export default createProfileSlice.reducer;
