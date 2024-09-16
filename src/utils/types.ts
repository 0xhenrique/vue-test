export type User = {
  id: number;
  fullName: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date
};

/*
   order_date and dateOrder are basically the same
   the problem is that the API responds *GET* with "order_date"
   but it requires "dateOrder" to accept *POST*
*/
export type Order = {
  id: number | null;
  product: string;
  userId: number;
  order_date?: string;
  dateOrder: string;
  created_at?: string;
  updated_at?: string
};
