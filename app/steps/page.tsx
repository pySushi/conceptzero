// app/page.tsx
import Stepper from "./components/Stepper";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="mx-auto max-w-xl px-2 py-1 w-full">
      <Stepper />
      <Toaster />
    </div>
  );
}
