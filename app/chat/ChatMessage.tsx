"use client";

import React, { useCallback, useMemo } from "react";
import { StreamingText } from "@/components/StreamingText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Markdown } from "@/components/Markdown";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface Action {
  tool: string;
  thought?: string;
}

export interface Message {
  speaker: string;
  designation?: string;
  text: string;
  data?: unknown;
  actions?: Action[];
  thoughts?: string;
  dataType?: string;
}

export interface DisplayPhases {
  avatar: boolean;
  thoughts: boolean;
  actions: boolean;
  text: boolean;
}

export interface ConversationData {
  conversation: Message[];
}

export interface ChatMessageProps {
  message: Message;
  isCurrent: boolean;
  phases: DisplayPhases;
  onStreamingComplete?: () => void;
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, isCurrent, phases, onStreamingComplete }, ref) => {
    const renderTable = useCallback((tableData: unknown[]) => {
      if (!Array.isArray(tableData) || tableData.length === 0) return null;

      const headers = Object.keys(tableData[0] as Record<string, unknown>);
      return (
        <div className="my-3 prose prose-gray max-w-none rounded-md shadow-sm overflow-clip">
          <table
            className="divide-y divide-gray-200 border border-gray-200 table-auto w-full"
            role="table"
            aria-label="Table Data"
          >
            <thead className="bg-gray-100">
              <tr>
                {headers.map((key) => (
                  <th
                    key={key}
                    className="px-3 py-2 tracking-tight text-gray-600 font-medium"
                    scope="col"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white" role="row">
                  {Object.values(row as Record<string, unknown>).map(
                    (value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 whitespace-nowrap text-sm"
                        role="cell"
                      >
                        {String(value)}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }, []);

    const staticChartOptions = useMemo(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 30,
            bottom: 10,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 12, family: "Arial" },
              color: "#333",
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0, 0, 0, 0.1)" },
            ticks: {
              font: { size: 12, family: "Arial" },
              color: "#333",
              callback: (value: number | string) => `${Number(value)}B`,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top" as const,
            labels: {
              font: { size: 12, family: "Arial" },
              color: "#333",
              boxWidth: 20,
              padding: 20,
            },
          },
          title: {
            display: true,
            text: "",
            font: { size: 16, weight: "bold" as const, family: "Arial" },
            color: "#333",
            padding: { bottom: 20 },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleFont: { size: 14, family: "Arial" },
            bodyFont: { size: 13, family: "Arial" },
            callbacks: {
              label: (context: any) => {
                let label = context.dataset.label || "";
                if (label) label += ": ";
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("en-US").format(
                    context.parsed.y
                  );
                }
                return label;
              },
            },
          },
        },
      }),
      []
    );

    const renderChart = useCallback(
      (chartData: any) => {
        if (!chartData?.datasets || !chartData?.labels) return null;

        const colors = {
          blue: "#0053E2",
          lightBlue: "#A9DDF7",
          teal: "#4DBDF5",
          darkBlue: "#001E60",
          yellow: "#FFC220",
        };

        const backgroundColors = [
          colors.blue,
          colors.teal,
          colors.yellow,
          colors.darkBlue,
          colors.lightBlue,
        ];

        // ... (chart data transformation logic omitted for brevity)

        const options = {
          ...staticChartOptions,
          plugins: {
            ...staticChartOptions.plugins,
            title: {
              ...staticChartOptions.plugins.title,
              text: chartData.title || "",
            },
          },
        };

        return (
          <div className="my-3" style={{ height: "400px" }}>
            <Bar options={options} data={chartData} />
          </div>
        );
      },
      [staticChartOptions]
    );

    const renderData = useCallback(() => {
      if (!message.data) return null;
      switch (message.dataType) {
        case "table":
          return renderTable(message.data as unknown[]);
        case "chart":
          return renderChart(message.data);
        default:
          return null;
      }
    }, [message.data, message.dataType, renderTable, renderChart]);

    return (
      <Card
        className={cn(
          "w-full rounded-xl px-3 py-3 shadow-none border-none",
          message.speaker === "Sam"
            ? "bg-white max-w-4xl"
            : "bg-gray-100 max-w-2xl ml-auto"
        )}
        ref={ref}
      >
        <CardContent className="!p-0">
          <div className="flex items-start space-x-4">
            {phases.avatar && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    message.speaker === "Sam"
                      ? "/sia.png"
                      : `https://api.dicebear.com/9.x/initials/svg?seed=${message.speaker}`
                  }
                  className="bg-blue-900"
                  alt={`${message.speaker}'s avatar`}
                />
                <AvatarFallback>
                  {message.speaker?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              {phases.avatar && (
                <div className="flex items-center gap-1 h-8">
                  <div className="font-medium text-sm text-black">
                    {message.speaker}
                  </div>
                  {message.designation && (
                    <span className="text-sm text-gray-500">
                      ({message.designation})
                    </span>
                  )}
                </div>
              )}
              {message.speaker === "Sam" &&
                message.thoughts &&
                phases.thoughts && (
                  <Accordion
                    type="single"
                    collapsible
                    className="max-w-xl w-fit bg-gray-50 rounded-md overflow-hidden mb-2"
                  >
                    <AccordionItem value="thoughts">
                      <AccordionTrigger className="font-medium text-gray-400 hover:no-underline justify-normal text-sm px-3 py-2 gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="!rotate-0"
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          aria-hidden="true"
                        >
                          <path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Zm0,184H48V124a84,84,0,1,1,84,84Zm12-80a12,12,0,1,1-12-12A12,12,0,0,1,144,128Zm-44,0a12,12,0,1,1-12-12A12,12,0,0,1,100,128Zm88,0a12,12,0,1,1-12-12A12,12,0,0,1,188,128Z"></path>
                        </svg>
                        Thoughts
                      </AccordionTrigger>
                      <AccordionContent className="mx-2 py-2 px-3">
                        <div className="space-y-2">
                          <div className="relative group before:absolute before:left-[-4px] before:top-0 before:bottom-0 before:w-[4px] before:border-r-[2px] before:border-solid before:border-gray-400">
                            <div className="flex items-start space-x-3 ml-4 text-sm text-gray-600">
                              {message.thoughts}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              {message.speaker === "Sam" &&
                message.actions &&
                phases.actions && (
                  <Accordion
                    type="single"
                    collapsible
                    className="max-w-xl w-fit bg-gray-100 rounded-md overflow-hidden mb-2"
                  >
                    <AccordionItem value="actions">
                      <AccordionTrigger className="font-medium text-gray-400 hover:no-underline justify-normal text-sm px-3 py-2 gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="!rotate-0"
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>
                        Actions
                      </AccordionTrigger>
                      <AccordionContent className="mx-2 py-2 px-3">
                        <div className="space-y-2">
                          <div className="relative group">
                            <div className="flex items-start border-l pl-4 border-gray-300">
                              <div className="flex flex-col gap-4">
                                {message.actions.map((action, actionIndex) => (
                                  <div key={actionIndex}>
                                    <div className="font-medium text-sm text-gray-900">
                                      {action.tool}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {action.thought}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              {phases.text && (
                <>
                  {isCurrent ? (
                    <StreamingText
                      text={message.text}
                      speaker={message.speaker}
                      className={`prose prose-base max-w-none prose-gray min-w-0 break-words space-y-2`}
                      onComplete={onStreamingComplete}
                    />
                  ) : (
                    <div
                      className={`prose prose-base max-w-none prose-gray min-w-0 break-words space-y-2 pre-line text-gray-900`}>
                    <Markdown>{message.text}</Markdown>
                    </div>
                  )}
                  {renderData()}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

export default React.memo(ChatMessage, (prevProps, nextProps) => {
  const phasesEqual =
    prevProps.phases.avatar === nextProps.phases.avatar &&
    prevProps.phases.thoughts === nextProps.phases.thoughts &&
    prevProps.phases.actions === nextProps.phases.actions &&
    prevProps.phases.text === nextProps.phases.text;
  return (
    prevProps.message === nextProps.message &&
    prevProps.isCurrent === nextProps.isCurrent &&
    phasesEqual
  );
});