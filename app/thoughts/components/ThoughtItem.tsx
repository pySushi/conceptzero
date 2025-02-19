// app/thought/components/ThoughtItem.tsx
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
import type { Thought } from "../types";

const thoughtItemVariants = {
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

const getStatusColor = (item: Thought): string => {
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

const ThoughtIcon = ({ item }: { item: Thought }) => {
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

interface ThoughtItemProps {
  thought: Thought;
  isLast: boolean;
  isFirst: boolean;
}

const ThoughtItem = ({ thought, isLast, isFirst }: ThoughtItemProps) => {
  const [isExpanded, setIsExpanded] = useState(thought.status === "processing");

  useEffect(() => {
    if (thought.status === "processing") {
      setIsExpanded(true);
    }
  }, [thought.status]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      variants={thoughtItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`${thought.status} relative`}
    >
      <div
        className={`flex h-8 w-full min-w-0 items-center gap-2 text-[13px] ${
          thought.status === "processing"
            ? "shimmer-text"
            : thought.status === "complete"
            ? "text-gray-900"
            : ""
        }`}
        onClick={handleToggle}
      >
        <div className="flex size-4 shrink-0 items-center justify-center">
          <span
            className={`relative flex size-[12px] items-center justify-center rounded-full ${
              thought.status === "complete" ? "bg-gray-400" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute left-1/2 top-1/2 z-10 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                thought.status === "complete" ? "bg-gray-800" : "bg-gray-400"
              }`}
            ></span>
          </span>
        </div>
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex truncate text-left items-center">
            {thought.thought}
            {/* <div
              className={`relative ${
                isExpanded ? "overflow-clip" : isLast ? "overflow-clip" : ""
              }`}
            >
              <div
                className={`w-auto rounded-full z-[2] ${getStatusColor(
                  thought
                )} flex items-center gap-1 h-8`}
              >
                <ThoughtIcon item={thought} />
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

export default ThoughtItem;