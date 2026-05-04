"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// SF Symbols equivalents via Lucide — closest matches to iOS system icons
const CheckmarkCircleIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none">
    <circle
      cx="12" cy="12" r="10"
      strokeWidth={active ? 0 : 1.6}
      stroke={active ? "none" : "currentColor"}
      fill={active ? "currentColor" : "none"}
    />
    {active && (
      <path d="M7.5 12.5l3 3 5.5-6" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    )}
    {!active && (
      <path d="M8 12.5l2.8 2.8 5.2-5.6" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
    )}
  </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none">
    <rect x="3" y="5" width="18" height="2.5" rx="1.25"
      fill="currentColor" opacity={active ? 1 : 0.75} />
    <rect x="3" y="10.75" width="18" height="2.5" rx="1.25"
      fill="currentColor" opacity={active ? 1 : 0.75} />
    <rect x="3" y="16.5" width="18" height="2.5" rx="1.25"
      fill="currentColor" opacity={active ? 1 : 0.75} />
  </svg>
);

const tabs = [
  { href: "/",        label: "Today",  Icon: CheckmarkCircleIcon },
  { href: "/habits",  label: "Habits", Icon: ListIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: "var(--ios-tab-bg)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "0.5px solid var(--ios-separator)",
      }}
    >
      <div className="flex h-[49px] max-w-lg mx-auto">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-[3px] transition-colors duration-150",
                active ? "text-primary" : "text-[var(--ios-tertiary-label)]"
              )}
              style={{
                color: active ? undefined : "rgba(128,128,128,0.7)",
              }}
            >
              <Icon active={active} />
              <span
                className="text-[10px] leading-none"
                style={{ fontWeight: 500, letterSpacing: "0.01em" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
