import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Account', 'ParentAccount', 'Content'],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation<{ accessToken: string; user: any }, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<{ accessToken: string; user: any }, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    // Accounts
    getAccounts: builder.query<any[], void>({
      query: () => '/accounts',
      providesTags: ['Account'],
    }),
    addAccount: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/accounts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Account'],
    }),
    updateAccount: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/accounts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Account'],
    }),
    deleteAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),

    // Parent Accounts
    getParentAccounts: builder.query<any[], void>({
      query: () => '/accounts/parent',
      providesTags: ['ParentAccount'],
    }),
    addParentAccount: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/accounts/parent',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ParentAccount'],
    }),
    updateParentAccount: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/accounts/parent/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ParentAccount'],
    }),

    // Content
    getContent: builder.query<any[], void>({
      query: () => '/content',
      providesTags: ['Content'],
    }),
    triggerDownload: builder.mutation<any[], string>({
      query: (parentAccountId) => ({
        url: `/content/${parentAccountId}/download`,
        method: 'POST',
      }),
      invalidatesTags: ['Content'],
    }),
    publishContent: builder.mutation<any, string>({
      query: (id) => ({
        url: `/content/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['Content'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAccountsQuery,
  useAddAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetParentAccountsQuery,
  useAddParentAccountMutation,
  useUpdateParentAccountMutation,
  useGetContentQuery,
  useTriggerDownloadMutation,
  usePublishContentMutation,
} = api;
