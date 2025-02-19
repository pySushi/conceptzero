// app/thoughts/components/Stepper.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb, Loader } from "lucide-react";
import { useThoughtStream } from "../hooks/useThoughtStream";
import { cn } from "@/lib/utils"; // Utility for conditional class names

const Stepper = () => {
  const { thoughts, isComplete } = useThoughtStream();
  // When streaming, we want the list to be collapsed.
  const [isExpanded, setIsExpanded] = React.useState(false);
  // Determine streaming state: if tasks are not complete, we're streaming.
  const isStreaming = !isComplete;
  const previousStreamingRef = React.useRef(isStreaming);

  // Auto-expand the thought list when streaming completes.
  React.useEffect(() => {
    if (!isStreaming && previousStreamingRef.current && thoughts.length > 0) {
      setIsExpanded(true);
    }
    previousStreamingRef.current = isStreaming;
  }, [isStreaming, thoughts.length]);

  // Toggle the expansion only if not streaming.
  const handleToggle = React.useCallback(() => {
    if (!isStreaming) {
      setIsExpanded((prev) => !prev);
    }
  }, [isStreaming]);

  // Get the current thought (last in the array)
  const currentThought = thoughts[thoughts.length - 1];

  return (
    <div className={cn("max-w-2xl group p-4")}>
      <motion.div
        initial={false}
        className="rounded-lg overflow-hidden w-full transition-colors"
      >
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 w-fit px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <div className="flex items-center gap-2">

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
              className="lucide lucide-lightbulb w-4 h-4"
            >
              <path stroke={`${isComplete ? "currentColor" : "rgb(229, 231, 235)"}`} d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
              <path stroke={`${isComplete ? "currentColor" : "rgb(229, 231, 235)"}`} d="M9 18h6"></path>
              <path stroke={`${isComplete ? "currentColor" : "rgb(229, 231, 235)"}`} d="M10 22h4"></path>

              <path className={`draw ${isComplete ? "complete" : ""}`} d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
              <path className={`draw ${isComplete ? "complete" : ""}`} d="M9 18h6"></path>
              <path className={`draw ${isComplete ? "complete" : ""}`} d="M10 22h4"></path>
            </svg>

            <span className="text-sm font-medium ">Thoughts</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isStreaming ? (
              <Loader className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </motion.div>
        </button>

        <div className="relative">
          {/* Streaming thought */}
          {isStreaming && currentThought && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 pb-3"
            >
              <div className="relative pl-6" style={{ marginLeft: "2px" }}>
                <div
                  className="absolute left-0 top-0 bottom-0 w-px bg-dashed-line"
                  style={{ left: "6px" }}
                />
                <motion.p
                  key={thoughts.length}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm leading-relaxed text-gray-400"
                >
                  <span className="shimmer-text">{currentThought.thought}</span>
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Expanded full thought list */}
          <AnimatePresence initial={false}>
            {isExpanded && !isStreaming && thoughts.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-3 pb-3">
                  <div className="relative pl-6" style={{ marginLeft: "2px" }}>
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 fill-[alternate]"
                      style={{ left: "6px" }}
                    />
                    <div className="space-y-3">
                      {thoughts.map((thought, index) => (
                        <motion.p
                          key={`${thought}-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-sm leading-relaxed text-gray-600"
                        >
                          {thought.thought}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Stepper;
