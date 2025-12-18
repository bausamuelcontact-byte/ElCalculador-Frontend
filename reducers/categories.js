import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		setCategories: (state, action) => {
            console.log(action.payload)
          state.value = action.payload; 
        },
        addCategory: (state, action) => {
        state.value.push(action.payload); 
        },
        updateCategory:  (state, action) => {
        state.value = state.value.map(cat => cat._id === action.payload._id ? action.payload : cat) 
        },
		    removeCategory: (state, action) => {
          state.value = state.value.filter(cat => cat._id !== action.payload); 
        },
	}	
});

export const { setCategories, addCategory, removeCategory } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
