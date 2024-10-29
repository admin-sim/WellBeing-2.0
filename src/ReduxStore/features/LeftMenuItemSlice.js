import { createSlice } from "@reduxjs/toolkit";



const LeftMenuItems = createSlice({
  name: "LeftMenuItems",
  initialState: {
    value: [],
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { update } = LeftMenuItems.actions;

export default LeftMenuItems.reducer;
