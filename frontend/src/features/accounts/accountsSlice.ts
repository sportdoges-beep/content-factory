import { createSlice } from '@reduxjs/toolkit';

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: [],
    parentAccounts: [],
  },
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setParentAccounts: (state, action) => {
      state.parentAccounts = action.payload;
    },
  },
});

export const { setAccounts, setParentAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;
