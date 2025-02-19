// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const uiElements = [
  {
    name: "Thoughts",
    path: "/thoughts",
    description:
      "A vertically collapsing panel that displays content in an organized and concise manner.",
    thumbnail: "/thumbnails/thoughts.png",
  },
  {
    name: "Steps",
    path: "/steps",
    description: "A numbered guide to walk users through a multi-step process.",
    thumbnail: "/thumbnails/steps.png",
  },
  {
    name: "Activity",
    path: "/activity",
    description:
      "A chronological list of events or actions, often used to show updates or notifications.",
    thumbnail: "/thumbnails/activity.png",
  },
  // Add more UI elements here, including the thumbnail path.
];

export default function UIDemoPage() {
  return (
    <div className="relative px-4 w-full max-w-7xl mx-auto">
      {/* <div className="flex w-full flex-col gap-4">
        <h1 className="text-xl font-bold tracking-tighter leading-tight">
          Beautiful, Reusable UI Components
        </h1>
        <p className="w-full text-gray-500">
          Pre-built, accessible components for your next project. Copy and
          paste, and you're ready to go.
        </p>
      </div> */}
      <div className="flex w-full flex-col gap-4">
        <h1 className="text-xl font-bold tracking-tighter leading-tight">
          Unlock Next-Gen AI Experiences
        </h1>
        <p className="w-full text-gray-500">
          Explore the concept library on AI interactions to get inspiration for
          your next AI-powered project.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
        {uiElements.map((element) => (
          <div key={element.path} className="">
            <Link
              href={element.path}
              className="group relative block overflow-hidden rounded-xl border border-border"
              tabIndex={-1}
            >
              <div className="aspect-video overflow-hidden">
                {/* Use Suspense with Image */}
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gray-100/50 text-sm text-gray-500">
                      Loading...
                    </div>
                  }
                >
                  <Image
                    src={element.thumbnail}
                    alt={`Thumbnail for ${element.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes for responsiveness
                  />
                </Suspense>
              </div>
            </Link>
            <div className="mt-3">
              <h2 className="text-sm font-medium">
                <Link href={element.path} className="hover:underline">
                  {element.name}
                </Link>
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
                {element.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
