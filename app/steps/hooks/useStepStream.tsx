// app/steps/hooks/useStepStream.tsx
"use client"

import { useState, useEffect } from "react"
import type { Step } from "../types"

const getRandomInterval = () => Math.floor(Math.random() * 1000) + 1000

const initialSteps: Step[] = [
  {
    step: "Step 1: Planning",
    status: "pending",
    type:"step",
    substeps: [
      { substep: "Define project scope", status: "pending", type:"substep" },
      { substep: "Create timeline", status: "pending", type:"substep" },
      { substep: "Assign resources", status: "pending", type:"substep" },
    ],
  },
  {
    step: "Step 2: Development",
    status: "pending",
    type:"step",
    substeps: [
      { substep: "Set up development environment", status: "pending", type:"substep" },
      { substep: "Implement core features", status: "pending", type:"substep" },
      { substep: "Conduct code reviews", status: "pending", type:"substep" },
    ],
  },
  {
    step: "Step 3: Testing",
    status: "pending",
    type:"step",
    substeps: [
      { substep: "Prepare test cases", status: "pending", type:"substep" },
      { substep: "Perform unit testing", status: "pending", type:"substep" },
      { substep: "Conduct integration testing", status: "pending", type:"substep" },
    ],
  },
]

export const useStepStream = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const streamUpdates = async () => {
      for (let i = 0; i < initialSteps.length; i++) {
        // Update step status to processing
        setSteps((prevSteps) =>
          prevSteps.map((step, index) => (index === i ? { ...step, status: "processing" } : step)),
        )

        for (let j = 0; j < initialSteps[i].substeps.length; j++) {
          // await new Promise((resolve) => setTimeout(resolve, getRandomInterval()))

          // Update substep status to processing
          setSteps((prevSteps) =>
            prevSteps.map((step, stepIndex) =>
              stepIndex === i
                ? {
                    ...step,
                    substeps: step.substeps.map((substep, substepIndex) =>
                      substepIndex === j ? { ...substep, status: "processing" } : substep,
                    ),
                  }
                : step,
            ),
          )

          await new Promise((resolve) => setTimeout(resolve, getRandomInterval()))

          // Update substep status to complete
          setSteps((prevSteps) =>
            prevSteps.map((step, stepIndex) =>
              stepIndex === i
                ? {
                    ...step,
                    substeps: step.substeps.map((substep, substepIndex) =>
                      substepIndex === j ? { ...substep, status: "complete" } : substep,
                    ),
                  }
                : step,
            ),
          )
        }

        // Update step status to complete
        setSteps((prevSteps) => prevSteps.map((step, index) => (index === i ? { ...step, status: "complete" } : step)))
      }

      setIsComplete(true)
    }

    streamUpdates()

    return () => {
      // Clean up if needed
    }
  }, [])

  return { steps, isComplete }
}

