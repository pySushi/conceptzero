// app/activity/hooks/useActivityStream.tsx
"use client";

import { useState, useEffect } from "react";
import type { Activity } from "../types";

const getRandomInterval = (millisec:number=3000) => Math.floor(Math.random() * millisec) + 1000;

const initialActivity: Activity[] = [
  {
    activity: "Activity 1: Planning",
    status: "pending",
    type: "activity",
  },
  {
    activity: "Activity 2: Development",
    status: "pending",
    type: "activity",
  },
  {
    activity: "Activity 3: Testing",
    status: "pending",
    type: "activity",
  },
];

export const useActivityStream = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const streamUpdates = async () => {
      for (let i = 0; i < initialActivity.length; i++) {
        if (isCancelled) break;

        // Avoid duplicate entries
        setActivities((prev) => {
          if (prev.some((act) => act.activity === initialActivity[i].activity)) {
            return prev; // If it already exists, return the same state
          }
          return [...prev, { ...initialActivity[i], status: "pending" }];
        });

        // Wait before updating to "processing"
        await new Promise((resolve) => setTimeout(resolve, getRandomInterval(1000)));
        if (isCancelled) break;

        setActivities((prev) =>
          prev.map((act) =>
            act.activity === initialActivity[i].activity
              ? { ...act, status: "processing" }
              : act
          )
        );

        // Wait before updating to "complete"
        await new Promise((resolve) => setTimeout(resolve, getRandomInterval(3000)));
        if (isCancelled) break;

        setActivities((prev) =>
          prev.map((act) =>
            act.activity === initialActivity[i].activity
              ? { ...act, status: "complete" }
              : act
          )
        );
      }
      await new Promise((resolve) => setTimeout(resolve, getRandomInterval()));
      if (!isCancelled) {
        setIsComplete(true);
      }
    };

    streamUpdates();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { activity: activities, isComplete };
};