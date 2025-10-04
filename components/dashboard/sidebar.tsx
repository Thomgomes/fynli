"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Pessoas", href: "/dashboard/people", icon: Users },
  { title: "Categorias", href: "/dashboard/categories", icon: Tags },
  { title: "Transações", href: "/dashboard/transactions", icon: FileText },
  { title: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
    <aside
      className={cn(
        "hidden h-screen border-r bg-card transition-all duration-300 ease-in-out md:flex md:flex-col",
        isCollapsed ? "w-20" : "w-64",
        "sticky top-0"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b p-4">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-primary">Fynli</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-muted-foreground hover:bg-muted"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-muted hover:text-primary",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t bg-card p-2 md:hidden">
      <ul className="flex w-full justify-around">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-muted hover:text-primary",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
    </nav>
    </>
  );
}