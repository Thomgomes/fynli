import {
  type LucideIcon,
  ShoppingCart, Gamepad2, Dog, Car, Puzzle, Home, UtensilsCrossed,
  HeartPulse, Shirt, Bus, Plane, Gift, GraduationCap, Fuel, Film,
  BookOpen, Landmark, HandCoins, Pizza, Coffee, PawPrint,
  HelpCircle
} from 'lucide-react';

export type Icon = {
  key: string;
 label: string;
  component: LucideIcon;
};

// Nossa lista curada de ícones disponíveis para o usuário
export const availableIcons: Icon[] = [
  { key: 'ShoppingCart', label: 'Carrinho de Compras', component: ShoppingCart },
  { key: 'UtensilsCrossed', label: 'Talheres', component: UtensilsCrossed },
  { key: 'Coffee', label: 'Café', component: Coffee },
  { key: 'Pizza', label: 'Pizza', component: Pizza },
  { key: 'Gamepad2', label: 'Gamepad', component: Gamepad2 },
  { key: 'Film', label: 'Filme', component: Film },
  { key: 'Dog', label: 'Cachorro', component: Dog },
  { key: 'PawPrint', label: 'Pata', component: PawPrint },
  { key: 'Car', label: 'Carro', component: Car },
  { key: 'Bus', label: 'Ônibus', component: Bus },
  { key: 'Plane', label: 'Avião', component: Plane },
  { key: 'Fuel', label: 'Combustível', component: Fuel },
  { key: 'Gift', label: 'Presente', component: Gift },
  { key: 'Home', label: 'Casa', component: Home },
  { key: 'Shirt', label: 'Roupas', component: Shirt },
  { key: 'HeartPulse', label: 'Saúde', component: HeartPulse },
  { key: 'GraduationCap', label: 'Educação', component: GraduationCap },
  { key: 'BookOpen', label: 'Livro', component: BookOpen },
  { key: 'Landmark', label: 'Banco', component: Landmark },
  { key: 'HandCoins', label: 'Moedas', component: HandCoins },
  { key: 'Puzzle', label: 'Puzzle/Jogos', component: Puzzle },
  { key: 'HelpCircle', label: 'Indefinido', component: HelpCircle },
];

export const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  availableIcons.map(icon => [icon.key, icon.component])
);