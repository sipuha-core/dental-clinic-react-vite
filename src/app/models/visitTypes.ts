export type VisitStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export interface Visit {
  id: string
  patient_id: string
  doctor_id: string
  patient_first_name: string
  patient_last_name: string
  doctor_first_name: string
  doctor_last_name: string
  start_time: string
  end_time: string
  status: VisitStatus
  created_at: string
  updated_at: string
}

export interface CreateVisitDto {
  patient_id: string
  doctor_id: string
  start_time: string
  end_time: string
  status: VisitStatus
}

export type UpdateVisitDto = Partial<CreateVisitDto>