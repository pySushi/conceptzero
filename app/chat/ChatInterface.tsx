// app/chat/ChatInterface.tsx

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import ChatMessage from "@/app/chat/ChatMessage";
import type { DisplayPhases, ConversationData } from "@/app/chat/ChatMessage";

// The conversation data remains unchanged.
const conversationData: ConversationData = {
  conversation: [
    {
      speaker: "Carlos",
      text: "That's massive! There may be an opportunity for us here. Can you find out which accounts in my TAM are using CrowdStrike?"
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      thoughts:
        "Okay, I need to access the Ideal Customer Profiler tool and filter the results to show only the accounts in Carlos's TAM that have CrowdStrike as their InstallBase. This is a multi-step process as I need to both call the tool and then filter the results.",
      actions: [
        {
          tool: "Calling Tool Ideal Customer Profiler",
          thought: "I need to access the Ideal Customer Profiler tool."
        },
        {
          tool: "Filtering results for InstallBase as Crowdstrike",
          thought: "Then, I'll filter the results to show only accounts with CrowdStrike."
        }
      ],
      text: `Okay, Carlos, I'm on it.

**Results from Ideal Customer Profiler (InstallBase = CrowdStrike):**

Here’s a list of companies in your territory that are using CrowdStrike, along with relevant firmographic data from GlobalData:`,
      dataType: "table",
      data: [
        {
          "Company Name": "Shopify",
          Industry: "E-commerce",
          "ICT Budget (in billions)": 1.6,
          Location: "Ottawa, Canada",
          "InstallBase Details": "Falcon Platform"
        },
        {
          "Company Name": "Stripe",
          Industry: "Fintech",
          "ICT Budget (in billions)": 2.4,
          Location: "San Francisco, CA",
          "InstallBase Details": "Falcon Endpoint Security"
        },
        {
          "Company Name": "Airbnb",
          Industry: "Hospitality",
          "ICT Budget (in billions)": 3.4,
          Location: "San Francisco, CA",
          "InstallBase Details": "Falcon Cloud Workload"
        },
        {
          "Company Name": "Dropbox",
          Industry: "SaaS",
          "ICT Budget (in billions)": 2.2,
          Location: "San Francisco, CA",
          "InstallBase Details": "CrowdStrike EDR"
        }
      ]
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      text: "Here's a chart showing the ICT budget distribution for these companies:",
      dataType: "chart",
      data: {
        title: "ICT Budget Distribution",
        labels: ["Shopify", "Stripe", "Airbnb", "Dropbox"],
        datasets: [
          {
            label: "ICT Budget (in billions)",
            data: [1.6, 2.4, 3.4, 2.2],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)"
            ]
          }
        ]
      }
    },
    {
      speaker: "Carlos",
      text: "Thanks! Do we have anything on buying signals or intent for these companies?"
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      thoughts:
        "Now I should use the Buying Signals tool to check for recent activities or news that indicate these companies might be considering new security solutions. I'll filter by Carlos's TAM watchlist. This requires me to call the tool and then filter, so it's a multi-step action.",
      actions: [
        {
          tool: "Calling Tool Buying Signals",
          thought: "I need to use the Buying Signals tool."
        },
        {
          tool: "Filtering results for Watchlist 'My TAM'",
          thought: "Then, I need to filter by Carlos's TAM watchlist."
        }
      ],
      text: `Let me check on that for you.

**Analysis from Buying Signals Tool:**

Here are the latest insights on buying signals for those companies:`,
      dataType: "table",
      data: [
        {
          "Company": "Airbnb",
          "Buying Signal": "Spike in cybersecurity interest",
          "Details": "24-hour spike in readership of cybersecurity articles among senior executives",
          "Source": "GlobalData Media Signals"
        },
        {
          "Company": "Shopify",
          "Buying Signal": "Security investment mentioned",
          "Details": "Shopify mentioned plans to invest in security in their recent company filings.",
          "Source": "GlobalData Company Filings Database"
        },
        {
          "Company": "Stripe",
          "Buying Signal": "Hiring for security role",
          "Details": "Stripe has a job opening for 'Endpoint Security Specialist'",
          "Source": "GlobalData Jobs Database"
        }
      ]
    },
    {
      speaker: "Carlos",
      text: "This is perfect. Let’s prioritize Shopify first. Who do we have as contacts there?"
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      text: `Okay, focusing on Shopify.

Here’s what our CRM currently shows for contacts at Shopify:`,
      dataType: "table",
      data: [
        {
          Name: "David Wang",
          Designation: "Director of IT Security",
          Location: "Ottawa, Canada"
        },
        {
          Name: "Lisa Patel",
          Designation: "VP of Cybersecurity",
          Location: "Ottawa, Canada"
        }
      ]
    },
    {
      speaker: "Carlos",
      text: "No, this isn’t enough. Can you find more relevant contacts?"
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      thoughts:
        "These contacts aren't sufficient. I'll use LinkedIn and Sales Navigator to find additional contacts at Shopify who are relevant to security and might be involved in purchasing decisions. This involves searching two different platforms, so it's a multi-step action.",
      actions: [
        {
          tool: "Searching LinkedIn",
          thought: "I'll search LinkedIn for additional contacts."
        },
        {
          tool: "Searching Sales Navigator",
          thought: "And I'll search Sales Navigator as well."
        }
      ],
      text: `No problem, let me expand the search.

**Additional Contacts found on LinkedIn and Sales Navigator:**

Here are some more relevant contacts at Shopify:`,
      dataType: "table",
      data: [
        {
          Name: "Mark Liu",
          Designation: "Head of Threat Intelligence",
          Location: "Toronto, Canada"
        },
        {
          Name: "Emily Ross",
          Designation: "Sr. Manager, Security Ops",
          Location: "Ottawa, Canada"
        }
      ]
    },
    {
      speaker: "Carlos",
      text: "Great! Mark Liu and Emily Ross look interesting. Add them to the CRM."
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      text: "Alright, I've added Mark Liu and Emily Ross to the CRM."
    },
    {
      speaker: "Carlos",
      text: "Now draft an email asking for a meeting. Use the outage as a hook and highlight our platform’s reliability and offline capabilities."
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      thoughts:
        "I need to draft an email that uses the recent CrowdStrike outage as a way to get a meeting. I should emphasize how SentinelOne's platform can offer better reliability and protection, especially its offline capabilities. This is a more complex task that requires careful thought and composition.",
      text: `Understood. Here’s a draft email for your review:

**Subject:** Helping Shopify Ensure Continuous Protection in Times of Outages

Hi [First Name],

I hope this note finds you well. I noticed that CrowdStrike’s recent outage has caused disruptions for many organizations, potentially leaving critical systems unprotected. At SentinelOne, we specialize in autonomous, always-on security that ensures uninterrupted protection—even during vendor outages.

I’d love to discuss how Shopify can enhance its resilience and ensure 24/7 coverage for its growing e-commerce ecosystem. Would you be available for a 20-minute call this week?

Best regards,
Carlos Lee`
    },
    {
      speaker: "Carlos",
      text: "This looks great. Change 'enhance its resilience' to 'fortify its security posture.' Then send it to everyone in our CrowdStrike contact list."
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      text: "Got it, the email has been updated and sent to your CrowdStrike contact list."
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      text: "Good news, Carlos! We’ve received a response from David Wang at Shopify. He’s open to a call tomorrow at 10 AM EST."
    },
    {
      speaker: "Carlos",
      text: "That’s a great start to the day. Please set up the meeting and send me a calendar invite."
    },
    {
      speaker: "Carlos",
      text: "Sam, can you provide an account plan for Shopify? I need something concise for the meeting."
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      thoughts:
        "I need to put together a brief account plan for Shopify. It should include key information about their business, potential pain points related to the CrowdStrike outage, and how SentinelOne can address those. This is a complex task that requires synthesizing information from multiple sources.",
      text: `Certainly, here’s a concise account plan for Shopify:

*   **Corporate Overview:** Shopify is a leader in e-commerce, handling over $200B in annual GMV.
*   **CrowdStrike Pain Points:** Reported reliability concerns and dissatisfaction during the outage.
*   **SentinelOne Fit:** Offline capabilities, ease of deployment, and robust ransomware defense.
*   **Opportunity:** Expansion in endpoint and cloud security as they scale globally.`
    },
    {
      speaker: "Carlos",
      text: "This is great. I also need talking points about their corporate priorities. Can you provide insights on their recent initiatives and how we align?"
    },
    {
      speaker: "Sam",
      designation: "GlobalData Sales Analyst",
      thoughts:
        "I should gather information about Shopify's recent business initiatives and strategies, focusing on how SentinelOne's solutions align with their goals. This will help Carlos in the meeting. This requires research and analysis, making it a more complex task.",
      text: `Absolutely, Carlos. Here are some key talking points regarding Shopify's corporate priorities and how we align:

*   Shopify is focused on expanding globally; security resilience is critical for their 24/7 operations.
*   They are integrating AI/ML into their platform, which aligns perfectly with SentinelOne’s AI-driven threat detection.
*   Recent executive statements highlight their goal to reduce operational complexity—our unified platform directly addresses this by simplifying endpoint management.`
    },
    {
      speaker: "Carlos",
      text: "This is perfect. Thanks, Sam."
    },
    {
      speaker: "Carlos",
      text: "Thank you, Sam. The meeting went great. They were amazed at our understanding of their needs and are open to a technical deep dive next week. Let’s prep for that!"
    }
  ]
};

const ChatInterface = ({ data }: { data: ConversationData }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [phases, setPhases] = useState<DisplayPhases>({
    avatar: false,
    thoughts: false,
    actions: false,
    text: false,
  });
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const streamingCompletedRef = useRef(false);

  // Stable complete phases for already streamed messages.
  const completePhases = useMemo(
    () => ({ avatar: true, thoughts: true, actions: true, text: true }),
    []
  );

  useEffect(() => {
    // Reset phases and streaming flag for the current message.
    setPhases({ avatar: false, thoughts: false, actions: false, text: false });
    streamingCompletedRef.current = false;
    const currentMessage = data.conversation[currentMessageIndex];
    const timeouts: number[] = [];

    // Show avatar after 100ms.
    timeouts.push(
      window.setTimeout(() => setPhases((prev) => ({ ...prev, avatar: true })), 100)
    );

    // Show thoughts for Sam messages (if available) after 500ms.
    if (currentMessage.speaker === "Sam" && currentMessage.thoughts) {
      timeouts.push(
        window.setTimeout(() => setPhases((prev) => ({ ...prev, thoughts: true })), 500)
      );
    }

    // Show actions for Sam messages (if available) after 1000ms.
    if (currentMessage.speaker === "Sam" && currentMessage.actions) {
      timeouts.push(
        window.setTimeout(() => setPhases((prev) => ({ ...prev, actions: true })), 1000)
      );
    }

    // Show text (starting streaming) after 1500ms.
    timeouts.push(
      window.setTimeout(() => setPhases((prev) => ({ ...prev, text: true })), 1500)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [currentMessageIndex, data.conversation]);

  // Scroll to the latest message.
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessageIndex]);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {data.conversation.slice(0, currentMessageIndex + 1).map((message, index) => {
        const isCurrent = index === currentMessageIndex;
        const usedPhases = isCurrent ? phases : completePhases;
        return (
          <ChatMessage
            key={`message-${index}`}
            message={message}
            isCurrent={isCurrent}
            phases={usedPhases}
            onStreamingComplete={() => {
              if (!streamingCompletedRef.current) {
                streamingCompletedRef.current = true;
                window.setTimeout(() => {
                  setCurrentMessageIndex((curr) =>
                    curr < data.conversation.length - 1 ? curr + 1 : curr
                  );
                }, 1000);
              }
            }}
            ref={isCurrent ? lastMessageRef : null}
          />
        );
      })}
    </div>
  );
};

export default ChatInterface;