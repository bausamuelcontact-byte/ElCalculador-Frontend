import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const singinSlice = createSlice({
  name: "singin",
  initialState,
  reducers: {
    isVisibleSingin: (state) => {
      state.value = !state.value;
    },
  },
});

export const { isVisibleSingin } = singinSlice.actions;
export default singinSlice.reducer;
