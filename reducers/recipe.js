import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    addRecipe: (state, action) => {
      state.value = action.payload;
    },
    removeRecipe: (state, action) => {
      state.value = {};
    },
  },
});

export const { addRecipe, removeRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
