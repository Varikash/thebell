export type Currency = 'USD' | 'RUB';
export type PlanPeriod = 'month' | 'halfyear' | 'year';

export interface Plan {
  id: string;
  period: PlanPeriod;
  price: number;
  oldPrice?: number;
  perMonth?: number;
  saving?: string;
}

export interface Trial {
  price: number;
  currency: Currency;
  period: 'month';
  note: string;
}

export interface Product {
  id: string;
  name: string;
  tariffName?: string;
  tagline: string;
  description: string;
  features: string[];
  landingUrl: string;
  trial: Trial | null;
  plans: Record<Currency, Plan[]>;
}

export interface ProductsCatalog {
  products: Product[];
}
