import { api } from './api'
import ENDPOINTS, { withId } from './endpoints'
import type { CreateVisitServiceDto, UpdateVisitServiceDto, VisitService } from './models/visitServiceTypes'

export const visitServiceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVisitServices: build.query<VisitService[], void>({
      query: () => ENDPOINTS.VISIT_SERVICES,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'VisitService' as const, id })), { type: 'VisitService' as const, id: 'LIST' }]
          : [{ type: 'VisitService' as const, id: 'LIST' }],
    }),
    getVisitServiceById: build.query<VisitService, string>({
      query: (id) => withId(ENDPOINTS.VISIT_SERVICES, id),
      providesTags: (_result, _error, id) => [{ type: 'VisitService', id }],
    }),
    getVisitServicesByVisit: build.query<VisitService[], string>({
      query: (visitId) => `${ENDPOINTS.VISIT_SERVICES}/by-visit/${visitId}`,
      providesTags: [{ type: 'VisitService', id: 'LIST' }],
    }),
    createVisitService: build.mutation<VisitService, CreateVisitServiceDto>({
      query: (body) => ({
        url: ENDPOINTS.VISIT_SERVICES,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'VisitService', id: 'LIST' }],
    }),
    updateVisitService: build.mutation<VisitService, { id: string; data: UpdateVisitServiceDto }>({
      query: ({ id, data }) => ({
        url: withId(ENDPOINTS.VISIT_SERVICES, id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'VisitService', id }, { type: 'VisitService', id: 'LIST' }],
    }),
    deleteVisitService: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: withId(ENDPOINTS.VISIT_SERVICES, id),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'VisitService', id }, { type: 'VisitService', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetVisitServicesQuery,
  useGetVisitServiceByIdQuery,
  useGetVisitServicesByVisitQuery,
  useCreateVisitServiceMutation,
  useUpdateVisitServiceMutation,
  useDeleteVisitServiceMutation,
} = visitServiceApi
