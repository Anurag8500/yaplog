import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  leftHeadline: string;
  leftSubtext: string;
  rightTitle: string;
  rightSubtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export default function AuthLayout({
  leftHeadline,
  leftSubtext,
  rightTitle,
  rightSubtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* LEFT SIDE (BLACK — BRAND / EMOTION) */}
      <div className="w-full md:w-1/2 bg-[#050505] text-white p-10 md:p-20 flex flex-col justify-center relative overflow-hidden">
        {/* Subtle texture/gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/20 to-black pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-xl mx-auto md:mx-0">
          <div className="mb-16 md:mb-24">
             <Link href="/" className="text-sm font-bold tracking-[0.2em] text-white/80 uppercase hover:text-white transition-colors">
              Yaplog
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-8 text-white">
            {leftHeadline}
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed max-w-md">
            {leftSubtext}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (WHITE — ACTION / FORM) */}
      <div className="w-full md:w-1/2 bg-white text-neutral-900 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-3">
              {rightTitle}
            </h2>
            <p className="text-neutral-500 text-lg">
              {rightSubtitle}
            </p>
          </div>

          {children}

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              {footerText}{" "}
              <Link 
                href={footerLinkHref} 
                className="text-black font-semibold hover:underline transition-all ml-1"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}