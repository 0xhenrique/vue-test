export type User = {
  id: number;
  fullName: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date
};

export type Order = {
  id: number | null;
  product: string;
  userId: number;
  order_date?: string;
  dateOrder: string;
  created_at?: string;
  updated_at?: string
};
