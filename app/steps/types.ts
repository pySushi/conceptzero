// app/types.ts
export type Status = "pending" | "processing" | "complete" | "error"

export interface SubStep {
  substep: string
  status: Status
  type:"substep"
}

export interface Step {
  step: string
  status: Status
  substeps: SubStep[]
  type:"step"
}

