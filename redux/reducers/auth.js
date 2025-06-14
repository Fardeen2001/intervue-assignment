const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  user: {},
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
});
export const authSliceReducer = authSlice.reducer;
export const { setUser, clearUser } = authSlice.actions;
