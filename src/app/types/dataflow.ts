export interface DataflowStep {
  id: string
  label: string
  description?: string
  icon?: string
  color?: string
}

export type Dataflow = DataflowStep[]
