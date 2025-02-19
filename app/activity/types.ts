// app/activity/types.ts
export type Status = "pending" | "processing" | "complete" | "error"

export interface Activity {
  activity: string
  status: Status
  type:"activity"
}

