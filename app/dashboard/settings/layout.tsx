"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Palette, FileText } from "lucide-react";

// Links para a nova sub-navegação
const settingsNav = [
  { title: "Perfil e Segurança", href: "/dashboard/settings/profile", icon: User },
  { title: "Aparência", href: "/dashboard/settings/theme", icon: Palette },
  { title: "Termos e Política", href: "/dashboard/settings/policy", icon: FileText },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row gap-10">
      {/* O Menu Lateral Aninhado */}
      <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <nav className="flex flex-row md:flex-col gap-2">
          {settingsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* O Conteúdo da Página (ex: profile, theme) será renderizado aqui */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}