import { api } from './api'
import ENDPOINTS, { withId } from './endpoints'
import type { CreatePatientDto, Patient, UpdatePatientDto } from './models/patientTypes'

export const patientApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPatients: build.query<Patient[], { search: string }>({
      query: ({ search }) => ({
        url: ENDPOINTS.PATIENTS,
        params: { search },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Patient' as const, id })), { type: 'Patient' as const, id: 'LIST' }]
          : [{ type: 'Patient' as const, id: 'LIST' }],
    }),

    getPatientById: build.query<Patient, string>({
      query: (id) => withId(ENDPOINTS.PATIENTS, id),
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),

    createPatient: build.mutation<Patient, CreatePatientDto>({
      query: (body) => ({
        url: ENDPOINTS.PATIENTS,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),

    updatePatient: build.mutation<Patient, { id: string; data: UpdatePatientDto }>({
      query: ({ id, data }) => ({
        url: withId(ENDPOINTS.PATIENTS, id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Patient', id }, { type: 'Patient', id: 'LIST' }],
    }),

    deletePatient: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: withId(ENDPOINTS.PATIENTS, id),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Patient', id }, { type: 'Patient', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi
