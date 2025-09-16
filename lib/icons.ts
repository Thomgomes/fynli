import {
  type LucideIcon,
  ShoppingCart, Gamepad2, Dog, Car, Puzzle, Home, UtensilsCrossed,
  HeartPulse, Shirt, Bus, Plane, Gift, GraduationCap, Fuel, Film,
  BookOpen, Landmark, HandCoins, Pizza, Coffee, PawPrint
} from 'lucide-react';

export type Icon = {
  name: string;
  component: LucideIcon;
};

// Nossa lista curada de ícones disponíveis para o usuário
export const availableIcons: Icon[] = [
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'UtensilsCrossed', component: UtensilsCrossed },
  { name: 'Coffee', component: Coffee },
  { name: 'Pizza', component: Pizza },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Film', component: Film },
  { name: 'Dog', component: Dog },
  { name: 'PawPrint', component: PawPrint },
  { name: 'Car', component: Car },
  { name: 'Bus', component: Bus },
  { name: 'Plane', component: Plane },
  { name: 'Fuel', component: Fuel },
  { name: 'Gift', component: Gift },
  { name: 'Home', component: Home },
  { name: 'Shirt', component: Shirt },
  { name: 'HeartPulse', component: HeartPulse },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Landmark', component: Landmark },
  { name: 'HandCoins', component: HandCoins },
  { name: 'Puzzle', component: Puzzle },
];

// Um objeto de mapeamento para fácil acesso ao componente pelo nome
// Ex: iconMap['ShoppingCart'] -> nos dará o componente <ShoppingCart />
export const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  availableIcons.map(icon => [icon.name, icon.component])
);