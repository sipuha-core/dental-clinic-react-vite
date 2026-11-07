import { api } from './api'
import ENDPOINTS, { withId } from './endpoints'
import type { CreateVisitDto, UpdateVisitDto, Visit } from './models/visitTypes'

export const visitApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVisits: build.query<Visit[], void>({
      query: () => ENDPOINTS.VISITS,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Visit' as const, id })), { type: 'Visit' as const, id: 'LIST' }]
          : [{ type: 'Visit' as const, id: 'LIST' }],
    }),
    getVisitById: build.query<Visit, string>({
      query: (id) => withId(ENDPOINTS.VISITS, id),
      providesTags: (_result, _error, id) => [{ type: 'Visit', id }],
    }),
    createVisit: build.mutation<Visit, CreateVisitDto>({
      query: (body) => ({
        url: ENDPOINTS.VISITS,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Visit', id: 'LIST' }],
    }),
    updateVisit: build.mutation<Visit, { id: string; data: UpdateVisitDto }>({
      query: ({ id, data }) => ({
        url: withId(ENDPOINTS.VISITS, id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Visit', id }, { type: 'Visit', id: 'LIST' }],
    }),
    deleteVisit: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: withId(ENDPOINTS.VISITS, id),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Visit', id }, { type: 'Visit', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetVisitsQuery,
  useGetVisitByIdQuery,
  useCreateVisitMutation,
  useUpdateVisitMutation,
  useDeleteVisitMutation,
} = visitApi
