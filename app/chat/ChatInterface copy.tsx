// app/chat/ChatInterface.tsx

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react"; // Import useMemo
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Action {
  tool: string;
  thought?: string;
}

interface Message {
  speaker: string;
  designation?: string;
  text: string;
  data?: any;
  actions?: Action[];
  thoughts?: string;
  dataType?: string;
}

interface ConversationData {
  conversation: Message[];
}

interface ChatInterfaceProps {
  data: ConversationData;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ data }) => {
  const [displayedMessageIndex, setDisplayedMessageIndex] =
    useState<number>(-1);
  const [messageElements, setMessageElements] = useState<
    Array<{ type: string; isVisible: boolean }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMessageFullyDisplayed, setIsMessageFullyDisplayed] = useState(false);
  const [newMessageToDisplay, setNewMessageToDisplay] =
    useState<boolean>(false);

  // Use ReturnType<typeof setTimeout> to fix browser/Next.js typed usage
  const lastDisplayedMessageRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoized initialization function
  const initializeMessageElements = useCallback((message: Message) => {
    const elements = [{ type: "avatar", isVisible: false }];
    if (message.speaker === "Sam") {
      if (message.thoughts)
        elements.push({ type: "thoughts", isVisible: false });
      if (message.actions) elements.push({ type: "actions", isVisible: false });
    }
    elements.push({ type: "text", isVisible: false });
    if (message.dataType === "table")
      elements.push({ type: "table", isVisible: false });
    if (message.dataType === "chart")
      elements.push({ type: "chart", isVisible: false });
    return elements;
  }, []);


  // Scroll to latest message (memoize the ref access to avoid unnecessary re-renders)
  const scrollEffectDependency = useMemo(
    () => [displayedMessageIndex, messageElements],
    [displayedMessageIndex, messageElements]
  );

  useEffect(() => {
    if (lastDisplayedMessageRef.current) {
      lastDisplayedMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollEffectDependency]); // Use memoized dependency

  const delayedSetIsVisible = useCallback(
    (index: number, type: string) => {
      setIsLoading(true);
      const delay = type === "thoughts" ? 1000 : 2000;

      // Return a promise so we can .then() it
      return new Promise<void>((resolve) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setMessageElements((prevElements) => {
            const newElements = [...prevElements];
            newElements[index].isVisible = true;
            return newElements;
          });
          setIsLoading(false);
          resolve();
        }, delay);
      });
    },
    [] // dependency array was correct
  );

  const showNextElement = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  
    setMessageElements((prevElements) => {
      const hiddenIndex = prevElements.findIndex((el) => !el.isVisible);
      
      if (hiddenIndex === -1) {
        setIsMessageFullyDisplayed(true);
        return prevElements;
      }
  
      const newElements = [...prevElements];
      const elementType = newElements[hiddenIndex].type;
  
      // Show element immediately unless it's thoughts or actions
      if (elementType === "thoughts" || elementType === "actions") {
        delayedSetIsVisible(hiddenIndex, elementType);
      } else {
        newElements[hiddenIndex].isVisible = true;
      }
  
      return newElements;
    });
  }, [delayedSetIsVisible]);

  // This useEffect will trigger showNextElement when a new message is set to be displayed
  useEffect(() => {
    if (newMessageToDisplay) {
      showNextElement();
      setNewMessageToDisplay(false); // Reset the flag
    }
  }, [newMessageToDisplay, showNextElement]);

  const displayNextMessage = useCallback(() => {
    setIsMessageFullyDisplayed(false);
    setDisplayedMessageIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= data.conversation.length) return prevIndex;
  
      const nextMessage = data.conversation[nextIndex];
      const elements = initializeMessageElements(nextMessage);
      setMessageElements(elements);
      
      // Start showing the first element immediately
      setTimeout(() => {
        showNextElement();
      }, 100);
  
      return nextIndex;
    });
  }, [data.conversation, initializeMessageElements, showNextElement]);

  // Start conversation on mount
  useEffect(() => {
    if (displayedMessageIndex === -1) {
      displayNextMessage();
    }
  }, [displayedMessageIndex, displayNextMessage]);

  const renderTable = useCallback((tableData: any[]) => {
    if (!Array.isArray(tableData) || tableData.length === 0) return null;

    return (
      <div className="my-3 prose prose-gray max-w-none rounded-md shadow-sm overflow-clip">
        <table
          className="divide-y divide-gray-200 border border-gray-200 table-auto w-full"
          role="table"
          aria-label="Table Data"
        >
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(tableData[0]).map((key) => (
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
                {Object.values(row).map((value: any, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2 whitespace-nowrap text-sm"
                    role="cell"
                  >
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, []);

  const chartOptions = useMemo(
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
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              family: "Arial",
            },
            color: "#333",
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            font: {
              size: 12,
              family: "Arial",
            },
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
            font: {
              size: 12,
              family: "Arial",
            },
            color: "#333",
            boxWidth: 20,
            padding: 20,
          },
        },
        title: {
          display: true,
          text: "",
          font: {
            size: 16,
            weight: "bold" as const,
            family: "Arial",
          },
          color: "#333",
          padding: {
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleFont: {
            size: 14,
            family: "Arial",
          },
          bodyFont: {
            size: 13,
            family: "Arial",
          },
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
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
      if (!chartData?.datasets || !chartData?.labels) {
        return null;
      }

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

      const data = {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset: any, index: number) => ({
          ...dataset,
          backgroundColor: backgroundColors[index % backgroundColors.length],
          borderColor: "white",
          borderWidth: 1,
          barThickness: 35,
          categoryPercentage: 0.8,
        })),
      };

      const options = {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          title: {
            ...chartOptions.plugins.title,
            text: chartData.title || "",
          },
        },
      };

      return (
        <div className="my-3" style={{ height: "400px" }}>
          <Bar options={options} data={data} />
        </div>
      );
    },
    [chartOptions]
  );

  const renderData = useCallback(
    (message: Message) => {
      const { data, dataType } = message;
      if (!data) return null;

      switch (dataType) {
        case "table":
          return renderTable(data);
        case "chart":
          return renderChart(data);
        default:
          return null;
      }
    },
    [renderTable, renderChart] // dependency array was correct
  );

  if (error) {
    return (
      <div className="text-red-500 text-center" role="alert">
        {error}
      </div>
    );
  }

  const messageList = useMemo(() => {
    // Memoize the message list rendering
    return data.conversation
      .slice(0, displayedMessageIndex + 1)
      .map((message, index) => (
        <Card
          key={`message-${index}`}
          className={cn(
            "w-full rounded-xl px-3 py-3 shadow-none border-none",
            message.speaker === "Sam"
              ? "bg-transparent bg-white max-w-4xl"
              : "bg-gray-100 max-w-2xl ml-auto"
          )}
          ref={index === displayedMessageIndex ? lastDisplayedMessageRef : null}
        >
          <CardContent className="!p-0">
            <div className="flex items-start space-x-4">
              {messageElements.some(
                (el) => el.type === "avatar" && el.isVisible
              ) && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      message.speaker === "Sam"
                        ? "/sia.png"
                        : `https://api.dicebear.com/9.x/initials/svg?seed=${message.speaker}&backgroundColor=transparent`
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
                {messageElements.some(
                  (el) => el.type === "avatar" && el.isVisible
                ) && (
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

                {/* Thoughts Accordion */}
                {message.speaker === "Sam" &&
                  message.thoughts &&
                  messageElements.some(
                    (el) => el.type === "thoughts" && el.isVisible
                  ) && (
                    <Accordion
                      type="single"
                      collapsible
                      className="max-w-xl w-fit bg-gray-50 rounded-md overflow-hidden mb-2"
                    >
                      <AccordionItem
                        value={`thoughts-${index}`}
                        className="border-none"
                      >
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
                              <div className="flex items-start space-x-3 ml-4">
                                <div className="flex flex-col gap-1">
                                  <div className="text-xs text-gray-600">
                                    {message.thoughts}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                {/* Thoughts Loading State */}
                {message.speaker === "Sam" &&
                  message.thoughts &&
                  messageElements.some(
                    (el) => el.type === "thoughts" && !el.isVisible
                  ) &&
                  isLoading && (
                    <div className="mb-2">
                      <Skeleton className="h-6 w-32 bg-gray-200" />
                    </div>
                  )}

                {/* Actions Accordion */}
                {message.speaker === "Sam" &&
                  message.actions &&
                  messageElements.some(
                    (el) => el.type === "actions" && el.isVisible
                  ) && (
                    <Accordion
                      type="single"
                      collapsible
                      className="max-w-xl w-fit bg-gray-100 rounded-md overflow-hidden mb-2"
                    >
                      <AccordionItem
                        value={`actions-${index}`}
                        className="border-none"
                      >
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
                                  {message.actions.map(
                                    (action, actionIndex) => (
                                      <div key={actionIndex}>
                                        <div className="font-medium text-sm text-gray-900">
                                          {action.tool}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {action.thought}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                {/* Actions Loading State */}
                {message.speaker === "Sam" &&
                  message.actions &&
                  messageElements.some(
                    (el) => el.type === "actions" && !el.isVisible
                  ) &&
                  isLoading && (
                    <div className="mb-2">
                      <Skeleton className="h-6 w-32 bg-gray-200" />
                    </div>
                  )}

                {/* Streaming Text */}
                {messageElements.some(
                  (el: any) => el.type === "text" && el.isVisible
                ) && (
                  <StreamingText
    text={message.text}
    speaker={message.speaker}
    className="text-sm text-gray-800 mt-2 prose prose-gray max-w-none"
    onComplete={() => {
      if (index === displayedMessageIndex) {
        if (messageElements.some(el => !el.isVisible)) {
          showNextElement();
        } else {
          setIsMessageFullyDisplayed(true);
          if (displayedMessageIndex < data.conversation.length - 1) {
            timerRef.current = setTimeout(displayNextMessage, 1000);
          }
        }
      }
    }}
  />
)}

                {/* Rendered Table */}
                {messageElements.some(
                  (el: any) => el.type === "table" && el.isVisible
                ) &&
                  message.dataType === "table" &&
                  renderData(message)}

                {/* Rendered Chart */}
                {messageElements.some(
                  (el: any) => el.type === "chart" && el.isVisible
                ) &&
                  message.dataType === "chart" &&
                  renderData(message)}
              </div>
            </div>
          </CardContent>
        </Card>
      ));
  }, [
    data.conversation,
    displayedMessageIndex,
    messageElements,
    lastDisplayedMessageRef,
    initializeMessageElements,
    renderData,
    showNextElement,
  ]);

  return (
    <div className="space-y-4 max-w-5xl mx-auto" role="log" aria-live="polite">
      {messageList}
    </div>
  );
};

export default ChatInterface;
