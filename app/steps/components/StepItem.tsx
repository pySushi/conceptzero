// app/steps/components/StepItem.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ban,
  ChevronDown,
  CircleCheck,
  CircleDot,
  CircleDashed,
  Dot,
  Loader,
} from "lucide-react";
import type { Step, SubStep } from "../types";

const stepItemVariants = {
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

const subStepContainerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const getStatusColor = (item: Step | SubStep): string => {
  switch (item.status) {
    case "complete":
      return item.type === "substep" ? "text-gray-600" : "text-black";
    case "error":
      return "text-red-600";
    case "processing":
      return item.type === "substep" ? "shimmer-text" : "text-gray-600";
    case "pending":
    default:
      return "text-gray-400";
  }
};

const StepIcon = ({ item }: { item: Step | SubStep }) => {
  switch (item.status) {
    case "complete":
      return item.type === "substep" ? (
        <CircleCheck className="w-4 h-4 m-0.5 text-gray-400" />
      ) : (
        <CircleCheck className="w-4 h-4 m-0.5 text-gray-400" />
        // <CircleDot className="w-4 h-4 m-0.5 text-gray-600" />
      );
    case "error":
      return <Ban className="w-4 h-4 m-0.5 text-gray-400 line-through" />;
    case "processing":
      return <Loader className="w-4 h-4 m-0.5 animate-spin text-gray-400" />;
    case "pending":
    default:
      return item.type === "substep" ? (
        <CircleDashed className="w-4 h-4 m-0.5 text-gray-400" />
      ) : (
        <Dot className="w-4 h-4 m-0.5 text-gray-400" />
      );
  }
};

const SubStepItem = ({
  substep,
  isLast,
}: {
  substep: SubStep;
  isLast: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* <div className="flex h-6 w-full min-w-0 items-center gap-2 text-[13px] rounded px-1 py-1"> */}
      <div className="flex h-6 w-full min-w-0 items-center gap-2 text-[13px] bg-gray-100 rounded px-1 py-1">
        <div className="flex size-4 shrink-0 items-center justify-center">
          <div
            className={`w-auto rounded-full ${getStatusColor(
              substep
            )} flex items-center gap-1`}
          >
            <StepIcon item={substep} />
            {/* <span className="relative flex size-[12px] items-center justify-center rounded-full bg-gray-200">
            <span className="absolute left-1/2 top-1/2 z-10 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-400"></span>
          </span> */}
          </div>
        </div>

        <div className="flex w-fit min-w-0 items-center justify-between gap-2">
          <button className="flex cursor-pointer truncate text-left items-center">
            {substep.substep}
          </button>
        </div>
      </div>

      {/* <div className="relative">
        <div
          className={`w-auto rounded-full ${getStatusColor(
            substep
          )} flex items-center gap-1`}
        >
          <StepIcon item={substep} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className={`font-mono text-xs ${getStatusColor(substep)}`}>
            {substep.substep}
          </span>
        </div>
      </div> */}
    </motion.div>
  );
};

interface StepItemProps {
  step: Step;
  isLast: boolean;
  isFirst: boolean;
}

const StepItem = ({ step, isLast, isFirst }: StepItemProps) => {
  const [isExpanded, setIsExpanded] = useState(step.status === "processing");

  useEffect(() => {
    if (step.status === "processing") {
      setIsExpanded(true);
    }
  }, [step.status]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      variants={stepItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`${step.status} relative`}
    >
        <div className={`absolute flex w-4 items-center justify-center ${isFirst?"mt-4 h-full":(isLast && !isExpanded?"h-4 mb-4":"h-full")}`}>
          <div className="h-full w-[1px] bg-gray-300"></div>
        </div>

      <div
        className={`flex h-8 w-full min-w-0 items-center gap-2 text-[13px] ${step.status==="processing"?"shimmer-text":(step.status==="complete"?"text-gray-900":"")}`}
        onClick={handleToggle}
      >
        <div className="flex size-4 shrink-0 items-center justify-center">
          <span className={`relative flex size-[12px] items-center justify-center rounded-full ${step.status==="complete"?"bg-gray-400":"bg-gray-200"}`}>
            <span className={`absolute left-1/2 top-1/2 z-10 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${step.status==="complete"?"bg-gray-800":"bg-gray-400"}`}></span>
          </span>
        </div>
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <button className={`flex cursor-pointer truncate text-left items-center`}>
            {step.step}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>

          <div className="font-mono text-xs text-gray-500">{step.status}</div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={subStepContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden cursor-pointer pl-4 flex flex-wrap gap-2"
            // className="overflow-hidden cursor-pointer pl-4 gap-2"
          >
            {step.substeps.map((substep, index) => (
              <SubStepItem
                key={index}
                substep={substep}
                isLast={index === step.substeps.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* <div className="flex gap-1 relative">
        <div
          className={`absolute h-full ${
            !isExpanded && isLast ? "hidden" : "flex"
          } w-5 pt-8 items-center justify-center overflow-clip`}
        >
          <div
            className={`h-full w-[0.5px] border transition-colors delay-100 duration-300 ${
              step.status === "complete" ? "border-solid " : "border-dashed"
            }`}
          ></div>
        </div>

        <div className="flex-1">
          <div
            onClick={handleToggle}
            className="flex items-center gap-1 cursor-pointer"
          >
            <div
              className={`relative ${
                isExpanded ? "overflow-clip" : isLast ? "overflow-clip" : ""
              }`}
            >
              <div
                className={`w-auto rounded-full z-[2] ${getStatusColor(
                  step
                )} flex items-center gap-1 h-8`}
              >
                <StepIcon item={step} />
              </div>
            </div>

            <span className={`font-medium leading-8 ${getStatusColor(step)}`}>
              {step.step}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={subStepContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden cursor-pointer pl-4"
              >
                {step.substeps.map((substep, index) => (
                  <SubStepItem
                    key={index}
                    substep={substep}
                    isLast={index === step.substeps.length - 1}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div> */}
    </motion.div>
  );
};

export default StepItem;
