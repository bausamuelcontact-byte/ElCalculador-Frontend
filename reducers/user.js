import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, username: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      console.log("token", action.payload);
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      console.log("passe");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
