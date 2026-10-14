import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const configuredBaseUrl = import.meta.env.VITE_API_URL ?? '/api'
const baseUrl = configuredBaseUrl.endsWith('/') ? configuredBaseUrl : `${configuredBaseUrl}/`

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['User', 'Patient', 'Visit', 'VisitService', 'Payment', 'Service'],
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints: () => ({}),
})