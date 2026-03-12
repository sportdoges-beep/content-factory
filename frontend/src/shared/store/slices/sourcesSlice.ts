import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contentSourcesApi } from '../../services/api';
import { ContentSource } from '../../services/api.types';

interface SourcesState {
  sources: ContentSource[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SourcesState = {
  sources: [],
  isLoading: false,
  error: null,
};

export const fetchSourcesByAccount = createAsyncThunk(
  'sources/fetchByAccount',
  async (accountId: string, { rejectWithValue }) => {
    try {
      const response = await contentSourcesApi.getByAccount(accountId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sources');
    }
  }
);

export const createSource = createAsyncThunk(
  'sources/create',
  async ({ accountId, data }: { accountId: string; data: Partial<ContentSource> }, { rejectWithValue }) => {
    try {
      const response = await contentSourcesApi.create(accountId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create source');
    }
  }
);

export const updateSource = createAsyncThunk(
  'sources/update',
  async ({ id, data }: { id: string; data: Partial<ContentSource> }, { rejectWithValue }) => {
    try {
      const response = await contentSourcesApi.update(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update source');
    }
  }
);

export const deleteSource = createAsyncThunk(
  'sources/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await contentSourcesApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete source');
    }
  }
);

export const toggleSource = createAsyncThunk(
  'sources/toggle',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await contentSourcesApi.toggle(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle source');
    }
  }
);

const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    clearSources: (state) => {
      state.sources = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by account
      .addCase(fetchSourcesByAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSourcesByAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sources = action.payload;
      })
      .addCase(fetchSourcesByAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createSource.fulfilled, (state, action) => {
        state.sources.unshift(action.payload);
      })
      // Update
      .addCase(updateSource.fulfilled, (state, action) => {
        const index = state.sources.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.sources[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteSource.fulfilled, (state, action) => {
        state.sources = state.sources.filter((s) => s.id !== action.payload);
      })
      // Toggle
      .addCase(toggleSource.fulfilled, (state, action) => {
        const index = state.sources.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.sources[index] = action.payload;
        }
      });
  },
});

export const { clearSources, clearError } = sourcesSlice.actions;
export default sourcesSlice.reducer;
