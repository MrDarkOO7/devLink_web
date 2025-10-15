import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    updateFeed: (state, action) => {
      return state.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    },
    removeUserFromFeed: (state, action) => {
      return state.filter((user) => user._id != action.payload);
    },
    removeFeed: (state, action) => {
      return null;
    },
  },
});

export const { addFeed, updateFeed, removeUserFromFeed, removeFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
