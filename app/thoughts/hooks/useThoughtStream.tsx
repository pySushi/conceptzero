// app/thoughts/hooks/useThoughtStream.tsx
"use client";

import { useState, useEffect } from "react";
import type { Thought } from "../types";

const getRandomInterval = (millisec: number = 3000) =>
  Math.floor(Math.random() * millisec) + 1000;

const initialThought: Thought[] = [
  {
    thought: "First, I'll analyze the user's requirements for the thoughts component enhancement.",
    status: "pending",
    type: "thought",
  },
  {
    thought: "Once all thoughts are complete, we'll expand to show the full thought process.",
    status: "pending",
    type: "thought",
  },
  {
    thought: "Finally, we'll ensure proper alignment with the lightbulb icon for visual consistency.",
    status: "pending",
    type: "thought",
  },
];

export const useThoughtStream = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const streamUpdates = async () => {
      for (let i = 0; i < initialThought.length; i++) {
        if (isCancelled) break;

        // Avoid duplicate entries
        setThoughts((prev) => {
          if (prev.some((act) => act.thought === initialThought[i].thought)) {
            return prev; // If it already exists, return the same state
          }
          return [...prev, { ...initialThought[i], status: "pending" }];
        });

        // Wait before updating to "processing"
        await new Promise((resolve) => setTimeout(resolve, getRandomInterval(1000)));
        if (isCancelled) break;

        setThoughts((prev) =>
          prev.map((act) =>
            act.thought === initialThought[i].thought
              ? { ...act, status: "processing" }
              : act
          )
        );

        // Wait before updating to "complete"
        await new Promise((resolve) => setTimeout(resolve, getRandomInterval(3000)));
        if (isCancelled) break;

        setThoughts((prev) =>
          prev.map((act) =>
            act.thought === initialThought[i].thought
              ? { ...act, status: "complete" }
              : act
          )
        );
      }

      await new Promise((resolve) => setTimeout(resolve, getRandomInterval(1000)));
      if (!isCancelled) {
        setIsComplete(true);
      }
    };

    streamUpdates();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { thoughts: thoughts, isComplete };
};
