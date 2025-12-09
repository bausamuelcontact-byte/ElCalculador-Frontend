import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    isVisible: (state) => {
      state.value = !state.value;
    },
  },
});

export const { isVisible } = loginSlice.actions;
export default loginSlice.reducer;
