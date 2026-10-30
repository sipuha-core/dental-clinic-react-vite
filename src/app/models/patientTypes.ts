export interface Patient {
  id: string
  first_name: string
  last_name: string
  phone: string | null
  birth_date: string | null
  created_at: string
  updated_at: string
}

export interface CreatePatientDto {
  first_name: string
  last_name: string
  phone: string | null
  birth_date: string | null
}

export type UpdatePatientDto = Partial<CreatePatientDto>
