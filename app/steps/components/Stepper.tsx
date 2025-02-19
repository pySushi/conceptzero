// app/steps/components/Stepper.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepItem from "./StepItem";
import { useStepStream } from "../hooks/useStepStream";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ChevronDown, Command } from "lucide-react";

const Stepper = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { steps, isComplete } = useStepStream();

  useEffect(() => {
    if (isComplete) {
      // Trigger confetti animation once all steps and substeps are complete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      });
      toast.success("All tasks completed!", {
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
      <div className="not-prose bg-background group/block-preview hover:ring-alpha-400 flex w-full max-w-full cursor-pointer select-none flex-col justify-between overflow-hidden rounded-md border border-gray-200 transition-all duration-200 ease-in-out hover:border-gray-300 md:w-[400px]">
        <div
          className={`flex h-9 w-full items-center justify-between gap-3 p-2 pl-3 ${isExpanded?"border-b":""}`}
          onClick={handleToggle}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Command className="h-4 w-4" />
            <div className="whitespace-nowrap text-[13px] font-medium text-gray-800 flex gap-1 items-center">
              <span>Steps</span>
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
              className="focus:border-alpha-400 focus-visible:border-alpha-400 disabled:border-alpha-300 border-alpha-400 hover:border-alpha-400 focus-visible:ring-offset-background aria-disabled:border-alpha-300 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:bg-gray-100 aria-disabled:text-gray-400 aria-disabled:ring-0 [&amp;>svg]:pointer-events-none [&amp;>svg]:size-4 [&amp;_svg]:shrink-0 bg-background-subtle text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus-visible:bg-gray-100 has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] h-5 rounded-sm px-1.5 text-xs"
              disabled={isComplete}
            >
              {isComplete?"Completed":"Execute"}
            </button>
          </div>
        </div>

        {/* <div
        onClick={handleToggle}
        className="flex w-fit items-center gap-1 cursor-pointer bg-gray-100 px-2 py-1 rounded-xl"
      >
        <Command className="h-4 w-4" />
        <div className="font-semibold tracking-tight flex">Steps</div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </div> */}
        <div className="overflow-hidden">
          {isExpanded && (
            <div className="flex w-full flex-col overflow-hidden rounded-md pb-1.5 pl-2 pr-2.5 pt-0.5 text-left text-gray-500">
              <AnimatePresence>
                {steps.map((step, index) => (
                  <StepItem
                    key={index}
                    step={step}
                    isLast={index === steps.length - 1}
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
