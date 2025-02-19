// app/activity/components/ActivityItem.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ban,
  ChevronDown,
  CircleCheck,
  CircleDashed,
  Loader,
} from "lucide-react";
import type { Activity } from "../types";

const activityItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const getStatusColor = (item: Activity): string => {
  switch (item.status) {
    case "complete":
      return "text-black";
    case "error":
      return "text-red-600";
    case "processing":
      return "shimmer-text";
    case "pending":
    default:
      return "text-gray-400";
  }
};

const ActivityIcon = ({ item }: { item: Activity }) => {
  switch (item.status) {
    case "complete":
      return <CircleCheck className="w-4 h-4 m-0.5 text-gray-400" />;
    case "error":
      return <Ban className="w-4 h-4 m-0.5 text-gray-400 line-through" />;
    case "processing":
      return <Loader className="w-4 h-4 m-0.5 animate-spin text-gray-400" />;
    case "pending":
    default:
      return <CircleDashed className="w-4 h-4 m-0.5 text-gray-400" />;
  }
};

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
  isFirst: boolean;
}

const ActivityItem = ({ activity, isLast, isFirst }: ActivityItemProps) => {
  const [isExpanded, setIsExpanded] = useState(activity.status === "processing");

  useEffect(() => {
    if (activity.status === "processing") {
      setIsExpanded(true);
    }
  }, [activity.status]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      variants={activityItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`${activity.status} relative`}
    >
      <div
        className={`flex h-8 w-full min-w-0 items-center gap-2 text-[13px] ${
          activity.status === "processing"
            ? "shimmer-text"
            : activity.status === "complete"
            ? "text-gray-900"
            : ""
        }`}
        onClick={handleToggle}
      >
        <div className="flex size-4 shrink-0 items-center justify-center">
          <span
            className={`relative flex size-[12px] items-center justify-center rounded-full ${
              activity.status === "complete" ? "bg-gray-400" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute left-1/2 top-1/2 z-10 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                activity.status === "complete" ? "bg-gray-800" : "bg-gray-400"
              }`}
            ></span>
          </span>
        </div>
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex truncate text-left items-center">
            {activity.activity}
            {/* <div
              className={`relative ${
                isExpanded ? "overflow-clip" : isLast ? "overflow-clip" : ""
              }`}
            >
              <div
                className={`w-auto rounded-full z-[2] ${getStatusColor(
                  activity
                )} flex items-center gap-1 h-8`}
              >
                <ActivityIcon item={activity} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      
      {!isLast && (
        <div className="flex h-3 w-4 items-center justify-center">
          <div className="h-full w-[1px] bg-gray-300"></div>
        </div>
      )}

    </motion.div>
  );
};

export default ActivityItem;