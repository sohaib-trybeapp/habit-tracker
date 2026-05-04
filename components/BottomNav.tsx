"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Today", icon: CheckSquare },
  { href: "/habits", label: "Habits", icon: ListTodo },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background:
          "linear-gradient(to top, oklch(0.108 0.007 55) 60%, oklch(0.108 0.007 55 / 0) 100%)",
      }}
    >
      <div className="flex h-16 max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200",
                active
                  ? "text-primary"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-all duration-200",
                  active ? "stroke-[2]" : "stroke-[1.5]"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-widest transition-all duration-200",
                  active ? "opacity-100" : "opacity-60"
                )}
              >
                {label}
              </span>
              {active && (
                <span
                  className="absolute bottom-[calc(64px+env(safe-area-inset-bottom)-2px)] h-0.5 w-8 rounded-full"
                  style={{ background: "oklch(0.75 0.13 78)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
