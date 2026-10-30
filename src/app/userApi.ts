import { api } from './api'
import ENDPOINTS, { withId } from './endpoints'
import type { CreateUserDto, LoginDto, LoginResponse, UpdateUserDto, User } from './models/userTypes'

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getUsers: build.query<User[], void>({
      query: () => ENDPOINTS.USERS,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User' as const, id: 'LIST' }]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    getUserById: build.query<User, string>({
      query: (id) => withId(ENDPOINTS.USERS, id),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: build.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: ENDPOINTS.USERS,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: build.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: withId(ENDPOINTS.USERS, id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
    }),

    deleteUser: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: withId(ENDPOINTS.USERS, id),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi
