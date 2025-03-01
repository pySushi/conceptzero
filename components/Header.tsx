// components/Navbar.tsx
import Link from 'next/link';
import { Circle } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative px-4 mb-14 before:absolute before:-inset-x-32 before:bottom-0 before:h-px before:bg-[linear-gradient(to_right,theme(colors.border/.3),theme(colors.border)_200px,theme(colors.border)_calc(100%-200px),theme(colors.border/.3))]">
      <div className="before:absolute before:-bottom-px before:-left-12 before:z-10 before:-ml-px before:size-[3px] before:bg-ring after:absolute after:-bottom-px after:-right-12 after:z-10 after:-mr-px after:size-[3px] after:bg-ring" aria-hidden="true"></div>
      <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between gap-3">
        <Link aria-label="Home" className="flex items-center gap-2 rounded-full outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70" href="/">
          {/*  Use Image component for logo */}
          <Circle className="h-8 w-8 "/>
          <span className='font-bold'>ConceptZero</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link className="inline-flex gap-0.5 text-sm hover:underline underline-offset-2 decoration-dotted decoration-blue-600 text-gray-500 font-medium hover:text-blue-600" href="https://www.buymeacoffee.com/sudeepshouche" target="_blank">
            Buy Me a Coffee
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
