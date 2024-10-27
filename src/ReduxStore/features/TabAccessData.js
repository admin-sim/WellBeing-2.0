import { createSlice } from "@reduxjs/toolkit";

const TabAccessData = createSlice({
  name: "TabAccessData",
  initialState: {
    value: {},
  },
  reducers: {
    updateTabAccessData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateTabAccessData } = TabAccessData.actions;

export default TabAccessData.reducer;
