import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instagramAccountsApi } from '../../services/api';
import { InstagramAccount } from '../../services/api.types';

interface AccountsState {
  accounts: InstagramAccount[];
  currentAccount: InstagramAccount | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  currentAccount: null,
  isLoading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instagramAccountsApi.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch accounts');
    }
  }
);

export const fetchAccountById = createAsyncThunk(
  'accounts/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await instagramAccountsApi.getById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch account');
    }
  }
);

export const createAccount = createAsyncThunk(
  'accounts/create',
  async (data: Partial<InstagramAccount>, { rejectWithValue }) => {
    try {
      const response = await instagramAccountsApi.create(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create account');
    }
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/update',
  async ({ id, data }: { id: string; data: Partial<InstagramAccount> }, { rejectWithValue }) => {
    try {
      const response = await instagramAccountsApi.update(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update account');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await instagramAccountsApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

export const toggleAutoPost = createAsyncThunk(
  'accounts/toggleAutoPost',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await instagramAccountsApi.toggleAutoPost(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle auto post');
    }
  }
);

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearCurrentAccount: (state) => {
      state.currentAccount = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch by id
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.currentAccount = action.payload;
      })
      // Create
      .addCase(createAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts.unshift(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        if (state.currentAccount?.id === action.payload.id) {
          state.currentAccount = action.payload;
        }
      })
      // Delete
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => a.id !== action.payload);
      })
      // Toggle auto post
      .addCase(toggleAutoPost.fulfilled, (state, action) => {
        const index = state.accounts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      });
  },
});

export const { clearCurrentAccount, clearError } = accountsSlice.actions;
export default accountsSlice.reducer;
