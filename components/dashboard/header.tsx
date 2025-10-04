"use client";

import { Settings, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeButton } from "../themeButton";

interface DashboardHeaderProps {
  onAddExpenseClick: () => void;
}

export function DashboardHeader({ onAddExpenseClick }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();

  const getUserInitials = () => {
    const name = user?.user_metadata?.display_name || user?.user_metadata?.full_name;
    if (name) {
      const parts = name.split(' ');
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button 
            className="gap-2 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            onClick={onAddExpenseClick}
          >
            <Plus className="h-4 w-4" />
            Adicionar Gasto
          </Button>
        <ThemeButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt="Avatar do usuário" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settings">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}