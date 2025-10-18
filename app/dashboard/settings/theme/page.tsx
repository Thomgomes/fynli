"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Monitor, Sun, Moon } from "lucide-react";

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>Personalize a aparência do Fynli no seu dispositivo.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={theme} onValueChange={setTheme}>
          <div className="space-y-4">
            <Label htmlFor="theme-light" className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <Sun className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Claro</p>
                <p className="text-sm text-muted-foreground">Aparência clara para o dia a dia.</p>
              </div>
              <RadioGroupItem value="light" id="theme-light" />
            </Label>
            <Label htmlFor="theme-dark" className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <Moon className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Escuro</p>
                <p className="text-sm text-muted-foreground">Aparência escura, ideal para pouca luz.</p>
              </div>
              <RadioGroupItem value="dark" id="theme-dark" />
            </Label>
            <Label htmlFor="theme-system" className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <Monitor className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Sistema</p>
                <p className="text-sm text-muted-foreground">Sincroniza automaticamente com o tema do seu dispositivo.</p>
              </div>
              <RadioGroupItem value="system" id="theme-system" />
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}