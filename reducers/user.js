import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, id: null, avatar: null},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.id = action.payload.id;
      state.value.avatar = action.payload.avatar;
      console.log("token", action.payload);
    },
    logout: (state) => {
      state.value.token = null;
      state.value.id = null;
      state.value.avatar = null;
      console.log("passe");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
