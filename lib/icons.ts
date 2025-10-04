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
  { name: 'Carrinho de Compras', component: ShoppingCart },
  { name: 'Talheres', component: UtensilsCrossed },
  { name: 'Café', component: Coffee },
  { name: 'Pizza', component: Pizza },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Filme', component: Film },
  { name: 'Cachorro', component: Dog },
  { name: 'Pata', component: PawPrint },
  { name: 'Carro', component: Car },
  { name: 'Ônibus', component: Bus },
  { name: 'Avião', component: Plane },
  { name: 'Combustivel', component: Fuel },
  { name: 'Presente', component: Gift },
  { name: 'Casa', component: Home },
  { name: 'Camisa', component: Shirt },
  { name: 'Saúde', component: HeartPulse },
  { name: 'Chapéu', component: GraduationCap },
  { name: 'Livro', component: BookOpen },
  { name: 'Banco', component: Landmark },
  { name: 'HandCoins', component: HandCoins },
  { name: 'Puzzle', component: Puzzle },
];

export const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  availableIcons.map(icon => [icon.name, icon.component])
);