import { api } from './api'
import ENDPOINTS, { withId } from './endpoints'
import type { CreateServiceDto, Service, UpdateServiceDto } from './models/serviceTypes'

export const serviceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query<Service[], void>({
      query: () => ENDPOINTS.SERVICES,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Service' as const, id })), { type: 'Service' as const, id: 'LIST' }]
          : [{ type: 'Service' as const, id: 'LIST' }],
    }),
    getServiceById: build.query<Service, string>({
      query: (id) => withId(ENDPOINTS.SERVICES, id),
      providesTags: (_result, _error, id) => [{ type: 'Service', id }],
    }),
    createService: build.mutation<Service, CreateServiceDto>({
      query: (body) => ({
        url: ENDPOINTS.SERVICES,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    updateService: build.mutation<Service, { id: string; data: UpdateServiceDto }>({
      query: ({ id, data }) => ({
        url: withId(ENDPOINTS.SERVICES, id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Service', id }, { type: 'Service', id: 'LIST' }],
    }),
    deleteService: build.mutation<{ message: boolean }, string>({
      query: (id) => ({
        url: withId(ENDPOINTS.SERVICES, id),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Service', id }, { type: 'Service', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi
