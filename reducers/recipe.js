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
      console.log("Action =>", action.payload);
    },
  },
});

export const { addRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
