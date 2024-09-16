export type User = {
  id?: number;
  fullName?: string;
  email?: string;
  password?: string;
  created_at?: string;
  updated_at?: string
};

export type Order = {
  id?: number | string;
  product?: string;
  userId?: number;
  order_date?: string;
  dateOrder?: string;
  created_at?: string;
  updated_at?: string
};
