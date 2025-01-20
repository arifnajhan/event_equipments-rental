export type Booking = {
  _id: string;
  user: {
      _id: string;
      name?: string;
  };
  eventEquipments: {
      _id: string;
      name: string;
      slug: {current: string};
      price: number;
  };
  rentDate: string;
  returnDate: string;
  numberOfDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
};