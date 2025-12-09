import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	value: [],
	selectedTag: null,
};

export const trendsSlice = createSlice({
	name: 'trends',
	initialState,
	reducers: {
		setAllTrends: (state, action) => {
          state.value = action.payload; 
        },

		tagSearch: (state, action) => {
		    // Hashtag = action.payload
			state.selectedTag = action.payload;
		},
	
	}	
});

export const { tagSearch, removeTrend, setAllTrends } = trendsSlice.actions;
export default trendsSlice.reducer;
