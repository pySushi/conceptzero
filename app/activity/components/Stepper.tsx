// app/activity/components/Stepper.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActivityItem from "./ActivityItem";
import { useActivityStream } from "../hooks/useActivityStream";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ChevronDown } from "lucide-react";

const Stepper = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { activity, isComplete } = useActivityStream();

  useEffect(() => {
    if (isComplete) {
      // Trigger confetti animation once all tasks are complete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      });
      toast.success("All actions completed!", {
        duration: 3000,
        position: "bottom-center",
      });
    }
  }, [isComplete]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-3 [&:not(:last-child)]:mb-3">
      <div 
      className="group not-prose text-gray-600 hover:text-blue-600 bg-background group/block-preview hover:ring-alpha-400 flex w-full max-w-full select-none flex-col justify-between overflow-hidden rounded-md border border-gray-200 transition-all duration-200 ease-in-out hover:border-gray-300 md:w-[400px]"
      >
        <div
          className={`flex h-9 items-center justify-between gap-3 p-2 ${isExpanded?"border-b bg-gray-50 w-full":"w-full"} cursor-pointer `}
          onClick={handleToggle}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-activity w-4 h-4"
            >
              <path
                stroke={`${isComplete ? "currentColor" : "rgb(229, 231, 235)"}`}
                d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
              />
              <path
                className={`draw ${isComplete ? "complete" : ""}`}
                d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
              />
            </svg>
            <div className="whitespace-nowrap text-[13px] font-medium flex gap-1 items-center">
              <span>Activity</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`border-alpha-400 hover:border-alpha-400 focus-visible:ring-offset-background inline-flex shrink-0 cursor-default select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed  aria-disabled:ring-0 [&amp;>svg]:pointer-events-none [&amp;>svg]:size-4 [&amp;_svg]:shrink-0 bg-background-subtle text-gray-400 hover:bg-gray-100 focus:bg-gray-100 focus-visible:bg-gray-100 has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] h-5 rounded-sm px-1.5 text-xs ${isComplete ? "disabled:bg-white disabled:text-gray-600":""}`}
              disabled={true}
            >
              {isComplete ? "Completed" : "Processing..."}
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          {isExpanded && (
            <div className="min-h-9 flex w-full flex-col overflow-hidden rounded-md pb-1.5 pl-2 pr-2.5 pt-0.5 text-left text-gray-500">
              <AnimatePresence>
                {activity.map((activityItem, index) => (
                  <ActivityItem
                    key={index}
                    activity={activityItem}
                    isLast={index === activity.length - 1}
                    isFirst={index === 0}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
