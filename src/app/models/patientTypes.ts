export interface Patient {
  id: string
  first_name: string
  last_name: string
  phone: string
  birth_date: string | null
  created_at: string
  updated_at: string
}

export type CreatePatientDto = Pick<Patient, 'first_name' | 'last_name' | 'phone' | 'birth_date'>

export type UpdatePatientDto = Partial<CreatePatientDto>
