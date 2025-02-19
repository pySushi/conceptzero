// app/activity/types.ts
export type Status = "pending" | "processing" | "complete" | "error"

export interface Thought {
  thought: string
  status: Status
  type:"thought"
}

